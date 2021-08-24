import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { gql, useLazyQuery } from "@apollo/client";
import _ from "lodash";
import CoffeeShop from "../components/coffeeShop/CoffeeShop";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";

const SEARCH_QUERY = gql`
    query search($keyword: String!, $userLastId: Int, $coffeeShopLastId: Int) {
        search(keyword: $keyword, userLastId: $userLastId, coffeeShopLastId: $coffeeShopLastId) {
            users {
                id
                avatarURL
                username
                name
            }
            coffeeShops {
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

const TopBar = styled.div`
    width: 80%;
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 60px;
    padding: 0 10%;
`;

const ControllerBtn = styled.button`
    cursor: pointer;
    border-radius: 8px;
    border: none;
    text-align: center;
    background-color: ${props => props.theme.deepColor};
    opacity: ${props => props.current === props.button ? 1 : 0.6};
    transition: opacity 0.1s;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: -5px;
`;

const NotFound = styled.h3`
    font-weight: 600;
    font-size: 28px;
`;

const UserObject = styled(Link)`
    position: relative;
    width: 80%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    box-sizing: border-box;
    background-color: ${props => props.theme.deepColor};
    text-decoration: none;
    border-radius: 5px;
`;

const Username = styled.h1`
    color: ${props => props.theme.accent};
    font-weight: 600;
    font-size: 16px;
    margin-left: 16px;
    margin-bottom: 1px;
`;

const Name = styled.p`
    position: absolute;
    font-weight: 500;
    font-size: 12px;
    right: 12px;
`;

function Search() {
    const [ page, setPage ] = useState("coffeeShops");
    const [ search, { data, loading, fetchMore } ] = useLazyQuery(SEARCH_QUERY, {
        fetchPolicy: "network-only", 
        onCompleted: () => {
            setPage("coffeeShops");
        }
    });

    useEffect(() => {
        const isOnBottom = () => Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

        const handleScroll = _.throttle(() => {
            const isBottom = isOnBottom();
            const userLastId =  data?.search.users[data?.search.users.length - 1]?.id;
            const coffeeShopLastId =  data?.search.coffeeShops[data?.search.coffeeShops.length - 1]?.id;
            if (isBottom && !loading) {
                if (page === "users" && userLastId) {
                    fetchMore({
                        variables: {
                            userLastId
                        }
                    });
                } else if (page === "coffeeShops" && coffeeShopLastId) {
                    fetchMore({
                        variables: {
                            coffeeShopLastId
                        }
                    });
                };
            };
        }, 300);
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [data, loading, page, fetchMore]);
    useEffect(() => {
        const keyword = window.location.search.slice(1).match(/keyword=[^&]*/g)[0].split("=")[1];
        const compiledKeyword = decodeURI(keyword);
        search({
            variables: {
                keyword: compiledKeyword
            }
        });
        // eslint-disable-next-line
    }, [window.location.search.slice(1).match(/keyword=[^&]*/g)[0].split("=")[1], search]);
    return (
        <Layout title="Search">
            <Container>
                {loading && !data ? (
                    <Loading>Loading...</Loading>
                ) : null}
                {data?.search ? (
                    <>
                        <TopBar>
                            <ControllerBtn button="coffeeShops" current={page} onClick={() => setPage("coffeeShops")}>
                                Coffee Shops
                            </ControllerBtn>
                            <ControllerBtn button="users" current={page} onClick={() => setPage("users")}>
                                Users
                            </ControllerBtn>
                        </TopBar>
                        <Container>
                            {page === "coffeeShops" ? (
                                <>
                                    {!data?.search?.coffeeShops[0] ? <NotFound>There's no coffee shops</NotFound> : null}
                                    {data?.search?.coffeeShops?.map((obj, index) => (
                                        <CoffeeShop key={index} index={index} obj={obj} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {!data?.search?.users[0] ? <NotFound>There's no users</NotFound> : null}
                                    {data?.search?.users?.map((obj, index) => (
                                        <UserObject to={`/users/${obj.username}`} key={index}>
                                            <Avatar avatar={obj.avatarURL} size={30} />
                                            <Username>{obj.username}</Username>
                                            <Name>{obj.name}</Name>
                                        </UserObject>
                                    ))}
                                </>
                            )}
                        </Container>
                    </>
                ) : null}
            </Container>
        </Layout>
    );
};

export default Search;