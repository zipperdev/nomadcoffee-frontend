import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>not found 404 client error</h1>
            <p>400 - try to get the page that does not exist</p>
            <Link to="/">go home</Link>
        </div>
    );
};

export default NotFound;