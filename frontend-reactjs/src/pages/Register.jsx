import { useState } from 'react';
import api, { endpoints } from '../api/APIs'; // Leo ra ngoài vào api
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '', phone: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post(endpoints['register'], formData);
            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (err) {
            alert("Lỗi đăng ký!");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Đăng Ký</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Họ tên" onChange={e => setFormData({...formData, fullName: e.target.value})} /><br/>
                <input type="text" placeholder="Username" style={{marginTop:'10px'}} onChange={e => setFormData({...formData, username: e.target.value})} /><br/>
                <input type="password" placeholder="Mật khẩu" style={{marginTop:'10px'}} onChange={e => setFormData({...formData, password: e.target.value})} /><br/>
                <button type="submit" style={{marginTop:'10px'}}>Đăng ký</button>
            </form>
        </div>
    );
}