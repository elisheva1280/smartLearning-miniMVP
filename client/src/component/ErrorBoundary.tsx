import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 text-center">
          <h1>משהו השתבש.</h1>
          <p>אנא רענן את העמוד או נסה שוב מאוחר יותר.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            רענן עמוד
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

