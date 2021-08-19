import React from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import styled from "styled-components";
import { gql, useMutation, useQuery } from "@apollo/client";
import ErrorText from "../components/auth/ErrorText";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/Input";
import Separator from "../components/auth/Separator";
import PageTitle from "../components/PageTitle";
import MainTitle from "../components/MainTitle";
import { logUserIn } from "../apollo";

const GITHUB_LOGIN_URL_QUERY = gql`
    query githubLoginUrl {
        githubLoginUrl
    }
`;

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            success
            token
            error
        }
    }
`;

const GithubLogin = styled.a`
    padding: 5px;
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #385285;
    span {
        margin-left: 10px;
        font-weight: 600;
    }
`;

function Login() {
    const { register, handleSubmit, setError, getValues, clearErrors, formState: { errors, isValid } } = useForm({
        mode: "onChange"
    });
    const { data: githubLoginUrlData } = useQuery(GITHUB_LOGIN_URL_QUERY);
    const [ login, { loading } ] = useMutation(LOGIN_MUTATION, {
        onCompleted: data => {
            const { login: { success, error, token } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            } else if (token) {
                logUserIn(token);
            };
        }
    });
    const githubLoginUrl = githubLoginUrlData?.githubLoginUrl;

    const onSubmitValid = () => {
        if (loading) {
            return null;
        } else {
            const { username, password } = getValues();
            login({
                variables: {
                    username, 
                    password
                }
            });
        };
    };
    return (
        <AuthLayout>
            <PageTitle title="Log In" />
            <FormBox>
                <MainTitle />
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input ref={register({
                        required: "Username is required."
                    })} onChange={() => clearErrors("result")} name="username" type="text" placeholder="Username" errorMessage={errors?.username?.message}  />
                    <Input ref={register({
                        required: "Password is required."
                    })} onChange={() => clearErrors("result")} name="password" type="password" placeholder="Password" errorMessage={errors?.password?.message} />
                    <Button type="submit" value={loading ? "Loading..." : "Log in"} disabled={!isValid || loading} />
                    <ErrorText>{errors?.result?.message}</ErrorText>
                </form>
                <Separator />
                <GithubLogin href={githubLoginUrl}>
                    <FaGithub size={22} />
                    <span>Log in with Github</span>
                </GithubLogin>
            </FormBox>
            <BottomBox short="Don't have an account?" linkText="Sign up" link="/signup" />
        </AuthLayout>
    );
};

export default Login;