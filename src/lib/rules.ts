/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { luatMau, luatRemix } from "../data/quytac";
import { mauSac } from "../data/mausac";
import { trangPhuc } from "../data/trangphuc";
import { phuKien } from "../data/phukien";
import { nhom } from "../data/nhom";
import { coem, domdom } from "../copy/coem";
import { callGemini } from "./gemini";
import { LuatMau, LuatRemix, Outfit, TrangPhuc } from "../types";
import { keGiaiThichNhanVanHoa3Phan, KetQuaGiaiThich3Phan } from "./loiKe";

/**
 * Bản đồ màu sắc ước định của các phụ kiện truyền thống và hiện đại
 */
export const PHU_KIEN_MAU: Record<string, string> = {
  non_la: "m_trang",       // nón lá / nón bài thơ lá cọ trắng ngà
  khan_dong: "m_cham",     // khăn đóng chàm đen
  khan_mo_qua: "m_cham",   // khăn mỏ quạ chàm đen
  non_quai_thao: "m_vang", // nón quai thao màu rơm vàng
  khan_ran: "m_cham",      // khăn rằn chàm trắng
  khan_pieu: "m_cham",     // khăn piêu thêu thổ cẩm trên nền chàm
  vong_bac: "m_trang",     // vòng bạc sáng ánh trắng
  tram_cai: "m_vang",      // trâm cài kim loại màu vàng
  tote: "m_trang",         // túi tote vải thô trắng ngà
  sneaker: "m_trang",      // giày sneaker trắng
};

export interface ColorEvaluation {
  ketQua: "hai_hoa" | "can_can_bang";
  nhanHienThi: "Hài hòa" | "Cần cân bằng";
  lyDo: string;
  capMau: [string, string];
  luat: LuatMau;
}

export interface RemixEvaluation {
  nhan: "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu";
  nhanHienThi: "Chuẩn đúng" | "Sáng tạo tự do" | "Cần xem lại" | "Chưa đủ dữ liệu để nói";
  lyDo: string;
  luatId: string;
  luat: LuatRemix;
  giaiThich3Phan: KetQuaGiaiThich3Phan;
}

export type PartialOutfit = {
  trangPhucId?: string;
  trangPhuc?: string;
  mauId?: string;
  phuKienIds?: string[];
  phuKien?: string[];
  hoaVanThem?: string | null;
  [key: string]: any;
};

/**
 * Tra cứu luật màu theo hai chiều (mauA, mauB hoặc mauB, mauA).
 * Nếu không có cặp cụ thể thì dùng dòng wildcard ('*').
 */
export function traCapMau(mauA: string, mauB: string): LuatMau {
  // Tra cặp theo hai chiều
  const found = luatMau.find(
    (l) => (l.a === mauA && l.b === mauB) || (l.a === mauB && l.b === mauA)
  );
  if (found) return found;

  // Dòng đại diện '*'
  const wildcard = luatMau.find((l) => l.a === "*" && l.b === "*");
  if (wildcard) return wildcard;

  // Dự phòng an toàn
  return {
    a: "*",
    b: "*",
    ketQua: "hai_hoa",
    lyDo: "Cặp này chưa có ghi chú riêng; nhìn chung hòa hợp.",
  };
}

/**
 * Đánh giá màu sắc: evaluateColor(mauId, phuKienIds)
 * Dựa trên luatMau (tra cặp theo hai chiều; không có thì dùng dòng "*").
 * Đảm bảo mọi cặp màu trong data đều có kết quả.
 */
export function evaluateColor(
  mauId: string,
  phuKienIds?: string[] | string
): ColorEvaluation {
  const currentMau = mauId || "m_do";

  // Trường hợp truyền vào trực tiếp một mã màu thứ 2 (hoặc 1 phụ kiện đơn)
  if (typeof phuKienIds === "string") {
    const isDirectColor = mauSac.some((m) => m.id === phuKienIds);
    const colorB = isDirectColor ? phuKienIds : PHU_KIEN_MAU[phuKienIds] ?? "m_trang";
    const rule = traCapMau(currentMau, colorB);
    return {
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, colorB],
      luat: rule,
    };
  }

  const accessories = Array.isArray(phuKienIds) ? phuKienIds : [];

  // Nếu không chọn phụ kiện nào, phối với màu nền mặc định của nếp áo (màu trắng ngà m_trang)
  if (accessories.length === 0) {
    const defaultCompanion = currentMau === "m_trang" ? "m_cham" : "m_trang";
    const rule = traCapMau(currentMau, defaultCompanion);
    return {
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, defaultCompanion],
      luat: rule,
    };
  }

  // Nếu có phụ kiện, đối chiếu màu từng phụ kiện với màu áo chính
  const evaluatedPairs: ColorEvaluation[] = [];

  for (const pkId of accessories) {
    const isDirectColor = mauSac.some((m) => m.id === pkId);
    const colorB = isDirectColor ? pkId : PHU_KIEN_MAU[pkId] ?? "m_trang";
    const rule = traCapMau(currentMau, colorB);
    evaluatedPairs.push({
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, colorB],
      luat: rule,
    });
  }

  // Ưu tiên cảnh báo "cần cân bằng" nếu có bất kỳ cặp nào cần lưu ý tỷ lệ
  const canCanBangItem = evaluatedPairs.find((p) => p.ketQua === "can_can_bang");
  if (canCanBangItem) {
    return canCanBangItem;
  }

  return evaluatedPairs[0];
}

/**
 * Đánh giá mức độ phối / cách tân: evaluateRemix(outfit)
 * Dựa trên luatRemix:
 * - Khớp trangPhuc, phuKienBatKy, hoaVanThem
 * - Nếu nhiều luật khớp, ưu tiên can_xem_lai > sang_tao > chuan
 * - Không khớp thì dùng "mac_dinh"
 * - Luôn dùng giọng mềm ("cần cân nhắc vì...", không dùng từ "sai")
 */
export function evaluateRemix(outfit: PartialOutfit | Outfit): RemixEvaluation {
  const anyOutfit = outfit as Record<string, any>;
  const costumeId: string = anyOutfit.trangPhucId || anyOutfit.trangPhuc || "";
  const accessoryIds: string[] = anyOutfit.phuKienIds || anyOutfit.phuKien || [];
  const hoaVan: string | null = anyOutfit.hoaVanThem || null;

  const matchedRules: LuatRemix[] = [];

  for (const rule of luatRemix) {
    if (rule.id === "mac_dinh") continue;

    const { trangPhuc, phuKienBatKy, hoaVanThem } = rule.khi;

    // 1. Kiểm tra trangPhuc nếu luật có quy định
    if (trangPhuc && trangPhuc.length > 0) {
      if (!trangPhuc.includes(costumeId)) {
        continue;
      }
    }

    // 2. Kiểm tra phuKienBatKy nếu luật có quy định
    if (phuKienBatKy && phuKienBatKy.length > 0) {
      const hasAny = phuKienBatKy.some((pk) => accessoryIds.includes(pk));
      if (!hasAny) {
        continue;
      }
    }

    // 3. Kiểm tra hoaVanThem nếu luật có quy định
    if (hoaVanThem) {
      if (hoaVan !== hoaVanThem) {
        continue;
      }
    }

    // Luật có ít nhất một điều kiện xác định và tất cả điều kiện đều khớp
    if (trangPhuc || phuKienBatKy || hoaVanThem) {
      matchedRules.push(rule);
    }
  }

  // Thứ tự ưu tiên: can_xem_lai (3) > sang_tao (2) > chuan (1)
  const rank: Record<string, number> = {
    can_xem_lai: 3,
    sang_tao: 2,
    chuan: 1,
  };

  let chosenRule: LuatRemix;

  if (matchedRules.length > 0) {
    matchedRules.sort((a, b) => (rank[b.nhan] ?? 0) - (rank[a.nhan] ?? 0));
    chosenRule = matchedRules[0];
  } else {
    // THÊM MỘT MỨC THỨ TƯ: "Chưa đủ dữ liệu để nói"
    // dùng khi tổ hợp không khớp luật nào VÀ không có trong danh sách đã kiểm chứng (daKiemChung=false ở cả hai món)
    const tpObj = trangPhuc.find((t) => t.id === costumeId);
    const tpChuaKiemChung = !tpObj || tpObj.daKiemChung === false;

    // Kiểm tra các phụ kiện hoặc họa tiết
    const pkObjs = accessoryIds.map((id) => phuKien.find((p) => p.id === id));
    // Nếu có phụ kiện thì tất cả phụ kiện đều chưa kiểm chứng (daKiemChung === false)
    const pkChuaKiemChung =
      accessoryIds.length > 0
        ? pkObjs.every((p) => !p || p.daKiemChung === false)
        : true;

    if (tpChuaKiemChung && pkChuaKiemChung) {
      chosenRule = {
        id: "chua_du_du_lieu",
        khi: {},
        nhan: "chua_du_du_lieu",
        lyDo: "Tôi chưa có đủ căn cứ để nói rõ về tổ hợp này.",
      };
    } else {
      chosenRule = luatRemix.find((l) => l.id === "mac_dinh") ?? {
        id: "mac_dinh",
        khi: {},
        nhan: "sang_tao",
        lyDo: "Cách phối này chưa có ghi chú riêng; xem như sáng tạo cá nhân.",
      };
    }
  }

  const nhanHienThi: "Chuẩn đúng" | "Sáng tạo tự do" | "Cần xem lại" | "Chưa đủ dữ liệu để nói" =
    chosenRule.nhan === "chuan"
      ? "Chuẩn đúng"
      : chosenRule.nhan === "can_xem_lai"
      ? "Cần xem lại"
      : chosenRule.nhan === "chua_du_du_lieu"
      ? "Chưa đủ dữ liệu để nói"
      : "Sáng tạo tự do";

  // Lời giải thích giọng mềm, tuyệt đối không dùng từ "sai"
  let softLyDo = chosenRule.lyDo;
  // Loại bỏ bất kỳ từ "sai" nào nếu có
  softLyDo = softLyDo.replace(/sai/gi, "lệch");

  if (chosenRule.nhan === "can_xem_lai") {
    if (!softLyDo.toLowerCase().startsWith("cần cân nhắc")) {
      softLyDo = `Cần cân nhắc vì ${softLyDo.charAt(0).toLowerCase() + softLyDo.slice(1)}`;
    }
  }

  // Chuẩn bị dữ liệu cho khuôn 3 phần từ loiKe.ts
  const tp = trangPhuc.find((t) => t.id === costumeId);
  const tenA = tp?.ten || costumeId || "Trang phục";

  // Tên B (phụ kiện hoặc hoa văn)
  let tenB = "";
  if (chosenRule.khi.hoaVanThem || hoaVan) {
    const hvId = chosenRule.khi.hoaVanThem || hoaVan;
    tenB = `họa tiết ${nhom.find((n) => n.id === hvId)?.ten || hvId}`;
  } else if (chosenRule.khi.phuKienBatKy && chosenRule.khi.phuKienBatKy.length > 0) {
    const matchedPkId = chosenRule.khi.phuKienBatKy.find((id) => accessoryIds.includes(id));
    tenB = phuKien.find((p) => p.id === matchedPkId)?.ten || "phụ kiện";
  } else if (accessoryIds.length > 0) {
    const matchedPks = accessoryIds
      .map((id) => phuKien.find((p) => p.id === id)?.ten || id);
    tenB = matchedPks.join(", ");
  } else {
    tenB = "phong cách tự chọn";
  }

  // Bối cảnh A (trang phục)
  let boiCanhA: string | undefined;
  if (tp) {
    const nhomNames = tp.nhomIds.map((id) => nhom.find((n) => n.id === id)?.ten).filter(Boolean);
    const dipNames = tp.dip.slice(0, 2);
    if (nhomNames.length > 0 && dipNames.length > 0) {
      boiCanhA = `${nhomNames.join(", ")} trong dịp ${dipNames.join(", ")}`;
    } else if (nhomNames.length > 0) {
      boiCanhA = `văn hóa ${nhomNames.join(", ")}`;
    } else if (tp.suThat && tp.suThat.length > 0) {
      boiCanhA = tp.suThat[0];
    }
  }

  // Bối cảnh B (phụ kiện hoặc hoa văn)
  let boiCanhB: string | undefined;
  const firstPk = phuKien.find((p) => accessoryIds.includes(p.id));
  if (firstPk && firstPk.suThat && firstPk.suThat.length > 0) {
    boiCanhB = firstPk.suThat[0];
  } else if (firstPk && firstPk.nhomIds && firstPk.nhomIds.length > 0) {
    const nhomPkNames = firstPk.nhomIds.map((id) => nhom.find((n) => n.id === id)?.ten).filter(Boolean);
    boiCanhB = `văn hóa ${nhomPkNames.join(", ")}`;
  } else if (hoaVan) {
    boiCanhB = `họa tiết đặc trưng của ${nhom.find((n) => n.id === hoaVan)?.ten || hoaVan}`;
  }

  const giaiThich3Phan = keGiaiThichNhanVanHoa3Phan({
    nhan: chosenRule.nhan,
    tenTrangPhuc: tenA,
    tenPhuKienOrHoaVan: tenB,
    boiCanhA,
    boiCanhB,
    lyDo: softLyDo,
    goiYThayThe: chosenRule.goiYThayThe,
  });

  return {
    nhan: chosenRule.nhan as "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu",
    nhanHienThi,
    lyDo: softLyDo,
    luatId: chosenRule.id,
    luat: chosenRule,
    giaiThich3Phan,
  };
}


export {
  type ThoiTietId,
  TEN_THOI_TIET,
  type GoiYCondition,
  type GoiYResult,
  locTrangPhucGoiY,
  layCauGiaiThichGoc,
  rephraseGoiYWithGemini,
} from "./rules/weatherOccasionRules";

export {
  type GoiYQueNhaItem,
  goiYTheoBoiCanhQueNha,
} from "./rules/queNhaRecommendations";
