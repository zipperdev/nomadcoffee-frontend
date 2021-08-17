import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BaseBox } from "../sharedStyles";

const SBottomBox = styled(BaseBox)`
    padding: 20px 0px;
    text-align: center;
    a {
        font-weight: 600;
        margin-left: 5px;
        color: ${props => props.theme.accent}
    }
`;

function BottomBox({ short, link, linkText }) {
    return (
        <SBottomBox>
            <span>{short}</span>
            <Link to={link}>{linkText}</Link>
        </SBottomBox>
    );
};

BottomBox.propTypes = {
    short: PropTypes.string.isRequired, 
    link: PropTypes.string.isRequired, 
    linkText: PropTypes.string.isRequired, 
};

export default BottomBox;