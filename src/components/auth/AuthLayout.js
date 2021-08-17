import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Wrapper = styled.div`
    max-width: 390px;
    width: 100%;
`;

const Footer = styled.footer`
    margin-top: 40px;
`;

const DarkModeBtn = styled.span`
    cursor: pointer;
`;

function AuthLayout({ children }) {
    const darkMode = useReactiveVar(darkModeVar);
    return (
        <Container>
            <Wrapper>{children}</Wrapper>
            <Footer>
                <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
                    {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
                </DarkModeBtn>
            </Footer>
        </Container>
    );
};

export default AuthLayout;