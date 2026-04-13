import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authAPIs, endpoints } from '../api/APIs';
import cookie from "react-cookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Chuẩn hoá object user — dùng nhất quán ở mọi nơi
    const buildUserData = (d) => ({
        id:        d.id,
        fullName:  d.fullName,
        email:     d.email,
        role:      d.role,
        avatarUrl: d.avatarUrl,
        phone:     d.phone,
    });

    const login = (userData, token) => {
        cookie.save('jwtToken', token, { path: '/' });
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // setUser → context thay đổi → Header re-render ngay lập tức
        setUser(userData);
    };

    const logout = () => {
        cookie.remove('jwtToken', { path: '/' });
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const loadUser = async () => {
        const token = cookie.load('jwtToken');

        if (!token) {
            // Không có token → không có user
            setLoading(false);
            return;
        }

        // Hiển thị dữ liệu cache ngay để UI không bị trắng khi F5
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
        }

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await authAPIs().get(endpoints['current-user']);
            const latestUser = buildUserData(res.data);
            setUser(latestUser);
            localStorage.setItem('user', JSON.stringify(latestUser));
        } catch (error) {
            // Token hết hạn hoặc không hợp lệ → đăng xuất luôn
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUser(); }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
            {!loading
                ? children
                : <div className="fixed inset-0 flex items-center justify-center">Loading...</div>
            }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);