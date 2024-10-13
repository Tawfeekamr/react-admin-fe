import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/statics";
import {ApprovalRequestArray, ApprovalResponse, PaginationMeta} from "../types";

const useApprovalRequests = () => {
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestArray>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);

    useEffect(() => {
        const fetchApprovalRequests = async () => {
            try {

                axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;

                const response = await axios.get<ApprovalResponse>(`${BASE_URL}/api/approval-requests?populate=*&fields=*`);

                setApprovalRequests(response.data.data);
                setPagination(response.data.meta.pagination);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Failed to fetch approval requests");
                setLoading(false);
            }
        };

        fetchApprovalRequests();
    }, []);

    return { approvalRequests, loading, error, pagination };
};

export default useApprovalRequests;
