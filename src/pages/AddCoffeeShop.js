/* global kakao */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import ErrorText from "../components/auth/ErrorText";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";

const CREATE_COFFEE_SHOP_MUTATION = gql`
    mutation createCoffeeShop($name: String!, $latitude: String!, $longitude: String!, $photos: [Upload], $categories: [String]) {
        createCoffeeShop(name: $name, latitude: $latitude, longitude: $longitude, photos: $photos, categories: $categories) {
            success
            error
            coffeeShop {
                id
            }
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

function AddCoffeeShop() {
    let map;
    const history = useHistory();
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isValid } } = useForm({
        mode: "onChange"
    });
    const [ marker, setMarker ] = useState(null);
    const [ photos, setPhotos ] = useState([]);
    const [ photoUrls, setPhotoUrls ] = useState([]);
    const [ photoError, setPhotoError ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const [ createCoffeeShop, { loading } ] = useMutation(CREATE_COFFEE_SHOP_MUTATION, {
        onCompleted: data => {
            const { createCoffeeShop: { success, error, coffeeShop } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            } else if (coffeeShop) {
                history.push(`/shops/${coffeeShop.id}`);
            };
        }
    });

    useEffect(() => {
        setError("images", {
            message: "Please add image."
        });
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_MAP_API}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            const container = document.getElementById("kakao-map");
            const options = {
                center: new kakao.maps.LatLng(37.517235, 127.047325),
                level: 3
            };
            map = new window.kakao.maps.Map(container, options);
            
            const pureMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(37.517235, 127.047325)
            });
            setMarker(pureMarker);
            pureMarker.setMap(map);
            pureMarker.setDraggable(true);
        };
    }, []);
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
        if (!photos) {
            return setError("images", {
                message: "Please add image."
            });
        };
        if (name, photos, longitude, latitude && !loading) {
            createCoffeeShop({
                variables: {
                    name, 
                    latitude: String(latitude), 
                    longitude: String(longitude), 
                    categories, 
                    photos: photos
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
    const removeCategories = index => setCategories([ ...categories.filter(category => categories.indexOf(category) !== index) ]);
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
    return (
        <Layout title="Create Coffee Shop">
            <Title>Create Coffee Shop</Title>
            <Form onSubmit={handleSubmit(onSubmitValid)}>
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
                            <Subtext>Add some photos</Subtext>
                        ): null}
                    </PhotosSection>
                </ObjectContainer>
                <ErrorText>{photoError?.message ? photoError?.message : errors?.images?.message}</ErrorText>
                <SButton type="submit" value={loading ? "Loading..." : "Create Coffee Shop"} disabled={loading || !isValid} />
                <ErrorText>{errors?.result?.message}</ErrorText>
            </Form>
        </Layout>
    );
};

export default AddCoffeeShop;