import styled from "styled-components";

export const BaseBox = styled.div`
    background-color: ${props => props.theme.bgColor};
    border: 1px solid ${props => props.theme.borderColor};
    width: 100%;
`;