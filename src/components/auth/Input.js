import React, { forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
`;

const StyledInput = styled.input`
    width: 100%;
    border-radius: 4px;
    padding: 7px;
    color: #17191c;
    background-color: #fafafa;
    border: 0.5px solid ${props => props.errorMessage ? "#ff471a" : props.theme.borderColor};
    box-sizing: border-box;
    &::placeholder {
        font-size: 13px;
    }
    &:focus {
        border-color: ${props => props.errorMessage ? "#ff471a" : "rgb(38, 38, 38)"};
    }
`;

const ErrorText = styled.p`
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: #ff471a;
`;

const Input = forwardRef((props, ref) => {
    const inputProps = { errorMessage: null, ...props };
    return <Container>
        <StyledInput ref={ref} {...inputProps} />
        {props.errorMessage ? (
            <ErrorText>{props.errorMessage}</ErrorText>
        ) : null}
    </Container>;
});

export default Input;