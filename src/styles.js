import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

export const lightTheme = {
    bgColor: "#f6f6f6", 
    fontColor: "#1c1c1c"
};

export const darkTheme = {
    bgColor: "#2c2c2c", 
    fontColor: "#f7f7f7"
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    * {
        background-color: ${props => props.theme.bgColor};
        color: ${props => props.theme.fontColor};
    }
`;