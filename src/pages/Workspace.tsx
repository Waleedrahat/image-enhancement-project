import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, Wand2, Layers, Shield, Settings2, Download } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { UploadSection } from '@/components/workspace/UploadSection';
import { ActionButtons } from '@/components/workspace/ActionButtons';
import { PipelineSection } from '@/components/workspace/PipelineSection';
import { EnhancementControls } from '@/components/workspace/EnhancementControls';
import { BackgroundControls } from '@/components/workspace/BackgroundControls';
import { SecurityControls } from '@/components/workspace/SecurityControls';
import { ExportSection } from '@/components/workspace/ExportSection';
import { ImagePreview } from '@/components/workspace/ImagePreview';
import { JobProgress, ResultMetrics } from '@/components/workspace/JobProgress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useJob } from '@/contexts/JobContext';

export default function Workspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, currentImage } = useWorkspace();
  const { currentJob } = useJob();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2 space-y-4">
        <UploadSection />
        <ActionButtons />
      </div>

      <div className="flex-1 min-h-0">
        <Tabs defaultValue="pipeline" className="h-full flex flex-col">
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-4 h-auto py-1">
              <TabsTrigger value="pipeline" title="Pipeline" className="px-1 py-1.5"><Settings2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="enhancement" disabled={!settings.enhancement.enabled} title="Enhancement" className="px-1 py-1.5"><Wand2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="background" disabled={!settings.background.enabled} title="Background" className="px-1 py-1.5"><Layers className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="security" disabled={!settings.security.enabled} title="Security" className="px-1 py-1.5"><Shield className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-4">
            <TabsContent value="pipeline" className="mt-0 pb-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Processing Pipeline</h3>
                <PipelineSection />
              </div>
            </TabsContent>

            <TabsContent value="enhancement" className="mt-0 pb-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Enhancement Controls</h3>
                <EnhancementControls />
              </div>
            </TabsContent>

            <TabsContent value="background" className="mt-0 pb-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Background Settings</h3>
                <BackgroundControls />
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 pb-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Security Options</h3>
                <SecurityControls />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 z-50 lg:hidden h-12 w-12 rounded-full shadow-elevated"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <ScrollArea className="h-full">
              <SidebarContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <aside
          className={`
            hidden lg:flex flex-col border-r bg-card transition-all duration-300
            ${sidebarCollapsed ? 'w-0' : 'w-80'}
          `}
        >
          {!sidebarCollapsed && (
            <ScrollArea className="flex-1">
              <SidebarContent />
            </ScrollArea>
          )}

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={`
              absolute top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border bg-background shadow-sm
              transition-all duration-300
              ${sidebarCollapsed ? 'left-2' : 'left-[304px]'}
            `}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Image preview */}
          <div className="flex-1 min-h-0">
            <ImagePreview />
          </div>

          {/* Right panel - Job progress and metrics */}
          {/* Right panel - Job progress, metrics, and Export */}
          {(currentJob || currentImage || settings.enhancement.enabled || settings.background.enabled || settings.security.enabled) && (
            <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l bg-card flex flex-col overflow-hidden">
              {/* Right Sidebar Header with Export Button */}
              <div className="p-4 border-b flex items-center justify-between bg-card z-10">
                <h3 className="font-semibold text-sm">Status</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="default" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ExportSection />
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  <JobProgress />
                  <ResultMetrics />
                </div>
              </ScrollArea>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
