import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/Input";
import PageTitle from "../components/PageTitle";
import MainTitle from "../components/MainTitle";

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount($username: String!, $email: String!, $name: String!, $location: String!, $password: String!) {
        createAccount(username: $username, email: $email, name: $name, location: $location password: $password) {
            success
            error
        }
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Subtitle = styled.p`
    font-size: 16px;
    text-align: center;
    margin-top: 10px;
    font-weight: 600;
    color: ${props => props.theme.accent};
`;

function Signup() {
    const history = useHistory();
    const { register, handleSubmit, getValues, setError, clearErrors, formState: { errors, isValid } } = useForm({
        mode: "onChange"
    });
    const [ createAccount, { loading } ] = useMutation(CREATE_ACCOUNT_MUTATION, {
        onCompleted: data => {
            const { createAccount: { success, error } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            };
            history.push("/");
        }
    });

    const onSubmitValid = data => {
        if (loading) {
            return null;
        } else {
            createAccount({
                variables: {
                    ...data
                }
            });
        };
    };
    const preventDefault = e => {
        if (e.code === "Enter") {
            e.preventDefault();
        };
    };
    return (
        <AuthLayout>
            <PageTitle title="Sign Up" />
            <FormBox>
                <HeaderContainer>
                    <MainTitle />
                    <Subtitle>Sign up to find and share coffee shops.</Subtitle>
                </HeaderContainer>
                <form onSubmit={handleSubmit(onSubmitValid)} onKeyDown={e => preventDefault(e)}>
                    <Input ref={register({
                        required: "Username is required.", 
                        maxLength: {
                            value: 50, 
                            message: "Username must be shorter than 50."
                        }
                    })} onChange={() => clearErrors("result")} name="username" type="text" placeholder="Username" errorMessage={errors?.username?.message} />
                    <Input ref={register({
                        required: "Email address is required.", 
                        maxLength: {
                            value: 60, 
                            message: "Email address must be shorter than 50."
                        }, 
                        pattern: {
                            value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, 
                            message: "Email address is invalid."
                        }
                    })} onChange={() => clearErrors("result")} name="email" type="email" placeholder="Email" errorMessage={errors?.email?.message} />
                    <Input ref={register({
                        required: "Real name is required.", 
                        maxLength: {
                            value: 80, 
                            message: "Real name must be shorter than 50."
                        }
                    })} onChange={() => clearErrors("result")} name="name" type="text" placeholder="Real Name" errorMessage={errors?.realname?.message} />
                    <Input ref={register({
                        required: "Location is required.", 
                        maxLength: {
                            value: 50, 
                            message: "Location must be shorter than 50."
                        }
                    })} onChange={() => clearErrors("result")} name="location" type="text" placeholder="Location" errorMessage={errors?.location?.message} />
                    <Input ref={register({
                        required: "Password is required.", 
                        minLength: {
                            value: 8, 
                            message: "Password must be bigger than 7."
                        }
                    })} onChange={() => clearErrors("result")} name="password" type="password" placeholder="Password" errorMessage={errors?.password?.message} />
                    <Input ref={register({
                        required: "Confrim password is required.", 
                        validate: currrentValue => {
                            const { password } = getValues();
                            return currrentValue === password ? null : "Password confrimation is not correct.";
                        }
                    })} onChange={() => clearErrors("result")} name="confrimPassword" type="password" placeholder="Confrim Password" errorMessage={errors?.confrimPassword?.message} />
                    <Button type="submit" value={loading ? "Loading..." : "Sign up"} disabled={!isValid || loading} />
                </form>
            </FormBox>
            <BottomBox short="Already have an account?" linkText="Log in" link="/" />
        </AuthLayout>
    );
};

export default Signup;