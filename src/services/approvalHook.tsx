import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/statics";
import { ApprovalRequestArray, ApprovalResponse, PaginationMeta } from "../types";

const useApprovalRequests = () => {
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestArray>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);

    const fetchApprovalRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;

            const response = await axios.get<ApprovalResponse>(`${BASE_URL}/api/approval-requests?populate=*&fields=*`);

            setApprovalRequests(response.data.data);
            setPagination(response.data.meta.pagination);
        } catch (err: any) {
            setError(err.message || "Failed to fetch approval requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApprovalRequests();
    }, [fetchApprovalRequests]);

    return { approvalRequests, loading, error, pagination, refetch: fetchApprovalRequests };
};

export default useApprovalRequests;