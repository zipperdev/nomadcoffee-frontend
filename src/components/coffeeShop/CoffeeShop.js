/* global kakao */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiTrash2, FiEdit3, IoIosArrowForward, IoIosArrowBack } from "react-icons/all";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { gql, useMutation } from "@apollo/client";
import _ from "lodash";
import { useUser } from "../../hooks/useUser";
import Avatar from "../Avatar";

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
        background-color: transparent !important;
    }
`;

const DescContainer = styled.div`
    display: flex;
    width: 100%;
    height: 440px;
`;

const DescMainContainer = styled.div`
    position: relative;
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
    transition: background-image 0.2s ease-in-out;
`;

const MainImageControl = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    height: 100%;
    top: 0;
    cursor: pointer;
    position: absolute;
    background-color: rgba(200, 200, 200, 0.4);
    opacity: 0.03;
    transition: opacity 0.2s ease-out;
    ${props => props.direction === "left" ? css`
        left: 0;
        border-radius: 0 20px 20px 0;
    ` : props.direction === "right" ? css`
        right: 0;
        border-radius: 20px 0 0 20px;
    ` : null}
    &:hover {
        opacity: 0.5;
    }
    & * {
        color: #ffffff;
    }
`;

const DescDetailsContainer = styled.div`
    width: 30%;
    height: 100%;
    display: grid;
    grid-template-rows: 5fr 4fr 3.8fr;
    background-color: ${props => props.theme.bgColor};
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
    width: 56px;
    height: 56px;
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
    font-weight: 600;
    line-height: 1.2rem;
`;

function CoffeeShop({ index, obj }) {
    const { data } = useUser();
    const history = useHistory();
    const [ mainImageIndex, setMainImageIndex ] = useState(0);
    const [ removeCoffeeShop, { loading } ] = useMutation(REMOVE_COFFEE_SHOP_MUTATION, {
        variables: {
            id: obj.id
        }, 
        update: (cache, result) => {
            const { data: { removeCoffeeShop: { success } } } = result;
            if (success) {
                const fragmentId = `CoffeeShop:${obj.id}`;
                cache.evict({
                    id: fragmentId
                });
                history.push("/");
            };
        }
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_MAP_API}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            const latitude = parseFloat(obj.latitude);
            const longitude = parseFloat(obj.longitude);
            const container = document.getElementById(`kakao-map-${index}`);
            const options = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 3
            };
            
            const kakaoMap = new window.kakao.maps.Map(container, options);

            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(latitude, longitude)
            });
            marker.setMap(kakaoMap);
            kakaoMap.setCenter(new kakao.maps.LatLng(
                marker.getPosition().Ma, 
                marker.getPosition().La
            ));

            window.addEventListener("resize", _.throttle(() => {
                kakaoMap.relayout();
                kakaoMap.setCenter(new kakao.maps.LatLng(
                    marker.getPosition().Ma, 
                    marker.getPosition().La
                ));
            }, 100));
        };

    }, [obj, index]);
    const deleteCoffeeShop = () => {
        if (!loading) {
            removeCoffeeShop();
        };
    };
    const changeMainImage = (skip, object) => {
        if (skip !== 0) {
            if (skip <= -1 && !(mainImageIndex + skip < 0)) {
                setMainImageIndex(mainImageIndex + skip);
            } else if (skip >= 1 && !(mainImageIndex + skip >= object.length)) {
                setMainImageIndex(mainImageIndex + skip);
            };
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
                    <MainImageControl onClick={() => changeMainImage(-1, obj.photos)} direction="left">
                        <IoIosArrowBack size={34} />
                    </MainImageControl>
                    <MainImage src={obj?.photos[mainImageIndex]?.url} />
                    <MainImageControl onClick={() => changeMainImage(1, obj.photos)} direction="right">
                        <IoIosArrowForward size={34} />
                    </MainImageControl>
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