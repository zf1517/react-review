import React from 'react';
// react逻辑复用
// mixin ： 将mixin对象上的方法混入到react组件中； 缺点： 命名重复， 隐式依赖

// 逻辑组件中使用props（例如render， children等）渲染
export default function TestRender(){
    return (
        <div>
            <Form>
                <Input v_model='name' />
                <ProxyWithRenderProps render={(props) => <input {...props}/>}  v_model='name2' />
                <InputWithHook v_model='name3'/>
            </Form>    
        </div>
    )
}


// 注意事项： 逻辑组件使用pureComponenet时，注意传递的props不要每次渲染时重复创建，可以定义成实例方法或是useCallback。

// HOC缺点： 代码嵌套，新增props时可能覆盖原有props。
// HOC实现表单双向绑定
const FormContext = React.createContext();
class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            model:{
            }
        }
    }
    
    changeModel = (name, value) => {
        this.setState({
            model:{...this.state.model,[name]: value}
        })
    }

    onSubmit = () => {
        console.log(this.state.model);
    }

    render(){
        return (<div>
            <FormContext.Provider value={{
                model: this.state.model,
                changeModel: this.changeModel
            }}>
                {this.props.children}
            </FormContext.Provider>
            <button onClick={this.onSubmit}>提交</button>  
        </div>)  
    }
}

function proxyHOC(WrappedComponent){
    return class extends React.Component{
        static contextType = FormContext;
        onChange = (event) => {
            const { changeModel } = this.context;
            const { onChange, v_model } = this.props;
            changeModel(v_model,event.target.value);
            if( typeof onChange === 'function') onChange(event);
        }
        render(){
            const { model } = this.context;
            const { v_model } = this.props;
            return <WrappedComponent {...this.props} value={model[v_model]} onChange={this.onChange}/>
        }
    }
}

const CInput = function(props){
    return <input {...props}/>
}
const Input = proxyHOC(CInput);

// 使用render props重构 上述HOC
function ProxyWithRenderProps(props){
    const formContext = React.useContext(FormContext);
    const { changeModel } = formContext;
    const { onChange, v_model } = props;
    const onChange2 = (event) => {
        changeModel(v_model, event.target.value);
        if( typeof onChange === 'function') onChange(event);
    }
    return props.render({value: formContext.model[v_model], onChange:onChange2})
}

// 使用hooks重构
function useBind(props){
    const formContext = React.useContext(FormContext);
    const { changeModel } = formContext;
    const { onChange, v_model } = props;
    const onChange2 = (event) => {
        changeModel(v_model, event.target.value);
        if( typeof onChange === 'function') onChange(event);
    }
    return {
        value: formContext.model[v_model],
        onChange:onChange2
    }
}

function InputWithHook(props){
    const {value, onChange} = useBind(props);
    return <input value={value} onChange={onChange} />
}