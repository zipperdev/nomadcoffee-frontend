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
    flex-direction: column;
    height: 100%;
`;

const Title = styled.h1`
    font-size: 30px;
    font-weight: 600;
    text-align: center;
`;

const Subtitle = styled.p`
    margin-top: 10px;
    font-size: 18px;
    & > #error-accent {
        font-weight: 600;
        text-decoration: underline;
        color: #ff5c33;
    }
    & > p {
        font-weight: 600;
    }
`;

function GithubCallback() {
    const history = useHistory();
    const [ githubLoginCallback, { error } ] = useMutation(GITHUB_LOGIN_CALLBACK_MUTATION, {
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
        {error ? (
            <Subtitle>
                Sorry, there's an <span id="error-accent">error</span> :&#40;
                <p>{error?.message}</p>
            </Subtitle>
        ) : null}
    </Container>;
};

export default GithubCallback;