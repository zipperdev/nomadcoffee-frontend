/* global kakao */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import styled from "styled-components";
import { gql, useMutation, useQuery } from "@apollo/client";
import ErrorText from "../components/auth/ErrorText";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";

const SEE_COFFEE_SHOP_QUERY = gql`
    query seeCoffeeShop($id: Int!) {
        seeCoffeeShop(id: $id) {
            id
            name
            latitude
            longitude
            photos {
                id
                url
            }
            categories {
                id
                name
                slug
            }
        }
    }
`;

const EDIT_COFFEE_SHOP_MUTATION = gql`
    mutation editCoffeeShop($id: Int!, $name: String, $latitude: String, $longitude: String, $photos: [Upload], $categories: [String]) {
        editCoffeeShop(id: $id, name: $name, latitude: $latitude, longitude: $longitude, photos: $photos, categories: $categories) {
            success
            error
        }
    }
`;

const Title = styled.h1`
    margin-top: 30px;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 24px;
`;

const Form = styled.form`
    margin-top: 30px;
    width: 90%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 5%;
    margin-bottom: 30px;
`;

const KakaoMap = styled.div`
    background-color: transparent;
    width: 100%;
    height: 400px;
    & > div:nth-child(2) {
        background-color: transparent !important;
        & div {
            background-color: transparent !important;
        }
    }
    & > div > div > div:nth-child(4) {
        z-index: 0 !important;
    }
    border-radius: 12px;
    margin-top: 20px;
`;

const ObjectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid ${props => props.theme.deepColor};
`;

const CategoryInput = styled(Input)`
    width: 101%;
    margin: -6px 0 0 -0.5%;
    padding-left: 18px;
    border: 1px solid ${props => props.theme.borderColor};
`;

const CategoryList = styled.ul`
    width: 95.6%;
    padding: 2%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const Category = styled.li`
    padding: 10px;
    display: flex;
    background-color: ${props => props.theme.deepColor};
    border-radius: 1000px;
`;

const CategoryContent = styled.span`
    cursor: default;
    font-weight: 600;
    margin-right: 4px;
`;

const RemoveCategory = styled.span`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1px;
    width: 10px;
    height: 10px;
    border: 2px solid ${props => props.theme.bgColor};
    border-radius: 50%;
    & * {
        color: ${props => props.theme.bgColor};
    }
`;

const Subtext = styled.h1`
    font-weight: 600;
    & b {
        font-weight: 700;
    }
    & strong {
        font-weight: 700;
        color: ${props => props.theme.accent};
        text-decoration: underline;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    width: 101%;
    height: 25px;
    display: block;
    cursor: pointer;
    margin: -6px 0 0 -0.5%;
    padding: 13px 0 0 0;
    padding-left: 18px;
    font-weight: 600;
    text-align: left;
    border-radius: 5px;
    background-color: #ffffff;
    color: #17191c;
    border: 1px solid ${props => props.theme.borderColor};
`;

const PhotosSection = styled.div`
    width: 95.6%;
    padding: 2%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const Photo = styled.div`
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    border-radius: 10px;
    border: 3px solid ${props => props.theme.deepColor};
`;

const SButton = styled(Button)`
    margin-top: 30px;
`;

function EditCoffeeShop() {
    const { id } = useParams();
    const history = useHistory();
    const [ kakaoMap, setKakaoMap ] = useState(null);
    const [ marker, setMarker ] = useState(null);
    const [ photos, setPhotos ] = useState([]);
    const [ photoUrls, setPhotoUrls ] = useState([]);
    const [ photoError, setPhotoError ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors, isValid } } = useForm({
        mode: "onChange"
    });
    const { data: coffeeShopData } = useQuery(SEE_COFFEE_SHOP_QUERY, {
        fetchPolicy: "cache-and-network", 
        variables: {
            id: parseInt(id)
        }, 
        onCompleted: data => {
            setValue("name", data.seeCoffeeShop.name);
            if (marker) {
                marker.setPosition(new kakao.maps.LatLng(data.seeCoffeeShop.latitude, data.seeCoffeeShop.longitude));
            };
            if (kakaoMap) {
                kakaoMap.setCenter(new kakao.maps.LatLng(
                    marker.getPosition().Ma, 
                    marker.getPosition().La
                ));
            };
            const compiledCategories = data.seeCoffeeShop.categories.map(value => value.name);
            setCategories(compiledCategories);
        }
    });
    const [ editCoffeeShop, { loading } ] = useMutation(EDIT_COFFEE_SHOP_MUTATION, {
        variables: {
            id: parseInt(id)
        }, 
        onCompleted: data => {
            const { editCoffeeShop: { success, error } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            } else {
                history.push({
                    pathname: `/shops/${coffeeShopData?.seeCoffeeShop?.id}`, 
                    state: {
                        status: "modified"
                    }
                });
            };
        }
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_MAP_API}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            const latitude = coffeeShopData?.seeCoffeeShop?.latitude;
            const longitude = coffeeShopData?.seeCoffeeShop?.longitude;
            const container = document.getElementById("kakao-map");
            const options = {
                center: new kakao.maps.LatLng(latitude ? latitude : 37.517235, longitude ? longitude : 127.047325),
                level: 3
            };
            const pureMap = new window.kakao.maps.Map(container, options);
            setKakaoMap(pureMap);
            
            const pureMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(
                    latitude ? latitude : 37.517235, 
                    longitude ? longitude : 127.047325
                )
            });
            setMarker(pureMarker);
            pureMarker.setMap(pureMap);
            pureMarker.setDraggable(true);

            pureMap.setCenter(new kakao.maps.LatLng(
                pureMarker.getPosition().Ma, 
                pureMarker.getPosition().La
            ));
        };
    }, [coffeeShopData]);
    useEffect(() => {
        setPhotoUrls([]);
        for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            const reader = new FileReader();
            reader.readAsDataURL(photo);
            reader.onload = () => {
                setPhotoUrls(urls => [...urls, { url: reader.result, id: photo.lastModified }]);
            };
        };
    }, [photos]);
    const onSubmitValid = data => {
        const { name } = data;
        const { La: longitude, Ma: latitude } = marker.getPosition();
        if (name && photos && longitude && latitude && !loading) {
            editCoffeeShop({
                variables: {
                    name, 
                    latitude: String(latitude), 
                    longitude: String(longitude), 
                    categories: categories, 
                    photos
                }
            });
        };
    };
    const addCategories = event => {
        clearErrors("result");
        if (event.key === "Enter" && event.target.value !== "" && !categories.includes(event.target.value)) {
            setCategories([ ...categories, event.target.value ]);
            event.target.value = "";
        } else if (event.key === "Backspace" && event.target.value === "") {
            setCategories(categories.filter((_, index) => index < categories.length -1));
        };
    };
    const removeCategories = index => setCategories([...categories.filter(category => categories.indexOf(category) !== index)]);
    const addPhotos = event => {
        clearErrors("result");
        setPhotoError(null);
        if (photos.length >= 10 || event.target.files.length + photos.length >= 10) {
            setPhotoError({
                message: "Photos must be no more than 10."
            });
        } else {
            setPhotos(event.target.files);
        };
    };
    const preventDefault = e => {
        if (e.code === "Enter") {
            e.preventDefault();
        };
    };
    return (
        <Layout title="Edit Coffee Shop">
            <Title>Edit Coffee Shop</Title>
            <Form onSubmit={handleSubmit(onSubmitValid)} onKeyDown={e => preventDefault(e)}>
                <Input ref={register({
                    required: "Name is required.", 
                    maxLength: {
                        value: 60, 
                        message: "Name must be shorter than 60."
                    }
                })} onChange={() => clearErrors("result")} name="name" type="text" placeholder="Name" errorMessage={errors?.name?.message} />
                <KakaoMap id="kakao-map"></KakaoMap>
                <ObjectContainer className="categories">
                    <CategoryInput type="text" onKeyUp={event => addCategories(event)} placeholder="Press enter to add categories" />
                    <CategoryList>
                        {categories !== [] ? categories.map((category, index) => (
                            <Category key={index}>
                                <CategoryContent>{category}</CategoryContent>
                                <RemoveCategory onClick={() => removeCategories(index)}>
                                    <FiX size={10} />
                                </RemoveCategory>
                            </Category>
                        )) : null}
                        {!categories[0] ? (
                            <Subtext>Create some categories</Subtext>
                        ) : null}
                    </CategoryList>
                </ObjectContainer>
                <ObjectContainer>
                    <div>
                        <FileInput id="images" onChange={event => {
                            clearErrors("images");
                            return addPhotos(event);
                        }} type="file" multiple accept=".png, .jpg" />
                        <FileInputLabel htmlFor="images">Choose Photos</FileInputLabel>
                    </div>
                    <PhotosSection>
                        {!!photos[0] ? photoUrls.map((url, index) => (
                            <Photo key={index} style={{ backgroundImage: `url(${url.url})` }} />
                        )) : null}
                        {!photoUrls[0] ? (
                            <Subtext>Choose some photos <b>if you want to <strong>select again</strong></b></Subtext>
                        ): null}
                    </PhotosSection>
                </ObjectContainer>
                <ErrorText>{photoError?.message}</ErrorText>
                <SButton type="submit" value={loading ? "Loading..." : "Edit Coffee Shop"} disabled={loading || !isValid} />
                <ErrorText>{errors?.result?.message}</ErrorText>
            </Form>
        </Layout>
    );
};

export default EditCoffeeShop;