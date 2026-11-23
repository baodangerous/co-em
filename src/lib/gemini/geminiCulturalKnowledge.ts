import { trangPhuc } from "../../data/trangphuc";
import { phuKien } from "../../data/phukien";
import { vai } from "../../data/vai";
import { mocThoiGian } from "../../data/mocthoigian";
import type { GoiYPhanTichBoiCanh } from "../gemini";

/**
 * Chọn CONTEXT bằng so khớp từ khóa đơn giản trên trangPhuc/phuKien/vai/mocThoiGian + bộ đồ đang xem
 */
export function timKiemContextChoCauHoi(
  cauHoi: string,
  boDoHienTai?: {
    trangPhucId?: string;
    mauId?: string;
    phuKienIds?: string[];
  }
): string {
  const qLower = cauHoi.toLowerCase();
  const contextLines: string[] = [];

  // 1. So khớp trangPhuc
  const matchedTrangPhuc = trangPhuc.filter((tp) => {
    if (boDoHienTai?.trangPhucId === tp.id) return true;
    if (qLower.includes(tp.ten.toLowerCase())) return true;
    if (qLower.includes("tứ thân") && tp.id === "tu_than") return true;
    if (qLower.includes("ngũ thân") && tp.id === "ngu_than") return true;
    if (qLower.includes("áo dài") && tp.id === "aodai") return true;
    if (qLower.includes("bà ba") && tp.id === "ba_ba") return true;
    if (qLower.includes("nhật bình") && tp.id === "nhat_binh") return true;
    if (qLower.includes("giao lĩnh") && tp.id === "giao_linh") return true;
    if (qLower.includes("áo tấc") && tp.id === "ao_tac") return true;
    if (qLower.includes("chàm") && tp.id === "ao_cham") return true;
    if (qLower.includes("khăn piêu") && tp.id === "khan_pieu") return true;
    return false;
  });

  matchedTrangPhuc.forEach((tp) => {
    contextLines.push(
      `[Trang phục: ${tp.id}] Tên: ${tp.ten}. Dành cho: ${tp.gioiTinh}. Dịp mặc: ${tp.dip.join(", ")}. Thời tiết: ${tp.thoiTiet.join(", ")}. Miêu tả: ${tp.moTaNgan}. Sự thật đã kiểm chứng: ${tp.suThat.join("; ")}. Nguồn: ${tp.nguonIds.join(", ")}.`
    );
  });

  // 2. So khớp phuKien
  const matchedPhuKien = phuKien.filter((pk) => {
    if (boDoHienTai?.phuKienIds?.includes(pk.id)) return true;
    if (qLower.includes(pk.ten.toLowerCase())) return true;
    if (qLower.includes("nón lá") && pk.id.includes("non_la")) return true;
    if (qLower.includes("khăn đóng") && pk.id.includes("khan_dong")) return true;
    if (qLower.includes("khăn mỏ quạ") && pk.id.includes("khan_mo_qua")) return true;
    if ((qLower.includes("quai thao") || qLower.includes("nón quai thao")) && pk.id.includes("non_quai_thao")) return true;
    if (qLower.includes("khăn rằn") && pk.id.includes("khan_ran")) return true;
    if (qLower.includes("khăn piêu") && pk.id.includes("khan_pieu")) return true;
    if (qLower.includes("kiềng") && pk.id.includes("kieng")) return true;
    if (qLower.includes("hài cong") && pk.id.includes("hai_cong")) return true;
    // Đi kèm áo tứ thân trong dữ liệu
    if (qLower.includes("tứ thân") && (pk.id === "khan_mo_qua" || pk.id === "non_quai_thao")) return true;
    return false;
  });

  matchedPhuKien.forEach((pk) => {
    contextLines.push(
      `[Phụ kiện: ${pk.id}] Tên: ${pk.ten}. Loại: ${pk.loai}. Sự thật: ${pk.suThat.join("; ")}.`
    );
  });

  // 3. So khớp vai (chất liệu)
  const matchedVai = vai.filter((v) => {
    if (qLower.includes(v.ten.toLowerCase())) return true;
    if (qLower.includes(v.langNghe.toLowerCase())) return true;
    if (qLower.includes("lụa") || qLower.includes("vạn phúc") || qLower.includes("hà đông")) {
      if (v.id === "lua_van_phuc") return true;
    }
    if (qLower.includes("vải chàm") || (qLower.includes("chàm") && !qLower.includes("áo chàm"))) {
      if (v.id === "cham_nhuom") return true;
    }
    if (qLower.includes("thổ cẩm") || qLower.includes("chăm") || qLower.includes("mỹ nghiệp")) {
      if (v.id === "tho_cam_champa") return true;
    }
    if (qLower.includes("lanh") || qLower.includes("mông") || qLower.includes("sáp ong")) {
      if (v.id === "lanh_mong") return true;
    }
    if (qLower.includes("ê đê") || (qLower.includes("thổ cẩm") && qLower.includes("tây nguyên"))) {
      if (v.id === "tho_cam_ede") return true;
    }
    return false;
  });

  matchedVai.forEach((v) => {
    contextLines.push(
      `[Vải/Chất liệu: ${v.id}] Tên: ${v.ten}. Làng nghề / Nguồn gốc: ${v.langNghe}. Kỹ thuật: ${v.kyThuat}. Sự thật: ${v.suThat.join("; ")}. Nguồn: ${v.nguonIds.join(", ")}.`
    );
  });

  // 4. So khớp mocThoiGian
  const matchedMoc = mocThoiGian.filter((m) => {
    if (qLower.includes(m.nam.toLowerCase())) return true;
    if (qLower.includes(m.ten.toLowerCase())) return true;
    if (qLower.includes("lemur") || qLower.includes("cát tường")) {
      if (m.id === "tg2") return true;
    }
    if (qLower.includes("raglan") || qLower.includes("cổ thuyền")) {
      if (m.id === "tg4") return true;
    }
    if (
      qLower.includes("thời gian") ||
      qLower.includes("lịch sử") ||
      qLower.includes("thế kỷ") ||
      qLower.includes("thập niên")
    ) {
      return true;
    }
    return false;
  });

  matchedMoc.forEach((m) => {
    contextLines.push(
      `[Mốc thời gian: ${m.id}] Năm/Thời kỳ: ${m.nam}. Sự kiện: ${m.ten}. Thay đổi: ${m.thayDoi}.`
    );
  });

  // Nếu không có gì khớp trực tiếp từ từ khóa
  if (contextLines.length === 0) {
    if (boDoHienTai?.trangPhucId) {
      const curTp = trangPhuc.find((t) => t.id === boDoHienTai.trangPhucId);
      if (curTp) {
        contextLines.push(
          `[Bộ đồ đang xem: ${curTp.id}] Tên: ${curTp.ten}. Dành cho: ${curTp.gioiTinh}. Dịp mặc: ${curTp.dip.join(", ")}. Miêu tả: ${curTp.moTaNgan}. Sự thật: ${curTp.suThat.join("; ")}. Nguồn: ${curTp.nguonIds.join(", ")}.`
        );
      }
    }
    // Dữ liệu nền tảng di sản phong phú khi người dùng hỏi chung hoặc chào hỏi
    contextLines.push(
      `[Nhân vật dẫn chuyện Cò Em]: Cò Em là chú chim Cò rằn thông thái, linh vật đồng hành cùng các bạn trẻ khám phá kho tàng di sản trang phục truyền thống Việt Nam (Việt phục remix). Cò Em xưng là "Cò Em", gọi người dùng là "bạn", giọng văn ấm áp, thân thiện, tôn trọng nét đẹp văn hóa đa dân tộc. Khi được chào hỏi hoặc hỏi mình là ai, Cò Em vui vẻ chào đón và gợi ý các chủ đề tìm hiểu.`,
      `[Kho tàng trang phục Việt Nam]:
- Áo dài: Biểu tượng quốc phục, phát triển từ ngũ thân lập lĩnh qua Le Mur (1930), Lê Phổ, Raglan (1960) đến hiện đại; mặc trong lễ tết, cưới hỏi, kỷ yếu, dạo phố. [nguon: bt_phu_nu_vn, bao_tang_ao_dai]
- Áo ngũ thân (Cố đô Huế): 5 thân tượng trưng tứ thân phụ mẫu và bản thân, 5 cúc khuy tượng trưng ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín); có ngũ thân tay chẽn và ngũ thân tay thụng (áo tấc). [nguon: trung_tam_bao_ton_di_tich_hue, nghien_cuu_trang_phuc_nguyen]
- Áo tứ thân (Bắc Bộ): 4 vạt áo buông thả hoặc buộc chéo, yếm đào, khăn mỏ quạ, nón quai thao ba tầm; trang phục hội xuân, hát quan họ Kinh Bắc. [nguon: bt_phu_nu_vn, trang_phuc_thang_long]
- Áo bà ba (Nam Bộ): Cổ tròn/tim xẻ tà hai bên hông, quần lụa đen, khăn rằn caro, nón lá búp bàng; mộc mạc, phóng khoáng, gắn liền sông nước miệt vườn. [nguon: bt_phu_nu_nam_bo, van_hoa_song_nuoc_nam_bo]
- Áo cỏm Thái (Tây Bắc): Hàng cúc bướm bạc (hàng pebm), khăn piêu thêu chỉ màu tinh xảo. [nguon: vien_dan_toc_hoc]
- Thổ cẩm Chăm (Mỹ Nghiệp): Dệt hoa văn cổ truyền trên khung dệt thủ công. [nguon: lang_nghe_my_nghiep]
- Trang phục Mông: Váy xòe xếp nếp, dệt vải lanh, kỹ thuật vẽ sáp ong và nhuộm chàm độc đáo. [nguon: vien_dan_toc_hoc]`,
      `[Làng nghề truyền thống]: Lụa Vạn Phúc (Hà Đông, hơn 1000 năm), Lãnh Mỹ A (Tân Châu, An Giang, nhuộm quả mặc nưa màu đen tuyền huyền bí). [nguon: lang_lua_van_phuc, lanh_my_a_tan_chau]`
    );
  }

  return contextLines.join("\n");
}

export const SYSTEM_PROMPT_CHATBOT = `Bạn là "Cố vấn văn hóa Cò Em" của ứng dụng Cò Em — Việt Phục Remix, xưng "Cò Em", gọi người dùng là "bạn", nói với học sinh, sinh viên bằng tiếng Việt, giọng thân thiện, tối đa 4 câu.
1. Khi người dùng chào hỏi hoặc hỏi bạn là ai, hãy vui vẻ chào lại bằng tiếng Việt, giới thiệu mình là Cò Em và gợi ý 1-2 chủ đề trang phục thú vị (như Áo dài, Áo tứ thân, Áo ngũ thân hay Áo bà ba).
2. Dùng thông tin trong CONTEXT để giải đáp chính xác về trang phục, dịp mặc, chất liệu lụa vải, phụ kiện và nét đẹp văn hóa Việt Nam.
3. Nếu câu hỏi hoàn toàn ngoài lề văn hóa/trang phục (như toán học, ẩm thực nấu nướng), từ chối lịch sự và hướng người dùng quay lại chủ đề trang phục truyền thống.
4. Không phán đúng/sai tuyệt đối; tôn trọng sự đa dạng của 54 dân tộc anh em.
5. Kết thúc bằng [nguon: id1, id2] khi cung cấp kiến thức từ tư liệu văn hóa.`;

export const FEW_SHOT_CHATBOT = `- Câu hỏi: "Áo tứ thân đi với gì?"
  Trả lời: Áo tứ thân của phụ nữ Bắc Bộ truyền thống thường đi cùng yếm, váy, khăn mỏ quạ và nón quai thao. Hai vạt trước của áo thường được buộc lại duyên dáng khi trẩy hội. [nguon: bt_phu_nu_vn, trang_phuc_thang_long]

- Câu hỏi: "Chào Cò Em, bạn là ai?"
  Trả lời: Cò Em chào bạn! Cò Em là linh vật đồng hành cùng bạn khám phá kho tàng trang phục truyền thống và di sản Việt phục remix. Bạn muốn tìm hiểu về Áo dài, Áo tứ thân Kinh Bắc hay Áo bà ba Nam Bộ nào?

- Câu hỏi: "Công thức nấu phở?"
  Trả lời: Cò Em là cố vấn trang phục truyền thống của Cò Em — Việt Phục Remix nên chưa thể chia sẻ công thức nấu ăn được rồi. Bạn có muốn tìm hiểu về trang phục truyền thống hay cách phối áo dài, áo tứ thân không nào?`;


export function taoCauTraLoiFallback(cauHoi: string, boDoHienTai?: { trangPhucId?: string }): { cauTraLoi: string; nguonIds: string[] } {
  const q = cauHoi.toLowerCase();
  if (q.includes("chào") || q.includes("hello") || q.includes("hi ") || q === "hi" || q.includes("bạn là ai")) {
    return {
      cauTraLoi: "Cò Em chào bạn! Cò Em là người bạn đồng hành cùng bạn khám phá vẻ đẹp trang phục truyền thống Việt Nam (Việt phục remix). Bạn muốn Cò Em kể về Áo dài, Áo tứ thân, Áo ngũ thân hay trang phục vùng miền nào nè?",
      nguonIds: ["bt_phu_nu_vn"],
    };
  }
  if (q.includes("áo dài")) {
    return {
      cauTraLoi: "Áo dài là quốc phục truyền thống Việt Nam, phát triển từ áo ngũ thân lập lĩnh qua bàn tay cách tân của họa sĩ Le Mur Nguyễn Cát Tường (1930) rồi đến kiểu may raglan (1960). Áo dài thường được mặc trong dịp Tết, cưới hỏi, kỷ yếu trường lớp và các nghi lễ trang trọng. [nguon: bt_phu_nu_vn, bao_tang_ao_dai]",
      nguonIds: ["bt_phu_nu_vn", "bao_tang_ao_dai"],
    };
  }
  if (q.includes("tứ thân")) {
    return {
      cauTraLoi: "Áo tứ thân gồm bốn vạt áo thướt tha tượng trưng cho tứ thân phụ mẫu, gắn liền với hình ảnh phụ nữ Kinh Bắc duyên dáng. Áo thường kết hợp cùng yếm đào, khăn mỏ quạ thắt đuôi gà và nón quai thao ba tầm rộn ràng trong các hội xuân trẩy hội. [nguon: bt_phu_nu_vn, trang_phuc_thang_long]",
      nguonIds: ["bt_phu_nu_vn", "trang_phuc_thang_long"],
    };
  }
  if (q.includes("ngũ thân") || q.includes("áo tấc")) {
    return {
      cauTraLoi: "Áo ngũ thân được định hình và quy chuẩn thời chúa Nguyễn Phúc Khoát và vua Minh Mạng triều Nguyễn. Năm thân áo tượng trưng cho tứ thân phụ mẫu và chính bản thân người mặc, cùng 5 hạt khuy cài tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín. [nguon: trung_tam_bao_ton_di_tich_hue, nghien_cuu_trang_phuc_nguyen]",
      nguonIds: ["trung_tam_bao_ton_di_tich_hue", "nghien_cuu_trang_phuc_nguyen"],
    };
  }
  if (q.includes("bà ba") || q.includes("khăn rằn")) {
    return {
      cauTraLoi: "Áo bà ba xẻ tà hai bên hông tạo sự thoải mái, uyển chuyển, là nét đẹp mộc mạc gắn liền với người dân sông nước Nam Bộ. Người mặc thường kết hợp với chiếc khăn rằn caro và nón lá thanh thoát khi làm việc hay du xuân miệt vườn. [nguon: bt_phu_nu_nam_bo, van_hoa_song_nuoc_nam_bo]",
      nguonIds: ["bt_phu_nu_nam_bo", "van_hoa_song_nuoc_nam_bo"],
    };
  }
  if (q.includes("thái") || q.includes("áo cỏm") || q.includes("khăn piêu")) {
    return {
      cauTraLoi: "Áo cỏm của phụ nữ Thái Tây Bắc nổi bật với hàng cúc bướm bạc 'hàng pebm' tượng trưng cho sự gắn kết lứa đôi, kết hợp cùng chân váy lụa đen và chiếc khăn piêu thêu hoa văn chỉ màu rực rỡ. [nguon: vien_dan_toc_hoc]",
      nguonIds: ["vien_dan_toc_hoc"],
    };
  }
  if (q.includes("mông") || q.includes("sáp ong") || q.includes("lanh")) {
    return {
      cauTraLoi: "Trang phục người Mông được may thủ công từ sợi vải lanh bền bỉ, ứng dụng kỹ thuật vẽ sáp ong và nhuộm chàm truyền thống qua nhiều công đoạn kỳ công để tạo nên hoa văn kỷ hà độc đáo. [nguon: vien_dan_toc_hoc]",
      nguonIds: ["vien_dan_toc_hoc"],
    };
  }
  if (q.includes("lụa") || q.includes("vạn phúc") || q.includes("lãnh mỹ a")) {
    return {
      cauTraLoi: "Lụa Vạn Phúc (Hà Đông) có lịch sử hơn nghìn năm với chất lụa tơ tằm óng ả, còn Lãnh Mỹ A (Tân Châu) trứ danh với sắc đen tuyền huyền bí nhuộm từ quả mặc nưa tự nhiên. [nguon: lang_lua_van_phuc, lanh_my_a_tan_chau]",
      nguonIds: ["lang_lua_van_phuc", "lanh_my_a_tan_chau"],
    };
  }
  if (boDoHienTai?.trangPhucId) {
    const tp = trangPhuc.find((t) => t.id === boDoHienTai.trangPhucId);
    if (tp) {
      return {
        cauTraLoi: `Bạn đang tìm hiểu về ${tp.ten}. Đây là trang phục dành cho ${tp.gioiTinh}, thường mặc vào dịp ${tp.dip.join(", ")}. ${tp.suThat[0] || tp.moTaNgan} [nguon: ${tp.nguonIds.join(", ")}]`,
        nguonIds: tp.nguonIds,
      };
    }
  }
  return {
    cauTraLoi: "Chào bạn, Cò Em rất vui được đồng hành cùng bạn tìm hiểu về di sản trang phục truyền thống Việt Nam! Bạn có thể khám phá thêm về Áo dài, Áo ngũ thân, Áo tứ thân, Áo bà ba hoặc chất liệu vải lụa truyền thống nhé. [nguon: bt_phu_nu_vn]",
    nguonIds: ["bt_phu_nu_vn"],
  };
}

export function taoGoiYFallback(moTa: string): GoiYPhanTichBoiCanh {
  const m = moTa.toLowerCase();
  if (m.includes("cưới") || m.includes("hỷ") || m.includes("dâu") || m.includes("rể")) {
    return {
      tongQuan: "Bối cảnh hỷ sự thiêng liêng đòi hỏi phục trang trang nhã, tươi vui mà không lấn át sắc áo cô dâu.",
      trangPhucId: m.includes("huế") ? "ngu_than" : "aodai",
      tenTrangPhuc: m.includes("huế") ? "Áo ngũ thân Cố Đô" : "Áo dài truyền thống",
      lyDo: "Tôn vinh nét đẹp kín đáo, trang trọng và mang đậm không khí lễ nghi gia đình ấm áp.",
      phoiMau: {
        mauChinh: "Hồng phấn hoặc Vàng hoàng yến nhạt",
        mauPhoi: "Trắng ngọc trai hoặc Xanh lam dịu",
        yNghia: "Sắc màu chúc phúc cát tường, dịu dàng và thanh lịch.",
      },
      phuKien: ["Khăn đóng hoặc nón lá thanh nhã", "Kiềng bạc mảnh", "Guốc mộc truyền thống"],
      luuYVanHoa: "Đi dự tiệc cưới nên tránh mặc màu trắng tuyết toàn thân hoặc đỏ tươi rực rỡ lấn át cô dâu.",
      dipTuongUng: ["cuoi"],
      vungTuongUng: m.includes("huế") ? "kh" : "kb",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  if (m.includes("kỷ yếu") || m.includes("tốt nghiệp") || m.includes("trường") || m.includes("học sinh") || m.includes("sinh viên")) {
    return {
      tongQuan: "Bối cảnh kỷ niệm học đường thanh xuân, cần vẻ đẹp tươi tắn, thuần khiết và lưu giữ nụ cười rạng rỡ.",
      trangPhucId: "aodai",
      tenTrangPhuc: "Áo dài nữ sinh / Áo dài thanh xuân",
      lyDo: "Biểu tượng tinh khôi của tuổi học trò, chụp ảnh nhóm hay cá nhân đều tôn dáng và hài hòa không gian trường lớp.",
      phoiMau: {
        mauChinh: "Trắng tinh khôi hoặc Xanh ngọc pastel",
        mauPhoi: "Vàng nhạt hoặc Hồng hoa đào",
        yNghia: "Biểu trưng cho thanh xuân trong trẻo và ước mơ bay cao.",
      },
      phuKien: ["Nón lá sen thêu nhẹ", "Cành hoa sen hồng hoặc cúc họa mi", "Guốc mộc đế thấp"],
      luuYVanHoa: "Nên chọn chất lụa mềm nhẹ để cử động bay bổng tự nhiên khi chụp ảnh kỷ niệm.",
      dipTuongUng: ["ky_yeu", "tot_nghiep"],
      vungTuongUng: "kb",
      phongCachKhuyenNghi: "cach_tan_nhe",
    };
  }
  if (m.includes("bắc bộ") || m.includes("quan họ") || m.includes("hội làng") || m.includes("chùa") || m.includes("đình")) {
    return {
      tongQuan: "Không gian lễ hội đình làng, trẩy hội văn hóa tâm linh miền Bắc cần sự đằm thắm, duyên dáng và cung kính.",
      trangPhucId: "tu_than",
      tenTrangPhuc: "Áo tứ thân Bắc Bộ",
      lyDo: "Dáng áo bốn vạt gắn liền với hội xuân miền Kinh Bắc, mềm mại và rộn ràng sắc màu dân gian.",
      phoiMau: {
        mauChinh: "Nâu sồng hoặc Hồng đào",
        mauPhoi: "Yếm cánh sen hoặc Xanh lục mạ",
        yNghia: "Sự kết hợp đa sắc truyền thống 'mười phần duyên dáng, mười phần nết na'.",
      },
      phuKien: ["Khăn mỏ quạ thắt đuôi gà", "Nón quai thao ba tầm", "Hài cong nhung"],
      luuYVanHoa: "Vạt áo trước có thể buông thả mềm mại hoặc thắt nút nhẹ nhàng trước bụng khi trẩy hội.",
      dipTuongUng: ["le_hoi", "tet"],
      vungTuongUng: "kb",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  if (m.includes("nam bộ") || m.includes("miền tây") || m.includes("sông nước") || m.includes("chợ nổi")) {
    return {
      tongQuan: "Không gian sông nước miệt vườn Nam Bộ cần sự phóng khoáng, chân chất, tiện lợi và gần gũi.",
      trangPhucId: "ba_ba",
      tenTrangPhuc: "Áo bà ba Nam Bộ",
      lyDo: "Thoải mái di chuyển trên ghe xuồng, dạo miệt vườn, toát lên nét duyên mộc mạc phương Nam.",
      phoiMau: {
        mauChinh: "Nâu đất phù sa hoặc Xanh đọt chuối",
        mauPhoi: "Đen tuyền hoặc Trắng khăn rằn",
        yNghia: "Biểu trưng cho cốt cách hào sảng, chân chất và đôn hậu của con người phương Nam.",
      },
      phuKien: ["Khăn rằn caro đen trắng quấn cổ", "Nón lá búp bàng", "Guốc mộc gõ nhịp"],
      luuYVanHoa: "Áo bà ba xẻ tà hai bên hông vừa vặn, kết hợp quần lụa đen rộng thoải mái.",
      dipTuongUng: ["doi_thuong", "le_hoi"],
      vungTuongUng: "kn",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  return {
    tongQuan: "Bối cảnh giao thoa văn hóa vừa trang nhã vừa hiện đại, phù hợp cho nhiều dịp dạo phố và gặp gỡ bạn bè.",
    trangPhucId: "aodai",
    tenTrangPhuc: "Áo dài cách tân thanh nhã",
    lyDo: "Dáng áo dài luôn là biểu tượng hoàn hảo nhất, dễ phối đồ và thích ứng linh hoạt với mọi hoàn cảnh.",
    phoiMau: {
      mauChinh: "Vàng lúa chín hoặc Xanh ngọc bích",
      mauPhoi: "Trắng ngà lụa tơ tằm",
      yNghia: "Mang lại năng lượng tươi mới, thanh lịch và ấm áp.",
    },
    phuKien: ["Nón lá mini hoặc quạt gỗ trầm", "Kiềng bạc trơn", "Túi cói thổ cẩm"],
    luuYVanHoa: "Chọn cổ áo tròn hoặc cổ đứng thấp 2-3cm để tạo cảm giác nhẹ nhàng, dễ chịu.",
    dipTuongUng: ["doi_thuong", "chi_muon_kham_pha"],
    vungTuongUng: "kb",
    phongCachKhuyenNghi: "cach_tan_nhe",
  };
}
