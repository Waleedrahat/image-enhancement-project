import { Check, Clock, Loader2, X, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useJob } from '@/contexts/JobContext';
import { PipelineStep, JobMetrics } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function JobProgress() {
  const { currentJob, isProcessing, cancelJob, clearJob } = useJob();

  if (!currentJob) {
    return null;
  }

  const getStepIcon = (step: PipelineStep) => {
    switch (step.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-success" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'failed':
        return <X className="h-4 w-4 text-destructive" />;
      case 'skipped':
        return <div className="h-4 w-4 rounded-full bg-muted" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const getStatusBadge = () => {
    switch (currentJob.status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge className="bg-primary text-primary-foreground">Processing</Badge>;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Job Progress
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(currentJob.progress)}%</span>
          </div>
          <Progress value={currentJob.progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {currentJob.steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-colors
                ${step.status === 'processing' ? 'bg-primary/5' : ''}
                ${step.status === 'completed' ? 'text-muted-foreground' : ''}
              `}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${step.status === 'processing' ? 'font-medium' : ''}`}>
                    {step.name}
                  </span>
                  {step.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(step.completedAt, { addSuffix: true })}
                    </span>
                  )}
                </div>
                {step.status === 'processing' && (
                  <Progress value={step.progress} className="h-1 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {isProcessing && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={cancelJob}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}

        {currentJob.status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={clearJob}
          >
            Clear & Start New
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ResultMetrics() {
  const { currentJob } = useJob();

  if (!currentJob?.metrics || currentJob.status !== 'completed') {
    return null;
  }

  const metrics = currentJob.metrics;

  const metricItems = [
    { 
      label: 'PSNR', 
      value: metrics.psnr ? `${metrics.psnr.toFixed(1)} dB` : null,
      description: 'Peak Signal-to-Noise Ratio - Higher is better',
      good: metrics.psnr && metrics.psnr > 30,
    },
    { 
      label: 'SSIM', 
      value: metrics.ssim ? metrics.ssim.toFixed(3) : null,
      description: 'Structural Similarity Index - Closer to 1 is better',
      good: metrics.ssim && metrics.ssim > 0.85,
    },
    { 
      label: 'Dice', 
      value: metrics.dice ? metrics.dice.toFixed(3) : null,
      description: 'Dice Coefficient for segmentation accuracy',
      good: metrics.dice && metrics.dice > 0.85,
    },
    { 
      label: 'Encryption', 
      value: metrics.encryptionSuccess ? '100%' : null,
      description: 'AES-256 encryption status',
      good: metrics.encryptionSuccess,
    },
  ].filter(m => m.value !== null);

  if (metricItems.length === 0) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Results</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs gap-1">
                  <Info className="h-3 w-3" />
                  Demo metrics
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Demo metrics until live evaluation is integrated</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metricItems.map((metric) => (
            <TooltipProvider key={metric.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-3 rounded-lg bg-muted/50 text-center cursor-help">
                    <div className={`text-lg font-bold ${metric.good ? 'text-success' : ''}`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">{metric.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
