import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = { hasError: false};
    }

    // 渲染阶段调用，不允许出现副作用
    static getDerivedStateFromError(error){
        return { hasError: true}
    }

    // commit阶段执行，允许执行副作用，可以用于记录错误情况
    componentDidCatch(error, errorInfo){
        console.log(error, errorInfo)
    }

    render(){
        if(this.state.hasError){
            return <h1>something went wrong</h1>   
        }
        return this.props.children;
    }
}