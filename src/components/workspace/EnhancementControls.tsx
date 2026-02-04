import { Sparkles, ArrowUpRight, Eraser, Activity, ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useJob } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { EnhancementMode, QualityLevel } from '@/types';

export function EnhancementControls() {
  const { currentImage, settings, updateEnhancement } = useWorkspace();
  const { startJob, isProcessing } = useJob();
  const { toast } = useToast();

  const handleRunEnhancement = () => {
    if (!currentImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    const enhancementOnlySettings = {
      ...settings,
      enhancement: { ...settings.enhancement, enabled: true },
      background: { ...settings.background, enabled: false },
      security: { ...settings.security, enabled: false },
    };

    startJob(currentImage, enhancementOnlySettings);
    toast({
      title: 'Enhancement started',
      description: 'Your image is being enhanced.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Upscaling Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4" />
          Upscaling
        </Label>
        <ToggleGroup
          type="single"
          value={settings.enhancement.mode.startsWith('upscale') ? settings.enhancement.mode : 'basic'}
          onValueChange={(value) => {
            if (value) updateEnhancement({ mode: value as EnhancementMode });
          }}
          className="justify-start"
        >
          <ToggleGroupItem value="auto" aria-label="Off" className="px-4">
            Off
          </ToggleGroupItem>
          <ToggleGroupItem value="upscale2x" aria-label="2x" className="px-4">
            2x
          </ToggleGroupItem>
          <ToggleGroupItem value="upscale4x" aria-label="4x" className="px-4">
            4x
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Restoration Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Restoration
        </Label>

        <div className="space-y-3 pl-2 border-l-2 border-muted ml-1">
          {/* Face Restoration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <ScanFace className="h-3 w-3" /> Face Recovery
              </Label>
              <Switch
                checked={settings.enhancement.faceRestoration}
                onCheckedChange={(c) => updateEnhancement({ faceRestoration: c })}
              />
            </div>
          </div>

          {/* Denoise Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Denoise Strength</Label>
              <span className="text-xs text-muted-foreground">{settings.enhancement.denoiseStrength}%</span>
            </div>
            <Slider
              value={[settings.enhancement.denoiseStrength || 50]}
              onValueChange={([v]) => updateEnhancement({ denoiseStrength: v })}
              max={100}
              step={1}
              className="py-1"
            />
          </div>

          {/* Deblur Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Deblur</Label>
              <span className="text-xs text-muted-foreground">{settings.enhancement.deblurStrength}%</span>
            </div>
            <Slider
              value={[settings.enhancement.deblurStrength || 50]}
              onValueChange={([v]) => updateEnhancement({ deblurStrength: v })}
              max={100}
              step={1}
              className="py-1"
            />
          </div>
        </div>
      </div>

      {/* Quality Settings */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Processing Quality</Label>
        <ToggleGroup
          type="single"
          value={settings.enhancement.quality}
          onValueChange={(v) => v && updateEnhancement({ quality: v as QualityLevel })}
          className="w-full justify-between"
        >
          <ToggleGroupItem value="fast" className="flex-1 text-xs">Fast</ToggleGroupItem>
          <ToggleGroupItem value="balanced" className="flex-1 text-xs">Balanced</ToggleGroupItem>
          <ToggleGroupItem value="high" className="flex-1 text-xs">High Quality</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Run Button */}
      <Button
        className="w-full"
        onClick={handleRunEnhancement}
        disabled={!currentImage || isProcessing}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Enhance
      </Button>
    </div>
  );
}
