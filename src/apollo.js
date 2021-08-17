import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

const AUTHENTICATION =  "AUTHENTICATION";
const DARK_MODE = "DARK_MODE";

export const authenticatedVar = makeVar(Boolean(localStorage.getItem(AUTHENTICATION)));
export const logUserIn = (token, history=null) => {
    localStorage.setItem(AUTHENTICATION, token);
    if (history) {
        history.push("/");
    };
    window.location.reload();
    authenticatedVar(true);
};
export const logUserOut = () => {
    localStorage.removeItem(AUTHENTICATION);
    window.location.reload();
    authenticatedVar(false);
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));
export const enableDarkMode = () => {
    localStorage.setItem(DARK_MODE, "enabled");
    darkModeVar(true);
};
export const disableDarkMode = () => {
    localStorage.removeItem(DARK_MODE);
    darkModeVar(false);
};

export const client = new ApolloClient({
    uri: "https://nomadcoffeeshop-backend.herokuapp.com/graphql", 
    cache: new InMemoryCache()
});