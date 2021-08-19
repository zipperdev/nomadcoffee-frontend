import React from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import CoffeeShop from "../components/CoffeeShop";

const SEE_COFFEE_SHOPS_QUERY = gql`
    query seeCoffeeShops {
        seeCoffeeShops {
            id
            name
            latitude
            longitude
            user {
                id
                avatarURL
                username
            }
            photos {
                id
                url
            }
            categories {
                id
                name
                slug
            }
            createdAt
        }
    }
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px 0;
    row-gap: 60px;
`;

const Loading = styled.h1`
    font-weight: 600;
    font-size: 28px;
    margin: 20px 0 0 20px;
`;

function Home() {
    const { data, loading } = useQuery(SEE_COFFEE_SHOPS_QUERY);

    return (
        <Layout title="Home">
            {loading ? (
                <Loading>Loading...</Loading>
            ) : (
                <Container>
                    {data?.seeCoffeeShops?.map((obj, index) => (
                        <CoffeeShop key={index} index={index} obj={obj} />
                    ))}
                </Container>
            )}
        </Layout>
    );
};

export default Home;