import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

function PageTitle({ title }) {
  return (
    <Helmet>
      <title>{title} | Nomad X Coffee</title>
    </Helmet>
  );
}

PageTitle.propTypes = {
    title: PropTypes.string.isRequired
};

export default PageTitle;