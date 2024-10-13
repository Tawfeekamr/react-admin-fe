import axios from 'axios';

import { BASE_URL } from '../utils/statics';

axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;

export const uploadFileService = async (formData: FormData) => {
  try {
    const url = `${BASE_URL}/api/upload`;

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getFileByIdService = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/upload/files/${id}`;

    const response = await axios.get(url);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteFileService = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/upload/files/${id}`;

    const response = await axios.delete(url);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
