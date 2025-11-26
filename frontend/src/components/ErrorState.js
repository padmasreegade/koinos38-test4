import React from "react";
import '../styles.css';

const ErrorState = ({
                        error,
                        onRetry,
                        title = "Something went wrong",
                        description = "We encountered an error while loading the data. Please try again.",
                        showRetry = true
                    }) => {
    const getErrorIcon = (errorType) => {
        if (error?.includes('network') || error?.includes('fetch')) return '📡';
        if (error?.includes('404') || error?.includes('not found')) return '🔎';
        if (error?.includes('500') || error?.includes('server')) return '⚠️';
        return '❌';
    };

    const getErrorMessage = (error) => {
        if (!error) return description;

        if (error.includes('Failed to fetch') || error.includes('Network Error')) return 'Unable to connect to the server. Please check you internet connection and try again';
        if (error.includes('404') || error.includes('not found')) return 'The requested resource was not found. It may have been moved or deleted';
        if (error.includes('500') || error.includes('server')) return 'the server encountered and error. Please try again later';
        if (error.includes('timeout')) return 'The request has timed out. Please check your connection and try again';
        return error.length > 100 ? `${error.substring(0, 100)}...` : error;
    };

    return (<div className='error-container'>
        <div className='error-icon'>
            {getErrorIcon(error)}
        </div>
        <h3 className='error-title'>
            {title}
        </h3>
        <p className='error-message'>
            {getErrorMessage(error)}
        </p>

        {showRetry && onRetry && (<div className='error-actions'>
            <button className='btn btn-primary'
                    onClick={onRetry}
                    aria-label='Retry loading data'>
                <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11V-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Try Again
            </button>
        </div>)}
        {/* Additional help text */}
        <div className='error-help'>
            If the problem persists, plase refresh the page or contact support.
        </div>
    </div>);
};

export default ErrorState;