import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import _ from "lodash";
import Layout from "../components/Layout";
import CoffeeShop from "../components/coffeeShop/CoffeeShop";

const SEE_COFFEE_SHOPS_QUERY = gql`
    query seeCoffeeShops($lastId: Int) {
        seeCoffeeShops(lastId: $lastId) {
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
    const { data, loading, fetchMore } = useQuery(SEE_COFFEE_SHOPS_QUERY, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        const isOnBottom = () => Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

        window.addEventListener("scroll", _.throttle(async () => {
            const isBottom = isOnBottom();
            const lastId =  data?.seeCoffeeShops[data?.seeCoffeeShops.length - 1]?.id;
            if (isBottom && !loading && lastId) {
                await fetchMore({
                    variables: {
                        lastId
                    }
                });
            };
        }, 300));
    });
    return (
        <Layout title="Home">
            <Container>
                {loading && !data ? (
                    <Loading>Loading...</Loading>
                ) : null}
                {data?.seeCoffeeShops?.map((obj, index) => (
                    <CoffeeShop key={index} index={index} obj={obj} />
                ))}
            </Container>
        </Layout>
    );
};

export default Home;