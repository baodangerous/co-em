/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ HOA VĂN DI SẢN VĂN HÓA & MÔ PHỎNG CHẤT LIỆU VẢI SVG (CULTURAL PATTERNS & FABRIC SHADERS)
 * 1. 8 hệ thống hoa văn thổ cẩm và họa tiết truyền thống của các dân tộc Việt Nam
 * 2. 5 bộ lọc và họa tiết mô phỏng chất liệu vải truyền thống:
 *    - Lụa: Độ mềm mại, bóng mờ và chuyển tiếp ánh sáng tự nhiên
 *    - Thổ cẩm & Gấm: Cấu trúc dệt sợi, hoa văn nổi và độ gợn bề mặt
 *    - Vải Chàm: Độ sâu màu, sắc chàm hữu cơ và vân nhuộm thủ công
 *    - Vải Sa: Độ mỏng, xuyên sáng bán trong suốt và xếp lớp thanh nhã
 *    - Vải Đũi: Kết cấu thô mộc, sợi tơ tằm đan dệt tự nhiên
 */

export function CulturalPatternsDefs() {
  return (
    <defs>
      {/* ============================================================== */}
      {/* 1. HOA VĂN THỔ CẨM & HỌA TIẾT CÁC VÙNG MIỀN DÂN TỘC VIỆT NAM  */}
      {/* ============================================================== */}

      {/* 1. Thái: Họa tiết quả trám & zic-zac dệt thổ cẩm */}
      <pattern id="hoa-van-thai" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <circle cx="10" cy="10" r="2.5" fill="#ffffff" opacity="0.4" />
      </pattern>

      {/* 2. Mông: Họa tiết chữ thập & xoắn ốc sáp ong */}
      <pattern id="hoa-van-mong" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 12 4 L 12 20 M 4 12 L 20 12" stroke="#ffffff" strokeWidth="1.5" opacity="0.35" />
        <rect x="2" y="2" width="6" height="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.28" />
        <rect x="16" y="16" width="6" height="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.28" />
      </pattern>

      {/* 3. Ê Đê: Họa tiết sọc chỉ & răng cưa Tây Nguyên */}
      <pattern id="hoa-van-ede" width="20" height="16" patternUnits="userSpaceOnUse">
        <line x1="0" y1="4" x2="20" y2="4" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <line x1="0" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <path d="M 0 8 L 5 4 L 10 8 L 15 4 L 20 8" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
      </pattern>

      {/* 4. Chăm: Hoa văn quả trám và tháp Chăm */}
      <pattern id="hoa-van-champa" width="22" height="22" patternUnits="userSpaceOnUse">
        <polygon points="11,2 20,11 11,20 2,11" fill="none" stroke="#ffffff" strokeWidth="1.3" opacity="0.32" />
        <polygon points="11,6 16,11 11,16 6,11" fill="#ffffff" opacity="0.2" />
      </pattern>

      {/* 5. Khmer: Vân sen cách điệu Nam Bộ */}
      <pattern id="hoa-van-khmer" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 4 20 C 6 12 10 8 12 4 C 14 8 18 12 20 20 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
      </pattern>

      {/* 6. Kinh Bắc (kb): Họa tiết hoa cúc & vân mây Đồng Sơn */}
      <pattern id="hoa-van-kb" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="5" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
        <path d="M 12 2 Q 18 6 18 12 Q 18 18 12 22 Q 6 18 6 12 Q 6 6 12 2" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />
      </pattern>

      {/* 7. Kinh Huế (kh): Vân mây cung đình & chữ thọ */}
      <pattern id="hoa-van-kh" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M 6 14 Q 10 8 16 10 Q 22 12 20 18 Q 14 22 8 18" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
      </pattern>

      {/* 8. Kinh Nam Bộ (kn): Kẻ ô vuông rằn */}
      <pattern id="hoa-van-kn" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="8" height="8" fill="#ffffff" opacity="0.25" />
        <rect x="8" y="8" width="8" height="8" fill="#ffffff" opacity="0.25" />
      </pattern>

      {/* ============================================================== */}
      {/* 2. MÔ PHỎNG 5 CHẤT LIỆU VẢI TRUYỀN THỐNG VIỆT NAM (SHADERS)   */}
      {/* ============================================================== */}

      {/* A. LỤA TƠ TẰM: Gradient ánh sáng bóng mờ (Specular Silk Sheen) */}
      <linearGradient id="fabric-lua-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="70%" stopColor="#000000" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
      </linearGradient>

      {/* B. GẤM & THỔ CẨM: Nổi gân sợi dệt đan chéo (Woven Fabric Relief) */}
      <pattern id="fabric-gams-tho-cam" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 0 4 L 4 0 L 8 4 L 4 8 Z" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
        <line x1="0" y1="0" x2="8" y2="8" stroke="#000000" strokeWidth="0.5" opacity="0.15" />
      </pattern>

      {/* C. VẢI CHÀM: Sắc chàm sâu, loang màu nhuộm thực vật tự nhiên */}
      <radialGradient id="fabric-cham-depth" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#2e4057" stopOpacity="0.15" />
        <stop offset="60%" stopColor="#0d1b2a" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#050a14" stopOpacity="0.4" />
      </radialGradient>

      {/* D. VẢI SA: Bán trong suốt mỏng nhẹ & rũ lượn (Sheer Gauze Fabric) */}
      <linearGradient id="fabric-sa-translucent" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>

      {/* E. VẢI ĐŨI: Gân xước sần tự nhiên của tơ thô (Raw Slub Texture) */}
      <pattern id="fabric-dui-slub" width="16" height="12" patternUnits="userSpaceOnUse">
        <line x1="1" y1="3" x2="7" y2="3" stroke="#ffffff" strokeWidth="0.9" opacity="0.25" />
        <line x1="9" y1="7" x2="15" y2="7" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
        <line x1="3" y1="10" x2="11" y2="10" stroke="#000000" strokeWidth="0.6" opacity="0.12" />
      </pattern>
    </defs>
  );
}
