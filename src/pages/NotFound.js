import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";
import { authenticatedVar } from "../apollo";
import Layout from "../components/Layout";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 60px;
`;

const Title = styled.h1`
    font-weight: 700;
    font-size: 50px;
    color: ${props => props.theme.accent};
`;

const Desc = styled.p`
    font-weight: 600;
    font-size: 20px;
    margin-top: 10px;
`;

function NotFound() {
    const authenticated = useReactiveVar(authenticatedVar);
    return authenticated ? (
        <Layout title="Page not found">
            <Container>
                <Title>404</Title>
                <Desc>This is not the page you are looking for.</Desc>
            </Container>
        </Layout>
    ) : (
        <Container>
            <Title>404</Title>
            <Desc>This is not the page you are looking for. <Link to="/">Go Home</Link></Desc>
        </Container>
    );
};

export default NotFound;