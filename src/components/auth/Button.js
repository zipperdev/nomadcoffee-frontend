import styled from "styled-components";

const Button = styled.input`
    cursor: pointer;
    border: none;
    border-radius: 3px;
    margin-top: 12px;
    color: #f1f1f1;
    background-color: ${props => props.theme.accent};
    text-align: center;
    padding: 8px 0px;
    font-weight: 600;
    width: 100%;
    opacity: ${props => props.disabled ? "0.2" : "1"};
    transition: opacity 0.1s;
`;

export default Button;