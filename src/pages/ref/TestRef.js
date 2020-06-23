import React, { useEffect, useRef } from 'react';

// createRef 与useRef 与回调Ref区别？
// 回调ref， dom创建和销毁时调用回调函数
// createRef 与useRef dom创建和销毁时赋值

// 函数组件内使用Ref，useRef hook 和 回调REF
export default function TestRef(){
    // 函数组件内不能使用createRef，使用useRef hook创建ref。
    // 类组件上添加Ref
    const classRef = React.useRef(null);
    console.log(classRef.current)

    const buttonRef = React.useRef(null);

    const nameRef = React.useRef(null);

    // 函数组件中使用回调Ref不能将实例保存起来，只能实时操作。在dom变化后就会执行。
    const measuredRef = React.useCallback(node => {
        if(node !== null){
            console.log(node);
        }
    },[])
    const InputRef = React.useCallback(node => {
        if(node !== null){
            console.log(node);
        }
    },[])

    const hocRef = useRef();

    // 函数组件内
    return (
        <>
            <BaseRef ref={classRef}/>
            <div ref={measuredRef}>函数组件内的回调REF</div> 
            <FancyButton ref={buttonRef} onClick={()=>{console.log(buttonRef.current)}}>ref转发</FancyButton> 
            <FancyButton2 inputRef={InputRef}>回调Ref转发</FancyButton2> 
            <FancyButton3 nameRef={nameRef} onClick={() => {console.log(nameRef.current)}}>换名字Ref</FancyButton3> 
            <HOCButton ref={hocRef} onClick={()=>{console.log(hocRef.current)}}>HOC REF</HOCButton>         
        </>
    )
}

// 类组件内使用Ref, refAPI 和回调ref
class BaseRef extends React.Component{
    constructor(props){
        super(props);
        this.myRef1 = React.createRef();
        this.setMyRef2 = element => {
            this.myRef2 = element;
        }
    }
    render(){
        return (
            <>
                <div ref={this.myRef1} onClick={() => {
                    alert(this.myRef1.current.innerHTML)
                }}>REF API</div>
                <div ref={this.setMyRef2}
                onClick={() => {
                    alert(this.myRef2.innerHTML)
                }}
                >回调REF</div>  
            </>
        )
    }
}

// 原因 ref不会像属性一样向下传递
// ref转发 组件上绑定的ref可以传递到组件内（不用ref转发是在组件上生效）
const FancyButton = React.forwardRef((props, ref) => (
   <button ref={ref} onClick={props.onClick}>
       {props.children}
   </button>
))

// 思路：换个属性名向下传递
// 回调ref实现Ref转发
const FancyButton2 = (props) => (
    <button ref={props.inputRef}>
       {props.children}
   </button>
)

const  FancyButton3 = (props) => (
    <button ref={props.nameRef} onClick={props.onClick}>
       {props.children}
   </button>
)


// 高阶组件中使用ref转发（高阶组件会包裹组件，原本传给组件的Ref会绑定到高阶组件上，所以需要透传, React.forwardRef最必要的应用场景）
function LogProps(WrappedComponent){
    function LogProps(props){
        const prevProps = useRef();
        useEffect(()=>{
            prevProps.current = props;
        })
        console.log('old props:', prevProps.current);
        console.log('new props:', props);
        return <WrappedComponent {...props} ref={props.forwardRef}/>
    }
    return React.forwardRef((props,ref)=> <LogProps {...props} forwardRef={ref}/>);
}

// ref绑定在函数组件上将会返回undefined
const HOCButton = LogProps(FancyButton);



