import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { gql, useQuery } from "@apollo/client";
import { AUTHENTICATION, logUserOut } from "../apollo";

const SEE_PROFILE_QUERY = gql`
    query seeProfile($id: Int!) {
        seeProfile(id: $id) {
            id
            username
            email
            name
            location
            totalFollowers
            totalFollowing
            isFollowing
            isMe
            avatarURL
            githubUsername
            createdAt
        }
    }
`;

export const useUser = () => {
    const token = localStorage.getItem(AUTHENTICATION);
    const { id } = jwtDecode(token);
    const { data } = useQuery(SEE_PROFILE_QUERY, {
        skip: !token, 
        variables: {
            id
        }
    });
    useEffect(() => {
        if (data?.seeProfile === null) {
            return logUserOut();
        };
    }, [data]);
    return {
        data
    };
};