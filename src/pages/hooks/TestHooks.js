import React, { useEffect, useState, useRef, useCallback, useImperativeHandle } from 'react';

// hooks 相比render props和高阶组件可以减少嵌套

export default function TestHooks(){
    const inputRef = (ele) => {
      if(ele){
         ele.focus()
      }
    }
    return (
    <div>
        <TestPreviosP />
        <TestForceUpdate />
        <TestUseImperativeHandle ref={inputRef}/>
        <TestMeasure />
    </div>
    )
}


// 1. 获取上一轮state或props
function usePrevios(value){
    const ref = useRef();
    // 每次渲染之后更新
    useEffect(() => {
        ref.current = value
    });
    return ref.current;
}

function TestPreviosC(props){
    const [ prevProps, setPrev ] = useState(null);
    console.log('previous props',usePrevios(props))
    
    return <div>{props.number}</div>
}

function TestPreviosP(){
    const [number, setNumber] = useState(0);
    const handleClick = useCallback(()=>{
        setNumber(number => number+1)
    },[ setNumber ])
    console.log('previos state:',usePrevios(number),number);
    return (
        <div>
            <button onClick={handleClick}>加一</button>
            <TestPreviosC number={number} />
        </div> 
    )
}

// forceUpdate
function TestForceUpdate(){
    console.log('render')
    const [_, forceUpdate] = React.useReducer(x => x + 1, 0)
    return <div onClick={() => forceUpdate()}>forceUpdate</div>
}

// useImperativeHandle配合forwardRef将子组件的方法暴露给父组件
const TestUseImperativeHandle = React.forwardRef((props,ref) => {
    const inputRef = useRef(null);
    useImperativeHandle(ref, () =>{
        return {
            focus: () => inputRef.current.focus()
        }
    })
    return <input ref={inputRef}/>
})

// 测量DOM节点
function useMeasure(){
    const [rect, setRect] = useState();
    const ref = useCallback( ele =>{
        if(ele){
            setRect(ele.getBoundingClientRect());
        }
    },[])
    return [rect, ref];
}

function TestMeasure(){
    const [rect, ref] = useMeasure();
    console.log(rect);
    return <div ref={ref}>测试Measure</div>
}
