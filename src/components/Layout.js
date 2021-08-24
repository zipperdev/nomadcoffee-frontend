import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiLogOut, FiPlusCircle, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";
import { useUser } from "../hooks/useUser";
import { authenticatedVar, darkModeVar, disableDarkMode, enableDarkMode, logUserOut } from "../apollo";
import PageTitle from "./PageTitle";
import Avatar from "./Avatar";

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const Header = styled.header`
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70px;
    overflow: hidden;
    background-color: ${props => props.theme.bgColor};
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    z-index: 2;
`;

const HeaderContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    height: 70px;
    display: grid;
    grid-template-columns: 6fr 4fr 6fr;
    grid-column-gap: 20px;
`;

const HeaderObj = styled.div`
    margin-left: 20px;
    cursor: pointer;
`;

const HeaderLink = styled(Link)`
    margin-left: 20px;
    text-decoration: none;
`;

const MainTitle = styled.h1`
    margin-top: -16px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
`;


const SMainTitle = styled.span`
    font-size: 22px;
    font-weight: 600;
    font-family: "Poppins", sans-serif !important;
    text-justify: center;
`;

const SeparatorTitle = styled.strong`
    font-size: 24px;
    font-family: "Poppins", sans-serif !important;
    margin: 0 6px 0 7px;
`;

const SearchSection = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SearchForm = styled.form`
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Input = styled.input`
    width: 100%;
    height: 30px;
    border-radius: 4px;
    padding: 7px;
    color: #17191c;
    background-color: #fafafa;
    border: 0.5px solid ${props => props.theme.borderColor};
    box-sizing: border-box;
    &::placeholder {
        font-size: 13px;
    }
    &:focus {
        border-color: "rgb(38, 38, 38)";
    }
`;

const Button = styled.button`
    display: block;
    position: absolute;
    margin-top: 1px;
    right: 5px;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    & > svg {
        stroke: #17191c;
        background-color: transparent;
    }
    @media screen and (max-width: 555px) {
        display: none;
    }
`;

const AuthSection = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DarkModeBtn = styled.span`
    cursor: pointer;
`;

const AvatarContainer = styled(Link)`
    margin-left: 20px;
    width: 24px;
    height: 24px;
`;

const SignupLink = styled(Link)`
    margin-left: 20px;
    color: ${props => props.theme.accent};
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
`;

const LoginLink = styled(Link)`
    margin-left: 20px;
    width: 60px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3px;
    padding-bottom: 3px;
    border-radius: 5px;
    color: #ffffff;
    background-color: ${props => props.theme.accent};
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
`;

const ChildrenContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Children = styled.div`
    width: 100%;
    max-width: 1000px;
`;

function Layout({ title, children }) {
    const { data } = useUser();
    const history = useHistory();
    const { handleSubmit, register } = useForm();
    const darkMode = useReactiveVar(darkModeVar);
    const authenticated = useReactiveVar(authenticatedVar);

    const onSubmit = data => {
        const { keyword } = data;
        if (keyword.replace(/ /g, "")) {
            history.push(`/search?keyword=${keyword}`);
        };
    };
    return (
        <Container>
            <PageTitle title={title} />
            <Header>
                <HeaderContainer>
                    <div>
                        <HeaderLink to="/">
                            <MainTitle>
                                <SMainTitle>Nomad</SMainTitle>
                                <SeparatorTitle>X</SeparatorTitle>
                                <SMainTitle>Coffee</SMainTitle>
                            </MainTitle>
                        </HeaderLink>
                    </div>
                    <SearchSection>
                        <SearchForm onSubmit={handleSubmit(onSubmit)}>
                            <Input ref={register({})} type="text" name="keyword" placeholder="Search" />
                            <Button type="submit">
                                <FiSearch size={18} />
                            </Button>
                        </SearchForm>
                    </SearchSection>
                    <AuthSection>
                        {authenticated ? (
                            <>
                                <HeaderObj>
                                    <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
                                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                                    </DarkModeBtn>
                                </HeaderObj>
                                <HeaderLink to="/add">
                                    <FiPlusCircle size={24} />
                                </HeaderLink>
                                <AvatarContainer to={`/users/${data?.seeProfile?.username}`}>
                                    <Avatar avatar={data?.seeProfile?.avatarURL} />
                                </AvatarContainer>
                                <HeaderObj onClick={logUserOut}>
                                    <FiLogOut size={24} />
                                </HeaderObj>
                            </>
                        ) : (
                            <>
                                <SignupLink to="/signup">Sign Up</SignupLink>
                                <LoginLink to="/">Log In</LoginLink>
                            </>
                        )}
                    </AuthSection>
                </HeaderContainer>
            </Header>
            <ChildrenContainer>
                <Children>
                    {children}
                </Children>
            </ChildrenContainer>
        </Container>
    );
};

Layout.propTypes = {
    title: PropTypes.string.isRequired
};

export default Layout;