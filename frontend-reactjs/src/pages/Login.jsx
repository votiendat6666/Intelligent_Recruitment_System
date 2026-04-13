import { useState, useEffect } from "react";
import api, { endpoints } from "../api/APIs";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {  Eye,  EyeOff,  X,  CheckCircle,  XCircle,  AlertTriangle,} from "lucide-react";
import logo from "../assets/logo.jpg";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import { Link } from "react-router-dom";

// ── Toast Component ──
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      icon: (
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ),
      title: "text-emerald-700",
      msg: "text-emerald-600",
      close: "text-emerald-400 hover:text-emerald-600",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />,
      title: "text-red-700",
      msg: "text-red-600",
      close: "text-red-400 hover:text-red-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      icon: (
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      ),
      title: "text-amber-700",
      msg: "text-amber-600",
      close: "text-amber-400 hover:text-amber-600",
    },
  };

  const s = styles[toast.type] || styles.success;

  return (
    <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-right-5 duration-300">
      <div
        className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 shadow-lg max-w-sm w-[320px] ${s.bg}`}
      >
        {s.icon}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${s.title}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-xs mt-0.5 ${s.msg}`}>{toast.message}</p>
          )}
        </div>
        <button onClick={onClose} className={`shrink-0 transition ${s.close}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function Login() {
  const [mode, setMode] = useState("login");
  const { login, loadUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlMode = searchParams.get("mode");
    if (urlMode === "register") setMode("register");
    else if (urlMode === "login") setMode("login");
  }, [location]);

  // State cho Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State cho Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);
  const [pwError, setPwError] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (type, title, message = "") =>
    setToast({ type, title, message });

  // Helper: chuẩn hoá userData từ response
  const buildUserData = (d) => ({
    id: d.id,
    fullName: d.fullName,
    email: d.email,
    role: d.role,
    avatarUrl: d.avatarUrl,
    phone: d.phone,
  });

  // Helper: điều hướng sau login
  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "RECRUITER") navigate("/recruiter");
    else navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(endpoints["login"], { email, password });
      const d = res.data;
      // login() cập nhật context → Header re-render ngay, không cần F5
      login(buildUserData(d), d.token);
      await loadUser();
      showToast(
        "success",
        "Đăng nhập thành công!",
        `Chào mừng, ${d.fullName}.`,
      );
      redirectByRole(d.role);
    } catch {
      showToast(
        "error",
        "Đăng nhập thất bại",
        "Email hoặc mật khẩu không đúng!",
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setPwError("");
    if (regPw !== regPw2) {
      setPwError("Mật khẩu xác nhận không khớp!");
      showToast("warning", "Chú ý", "Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      await api.post(endpoints["register"], {
        fullName: regName,
        email: regEmail,
        password: regPw,
      });
      showToast(
        "success",
        "Tạo tài khoản thành công!",
        "Vui lòng đăng nhập để tiếp tục.",
      );
      setMode("login");
    } catch {
      showToast(
        "error",
        "Đăng ký thất bại",
        "Email đã tồn tại hoặc có lỗi xảy ra!",
      );
    }
  };

  // ── Google Auth ──
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const res = await api.post(endpoints["social-login"], {
          email: userInfo.data.email,
          fullName: userInfo.data.name,
          avatarUrl: userInfo.data.picture,
          provider: "GOOGLE",
        });
        const d = res.data;
        login(buildUserData(d), d.token);
        await loadUser();
        showToast(
          "success",
          "Đăng nhập thành công!",
          `Chào mừng, ${d.fullName}.`,
        );
        redirectByRole(d.role);
      } catch {
        showToast("error", "Lỗi xác thực", "Không thể đăng nhập bằng Google!");
      }
    },
  });

  // ── Facebook Auth ──
  const responseFacebook = async (response) => {
    if (!response.accessToken) return;
    try {
      const res = await api.post(endpoints["social-login"], {
        email: response.email,
        fullName: response.name,
        avatarUrl: response.picture?.data?.url,
        provider: "FACEBOOK",
      });
      const d = res.data;
      login(buildUserData(d), d.token);
      await loadUser();
      showToast(
        "success",
        "Đăng nhập thành công!",
        `Chào mừng, ${d.fullName}.`,
      );
      redirectByRole(d.role);
    } catch {
      showToast("error", "Lỗi xác thực", "Không thể đăng nhập bằng Facebook!");
    }
  };

  const inputCls =
    "w-full h-[50px] px-5 border border-gray-200 rounded-[5px] text-base placeholder-gray-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition";
  const socialBtnCls =
    "flex-1 h-[50px] flex items-center justify-center gap-2.5 border border-gray-200 rounded-[5px] text-sm hover:bg-gray-50 transition active:scale-[0.98] cursor-pointer";

  const SocialButtons = () => (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        className={socialBtnCls}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
          alt="Google"
        />{" "}
        Google
      </button>
      <FacebookLogin
        appId="1687483312411632"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            type="button"
            onClick={renderProps.onClick}
            className={socialBtnCls}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              className="w-5 h-5"
              alt="Facebook"
            />{" "}
            Facebook
          </button>
        )}
      />
    </div>
  );

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="min-h-screen bg-white flex items-stretch font-sans antialiased text-gray-900">
        <div className="w-full flex overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center px-10 py-10 md:px-20 bg-white relative">
            <Link
              to="/"
              className="absolute top-7 left-7 flex items-center gap-2.5 cursor-pointer z-20 transition-transform"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-auto h-16 object-contain"
              />
            </Link>

            <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-[gradientFlow_4s_linear_infinite] mb-10 text-center">
              Smart Recruitment
            </div>

            <div className="w-full max-w-[400px] overflow-hidden">
              <div
                className="flex w-[200%] transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  transform:
                    mode === "register" ? "translateX(-50%)" : "translateX(0)",
                }}
              >
                {/* ── LOGIN FORM ── */}
                <div className="w-1/2 flex-shrink-0 px-0.5">
                  <h1 className="text-[28px] font-bold tracking-tight text-gray-950 text-center mb-7">
                    Welcome Back!
                  </h1>
                  <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`${inputCls} text-[13px]`}
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`${inputCls} pr-12 text-[13px]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="w-full h-[50px] bg-gray-950 hover:bg-gray-800 text-white text-base rounded-[5px] transition active:scale-[0.98] cursor-pointer"
                    >
                      Sign in
                    </button>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[11px] text-gray-300 uppercase tracking-widest">
                        OR
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <SocialButtons />
                    <p className="text-center text-[13px] text-gray-400 mt-3">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="text-gray-950 font-semibold hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </div>

                {/* ── REGISTER FORM ── */}
                <div className="w-1/2 flex-shrink-0 px-0.5">
                  <h1 className="text-[28px] font-bold tracking-tight text-gray-950 text-center mb-7">
                    Create Account
                  </h1>
                  <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        className={`${inputCls} flex-1 text-[13px]`}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        className={`${inputCls} flex-1 text-[13px]`}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type={showRegPw ? "text" : "password"}
                        placeholder="Password"
                        value={regPw}
                        onChange={(e) => setRegPw(e.target.value)}
                        required
                        className={`${inputCls} pr-12 text-[13px]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPw((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 cursor-pointer"
                      >
                        {showRegPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showRegPw2 ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={regPw2}
                        onChange={(e) => {
                          setRegPw2(e.target.value);
                          setPwError("");
                        }}
                        required
                        className={`${inputCls} pr-12 text-[13px] ${pwError ? "border-red-400 focus:border-red-400" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPw2((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 cursor-pointer"
                      >
                        {showRegPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {pwError && (
                      <p className="text-[11px] text-red-400 -mt-1 ml-1 font-medium">
                        {pwError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full h-[50px] bg-gray-950 hover:bg-gray-800 text-white text-base rounded-[5px] transition active:scale-[0.98] cursor-pointer mt-1"
                    >
                      Sign Up
                    </button>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[11px] text-gray-300 uppercase tracking-widest">
                        OR
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <SocialButtons />
                    <p className="text-center text-[13px] text-gray-400 mt-3">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-gray-950 font-semibold hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Banner */}
          <div className="hidden lg:block w-[45%] flex-shrink-0 relative overflow-hidden">
            <svg
              className="absolute top-0 left-0 h-full w-24 fill-white z-10 -ml-px"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 0 C 100 30 100 70 0 100 L 0 100 L 0 0 Z" />
            </svg>
            <img
              src="https://vietsmart.vn/wp-content/uploads/2024/09/da1ac368-c4e4-4a97-b276-d32a71aa295d.webp"
              alt="Smart Recruitment Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
