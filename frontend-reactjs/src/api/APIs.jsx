import axios from "axios";
import cookie from "react-cookies";

export const BASE_URL = 'http://localhost:8080/';

export const endpoints = {
    
    // Các endpoint API login/register/user
    'login': '/auth/login',
    'register': '/auth/register',
    'current-user': '/user/profile',
    'social-login': '/auth/social-login',

    //Phần danh sách category
    'categories': '/api/categories',

    // Phần danh sách locations
    'locations': '/api/locations',

    // Phần profile
    'profile': '/user/profile',
    

};

// Instance cho login/register (không cần token)
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Instance cần token cho loadUser
export const authAPIs = () => {
    const token = cookie.load("jwtToken");
    return axios.create({
        baseURL: BASE_URL,
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export default api;