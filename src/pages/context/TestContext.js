import React, { createContext, useContext } from 'react';


const themes = {
    light: {
      foreground: '#000000',
      background: '#eeeeee',
    },
    dark: {
      foreground: '#ffffff',
      background: '#222222',
    },
  };
// context通过新旧值Object.is来确认变化
const ThemeContext = createContext(themes.dark);
  

export default class TestContext extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            theme: themes.light
        }

        this.toggleTheme = () => {
            this.setState(state => ({
                theme: state.theme === themes.dark ? themes.light : themes.dark
            }))
        }
    }

    render(){
        return (
            <div>
                <ThemeContext.Provider value={{theme: this.state.theme, toggleTheme: this.toggleTheme}}>
                    <>
                      <Header />
                      <Content /> 
                      <Footer />          
                    </> 
                </ThemeContext.Provider>
            </div>
        )
    }
}

// 函数式组件中使用Context
function Header(){
    const obj = useContext(ThemeContext);
    return (
        <button onClick={() => obj.toggleTheme()}>toggleTheme</button>    
    )
}

// 类组件中使用Context

class Footer extends React.Component{
    static contextType = ThemeContext;
    render(){
        return (
            <div>{this.context.theme.background}</div> 
        )
    }
}


// 通用使用方法
function Content(){
    return (
        <ThemeContext.Consumer>
            {
                obj => (
                    <>
                        <h1 style={obj.theme}>hello world</h1>  
                    </> 
                )
            }
        </ThemeContext.Consumer>
    )
}

