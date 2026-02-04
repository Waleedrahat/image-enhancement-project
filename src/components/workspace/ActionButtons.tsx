import { Sparkles, Wand2, Eraser, Image, Zap, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useJob } from '@/contexts/JobContext';
import { cn } from '@/lib/utils';
import { PipelineSettings } from '@/types';

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  recommended?: boolean;
  variant?: 'default' | 'primary' | 'accent';
}

function ActionButton({ icon, title, description, onClick, disabled, recommended, variant = 'default' }: ActionButtonProps) {
  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none',
        variant === 'primary' && 'border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10',
        variant === 'accent' && 'border-accent/50 bg-accent/5 hover:border-accent'
      )}
      onClick={() => !disabled && onClick()}
    >
      {recommended && (
        <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
          Recommended
        </Badge>
      )}
      <CardContent className="p-4 flex items-start gap-3">
        <div className={cn(
          'p-2.5 rounded-lg shrink-0',
          variant === 'primary' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActionButtons() {
  const { currentImage, settings, updateEnhancement, updateBackground, updateSecurity } = useWorkspace();
  const { startJob, isProcessing } = useJob();

  const hasImage = !!currentImage;
  const disabled = !hasImage || isProcessing;

  const runWithSettings = (customSettings: Partial<PipelineSettings>) => {
    if (!currentImage) return;
    
    const jobSettings: PipelineSettings = {
      enhancement: { ...settings.enhancement, ...customSettings.enhancement },
      background: { ...settings.background, ...customSettings.background },
      security: { ...settings.security, ...customSettings.security },
    };
    
    startJob(currentImage, jobSettings);
  };

  const handleAutoEnhance = () => {
    updateEnhancement({ enabled: true, mode: 'auto', quality: 'balanced' });
    updateBackground({ enabled: false });
    updateSecurity({ enabled: false });
    runWithSettings({
      enhancement: { enabled: true, mode: 'auto', quality: 'balanced' },
      background: { enabled: false, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    });
  };

  const handleCustomEnhance = () => {
    updateEnhancement({ enabled: true, mode: 'auto', quality: 'balanced' });
    updateBackground({ enabled: false });
    updateSecurity({ enabled: false });
    // Just enable the controls, don't start - user will configure manually
  };

  const handleRemoveBackground = () => {
    updateEnhancement({ enabled: false });
    updateBackground({ enabled: true, action: 'remove', type: 'transparent' });
    updateSecurity({ enabled: false });
    runWithSettings({
      enhancement: { enabled: false, mode: 'auto', quality: 'balanced' },
      background: { enabled: true, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    });
  };

  const handleReplaceBackground = () => {
    updateEnhancement({ enabled: false });
    updateBackground({ enabled: true, action: 'replace', type: 'blur' });
    updateSecurity({ enabled: false });
    // Just enable the controls, user needs to pick replacement option manually
  };

  const handleFullPipeline = () => {
    updateEnhancement({ enabled: true, mode: 'auto', quality: 'balanced' });
    updateBackground({ enabled: true, action: 'remove', type: 'transparent' });
    updateSecurity({ enabled: false });
    runWithSettings({
      enhancement: { enabled: true, mode: 'auto', quality: 'balanced' },
      background: { enabled: true, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    });
  };

  const handleEncrypt = () => {
    updateEnhancement({ enabled: false });
    updateBackground({ enabled: false });
    updateSecurity({ enabled: true });
    runWithSettings({
      enhancement: { enabled: false, mode: 'auto', quality: 'balanced' },
      background: { enabled: false, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: true },
    });
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground">
          {hasImage ? 'What do you want to do with this image?' : 'Upload an image to get started'}
        </h2>
        
        <div className="grid grid-cols-1 gap-2.5">
          <ActionButton
            icon={<Sparkles className="h-5 w-5" />}
            title="Auto Enhance"
            description="AI-powered enhancement with optimal settings"
            onClick={handleAutoEnhance}
            disabled={disabled}
            recommended
            variant="primary"
          />
          
          <ActionButton
            icon={<Wand2 className="h-5 w-5" />}
            title="Custom Enhance"
            description="Choose upscaling, denoising, deblurring options"
            onClick={handleCustomEnhance}
            disabled={disabled}
          />
          
          <ActionButton
            icon={<Eraser className="h-5 w-5" />}
            title="Remove Background"
            description="Extract subject with transparent background"
            onClick={handleRemoveBackground}
            disabled={disabled}
          />
          
          <ActionButton
            icon={<Image className="h-5 w-5" />}
            title="Replace Background"
            description="Swap background with blur, color, or image"
            onClick={handleReplaceBackground}
            disabled={disabled}
          />
          
          <ActionButton
            icon={<Zap className="h-5 w-5" />}
            title="Run Full AI Pipeline"
            description="Enhance + remove background in one go"
            onClick={handleFullPipeline}
            disabled={disabled}
            variant="accent"
          />
          
          <ActionButton
            icon={<Lock className="h-5 w-5" />}
            title="Encrypt Image"
            description="Secure with AES-256 encryption"
            onClick={handleEncrypt}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}