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

const coffeeShopMerge = (existing, incoming, { args }) => {
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
};
export const client = new ApolloClient({
    link: ApolloLink.from([ authLink, uploadLink ]), 
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    seeCoffeeShops: {
                        keyArgs: false, 
                        merge: coffeeShopMerge
                    }, 
                    search: {
                        keyArgs: false, 
                        merge(existing, incoming, { args })  {
                            const coffeeShopExisting = existing?.coffeeShops;
                            const userExisting = existing?.users;
                            const coffeeShopIncoming = incoming?.coffeeShops;
                            const userIncoming = incoming?.users;
                            if (args.hasOwnProperty("lastId") && !!args.lastId) {
                                const coffeeShopMerged = coffeeShopExisting ? coffeeShopExisting.slice(0) : [];
                                const userMerged = userExisting ? userExisting.slice(0) : [];
                                const coffeeShopFilteredMerged = coffeeShopMerged.filter((value, index) => coffeeShopMerged.indexOf(value) === index);
                                const userFilteredMerged = userMerged.filter((value, index) => userMerged.indexOf(value) === index);
                                const coffeeShopFilteredIncoming = coffeeShopIncoming.filter(value => !coffeeShopFilteredMerged.some(item => item.__ref === value.__ref));
                                const userFilteredIncoming = userIncoming.filter(value => !userFilteredMerged.some(item => item.__ref === value.__ref));
                                return {
                                    coffeeShops: [
                                        ...coffeeShopFilteredMerged, 
                                        ...coffeeShopFilteredIncoming
                                    ], 
                                    users: [
                                        ...userFilteredMerged, 
                                        ...userFilteredIncoming
                                    ]
                                };
                            } else {
                                return {
                                    coffeeShops: [
                                        ...coffeeShopIncoming
                                    ], 
                                    users: [
                                        ...userIncoming
                                    ]
                                };
                            };
                        }
                    }
                }
            }
        }
    })
});