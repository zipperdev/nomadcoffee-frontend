import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { authenticationVar, darkModeVar } from "./apollo";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Home from "./pages/Home";

function App() {
    const darkMode = useReactiveVar(darkModeVar);
    const authentication = useReactiveVar(authenticationVar);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
