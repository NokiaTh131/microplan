import NodePalette from "./components/Toolbar/NodePalette";
import EdgeSelector from "./components/Toolbar/EdgeSelector";
import MicroservicesCanvas from "./components/Canvas/MicroservicesCanvas";
import TabPanel from "./components/UI/TabPanel";
import ResizablePanel from "./components/UI/ResizablePanel";
import EmptyStateHint from "./components/UI/EmptyStateHint";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import ToastProvider from "./components/UI/ToastProvider";
import { usePanelVisibility } from "./hooks/usePanelVisibility";

function App() {
  const { shouldShowPanel } = usePanelVisibility();

  return (
    <ErrorBoundary>
      <ToastProvider />
      <div className="flex h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <ErrorBoundary>
          <div className="flex-shrink-0">
            <NodePalette />
          </div>
        </ErrorBoundary>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Microservices Architecture Planner
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-1 hidden sm:block">
                  Design, analyze, and generate infrastructure code for
                  distributed systems
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-medium rounded-full">
                  ✨ Enhanced
                </div>
              </div>
            </div>
          </header>

          {/* Canvas Area with Conditional Panel */}
          <div className="flex-1 flex min-h-0 relative">
            <main className="flex-1 relative">
              <ErrorBoundary>
                <MicroservicesCanvas />
              </ErrorBoundary>

              {/* Edge Selector Overlay */}
              <div className="absolute top-4 right-4 z-10">
                <EdgeSelector />
              </div>

              {/* Show hint when panel is hidden */}
              {!shouldShowPanel && <EmptyStateHint />}
            </main>

            {/* Right Sidebar - Conditionally Rendered Tabbed Panels */}
            {shouldShowPanel && (
              <ErrorBoundary>
                <ResizablePanel
                  defaultWidth={384}
                  minWidth={280}
                  maxWidth={600}
                >
                  <TabPanel />
                </ResizablePanel>
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
