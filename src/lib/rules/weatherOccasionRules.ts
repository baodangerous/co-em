import { trangPhuc } from "../../data/trangphuc";
import { domdom } from "../../copy/coem";
import { callGemini } from "../gemini";
import type { TrangPhuc } from "../../types";

// ============================================================================
// BỘ LUẬT GỢI Ý TRANG PHỤC THEO THỜI TIẾT & DỊP
// ============================================================================

export type ThoiTietId = "nong" | "mat" | "lanh" | "mua";

export const TEN_THOI_TIET: Record<string, string> = {
  nong: "Nắng nóng",
  mat: "Dịu mát",
  lanh: "Se lạnh",
  mua: "Trời mưa",
};

export interface GoiYCondition {
  thoiTiet?: ThoiTietId | string | null;
  dip?: string | null;
}

export interface GoiYResult {
  danhSach: TrangPhuc[];
  cauGoc: string;
  cauDienDat: string;
  tuGemini: boolean;
}

/**
 * Lọc trang phục theo thời tiết (nong/mat/lanh/mua) hoặc một dịp.
 * Đảm bảo đổi điều kiện ra danh sách khác nhau.
 * Với trường hợp vừa có thời tiết vừa có dịp (như {"thoiTiet":"mua","dip":"khai_giang"}),
 * nếu có bộ thỏa cả 2 thì lấy, nếu không thì kết hợp các bộ khớp dịp và các bộ khớp thời tiết.
 */
export function locTrangPhucGoiY(condition: GoiYCondition): TrangPhuc[] {
  const { thoiTiet, dip } = condition;
  if (!thoiTiet && !dip) {
    return trangPhuc;
  }

  // Chọn cả thời tiết và dịp
  if (thoiTiet && dip) {
    const both = trangPhuc.filter(
      (tp) => tp.thoiTiet.includes(thoiTiet) && tp.dip.includes(dip)
    );
    if (both.length > 0) return both;

    // Ví dụ {"thoiTiet":"mua","dip":"khai_giang"}:
    // aodai (khớp khai_giang) + ba_ba (khớp mua)
    const combined = trangPhuc.filter(
      (tp) => tp.dip.includes(dip) || tp.thoiTiet.includes(thoiTiet)
    );
    return combined;
  }

  // Chỉ chọn thời tiết
  if (thoiTiet) {
    return trangPhuc.filter((tp) => tp.thoiTiet.includes(thoiTiet));
  }

  // Chỉ chọn dịp
  if (dip) {
    return trangPhuc.filter((tp) => tp.dip.includes(dip));
  }

  return trangPhuc;
}

/**
 * Lấy MỘT câu giải thích gốc từ luật (fallback chuẩn, không dùng AI).
 * Ví dụ: "Trời mưa... Cò Em gợi ý những bộ gọn và dễ di chuyển."
 */
export function layCauGiaiThichGoc(
  condition: GoiYCondition,
  danhSach: TrangPhuc[] = []
): string {
  const { thoiTiet, dip } = condition;
  const tenDip = dip ? domdom.s2.tenDip[dip] ?? dip : "";

  // 1. Trường hợp thời tiết mưa
  if (thoiTiet === "mua") {
    if (dip === "khai_giang") {
      return "Dịp khai giảng gặp trời mưa, Cò Em gợi ý những bộ gọn và dễ di chuyển, vừa giữ vẻ trang nhã vừa tiện đi lại.";
    }
    if (dip) {
      return `Dịp ${tenDip} gặp trời mưa, Cò Em gợi ý những bộ gọn và dễ di chuyển để vừa giữ nét đẹp vừa thuận tiện đi lại.`;
    }
    return "Trời mưa... Cò Em gợi ý những bộ gọn và dễ di chuyển.";
  }

  // 2. Trường hợp thời tiết nắng nóng
  if (thoiTiet === "nong") {
    if (dip === "khai_giang") {
      return "Dịp khai giảng ngày nắng ráo, Cò Em gợi ý tà áo dài thanh thoát, chất liệu nhẹ và thoáng mát.";
    }
    if (dip) {
      return `Dịp ${tenDip} vào ngày nắng nóng, Cò Em gợi ý những bộ trang phục thoáng mát, chất vải nhẹ và dễ chịu.`;
    }
    return "Trời nắng nóng, Cò Em gợi ý những bộ trang phục thoáng mát và thấm hút mồ hôi tốt.";
  }

  // 3. Trường hợp thời tiết se lạnh
  if (thoiTiet === "lanh") {
    if (dip === "tet") {
      return "Dịp Tết tiết trời se lạnh, Cò Em gợi ý những bộ áo nhiều lớp ấm áp như áo ngũ thân hoặc áo dài cổ truyền.";
    }
    if (dip) {
      return `Dịp ${tenDip} vào tiết trời se lạnh, Cò Em gợi ý những bộ trang phục nhiều lớp giúp giữ ấm mà vẫn vẹn nếp cổ truyền.`;
    }
    return "Trời se lạnh, Cò Em gợi ý những bộ trang phục nhiều lớp hoặc chất vải dệt dày dặn giúp giữ ấm cơ thể.";
  }

  // 4. Trường hợp thời tiết dịu mát
  if (thoiTiet === "mat") {
    if (dip) {
      return `Dịp ${tenDip} trong tiết trời dịu mát, Cò Em gợi ý những bộ trang phục thanh lịch, thoải mái dạo phố hay dự hội.`;
    }
    return "Tiết trời dịu mát, Cò Em gợi ý những nếp áo truyền thống tao nhã, rất thích hợp cho những cuộc dạo phố và gặp gỡ.";
  }

  // 5. Trường hợp chỉ chọn dịp
  if (dip) {
    if (dip === "khai_giang") {
      return "Dịp khai giảng năm học mới, Cò Em gợi ý tà áo dài truyền thống thanh lịch, trang nhã.";
    }
    if (dip === "tet") {
      return "Dịp Tết đến xuân về, Cò Em gợi ý những bộ trang phục truyền thống mang sắc màu hoan hỉ, sum vầy.";
    }
    if (dip === "cuoi") {
      return "Dịp lễ cưới hỏi thiêng liêng, Cò Em gợi ý những bộ trang phục trang trọng, đĩnh đạc và cát tường.";
    }
    if (dip === "le_hoi") {
      return "Dịp trẩy hội buôn làng, Cò Em gợi ý những bộ trang phục rực rỡ mang đậm bản sắc văn hóa vùng miền.";
    }
    if (dip === "hoi_lang") {
      return "Dịp hội làng Bắc Bộ, Cò Em gợi ý những tà áo tứ thân, áo ngũ thân đượm hồn quê xứ sở.";
    }
    if (dip === "doi_thuong") {
      return "Mặc thường ngày, Cò Em gợi ý những bộ trang phục mộc mạc như áo bà ba, tiện cho sinh hoạt và lao động.";
    }
    if (dip === "cho_phien") {
      return "Dịp chợ phiên vùng cao, Cò Em gợi ý trang phục dệt thổ cẩm rực rỡ, thuận tiện bước trên đường dốc.";
    }
    return `Dịp ${tenDip}, Cò Em gợi ý những nếp áo truyền thống trang nhã, phù hợp với không khí ngày này.`;
  }

  // Mặc định
  if (danhSach.length > 0) {
    return "Tôi gợi ý những nếp áo tiêu biểu của các vùng miền, từ áo dài thanh thoát đến áo bà ba mộc mạc.";
  }
  return "Tôi gợi ý những nếp áo truyền thống hài hòa với vóc dáng và văn hóa xứ mình.";
}

/**
 * Gọi callGemini CHỈ để diễn đạt lại câu ấy tự nhiên hơn.
 * - Giữ nguyên danh sách và ý nghĩa.
 * - Nhiệt độ: 0.5 (theo yêu cầu).
 * - Fallback: trả về nguyên văn câu gốc khi Gemini lỗi hoặc offline.
 */
export async function rephraseGoiYWithGemini(
  cauGoc: string,
  danhSachTen: string[],
  condition: GoiYCondition
): Promise<{ cauDienDat: string; tuGemini: boolean }> {
  const tenThoiTiet = condition.thoiTiet
    ? TEN_THOI_TIET[condition.thoiTiet] ?? condition.thoiTiet
    : "bình thường";
  const tenDip = condition.dip
    ? domdom.s2.tenDip[condition.dip] ?? condition.dip
    : "thường nhật";

  try {
    const res = await callGemini({
      vaiTro:
        "Bạn là người kể chuyện Cò Em, am hiểu trang phục truyền thống Việt Nam. Giọng điệu của bạn trầm, ấm áp, nhã nhặn, tự nhiên, xưng Cò Em gọi bạn, mang hơi thở dân gian nhưng hiện đại, câu từ súc tích.",
      context: `Người dùng đang tìm gợi ý trang phục theo điều kiện: Thời tiết: "${tenThoiTiet}", Dịp: "${tenDip}". Danh sách trang phục gợi ý: ${danhSachTen.join(
        ", "
      )}.`,
      quyTac: [
        "CHỈ diễn đạt lại MỘT câu giải thích gốc sao cho tự nhiên, mượt mà và ấm áp hơn.",
        "Giữ nguyên ý nghĩa cốt lõi và danh sách trang phục được gợi ý, không thêm bớt thông tin sai lệch.",
        "Độ dài chỉ đúng MỘT câu ngắn gọn (khoảng 15-30 từ).",
        "Không dùng từ ngữ sáo rỗng hoặc quảng cáo.",
      ],
      cauHoi: `Hãy diễn đạt lại câu giải thích gốc sau thành 1 câu tự nhiên hơn:\n"${cauGoc}"`,
      schema: {
        type: "object",
        properties: {
          cauDienDat: {
            type: "string",
            description: "MỘT câu giải thích tự nhiên, ấm áp diễn đạt lại từ câu gốc",
          },
        },
        required: ["cauDienDat"],
      },
      nhietDo: 0.5,
    });

    if (res.ok && res.data && typeof res.data === "object") {
      const parsed = res.data as { cauDienDat?: string };
      if (
        parsed.cauDienDat &&
        typeof parsed.cauDienDat === "string" &&
        parsed.cauDienDat.trim().length > 5
      ) {
        return {
          cauDienDat: parsed.cauDienDat.trim(),
          tuGemini: true,
        };
      }
    }
  } catch (err) {
    console.warn("rephraseGoiYWithGemini fallback to cauGoc:", err);
  }

  // Fallback = câu gốc
  return {
    cauDienDat: cauGoc,
    tuGemini: false,
  };
}

