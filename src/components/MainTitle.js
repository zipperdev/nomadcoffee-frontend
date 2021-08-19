import React from "react";
import styled from "styled-components";

const SMainTitle = styled.span`
    font-size: 30px;
    font-weight: 600;
    font-family: "Poppins", sans-serif !important;
`;

const SeparatorTitle = styled.strong`
    font-size: 32px;
    font-family: "Poppins", sans-serif !important;
    margin: 0 16px;
`;

function MainTitle() {
    return (
        <h1>
            <SMainTitle>Nomad</SMainTitle>
            <SeparatorTitle>X</SeparatorTitle>
            <SMainTitle>Coffee</SMainTitle>
        </h1>
    );
};

export default MainTitle;