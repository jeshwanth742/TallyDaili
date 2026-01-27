import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="bg-[#1A1A1A] border border-danger/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-3 bg-danger/10 rounded-full text-danger">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-white text-lg font-bold">Something went wrong</h2>
                            <p className="text-text-secondary text-xs font-mono bg-black/50 p-3 rounded-lg w-full overflow-x-auto text-left">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                            <button
                                onClick={this.handleReset}
                                className="mt-2 text-xs font-black uppercase tracking-widest bg-white text-black px-6 py-3 rounded-lg hover:scale-105 transition-transform"
                            >
                                Reload App
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
