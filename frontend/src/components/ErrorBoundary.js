import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: null, errorInfo: null};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('Error Boundary caught an error: ', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallBack
                    error={this.state.error}
                    errorInfo={this.this.state.errorInfo}
                    onRetry={() => this.setState({hasError: false, error: null, errorInfo: null})}
                />
            );
        }
        return this.props.children;
    }
}

const ErrorFallback = ({ error, errorInfo, onRetry}) => (
    <div className='error-boundary-outer'>
        <div className='error-boundary-inner'/>
        <h2 className='error-boundary-h2'> Oops! Something went wrong</h2>
        <p className='error-boundary-p'>We encountered an unexpected error. Please tr refreshing the page or contact support if the problem persists.</p>
        <div className='error-boundary-btn-div'>
            <button className='error-boundary-btn-retry'
            onClick={onRetry}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}>
                Try again
            </button>
            <button
            onClick={() => window.location.reload()}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#dc2626';
            }}>
                Refresh Page
            </button>
        </div>
        {/* Development error details*/}
        {process.env.NODE_ENV === 'development' && error && (
            <details className='error-boundary-details'>
                <summary className='error-boundary-summary'>
                    Error Details (Development only)
                </summary>
                <div className='error-boundary-summary-div'>
                    <strong>Error:</strong> {error.toString()}
                    {errorInfo && (
                        <>
                        <br/><br/>
                            <strong>Component Stack:</strong>
                            {errorInfo.componentStack}
                        </>
                    )}
                </div>
            </details>
        )}
    </div>
);

export default ErrorBoundary;