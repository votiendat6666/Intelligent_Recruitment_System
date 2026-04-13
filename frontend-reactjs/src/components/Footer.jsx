const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Về SmartRecruit</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hệ thống tuyển dụng thông minh giúp kết nối ứng viên và nhà tuyển dụng một cách nhanh chóng và hiệu quả nhất.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Liên kết</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li><a href="#" className="hover:text-blue-600">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Liên hệ</h3>
            <p className="text-gray-500 text-sm">Email: support@smartrecruit.vn</p>
            <p className="text-gray-500 text-sm">Hotline: 1900 xxxx</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} SmartRecruit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;