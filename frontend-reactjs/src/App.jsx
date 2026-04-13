import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';

// Import Layout và Pages
import MainLayout from './components/MainLayout';
import Homes from './pages/Homes';
import Login from './pages/Login'; 
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Group các trang dùng chung Header/Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homes />} />
            <Route path="/dashboard" element={<div>Dashboard Tuyển dụng</div>} />
            {/* Thêm các trang khác như /jobs, /profile ở đây */}
          </Route>

          {/* Các trang KHÔNG dùng Header/Footer chung (nếu muốn) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;