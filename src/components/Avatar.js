import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NullAvatarImg from "../images/nullAvatar.png";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: ${props => `${props.size-2}px`};
    height: ${props => `${props.size-2}px`};
    background-color: ${props => props.theme.fontColor};
    border-radius: 50%;
`;

const SAvatar = styled.div`
    position: absolute;
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
    border-radius: 50%;
    background-color: transparent;
    background-image: url(${props => props.src ? props.src : NullAvatarImg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

function Avatar({ avatar, size }) {
    return (
        <Container size={size ? size : 24}>
            <SAvatar  src={avatar} size={size ? size : 24} />
        </Container>
    );
};

Avatar.propTypes = {
    avatar: PropTypes.string, 
    size: PropTypes.number
};

export default Avatar;