import { ApolloClient, ApolloLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

export const AUTHENTICATION =  "AUTHENTICATION";
export const DARK_MODE = "DARK_MODE";

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

const API_URI = "https://nomadcoffeeshop-backend.herokuapp.com/graphql";
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers, 
            autorization: localStorage.getItem(AUTHENTICATION)
        }
    };
});
const uploadLink = createUploadLink({
    uri: API_URI
});
export const client = new ApolloClient({
    link: ApolloLink.from([ authLink, uploadLink ]), 
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    seeCoffeeShops: {
                        keyArgs: false, 
                        merge(existing, incoming, { args }) {
                            if (args.hasOwnProperty("lastId") && !!args.lastId) {
                                const merged = existing ? existing.slice(0) : [];
                                const filteredMerged = merged.filter((value, index) => merged.indexOf(value) === index);
                                const filteredIncoming = incoming.filter(value => !filteredMerged.some(item => item.__ref === value.__ref));
                                return [ ...filteredMerged, ...filteredIncoming ];
                            } else if (existing) {
                                const merged = existing ? existing.slice(0) : [];
                                const filteredMerged = merged.filter((value, index) => merged.indexOf(value) === index);
                                const filteredIncoming = incoming.filter(value => !filteredMerged.some(item => item.__ref === value.__ref));
                                return [ ...filteredMerged, ...filteredIncoming ];
                            } else {
                                return [ ...incoming ];
                            };
                        }
                    }
                }
            }
        }
    })
});