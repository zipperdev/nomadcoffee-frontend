/* global kakao */
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import PropTypes from "prop-types";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import Avatar from "../components/Avatar";
import { useUser } from "../hooks/useUser";

const REMOVE_COFFEE_SHOP_MUTATION = gql`
    mutation removeCoffeeShop($id: Int!) {
        removeCoffeeShop(id: $id) {
            success
            error
        }
    }
`;

const CoffeeShopBox = styled.div`
    width: 90%;
    height: 500px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${props => props.theme.deepColor};
    border: 1px solid ${props => props.theme.borderColor};
    overflow: hidden;
`;

const TitleContainer = styled.div`
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.deepColor};
`;

const UserTab = styled(Link)`
    height: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
    margin-left: 20px;
`;

const Username = styled.h3`
    margin-left: 10px;
    margin-bottom: 2px;
    font-weight: 500;
`;

const Title = styled(Link)`
    margin-left: 10px;
    margin-bottom: 4px;
    font-size: 18px;
    color: ${props => props.theme.accent};
    font-weight: 600;
    text-decoration: none;
`;

const AdminPannel = styled.div`
    position: absolute;
    display: flex;
    right: 20px;
`;

const PannelBtn = styled.div`
    cursor: pointer;
    margin-left: 20px;
    & > svg {
        stroke: #17191c;
        background-color: transparent !important;
    }
`;

const DescContainer = styled.div`
    display: flex;
    width: 100%;
    height: 440px;
`;

const DescMainContainer = styled.div`
    width: 70%;
    height: 100%;
`;

const MainImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.fontColor};
    background-image: url(${props => props.src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

const DescDetailsContainer = styled.div`
    width: 30%;
    height: 100%;
    display: grid;
    grid-template-rows: 5fr 4fr 3.8fr;
`;

const KakaoMap = styled.div`
    background-color: transparent;
    & > div:nth-child(2) {
        background-color: transparent !important;
        & > div:nth-child(2) {
            background-color: transparent !important;
        }
    }
    & > div > div > div:nth-child(4) {
        z-index: 0 !important;
    }
`;

const DetailsObject = styled.div`
    background-color: ${props => props.theme.bgColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 96%;
    height: 96%;
    overflow: auto;
    padding: 2%;
`;

const ObjectTitle = styled.h1`
    font-weight: 600;
    margin-bottom: 5px;
`;

const ObjectArray = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    border-radius: 8px;
    ::-webkit-scrollbar {
        width: 4px;
        background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.deepColor};
    }
    margin-bottom: 2px;
`;

const Photo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background-color: ${props => props.theme.fontColor};
    background-image: url(${props => props.src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 8px;
`;

const Category = styled.h1`
    width: fit-content;
    max-width: 90%;
    height: fit-content;
    padding: 10px;
    background-color: ${props => props.theme.deepColor};
    border-radius: 8px;
    overflow-wrap: break-word;
    line-height: 1.2rem;
`;

function CoffeeShop({ index, obj }) {
    const { data } = useUser();
    const history = useHistory();
    const [ removeCoffeeShop, { loading } ] = useMutation(REMOVE_COFFEE_SHOP_MUTATION, {
        variables: {
            id: obj.id
        }, 
        onCompleted: data => {
            const { removeCoffeeShop: { success } } = data;
            if (success) {
                history.push("/");
                window.location.reload();
            };
        }
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_MAP_API}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            const latitude = parseInt(obj.latitude);
            const longitude = parseInt(obj.longitude);
            const container = document.getElementById(`kakao-map-${index}`);
            const options = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 3
            };
            
            const map = new window.kakao.maps.Map(container, options);
            
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(latitude, longitude)
            });
            marker.setMap(map);
        };
    }, []);
    const deleteCoffeeShop = () => {
        if (!loading) {
            removeCoffeeShop();
        };
    };
    return (
        <CoffeeShopBox key={index}>
            <TitleContainer>
                <UserTab to={`/users/${obj.user.username}`}>
                    <Avatar avatar={obj.user.avatarURL} size={35} />
                    <Username>{obj.user.username}</Username>
                </UserTab>
                <Title to={`/shops/${obj.id}`}>{obj.name}</Title>
                {obj.user.id === data?.seeProfile?.id ? (
                    <AdminPannel>
                        <PannelBtn>
                            <Link to={`/shops/${obj.id}/edit`}>
                                <FiEdit3 size={20} />
                            </Link>
                        </PannelBtn>
                        <PannelBtn onClick={deleteCoffeeShop}>
                            <FiTrash2 size={20} />
                        </PannelBtn>
                    </AdminPannel>
                ) : null}
            </TitleContainer>
            <DescContainer>
                <DescMainContainer> 
                    <MainImage src={obj.photos[0].url} />
                </DescMainContainer>
                <DescDetailsContainer>
                    <KakaoMap id={`kakao-map-${index}`}></KakaoMap>
                    <DetailsObject>
                        <ObjectTitle>Photos</ObjectTitle>
                        <ObjectArray>
                            {obj.photos.map((photo, index) => (
                                <Photo key={index} src={photo.url} />
                            ))}
                        </ObjectArray>
                    </DetailsObject>
                    <DetailsObject>
                        <ObjectTitle>Categories</ObjectTitle>
                        <ObjectArray>
                            {obj.categories.map((category, index) => (
                                <Category key={index}>{category.slug}</Category>
                            ))}
                        </ObjectArray>
                    </DetailsObject>
                </DescDetailsContainer>
            </DescContainer>
        </CoffeeShopBox>
    );
};

CoffeeShop.propTypes = {
    index: PropTypes.number.isRequired, 
    obj: PropTypes.object.isRequired
};

export default CoffeeShop;