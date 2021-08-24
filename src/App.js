import dotenv from "dotenv";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { authenticatedVar, client, darkModeVar } from "./apollo";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import GithubCallback from "./pages/GithubCallback";
import AddCoffeeShop from "./pages/AddCoffeeShop";
import EditCoffeeShop from "./pages/EditCoffeeShop";
import CoffeeShop from "./pages/CoffeeShop";
import NotFound from "./pages/NotFound";
dotenv.config();

function App() {
    const darkMode = useReactiveVar(darkModeVar);
    const authenticated = useReactiveVar(authenticatedVar);

    useEffect(() => {
        document.getElementById("root").scrollTo(0, 0);
    }, []);

    return (
        <ApolloProvider client={client}>
            <HelmetProvider>
                <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                    <GlobalStyles />
                    <Router>
                        <ScrollToTop />
                        <Switch>
                            <Route exact path="/" component={authenticated ? Home : Login} />
                            {authenticated ? null : <Route exact path="/signup" component={Signup} />}
                            {authenticated ? null : <Route exact path="/github/callback" component={GithubCallback} />}
                            {authenticated ? <Route exact path="/add" component={AddCoffeeShop} /> : null}
                            <Route exact path="/search" component={Search} />
                            <Route exact path="/shops/:id" render={props => <CoffeeShop {...props} />} />
                            <Route exact path="/shops/:id/edit" component={EditCoffeeShop} />
                            <Route path="*" component={NotFound} />
                        </Switch>
                    </Router>
                </ThemeProvider>
            </HelmetProvider>
        </ApolloProvider>
    );
}

export default App;
