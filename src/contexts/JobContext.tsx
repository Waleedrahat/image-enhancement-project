import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Job, JobStatus, PipelineStep, PipelineSettings, ImageFile, JobMetrics } from '@/types';

interface JobContextType {
  currentJob: Job | null;
  isProcessing: boolean;
  startJob: (image: ImageFile, settings: PipelineSettings) => void;
  cancelJob: () => void;
  clearJob: () => void;
}

const JobContext = createContext<JobContextType | null>(null);

// Helper to create pipeline steps based on settings
function createSteps(settings: PipelineSettings): PipelineStep[] {
  const steps: PipelineStep[] = [
    { id: 'upload', name: 'Uploading', status: 'pending', progress: 0 },
  ];

  if (settings.enhancement.enabled) {
    steps.push({ id: 'enhance', name: 'Enhancing', status: 'pending', progress: 0 });
  }

  if (settings.background.enabled) {
    steps.push({ id: 'segment', name: 'Segmenting', status: 'pending', progress: 0 });
    if (settings.background.action === 'replace') {
      steps.push({ id: 'replace', name: 'Background Replace', status: 'pending', progress: 0 });
    }
  }

  if (settings.security.enabled) {
    steps.push({ id: 'encrypt', name: 'Encrypting', status: 'pending', progress: 0 });
  }

  steps.push({ id: 'ready', name: 'Ready', status: 'pending', progress: 0 });

  return steps;
}

// Mock metrics generator
function generateMockMetrics(settings: PipelineSettings): JobMetrics {
  return {
    psnr: settings.enhancement.enabled ? 32 + Math.random() * 6 : undefined,
    ssim: settings.enhancement.enabled ? 0.88 + Math.random() * 0.1 : undefined,
    dice: settings.background.enabled ? 0.85 + Math.random() * 0.1 : undefined,
    encryptionSuccess: settings.security.enabled ? true : undefined,
  };
}

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const startJob = useCallback((image: ImageFile, settings: PipelineSettings) => {
    if (processingRef.current) return;

    clearTimeouts();
    processingRef.current = true;
    setIsProcessing(true);

    const steps = createSteps(settings);
    const job: Job = {
      id: `job-${Date.now()}`,
      status: 'pending',
      steps,
      currentStepIndex: 0,
      progress: 0,
      settings,
      originalImage: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCurrentJob(job);

    // Simulate step-by-step processing
    let stepIndex = 0;
    const processStep = () => {
      if (!processingRef.current || stepIndex >= steps.length) {
        return;
      }

      const step = steps[stepIndex];
      
      // Start the step
      setCurrentJob(prev => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[stepIndex] = { ...step, status: 'processing', progress: 0, startedAt: new Date() };
        
        let status: JobStatus = 'pending';
        switch (step.id) {
          case 'upload': status = 'uploading'; break;
          case 'enhance': status = 'enhancing'; break;
          case 'segment': status = 'segmenting'; break;
          case 'replace': status = 'replacing'; break;
          case 'encrypt': status = 'encrypting'; break;
          case 'ready': status = 'completed'; break;
        }
        
        return {
          ...prev,
          status,
          steps: newSteps,
          currentStepIndex: stepIndex,
          updatedAt: new Date(),
        };
      });

      // Simulate progress within step
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (!processingRef.current) {
          clearInterval(progressInterval);
          return;
        }
        
        progress += 10 + Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        
        setCurrentJob(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[stepIndex] = { ...newSteps[stepIndex], progress };
          const overallProgress = ((stepIndex + progress / 100) / steps.length) * 100;
          return { ...prev, steps: newSteps, progress: Math.min(overallProgress, 100) };
        });
      }, 200);

      // Complete step and move to next
      const stepDuration = step.id === 'ready' ? 300 : 1500 + Math.random() * 1000;
      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        
        if (!processingRef.current) return;

        setCurrentJob(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[stepIndex] = { 
            ...newSteps[stepIndex], 
            status: 'completed', 
            progress: 100, 
            completedAt: new Date() 
          };
          return { ...prev, steps: newSteps, updatedAt: new Date() };
        });

        stepIndex++;
        
        if (stepIndex < steps.length) {
          const nextTimeout = setTimeout(processStep, 300);
          timeoutsRef.current.push(nextTimeout);
        } else {
          // Job complete
          processingRef.current = false;
          setIsProcessing(false);
          
          setCurrentJob(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: 'completed',
              progress: 100,
              completedAt: new Date(),
              updatedAt: new Date(),
              enhancedImageUrl: settings.enhancement.enabled ? image.url : undefined,
              backgroundEditedUrl: settings.background.enabled ? image.url : undefined,
              encryptedPackageUrl: settings.security.enabled ? `encrypted-${image.name}.enc` : undefined,
              metrics: generateMockMetrics(settings),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            };
          });
        }
      }, stepDuration);
      
      timeoutsRef.current.push(timeout);
    };

    // Start processing after a brief delay
    const startTimeout = setTimeout(processStep, 300);
    timeoutsRef.current.push(startTimeout);
  }, []);

  const cancelJob = useCallback(() => {
    processingRef.current = false;
    clearTimeouts();
    setIsProcessing(false);
    
    setCurrentJob(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'cancelled',
        updatedAt: new Date(),
      };
    });
  }, []);

  const clearJob = useCallback(() => {
    processingRef.current = false;
    clearTimeouts();
    setIsProcessing(false);
    setCurrentJob(null);
  }, []);

  return (
    <JobContext.Provider value={{ currentJob, isProcessing, startJob, cancelJob, clearJob }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}
