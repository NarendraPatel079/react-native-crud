import axios from "axios";
// const axios = require('axios').default;
import {API_BASE_URL, RESPONSE_ERROR, DEFAULT_ERROR_MESSAGE} from "@env";
import { encode as btoa } from 'base-64'

// const API_BASE_URL = 'http://localhost:9000';
const url = API_BASE_URL + '/users';
const default_response = {
    "status": RESPONSE_ERROR,
    "message": DEFAULT_ERROR_MESSAGE,
    "data": [],
};
// console.log(default_response);

export const LoginAPI = async (user) => {
    try {
        // console.log('LoginAPI', user);
        user.password = btoa(user.password);
        // console.log('LoginAPI', user);
        return await axios.post(`${url}/login`, user);
    } catch (err) {
        console.error(err);
    }
    return default_response;
};

export const getUsersAPI = async(id = '') => {
    try {
        id = id || '';
        return await axios.get(`${url}/${id}`);
    } catch (err) {
        console.error(err);
    }
    return default_response;
};

export const addUserAPI = async(user) => {
    try {
        // console.log('addUserAPI', user);
        user.password = btoa(user.password);
        // console.log('addUserAPI', user);
        return await axios.post(`${url}/add`, user);
    } catch (err) {
        console.error(err);
    }
    return default_response;
}

export const editUserAPI = async(id, user) => {
    try {
        //console.log(user);
        return await axios.put(`${url}/${id}`, user);
    } catch (err) {
        console.error(err);
    }
    return default_response;
}

export const deleteUserAPI = async(id, user) => {
    try {
        return await axios.delete(`${url}/${id}`, user);
    } catch (err) {
        console.error(err);
    }
    return default_response;
}