import React, { useEffect, useState, useRef } from "react";
import api, { endpoints } from "../api/APIs";
import backgroundImage from "../assets/background.jpg";
import giaoDienImage from "../assets/giaoDien.jpg";
import { Search, MapPin, ChevronDown, ChevronRight, ChevronLeft, TrendingUp, Play } from "lucide-react";

const Homes = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const hideTimer = useRef(null);
  const ITEMS_PER_PAGE = 6;

  // --- LOGIC ĐỊA ĐIỂM ---
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const BOX_HEIGHT = 300;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(endpoints["categories"]);
        setCategories(res.data);
        if (res.data && res.data.length > 0) {
          setActiveCategory(res.data[0]);
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const res = await api.get(endpoints["locations"]);
        setLocations(res.data);
      } catch (err) {
        console.error("Lỗi load địa điểm:", err);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const visibleCategories = categories.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  const handleMouseEnterSidebar = (cat) => {
    clearTimeout(hideTimer.current);
    setActiveCategory(cat);
    setShowPanel(true);
  };

  const handleMouseLeaveArea = () => {
    hideTimer.current = setTimeout(() => setShowPanel(false), 200);
  };

  const handleMouseEnterArea = () => {
    clearTimeout(hideTimer.current);
  };

  const toggleLocation = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  return (
    <div
      className="min-h-[400px] w-full bg-cover bg-center py-8 relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="container mx-auto relative z-10 px-4">
        <h1 className="text-center text-[#00b14f] text-3xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
          SmartRecruit - Tạo CV - Tìm việc làm - Tuyển dụng hiệu quả
        </h1>

        {/* THAY ĐỔI: Bỏ overflow-hidden ở đây để dropdown không bị cắt */}
        <div className="max-w-6xl mx-auto mb-8 bg-white rounded-xl shadow-2xl flex items-center p-1 relative z-50">
          <div className="flex-[2] flex items-center px-4">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Vị trí tuyển dụng, tên công ty..."
              className="w-full py-3 outline-none text-sm text-gray-700 font-medium"
            />
          </div>

          <div className="w-px h-8 bg-gray-200" />
          
          <div className="flex-1 relative">
            <div 
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center justify-between px-6 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 py-3 transition rounded-lg"
            >
              <span className="font-semibold flex items-center gap-1 text-gray-800">
                <MapPin size={18} className="text-gray-800" /> 
                {selectedLocations.length > 0 
                  ? `Đã chọn (${selectedLocations.length})` 
                  : "Địa điểm"}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showLocationDropdown && (
              <>
                {/* Overlay để đóng khi bấm ra ngoài */}
                <div className="fixed inset-0 z-[60]" onClick={() => setShowLocationDropdown(false)} />
                {/* Bảng địa điểm */}
                <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white shadow-2xl rounded-xl border border-gray-100 z-[70] max-h-60 overflow-y-auto p-2 animate-fadeIn scrollbar-hide">
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <label 
                        key={loc.id} 
                        className="flex items-center px-4 py-2.5 hover:bg-green-50 rounded-lg cursor-pointer transition group"
                      >
<div 
  onClick={() => toggleLocation(loc.id)}
  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
    selectedLocations.includes(loc.id) 
    ? "bg-[#00b14f] border-[#00b14f]" 
    : "bg-white border-gray-300"
  }`}
>
  {selectedLocations.includes(loc.id) && (
    <svg size={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )}
</div>
<span className="ml-3 text-gray-700 group-hover:text-[#00b14f] text-sm font-medium">
  {loc.cityName}
</span>
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-400">Đang tải địa điểm...</div>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="bg-[#00b14f] hover:bg-green-600 text-white font-bold text-sm px-5 py-3 transition rounded-lg ml-1 shadow-md flex items-center justify-center cursor-pointer">
            <Search size={20} className="text-white mr-2" />
            Tìm kiếm
          </button>
        </div>

        <div
          className="flex max-w-6xl mx-auto gap-6 items-start"
          onMouseLeave={handleMouseLeaveArea}
          onMouseEnter={handleMouseEnterArea}
        >
          {/* SIDEBAR VÀ PANEL GIỮ NGUYÊN 100% NHƯ CŨ */}
          <div
            className="w-[320px] bg-white rounded-xl shadow-xl flex-shrink-0 flex flex-col overflow-hidden transition-all "
            style={{ height: BOX_HEIGHT }}
          >
            <div className="flex-1 overflow-hidden py-1 mt-2">
              {loading ? (
                <div className="p-4 text-sm text-gray-400 font-medium">Đang tải...</div>
              ) : (
                visibleCategories.map((lv1) => (
                  <div
                    key={lv1.id}
                    onMouseEnter={() => handleMouseEnterSidebar(lv1)}
                    className={`flex items-center justify-between px-6 py-1.5 cursor-pointer text-sm transition-all border-l-[4px]
                        ${showPanel && activeCategory?.id === lv1.id
                          ? "text-[#00b14f] bg-green-50 border-l-[#00b14f]"
                          : "text-gray-700 border-l-transparent hover:text-[#00b14f] hover:bg-gray-50"}`}
                  >
                    <span className="truncate mr-2 font-bold tracking-tight">{lv1.name}</span>
                    <span className={`text-xl transition-transform ${showPanel && activeCategory?.id === lv1.id ? "translate-x-1" : "opacity-60"}`}>›</span>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100 bg-gray-50 text-[15px] font-bold text-gray-700 ">
                <span>{page + 1} / {totalPages}</span>
                <div className="flex gap-3 ">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="cursor-pointer w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-[#00b14f] hover:text-white hover:border-[#00b14f] transition disabled:opacity-20"
                    disabled={page === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    className="cursor-pointer w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-[#00b14f] hover:text-white hover:border-[#00b14f] transition disabled:opacity-20"
                    disabled={page === totalPages - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4" style={{ height: BOX_HEIGHT }}>
            {showPanel && activeCategory ? (
              <div className="h-full rounded-xl shadow-xl overflow-hidden bg-white p-6 animate-fadeIn border border-gray-100 flex flex-col">
                <div className="overflow-y-auto h-full scrollbar-hide pr-2 ">
                  {activeCategory.children?.map((lv2) => (
                    <div key={lv2.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                      <a href={`/search?category=${lv2.id}`} className="block text-[15px] font-semibold text-gray-900 mb-3 hover:text-[#00b14f] transition-colors">
                        {lv2.name}
                      </a>
                      <div className="flex flex-wrap gap-2 line">
                        {lv2.children?.map((lv3) => (
                          <a key={lv3.id} href={`/search?category=${lv3.id}`} className="px-3 py-1.5 bg-gray-50 hover:bg-green-50 hover:text-[#00b14f] border border-gray-100 hover:border-[#00b14f]/30 text-gray-900 rounded-md text-[14px] transition-all">
                            {lv3.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-2xl overflow-hidden mb-4 border-none outline-none">
                  <img src={giaoDienImage} alt="Giao diện" className="w-full h-full object-cover block border-none" />
                </div>
                <div className="bg-gradient-to-r from-black/90 to-[#075a2d]/95 rounded-xl shadow-lg px-8 py-5 flex items-center justify-between transition-all hover:shadow-green-900/20">
                  {/* ... các phần thị trường giữ nguyên ... */}
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg text-xl border border-white/5">
                      <TrendingUp size={24} className="text-[#00d45e]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1.5">Thị trường hôm nay</p>
                      <p className="text-sm font-extrabold text-white">{new Date().toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Việc làm mới</p>
                      <p className="text-lg font-black text-[#00d45e]">1,271</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Đang tuyển</p>
                      <p className="text-lg font-black text-[#00d45e]">61,501</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `,
        }}
      />
    </div>
  );
};

export default Homes;