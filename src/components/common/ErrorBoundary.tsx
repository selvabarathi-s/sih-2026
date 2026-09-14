import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
            {/* Header / National Portal Header Style */}
            <div className="flex items-center space-x-4 mb-6 border-b border-slate-800 pb-5">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  PAIMANA PREDICT — Runtime Safeguard Engaged
                </h1>
                <p className="text-sm text-slate-400">
                  Infrastructure Surveillance & Analytics Platform Fail-Safe Boundary
                </p>
              </div>
            </div>

            {/* User Message */}
            <div className="space-y-3 mb-6 text-slate-300 text-sm leading-relaxed">
              <p>
                An unexpected interface anomaly was intercepted. The application protected your session state to prevent corruption.
              </p>
              <p className="text-slate-400 text-xs">
                Active telemetry channels and database transactions remain secure. You may reload the active workspace or return to the main dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={this.handleReload}
                className="flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-sm transition-colors shadow-lg shadow-sky-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Workspace</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-colors border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>Return to Overview</span>
              </button>
              <button
                onClick={this.toggleDetails}
                className="flex items-center space-x-1.5 px-4 py-2.5 text-slate-400 hover:text-slate-200 text-xs transition-colors ml-auto"
              >
                <span>{this.state.showDetails ? 'Hide Diagnostics' : 'View Diagnostics'}</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Technical Diagnostics (Collapsible) */}
            {this.state.showDetails && (
              <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 overflow-auto max-h-60 space-y-2">
                <div className="text-rose-400 font-semibold">
                  {this.state.error?.name}: {this.state.error?.message}
                </div>
                {this.state.error?.stack && (
                  <pre className="text-[11px] leading-tight text-slate-500 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[11px] leading-tight text-slate-600 whitespace-pre-wrap border-t border-slate-900 pt-2">
                    Component Stack:{this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
