/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * LOGIC ĐỐI CHIẾU & TÌM SỢI CHỈ CHUNG (CULTURAL INTERSECTION ENGINE)
 * - Tập trung vào Con người (trang phục trên nhân vật) và Đồ vật (hiện vật/công cụ văn hóa)
 * - Rút gọn tối đa diễn giải văn bản: chỉ giữ thông tin cốt lõi (Nguồn gốc, Lịch sử)
 * - Thay thế mô tả dài dòng bằng danh sách Link tham khảo có chú thích rõ ràng từ nguon.ts
 */

import { Nhom, TrangPhuc, Nguon } from "../types";
import { trangPhuc } from "../data/trangphuc";
import { nguon } from "../data/nguon";

export type ArtifactVisualId =
  | "khung_cui"
  | "but_sap_ong"
  | "cuc_buom_bac"
  | "cap_vay_dong_son"
  | "kieng_bac_cham"
  | "khuy_ngu_than"
  | "khan_van_non";

export interface DoVatVanHoa {
  id: ArtifactVisualId;
  ten: string;
  chatLieu: string;
  nguonGocNgan: string;
}

export interface DiemChungItem {
  id: string;
  tieuDe: string;
  nguonGocCotLoi: string;
  lichSuCotLoi: string;
  canCu: string;
  bieuTuong: string;
  doVatChung: DoVatVanHoa;
  trangPhucMinhHoaIds: string[];
  nguonThamKhao: Nguon[];
}

export interface TrangPhucNhomInfo {
  trangPhuc: TrangPhuc;
  nguonGocCotLoi: string;
  lichSuCotLoi: string[];
  doVatDacTrung: DoVatVanHoa;
  nguonThamKhao: Nguon[];
}

export interface DiemRiengNhom {
  nhom: Nhom;
  trangPhucs: TrangPhucNhomInfo[];
  tatCaSuThat: string[];
}

const DO_VAT_BY_COSTUME: Record<string, DoVatVanHoa> = {
  aodai: {
    id: "khan_van_non",
    ten: "Nón lá bài thơ & Lụa tơ tằm",
    chatLieu: "Lá cọ, trúc thanh, tơ tằm Vạn Phúc",
    nguonGocNgan: "Biểu vật gắn liền với tà áo dài Việt Nam từ thế kỷ XIX - XX.",
  },
  ngu_than: {
    id: "khuy_ngu_than",
    ten: "Năm hạt khuy đồng & Khăn đóng",
    chatLieu: "Đồng đúc / Ngọc, nhiễu đen",
    nguonGocNgan: "Định chế Ngũ thường thời chúa Nguyễn Phúc Khoát (1744) & Minh Mạng (1837).",
  },
  ao_tac: {
    id: "khuy_ngu_than",
    ten: "Khánh ngọc đại lễ & Quạt giấy",
    chatLieu: "Ngọc bội, đồng mạ, gấm triều Nguyễn",
    nguonGocNgan: "Phụ kiện lễ phục Áo Tấc tay thụng trong nghi lễ cung đình và gia tộc.",
  },
  ao_giao_linh: {
    id: "khan_van_non",
    ten: "Nón quai thao & Đai lụa giao lĩnh",
    chatLieu: "Lá cọ ba tầm, tua lụa tơ tằm",
    nguonGocNgan: "Di sản y phục cổ truyền thời Lý - Trần - Lê trung hưng (thế kỷ XI - XVIII).",
  },
  tu_than: {
    id: "khan_van_non",
    ten: "Khăn mỏ quạ & Nón ba tầm",
    chatLieu: "Vải lụa nhuộm bùn non, lá cọ",
    nguonGocNgan: "Phụ kiện đặc trưng của phụ nữ Kinh Bắc từ thế kỷ XVII - XIX.",
  },
  ba_ba: {
    id: "khan_van_non",
    ten: "Khăn rằn Nam Bộ & Guốc mộc",
    chatLieu: "Sợi bông dệt ô vuông, gỗ xoan",
    nguonGocNgan: "Giao lưu văn hóa Khmer - Việt trên vùng sông nước Nam Bộ thế kỷ XIX.",
  },
  muong_vay: {
    id: "cap_vay_dong_son",
    ten: "Cạp váy thổ cẩm & Xà tích bạc",
    chatLieu: "Tơ nhuộm tự nhiên, bạc chạm",
    nguonGocNgan: "Bảo lưu trực tiếp hệ thống hoa văn trống đồng Đông Sơn của người Mường.",
  },
  co_thai: {
    id: "cuc_buom_bac",
    ten: "Hàng cúc bướm bạc (Mák Pém) & Khăn Piêu",
    chatLieu: "Bạc trắng chạm khắc thủ công, vải bông thêu",
    nguonGocNgan: "Biểu tượng gắn kết âm dương trên áo cóm phụ nữ Thái Tây Bắc.",
  },
  mong_lanh: {
    id: "but_sap_ong",
    ten: "Bút đồng vẽ sáp ong & Chậu nhuộm chàm",
    chatLieu: "Lưỡi đồng tam giác, cán tre, sáp ong rừng",
    nguonGocNgan: "Kỹ thuật tạo hoa văn sáp ong trên vải lanh của người Mông vùng cao.",
  },
  dao_do: {
    id: "kieng_bac_cham",
    ten: "Chuông bạc, hoa bạc & Khăn đỏ",
    chatLieu: "Bạc đúc chạm nổi, len đỏ, hạt cườm",
    nguonGocNgan: "Hiện vật tín ngưỡng và trang sức cưới truyền đời của người Dao Đỏ.",
  },
  tay_cham: {
    id: "kieng_bac_cham",
    ten: "Kiềng bạc mảnh & Chum nhuộm chàm",
    chatLieu: "Bạc nguyên chất, lá chàm ngâm ủ",
    nguonGocNgan: "Vật phẩm gắn liền với nếp áo chàm năm thân của người Tày Việt Bắc.",
  },
  lo_lo_hoa: {
    id: "khung_cui",
    ten: "Mảnh ghép vải tam giác ngũ sắc",
    chatLieu: "Vải bông nhuộm màu tự nhiên khâu ghép tay",
    nguonGocNgan: "Nghệ thuật ghép hàng trăm mảnh vải nhỏ của người Lô Lô Hoa Hà Giang.",
  },
  ha_nhi: {
    id: "kieng_bac_cham",
    ten: "Hàng đồng xu bạc & Mũ tóc tết chỉ",
    chatLieu: "Đồng bạc xưa, sợi len màu, vải chàm",
    nguonGocNgan: "Đồ vật hộ thân và biểu trưng sung túc của phụ nữ Hà Nhì biên cương.",
  },
  pa_then: {
    id: "khung_cui",
    ten: "Vành khăn đỏ xếp tầng & Chỉ thêu chữ thập",
    chatLieu: "Sợi bông nhuộm đỏ thần lửa, cườm bạc",
    nguonGocNgan: "Hiện vật gắn với tín ngưỡng thờ thần lửa của dân tộc Pà Thẻn.",
  },
  ede_tho_cam: {
    id: "khung_cui",
    ten: "Khung dệt thổ cẩm & Vòng đồng cồng chiêng",
    chatLieu: "Gỗ rừng, sợi bông đen - đỏ, đồng đúc",
    nguonGocNgan: "Công cụ dệt hoa văn hình học của phụ nữ mẫu hệ Ê Đê Tây Nguyên.",
  },
  bana_tho_cam: {
    id: "khung_cui",
    ten: "Khung dệt Ktplơng & Chuỗi cườm cổ",
    chatLieu: "Tre nứa, gỗ, sợi bông nhuộm vỏ cây",
    nguonGocNgan: "Kỹ nghệ dệt đối xứng tam sắc đen - đỏ - trắng của người Ba Na.",
  },
  caho_tho_cam: {
    id: "khung_cui",
    ten: "Con thoi dệt vải bông & Kiềng đồng",
    chatLieu: "Sợi bông trắng ngà, chàm rừng Lâm Viên",
    nguonGocNgan: "Hiện vật dệt hoa văn mắt chim, hình thoi của người Cơ Ho Nam Tây Nguyên.",
  },
  champa_tho_cam: {
    id: "khung_cui",
    ten: "Khung dệt dài & Đai lưng Talei Ka-in",
    chatLieu: "Tơ tằm, chỉ vàng kim sa Mỹ Nghiệp",
    nguonGocNgan: "Di sản nghề dệt thủ công làng Mỹ Nghiệp (Ninh Thuận) của người Chăm.",
  },
  sampot: {
    id: "khung_cui",
    ten: "Khăn Sbai dệt kim tuyến & Thắt lưng bạc",
    chatLieu: "Lụa tơ tằm, chỉ vàng ánh kim, bạc chạm",
    nguonGocNgan: "Hiện vật lễ phục truyền thống của người Khmer Nam Bộ.",
  },
};

const NGUON_GOC_LICH_SU_NGAN: Record<string, string> = {
  aodai: "Khởi nguồn từ áo Ngũ thân (1744), định hình qua cải cách thập niên 1930 đến nay.",
  ngu_than: "Định chế năm 1744 thời Võ Vương Nguyễn Phúc Khoát và năm 1837 thời Minh Mạng.",
  ao_tac: "Lễ phục Ngũ thân tay thụng triều Nguyễn (thế kỷ XVIII – đầu thế kỷ XX).",
  ao_giao_linh: "Cổ phục vạt giao nhau thời Lý – Trần – Lê trung hưng (thế kỷ XI – XVIII).",
  tu_than: "Y phục dân gian đồng bằng Bắc Bộ phổ biến từ thế kỷ XVII – XIX.",
  ba_ba: "Hình thành tại Nam Bộ cuối thế kỷ XIX qua giao lưu văn hóa vùng sông nước.",
  muong_vay: "Di sản văn hóa Mường Hòa Bình – Thanh Phú, kế thừa họa tiết Đông Sơn cổ đại.",
  co_thai: "Trang phục truyền đời của cộng đồng người Thái Đen, Thái Trắng vùng Tây Bắc.",
  mong_lanh: "Di sản dệt lanh và vẽ sáp ong lâu đời của người Mông vùng núi cao phía Bắc.",
  dao_do: "Trang phục truyền thống gắn với sử thi Bàn Vương của người Dao Đỏ.",
  tay_cham: "Y phục vải chàm năm thân truyền thống của cư dân Tày vùng thung lũng Việt Bắc.",
  lo_lo_hoa: "Di sản ghép vải thủ công cổ xưa của người Lô Lô Hoa trên cao nguyên đá Hà Giang.",
  ha_nhi: "Trang phục giữ ấm nhiều lớp của người Hà Nhì vùng núi cao Lào Cai, Lai Châu.",
  pa_then: "Lễ phục sắc đỏ truyền thống gắn với lễ hội nhảy lửa của người Pà Thẻn.",
  ede_tho_cam: "Di sản dệt thổ cẩm mẫu hệ của người Ê Đê trên cao nguyên Đắk Lắk.",
  bana_tho_cam: "Trang phục thổ cẩm truyền thống gắn với văn hóa nhà Rông của người Ba Na.",
  caho_tho_cam: "Di sản dệt sợi bông cổ truyền của người Cơ Ho trên cao nguyên Lâm Viên.",
  champa_tho_cam: "Lễ phục truyền thống gắn với làng dệt cổ Mỹ Nghiệp (Ninh Thuận) của người Chăm.",
  sampot: "Trang phục lễ hội cổ truyền gắn với văn hóa Phật giáo Nam tông của người Khmer.",
};

function layNguonTuIds(ids: string[]): Nguon[] {
  const list = ids
    .map((id) => nguon.find((n) => n.id === id))
    .filter((n): n is Nguon => Boolean(n));
  if (list.length > 0) return list;
  return [nguon[0], nguon[1]].filter(Boolean);
}

/**
 * Lấy thông tin cô đọng của một nhóm:
 * - Hình ảnh con người (qua trangPhuc.id)
 * - Hình ảnh đồ vật đặc trưng (doVatDacTrung)
 * - Thông tin cốt lõi tối giản (Nguồn gốc, Lịch sử)
 * - Danh sách link tham khảo có chú thích rõ ràng (nguonThamKhao)
 */
export function layDiemRiengCuaNhom(nhomItem: Nhom): DiemRiengNhom {
  const dsTrangPhuc = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomItem.id));
  const tatCaSuThat: string[] = [];

  const trangPhucs: TrangPhucNhomInfo[] = dsTrangPhuc.map((tp) => {
    const filteredSuThat = tp.suThat.filter(
      (st) => st.trim().toLowerCase() !== tp.moTaNgan.trim().toLowerCase()
    );

    filteredSuThat.forEach((st) => {
      if (!tatCaSuThat.includes(st)) {
        tatCaSuThat.push(st);
      }
    });

    const lichSuCotLoi = (filteredSuThat.length > 0 ? filteredSuThat : tp.suThat).slice(0, 2);

    return {
      trangPhuc: tp,
      nguonGocCotLoi: NGUON_GOC_LICH_SU_NGAN[tp.id] || tp.moTaNgan,
      lichSuCotLoi,
      doVatDacTrung:
        DO_VAT_BY_COSTUME[tp.id] || {
          id: "khung_cui",
          ten: "Khung cửi & Vải dệt truyền thống",
          chatLieu: "Sợi tự nhiên thủ công",
          nguonGocNgan: "Hiện vật nghề dệt cổ truyền Việt Nam.",
        },
      nguonThamKhao: layNguonTuIds(tp.nguonIds),
    };
  });

  return {
    nhom: nhomItem,
    trangPhucs,
    tatCaSuThat,
  };
}

/**
 * Suy luận điểm chung cốt lõi giữa hai nhóm văn hóa:
 * - Không viết đoạn văn diễn giải dài dòng
 * - Tập trung vào Nguồn gốc, Lịch sử, Hiện vật/Con người chung và Link tham khảo có chú thích
 */
export function suyDiemChung(nhomA: Nhom, nhomB: Nhom): DiemChungItem[] {
  if (nhomA.id === nhomB.id) {
    const dsTp = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomA.id));
    return [
      {
        id: "cung_nhom",
        tieuDe: `Cùng cộng đồng: ${nhomA.ten}`,
        nguonGocCotLoi: "Đang chọn cùng một nhóm cộng đồng.",
        lichSuCotLoi: "Hãy chọn hai nhóm khác nhau ở thanh chọn phía trên để đối chiếu.",
        canCu: "Đối chiếu dữ liệu trực tiếp",
        bieuTuong: "✨",
        doVatChung: DO_VAT_BY_COSTUME[dsTp[0]?.id || "aodai"] || DO_VAT_BY_COSTUME.aodai,
        trangPhucMinhHoaIds: dsTp.slice(0, 2).map((t) => t.id),
        nguonThamKhao: layNguonTuIds(dsTp[0]?.nguonIds || ["btdth", "btls"]),
      },
    ];
  }

  const ketQua: DiemChungItem[] = [];

  const dsTpA = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomA.id));
  const dsTpB = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomB.id));
  const combinedSourceIds = Array.from(
    new Set([
      ...dsTpA.flatMap((t) => t.nguonIds),
      ...dsTpB.flatMap((t) => t.nguonIds),
    ])
  );
  const commonSources = layNguonTuIds(combinedSourceIds);
  const pairCostumeIds = [dsTpA[0]?.id, dsTpB[0]?.id].filter(Boolean) as string[];

  // 1. CHIA SẺ DÒNG TRANG PHỤC DI SẢN
  const sharedCostumes = dsTpA.filter((tpA) =>
    dsTpB.some((tpB) => tpB.id === tpA.id)
  );

  if (sharedCostumes.length > 0) {
    const names = sharedCostumes.map((c) => c.ten).join(", ");
    ketQua.push({
      id: "chung_trang_phuc",
      tieuDe: "Chung cội nguồn y phục truyền thống",
      nguonGocCotLoi: `Chia sẻ trực tiếp dòng trang phục: ${names}.`,
      lichSuCotLoi: "Kế thừa cấu trúc cắt may cổ truyền từ thế kỷ XVIII – XX.",
      canCu: `Hồ sơ di sản: ${names}`,
      bieuTuong: "👘",
      doVatChung: DO_VAT_BY_COSTUME[sharedCostumes[0].id] || DO_VAT_BY_COSTUME.ngu_than,
      trangPhucMinhHoaIds: sharedCostumes.slice(0, 2).map((c) => c.id),
      nguonThamKhao: layNguonTuIds(sharedCostumes.flatMap((c) => c.nguonIds)),
    });
  }

  // 2. KỸ NGHỆ DỆT KHUNG CỬI & THỔ CẨM / TƠ SỢI
  const aCoDet = dsTpA.some(
    (tp) => tp.suThat.some((st) => /dệt|thổ cẩm|lanh|sợi/i.test(st)) || /dệt|thổ cẩm|lanh/i.test(tp.moTaNgan)
  );
  const bCoDet = dsTpB.some(
    (tp) => tp.suThat.some((st) => /dệt|thổ cẩm|lanh|sợi/i.test(st)) || /dệt|thổ cẩm|lanh/i.test(tp.moTaNgan)
  );

  if (aCoDet && bCoDet) {
    ketQua.push({
      id: "det_thu_cong",
      tieuDe: "Kỹ nghệ dệt khung cửi & sợi tự nhiên",
      nguonGocCotLoi: "Sử dụng khung dệt thủ công với sợi bông, vỏ lanh hoặc tơ tằm.",
      lichSuCotLoi: "Lưu giữ hệ thống đồ án hoa văn hình học truyền đời trên mặt vải.",
      canCu: "Kỹ thuật dệt sợi tự nhiên thủ công",
      bieuTuong: "🧵",
      doVatChung: {
        id: "khung_cui",
        ten: "Khung cửi gỗ & Con thoi dệt hoa văn",
        chatLieu: "Gỗ, tre, sợi bông / lanh / tơ tằm",
        nguonGocNgan: "Công cụ dệt vải thủ công truyền đời của phụ nữ các dân tộc Việt Nam.",
      },
      trangPhucMinhHoaIds: pairCostumeIds,
      nguonThamKhao: commonSources,
    });
  }

  // 3. CHẤT LIỆU BẠC & NGHỆ THUẬT KIM HOÀN
  const aCoBac = dsTpA.some((tp) => tp.suThat.some((st) => /bạc|cúc|kiềng|xu/i.test(st)));
  const bCoBac = dsTpB.some((tp) => tp.suThat.some((st) => /bạc|cúc|kiềng|xu/i.test(st)));

  if (aCoBac && bCoBac) {
    ketQua.push({
      id: "trang_suc_bac",
      tieuDe: "Hiện vật trang sức & khuy bạc chạm khắc",
      nguonGocCotLoi: "Chế tác bạc thủ công làm khuy áo, kiềng cổ, chuông bạc, đồng xu.",
      lichSuCotLoi: "Vừa cố định nếp áo, vừa là vật phẩm tín ngưỡng kỵ gió và cầu bình an.",
      canCu: "Hiện vật kim hoàn bạc trên trang phục",
      bieuTuong: "💍",
      doVatChung: {
        id: "kieng_bac_cham",
        ten: "Kiềng bạc, Cúc bướm & Lục lạc bạc",
        chatLieu: "Bạc trắng đúc và chạm trổ thủ công",
        nguonGocNgan: "Hiện vật kim hoàn truyền thống định hình bản sắc lễ phục.",
      },
      trangPhucMinhHoaIds: pairCostumeIds,
      nguonThamKhao: commonSources,
    });
  }

  // 4. KỸ THUẬT NHUỘM CHÀM TỰ NHIÊN
  const aCoCham = dsTpA.some(
    (tp) => tp.suThat.some((st) => /chàm/i.test(st)) || /chàm/i.test(tp.moTaNgan)
  );
  const bCoCham = dsTpB.some(
    (tp) => tp.suThat.some((st) => /chàm/i.test(st)) || /chàm/i.test(tp.moTaNgan)
  );

  if (aCoCham && bCoCham) {
    ketQua.push({
      id: "nhuom_cham",
      tieuDe: "Văn hóa nhuộm chàm tự nhiên",
      nguonGocCotLoi: "Chiết xuất sắc xanh đen từ lá cây chàm ngâm ủ với vôi và tro bếp.",
      lichSuCotLoi: "Kỹ thuật nhuộm truyền thống thích ứng với sinh thái rừng núi phía Bắc.",
      canCu: "Quy trình trồng chàm, ngâm ủ và nhuộm vải cổ truyền",
      bieuTuong: "🌿",
      doVatChung: {
        id: "but_sap_ong",
        ten: "Chum nhuộm chàm & Bút vẽ sáp ong",
        chatLieu: "Gỗ/sành, tinh bột chàm, sáp ong",
        nguonGocNgan: "Hiện vật nghề nhuộm chàm truyền thống của cư dân miền núi.",
      },
      trangPhucMinhHoaIds: pairCostumeIds,
      nguonThamKhao: commonSources,
    });
  }

  // 5. KHÔNG GIAN ĐỊA LÝ & LỊCH SỬ CƯ TRÚ
  if (nhomA.vung === nhomB.vung) {
    const tenVungMap: Record<string, string> = {
      bac: "Bắc Bộ & Miền núi phía Bắc",
      trung: "Duyên hải miền Trung",
      nam: "Đồng bằng Nam Bộ",
      taynguyen: "Cao nguyên Tây Nguyên",
    };
    const tenVung = tenVungMap[nhomA.vung] || nhomA.vung;

    ketQua.push({
      id: "cung_vung_mien",
      tieuDe: `Không gian lịch sử – địa lý: ${tenVung}`,
      nguonGocCotLoi: `Cùng sinh tụ lâu đời tại vùng văn hóa ${tenVung}.`,
      lichSuCotLoi: "Cấu trúc độ dày vải và kiểu dáng thích ứng trực tiếp với khí hậu bản địa.",
      canCu: `Phân vùng địa văn hóa: ${tenVung}`,
      bieuTuong: "🗺️",
      doVatChung: DO_VAT_BY_COSTUME[dsTpA[0]?.id || "aodai"] || DO_VAT_BY_COSTUME.aodai,
      trangPhucMinhHoaIds: pairCostumeIds,
      nguonThamKhao: commonSources,
    });
  }

  // 6. VĂN HÓA KHĂN ĐỘI ĐẦU & NÓN LÁ
  const aCoKhan = dsTpA.some((tp) => tp.suThat.some((st) => /khăn|nón|mũ/i.test(st)));
  const bCoKhan = dsTpB.some((tp) => tp.suThat.some((st) => /khăn|nón|mũ/i.test(st)));

  if (aCoKhan && bCoKhan && ketQua.length < 3) {
    ketQua.push({
      id: "phu_kien_khan",
      tieuDe: "Di sản khăn đội đầu & phụ kiện che chở",
      nguonGocCotLoi: "Sử dụng khăn vấn, khăn piêu, khăn rằn hoặc nón lá đi kèm y phục.",
      lichSuCotLoi: "Định hình quy chuẩn trang nghiêm trong lễ hội và che nắng gió lao động.",
      canCu: "Hệ thống phụ kiện đầu truyền thống Việt Nam",
      bieuTuong: "🧣",
      doVatChung: {
        id: "khan_van_non",
        ten: "Khăn đội đầu thêu & Nón truyền thống",
        chatLieu: "Vải bông / lụa thêu, lá cọ",
        nguonGocNgan: "Hiện vật phụ kiện đầu gắn liền với trang phục truyền thống.",
      },
      trangPhucMinhHoaIds: pairCostumeIds,
      nguonThamKhao: commonSources,
    });
  }

  return ketQua;
}
