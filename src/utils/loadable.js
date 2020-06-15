import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

const loadable = (importFunc, { fallback = null } = { fallback: null }) =>{
    const LazyComponent = lazy(importFunc);
    return props => (
        <ErrorBoundary >
            <Suspense fallback={fallback}>
                <LazyComponent  {...props} />  
            </Suspense> 
        </ErrorBoundary>      
    )
}

export default loadable;