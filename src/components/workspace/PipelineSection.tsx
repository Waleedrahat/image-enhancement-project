
import { Play, Sparkles, User, Package, Building2, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWorkspace, pipelinePresets } from '@/contexts/WorkspaceContext';
import { useJob } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function PipelineSection() {
  const {
    currentImage,
    settings,
    activePreset,
    applyPreset,
  } = useWorkspace();
  const { startJob, isProcessing } = useJob();
  const { toast } = useToast();

  const handleRunPipeline = () => {
    if (!currentImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    startJob(currentImage, settings);
    toast({
      title: 'Processing started',
      description: 'Your image is being processed.',
    });
  };

  const workflows = [
    { id: 'universal', name: 'Universal', icon: Sparkles, desc: 'General purpose enhancement' },
    { id: 'portrait', name: 'Portrait', icon: User, desc: 'Face recovery & skin smoothing' },
    { id: 'product', name: 'Product', icon: Package, desc: 'Sharp details & clean background' },
    { id: 'architecture', name: 'Architecture', icon: Building2, desc: 'Perspective & clarity' },
  ];

  return (
    <div className="space-y-6">
      {/* Workflow Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Workflow</Label>
        <RadioGroup
          value={activePreset?.id || 'universal'}
          onValueChange={(value) => {
            const preset = pipelinePresets.find(p => p.id === value) || pipelinePresets[0];
            if (preset) applyPreset(preset);
          }}
          className="grid grid-cols-1 gap-2"
        >
          {workflows.map((wf) => {
            const isSelected = activePreset?.id === wf.id;
            const PresetIcon = wf.icon;
            return (
              <div key={wf.id}>
                <RadioGroupItem value={wf.id} id={wf.id} className="peer sr-only" />
                <Label
                  htmlFor={wf.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent hover:border-sidebar-primary/50",
                    isSelected ? "border-primary bg-primary/5" : "border-muted bg-card"
                  )}
                >
                  <div className={cn("p-2 rounded-md mr-3", isSelected ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <PresetIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{wf.name}</p>
                    <p className="text-xs text-muted-foreground">{wf.desc}</p>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Active Steps Summary */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-2 border">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Steps</Label>
        <div className="flex flex-wrap gap-2 text-xs">
          {settings.enhancement.enabled && (
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-medium border border-blue-500/20">Enhancement</span>
          )}
          {settings.background.enabled && (
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 font-medium border border-green-500/20">Background</span>
          )}
          {settings.security.enabled && (
            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-500 font-medium border border-purple-500/20">Security</span>
          )}
          {(!settings.enhancement.enabled && !settings.background.enabled && !settings.security.enabled) && (
            <span className="text-muted-foreground italic">No steps selected</span>
          )}
        </div>
      </div>

      {/* Master Run Button */}
      <Button
        className="w-full h-12 text-base shadow-lg"
        size="lg"
        onClick={handleRunPipeline}
        disabled={!currentImage || isProcessing}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            Run Workflow <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
