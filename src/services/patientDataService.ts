import type { Dayjs } from 'dayjs';

import axios from 'axios';

import { BASE_URL } from '../utils/statics';

export interface IPatientData {
  id: number;
  isEdit?: boolean;
  attributes: {
    name: string;
    uuid: string;
    createdAt: string;
    approved: boolean;
    processed: boolean;
    reject_reason: string;
    approval_send: boolean;
    upload_date: Dayjs | Date | null;
    data_file: { data: { id: number; attributes: { url: string; ext: string } } };
    approval_request: {
      data: null;
      disconnect: never[];
      connect: never[];
    };
  };
}

export interface IPatientUploadData {
  name: string;
  uuid: string;
  approved: boolean;
  processed: boolean;
  reject_reason: string;
  approval_send: boolean;
  data_file: { data: { id: number; attributes: { url: string; ext: string } } };
  upload_date: Dayjs | null | string | Date;
  approval_request: {
    data: never[];
    disconnect: never[];
    connect: never[];
  };
}

axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;

export const getPatientData = async (page: number, pageSize: number) => {
  try {
    const url = `${BASE_URL}/api/patients-data?pagination%5Bpage%5D=${page}&pagination%5BpageSize%5D=${pageSize}&populate=*&fields=*`;

    const response = await axios.get(url);

    return response.data.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPatientDataById = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/patients-data/${id}?populate=*&fields=*`;

    const response = await axios.get(url);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createPatientData = async (payload: IPatientUploadData) => {
  try {
    const url = `${BASE_URL}/api/patients-data`;

    const response = await axios.post(url, { data: payload });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePatientDataById = async (id: number, payload: IPatientUploadData) => {
  try {
    const url = `${BASE_URL}/api/patients-data/${id}`;

    const response = await axios.put(url, { data: payload });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deletePatientById = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/patients-data/${id}`;

    const response = await axios.delete(url);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
