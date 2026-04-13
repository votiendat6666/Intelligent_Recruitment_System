import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Bell, MessageCircle, ChevronDown, Briefcase, FileText, Mail, Shield, Star, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-10 h-20 flex justify-between items-center">
        {/* Bên trái: Logo + Menu chính */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center cursor-pointer">
            <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {['Việc làm', 'Tạo CV', 'Công cụ', 'Cẩm nang nghề nghiệp'].map((label, index) => (
              <Link
                key={index}
                to="#"
                className="group text-gray-700 hover:text-green-600 font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                {label}
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Bên phải: Các nút hành động */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition font-semibold text-sm cursor-pointer">Đăng ký</Link>
              <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-semibold text-sm cursor-pointer">Đăng nhập</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                <Bell size={20} />
              </button>

              <button className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                <MessageCircle size={20} />
              </button>

              {/* Container chứa Avatar và Dropdown */}
              <div className="relative group py-5 cursor-pointer">
                <div className="flex items-center gap-1">
                  <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <div className="bg-gray-200 rounded-full p-0.5 cursor-pointer">
                    <ChevronDown size={12} className="text-gray-600" />
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-[90%] w-[320px] bg-white border border-gray-100 rounded-xl shadow-2xl hidden group-hover:block z-[60] overflow-hidden">
                  {/* Thông tin user */}
                  <div className="p-4 flex items-center gap-3 border-b border-gray-50 bg-white">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-full h-full text-gray-300" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{user?.fullName || 'Người dùng'}</h4>
                      <p className="text-[11px] text-green-600 font-medium italic">Tài khoản đã xác thực</p>
                      <p className="text-[11px] text-gray-400 truncate">ID {user?.id} | {user?.email}</p>
                    </div>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <div className="flex items-center justify-between p-2 text-gray-700 font-bold text-[13px] bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <Briefcase size={18} className="text-gray-500" />
                          Quản lý tìm việc
                        </div>
                        <ChevronDown size={14} />
                      </div>
                      <div className="pl-11 pr-4 py-1 flex flex-col gap-1 mt-1">
                        {['Việc làm đã lưu', 'Việc làm đã ứng tuyển', 'Việc làm phù hợp với bạn', 'Cài đặt gợi ý việc làm'].map((item) => (
                          <Link key={item} to="#" className="text-sm text-gray-600 hover:text-green-600 py-1.5 cursor-pointer transition-colors">
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center justify-between p-2 text-gray-700 font-bold text-[13px] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-500" />
                          Quản lý CV & Cover letter
                        </div>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    </div>

                    {[
                      { icon: <Mail size={18} />, text: 'Cài đặt email & thông báo' },
                      { icon: <Shield size={18} />, text: 'Cá nhân & Bảo mật' },
                      { icon: <Star size={18} />, text: 'Nâng cấp tài khoản' }
                    ].map((item, idx) => (
                      <div key={idx} className="px-4 py-3 border-t border-gray-50 flex items-center justify-between text-gray-700 font-bold text-[13px] hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{item.icon}</span>
                          {item.text}
                        </div>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>

                  {/* Nút Đăng xuất */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 text-gray-600 hover:bg-red-50 hover:text-red-600 border-t border-gray-100 font-bold text-sm transition-all cursor-pointer"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-gray-200 mx-2" />

              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] text-gray-400 font-medium">Bạn là nhà tuyển dụng?</span>
                <Link to="/employer" className="text-[#00b14f] font-bold text-[13px] flex items-center gap-1 hover:underline cursor-pointer">
                  Đăng tuyển ngay
                  <span className="text-lg">»</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;