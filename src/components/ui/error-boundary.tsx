
import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { maxRetries = 3, showDetails = false } = this.props;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Oops! Něco se pokazilo
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center text-gray-600">
                <p className="mb-2">
                  Aplikace narazila na neočekávanou chybu. Omlouváme se za nepříjemnosti.
                </p>
                {this.state.retryCount > 0 && (
                  <p className="text-sm text-amber-600">
                    Pokus o obnovení: {this.state.retryCount}/{maxRetries}
                  </p>
                )}
              </div>

              {showDetails && this.state.error && (
                <details className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Technické detaily
                  </summary>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-mono break-all">
                      <strong>Chyba:</strong> {this.state.error.message}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 text-xs overflow-auto max-h-32 bg-white p-2 rounded border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Zkusit znovu
                  </Button>
                )}
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Zpět na domů
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pro error boundary
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Application error:', error, errorInfo);
    
    // Zde můžete přidat logování chyb do externí služby
    // například Sentry, LogRocket, atd.
  }, []);

  return { handleError };
};
