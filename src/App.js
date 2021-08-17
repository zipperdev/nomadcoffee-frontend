import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { authenticatedVar, client, darkModeVar } from "./apollo";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GithubCallback from "./pages/GithubCallback";
import NotFound from "./pages/NotFound";

function App() {
    const darkMode = useReactiveVar(darkModeVar);
    const authenticated = useReactiveVar(authenticatedVar);
    
    return (
        <ApolloProvider client={client}>
            <HelmetProvider>
                <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                    <GlobalStyles />
                    <Router>
                        <Switch>
                            <Route exact path="/" component={authenticated ? Home : Login} />
                            {authenticated ? null : (
                                <>
                                    <Route path="/signup" component={Signup} />
                                    <Route path="/github/callback" component={GithubCallback} />
                                </>
                            )}
                            <Route component={NotFound} />
                        </Switch>
                    </Router>
                </ThemeProvider>
            </HelmetProvider>
        </ApolloProvider>
    );
}

export default App;
