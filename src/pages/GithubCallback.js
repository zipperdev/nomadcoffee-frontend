import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";

const GITHUB_LOGIN_CALLBACK_MUTATION = gql`
    mutation githubLoginCallback($code: String!) {
        githubLoginCallback(code: $code) {
            success
            token
            error
        }
    }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Title = styled.h1`
    font-size: 30px;
    font-weight: 600;
    text-align: center;
`;

function GithubCallback() {
    const history = useHistory();
    const [ githubLoginCallback ] = useMutation(GITHUB_LOGIN_CALLBACK_MUTATION, {
        onCompleted: data => {
            const { githubLoginCallback: { success, error, token } } = data;
            if (success && !error) {
                logUserIn(token, history);
            };
        }
    });
    
    useEffect(() => {
        const code = window.location.search.split("=")[1];
        if (code) {
            githubLoginCallback({
                variables: {
                    code
                }
            });
        };
    }, [githubLoginCallback]);
    return <Container>
        <Title>Logging you in...</Title>
    </Container>;
};

export default GithubCallback;