import React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import SingleCoffeeShop from "../components/coffeeShop/CoffeeShop";
import Layout from "../components/Layout";

const SEE_COFFEE_SHOP_QUERY = gql`
    query seeCoffeeShop($id: Int!) {
        seeCoffeeShop(id: $id) {
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
`;

const Loading = styled.h1`
    font-weight: 600;
    font-size: 28px;
    margin: 20px 0 0 20px;
`;

function CoffeeShop() {
    const { id } = useParams();
    const { state } = useLocation();
    const { data, loading } = useQuery(SEE_COFFEE_SHOP_QUERY, {
        fetchPolicy: state?.status === "modified" ? "network-only" : "cache-first", 
        variables: {
            id: parseInt(id)
        }
    });

    return (
        <Layout title={`${data ? data?.seeCoffeeShop.name : ""}${data ? " " : ""}Coffee Shop`}>
            {loading ? (
                <Loading>Loading...</Loading>
            ) : (
                <Container>
                    <SingleCoffeeShop index={0} obj={data?.seeCoffeeShop} />
                </Container>
            )}
        </Layout>
    );
};

export default CoffeeShop;