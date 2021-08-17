import React from "react";
import styled from "styled-components";
import { logUserOut } from "../apollo";

const Title = styled.h1`
    font-size: 16px;
`;

function Home() {
    return (
        <>
            <Title>Home / Test Page</Title>
            <button onClick={logUserOut}>Log Out</button>
        </>
    );
};

export default Home;