import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, SplitSquareVertical, Grid, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useJob } from '@/contexts/JobContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UploadSection } from '@/components/workspace/UploadSection';

export function ImagePreview() {
  const {
    currentImage,
    showComparison,
    setShowComparison,
    comparisonPosition,
    setComparisonPosition,
    zoomLevel,
    setZoomLevel,
  } = useWorkspace();
  const { currentJob } = useJob();
  const [showGrid, setShowGrid] = useState(false);
  const [isPressingOriginal, setIsPressingOriginal] = useState(false);

  const hasProcessedImage = currentJob?.status === 'completed' &&
    (currentJob.enhancedImageUrl || currentJob.backgroundEditedUrl);

  const activeImageUrl = hasProcessedImage
    ? (currentJob?.enhancedImageUrl || currentJob?.backgroundEditedUrl)
    : currentImage?.url;

  const displayUrl = isPressingOriginal ? currentImage?.url : activeImageUrl;

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 25, 400));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 25, 25));
  const handleResetZoom = () => setZoomLevel(100);
  const handleFit = () => setZoomLevel(100);

  return (
    <div className="flex flex-col min-h-full bg-background/50 relative">
      {/* Floating Toolbar */}
      <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-full bg-background/80 backdrop-blur-md border shadow-lg">
        <TooltipProvider delayDuration={300}>
          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 px-1">
            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-full hover:bg-muted" disabled={!currentImage}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger><TooltipContent>Zoom Out</TooltipContent></Tooltip>

            <span className="text-xs font-medium w-10 text-center select-none text-muted-foreground">{zoomLevel}%</span>

            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-full hover:bg-muted" disabled={!currentImage}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger><TooltipContent>Zoom In</TooltipContent></Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* View Options */}
          <div className="flex items-center gap-0.5 px-1">
            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleFit} className="h-8 w-8 rounded-full hover:bg-muted" disabled={!currentImage}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger><TooltipContent>Fit to Screen</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
              <Toggle
                pressed={showGrid}
                onPressedChange={setShowGrid}
                size="sm"
                className="h-8 w-8 rounded-full data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                disabled={!currentImage}
              >
                <Grid className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger><TooltipContent>Toggle Grid</TooltipContent></Tooltip>
          </div>

          {hasProcessedImage && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />

              {/* Comparison Controls */}
              <div className="flex items-center gap-0.5 px-1">
                <Tooltip><TooltipTrigger asChild>
                  <Toggle
                    pressed={showComparison}
                    onPressedChange={setShowComparison}
                    size="sm"
                    className="h-8 px-3 rounded-full gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
                  >
                    <SplitSquareVertical className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Compare</span>
                  </Toggle>
                </TooltipTrigger><TooltipContent>Slider Comparison</TooltipContent></Tooltip>

                <Tooltip><TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 rounded-full", isPressingOriginal && "bg-accent text-accent-foreground")}
                    onMouseDown={() => setIsPressingOriginal(true)}
                    onMouseUp={() => setIsPressingOriginal(false)}
                    onMouseLeave={() => setIsPressingOriginal(false)}
                  >
                    {isPressingOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger><TooltipContent>Hold to View Original</TooltipContent></Tooltip>
              </div>
            </>
          )}
        </TooltipProvider>
      </div>

      {/* Image Display Area */}
      <div className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_center,hsl(var(--muted)),hsl(var(--background)))]">
        {!currentImage ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <UploadSection compact />
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm sm:bottom-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:w-64">
            <UploadSection compact />
          </div>
        )}

        {/* Checkerboard pattern for transparency */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(45deg, hsl(var(--foreground)) 25%, transparent 25%),
              linear-gradient(-45deg, hsl(var(--foreground)) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, hsl(var(--foreground)) 75%),
              linear-gradient(-45deg, transparent 75%, hsl(var(--foreground)) 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />

        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(128,128,128,0.1) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(128,128,128,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        )}

        {currentImage ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {showComparison && hasProcessedImage && !isPressingOriginal ? (
              <ComparisonView
                originalUrl={currentImage.url}
                processedUrl={activeImageUrl!}
                position={comparisonPosition}
                onPositionChange={setComparisonPosition}
                zoom={zoomLevel}
              />
            ) : (
              <div
                className="relative max-w-full max-h-full transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <img
                  src={displayUrl!}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-border/10"
                  draggable={false}
                />

                {/* Image Info Badge */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm text-xs font-normal">
                    {isPressingOriginal ? 'Original Image' : (hasProcessedImage ? 'Processed Result' : 'Original Image')}
                    {currentImage.width && ` • ${currentImage.width}x${currentImage.height}`}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
  position: number;
  onPositionChange: (position: number) => void;
  zoom: number;
}

function ComparisonView({ originalUrl, processedUrl, position, onPositionChange, zoom }: ComparisonViewProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onPositionChange(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className="relative w-full h-full max-w-3xl max-h-[70vh] cursor-ew-resize select-none"
      style={{ transform: `scale(${zoom / 100})` }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Processed image (full) */}
      <img
        src={processedUrl}
        alt="Processed"
        className="absolute inset-0 w-full h-full object-contain rounded-lg"
        draggable={false}
      />

      {/* Original image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: `${10000 / position}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-muted-foreground rounded-full" />
            <div className="w-0.5 h-4 bg-muted-foreground rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-black/50 text-white text-xs">
        Original
      </div>
      <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/50 text-white text-xs">
        Processed
      </div>
    </div>
  );
}
