import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

export const lightTheme = {
    bgColor: "#deb8a0", 
    fontColor: "#17191c", 
    borderColor: "#747879", 
    accent: "#5b5411"
};

export const darkTheme = {
    bgColor: "#251a0e", 
    fontColor: "#faf2eb", 
    borderColor: "#989fa2", 
    accent: "#968936"
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    html, 
    body {
        height: 100vh;
    }
    
    * {
        outline: none;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
        background-color: ${props => props.theme.bgColor};
        color: ${props => props.theme.fontColor};
    }

    input, button {
        outline: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
`;