import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/statics";
import {LinkItemArray} from "../types";

const useLinks = () => {
    const [links, setLinks] = useState<LinkItemArray>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;
                const response = await axios.get(`${BASE_URL}/api/dashboards`);
                setLinks(response.data.data); // Adjust based on the structure of the API response
                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Failed to fetch links");
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    return { links, loading, error };
};

export default useLinks;

