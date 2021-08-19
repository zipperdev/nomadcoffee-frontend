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

const CategoryContainer = styled.div`
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

const Photos = styled.div`
    width: 100%;
    display: flex;
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    font-weight: 600;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    display: block;
    margin-top: 20px;
    border-radius: 5px;
    width: 100%;
    height: 35px;
    background-color: #ffffff;
`;

const SButton = styled(Button)`
    margin-top: 30px;
`;

function EditCoffeeShop() {
    let map;
    const { id } = useParams();
    const history = useHistory();
    const [ marker, setMarker ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const { data: coffeeShopData } = useQuery(SEE_COFFEE_SHOP_QUERY, {
        variables: {
            id: parseInt(id)
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
                history.push(`/shops/${coffeeShopData?.seeCoffeeShop?.id}`);
            };
        }
    });
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isValid } } = useForm({
        mode: "onChange"
    });

    useEffect(() => {
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
    const onSubmitValid = data => {
        const { name, images } = data;
        const { La: longitude, Ma: latitude } = marker.getPosition();
        editCoffeeShop({
            variables: {
                name, 
                latitude: String(latitude), 
                longitude: String(longitude), 
                categories, 
                photos: images
            }
        });
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
    return (
        <Layout title="Edit Coffee Shop">
            <Title>Edit Coffee Shop</Title>
            <Form onSubmit={handleSubmit(onSubmitValid)}>
                <Input ref={register({
                    required: "Name is required.", 
                    maxLength: {
                        value: 60, 
                        message: "Name must be shorter than 60."
                    }
                })} onChange={() => clearErrors("result")} name="name" type="text" placeholder="Name" defaultValue={coffeeShopData?.seeCoffeeShop?.name} errorMessage={errors?.name?.message} />
                <KakaoMap id="kakao-map"></KakaoMap>
                <CategoryContainer className="categories">
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
                </CategoryContainer>
                <Photos>
                    <FileInput ref={register()} onChange={() => clearErrors("result")} name="images" id="images" type="file" multiple accept=".png, .jpg" />
                    <FileInputLabel htmlFor="images">Choose Photos</FileInputLabel>
                </Photos>
                <SButton type="submit" value={loading ? "Loading..." : "Edit Coffee Shop"} disabled={loading || !isValid} />
                <ErrorText>{errors?.result?.message}</ErrorText>
            </Form>
        </Layout>
    );
};

export default EditCoffeeShop;