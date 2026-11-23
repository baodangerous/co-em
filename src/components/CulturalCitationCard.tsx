/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * THẺ TÓM TẮT VĂN HÓA & NGUỒN KHẢO CỨU (CULTURAL CITATION CARD)
 * - Tinh gọn: Chỉ giữ thông tin lịch sử cốt lõi và liên kết nguồn khảo cứu ngắn gọn
 * - Đồng bộ hệ thống 3 cỡ chữ (text-lg, text-sm, text-xs) & 3 kiểu chữ
 */

import React, { useState } from "react";
import { BookOpen, ShieldCheck, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { TrangPhuc } from "../types";
import { nguon } from "../data/nguon";

interface Props {
  trangPhuc: TrangPhuc;
  className?: string;
  onOpenFullStory?: () => void;
}

const CONCISE_SCHOLARLY_CITATIONS: Record<
  string,
  {
    thoiKy: string;
    ghiChepCotLoi: string;
  }
> = {
  aodai: {
    thoiKy: "1744 · Thập niên 1930",
    ghiChepCotLoi: "Khởi nguồn từ áo ngũ thân lập lĩnh (1744), được họa sĩ Cát Tường và Lê Phổ cách tân thập niên 1930.",
  },
  ngu_than: {
    thoiKy: "1744 · Minh Mạng 1837",
    ghiChepCotLoi: "Quy định trong Khâm Định Đại Nam Hội Điển Sự Lệ: 5 thân vải, cổ đứng, cài 5 khuy bên phải.",
  },
  tu_than: {
    thoiKy: "Thế kỷ XVII – XX",
    ghiChepCotLoi: "Y phục nữ giới Bắc Bộ gồm 4 thân vải, mặc cùng yếm đào, khăn mỏ quạ và nón quai thao.",
  },
  ba_ba: {
    thoiKy: "Cuối thế kỷ XIX",
    ghiChepCotLoi: "Áo ngắn không cổ, xẻ tà hai bên hông, gắn liền với lụa lãnh Mỹ A và khăn rằn Nam Bộ.",
  },
  co_thai: {
    thoiKy: "Di sản Tây Bắc",
    ghiChepCotLoi: "Áo ngắn ôm sát đính hai hàng khuy bướm bạc (Mák pém), phối cùng váy đen và khăn Piêu.",
  },
  mong_lanh: {
    thoiKy: "Di sản phi vật thể QG",
    ghiChepCotLoi: "Dệt từ sợi vỏ cây lanh, vẽ hoa văn bằng sáp ong nóng chảy và nhuộm chàm nhiều lần.",
  },
  ede_tho_cam: {
    thoiKy: "Tây Nguyên",
    ghiChepCotLoi: "Thổ cẩm nền chàm đen dệt kỹ thuật Kteh luồn sợi nổi hoa văn đỏ, vàng.",
  },
  champa_tho_cam: {
    thoiKy: "Làng nghề Mỹ Nghiệp",
    ghiChepCotLoi: "Áo dài Aw Tah kết hợp dải khăn thổ cẩm Talei Ka-in vắt chéo ngực.",
  },
  sampot: {
    thoiKy: "Văn hóa Khmer Nam Bộ",
    ghiChepCotLoi: "Váy quấn Sampot dệt tơ ánh kim phối cùng khăn Sbai vắt chéo vai dịp lễ hội.",
  },
  ao_tac: {
    thoiKy: "Thế kỷ XVIII – XX",
    ghiChepCotLoi: "Lễ phục ngũ thân tay thụng rộng khoảng 1 tấc, dùng trong đại lễ và hôn lễ.",
  },
  ao_giao_linh: {
    thoiKy: "Thế kỷ XI – XVIII",
    ghiChepCotLoi: "Cổ phục vạt chéo giao nhau trước ngực, phổ biến thời Lý – Trần – Lê.",
  },
  dao_do: {
    thoiKy: "Việt Bắc – Tây Bắc",
    ghiChepCotLoi: "Áo chàm thêu hoa văn chữ Vạn, cây thông bằng chỉ đỏ trên mặt trái vải.",
  },
  tay_cham: {
    thoiKy: "Việt Bắc",
    ghiChepCotLoi: "Áo năm thân vải bông tự dệt nhuộm lá chàm tự nhiên, cài khuy đồng bên nách phải.",
  },
  muong_vay: {
    thoiKy: "Hòa Bình – Thanh Hóa",
    ghiChepCotLoi: "Điểm nhấn là cạp váy 3 phần (rang trên, rang dưới, cáol) dệt nổi hoa văn Đông Sơn.",
  },
  lo_lo_hoa: {
    thoiKy: "Cao nguyên đá Hà Giang",
    ghiChepCotLoi: "Ghép thủ công hàng trăm mảnh vải tam giác màu thành họa tiết mặt trời và chim Tước.",
  },
  ha_nhi: {
    thoiKy: "Biên giới Tây Bắc",
    ghiChepCotLoi: "Áo chàm kép hai lớp giữ ấm, viền vải màu răng cưa và đính hàng xu bạc.",
  },
  pa_then: {
    thoiKy: "Hà Giang – Tuyên Quang",
    ghiChepCotLoi: "Lễ phục sắc đỏ rực chủ đạo gắn với tín ngưỡng thần Lửa, kết hợp vành khăn xếp tầng.",
  },
  bana_tho_cam: {
    thoiKy: "Bắc Tây Nguyên",
    ghiChepCotLoi: "Thổ cẩm đối xứng 3 gam màu gốc: đen (đất), đỏ (lửa/mặt trời), trắng (bầu trời).",
  },
  caho_tho_cam: {
    thoiKy: "Cao nguyên Lâm Viên",
    ghiChepCotLoi: "Nền vải bông trắng ngà hoặc chàm dệt hoa văn hình thoi, mắt võng.",
  },
};

export default function CulturalCitationCard({
  trangPhuc,
  className = "",
  onOpenFullStory,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const info = CONCISE_SCHOLARLY_CITATIONS[trangPhuc.id] || {
    thoiKy: "Di sản Việt Nam",
    ghiChepCotLoi: trangPhuc.moTaNgan,
  };

  const linkedSources = (trangPhuc.nguonIds || [])
    .map((id) => nguon.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  return (
    <div
      className={`p-3 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sử liệu cốt lõi</span>
            </span>
            <span className="text-xs text-[var(--tro-tram)]">
              {info.thoiKy}
            </span>
          </div>

          <p className="text-sm text-[var(--nen-toi)] m-0">
            {info.ghiChepCotLoi}
          </p>

          {/* Liên kết nguồn ngắn gọn hiển thị ngay */}
          {linkedSources.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-[var(--tro-tram)]">Nguồn:</span>
              {linkedSources.map((src) => (
                <a
                  key={src.id}
                  href={src.url || "#"}
                  target={src.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-emerald-500 text-xs font-semibold text-emerald-700 dark:text-emerald-400 no-underline"
                  title={src.chuThich}
                >
                  <span>{src.ten}</span>
                  {src.url && <ExternalLink className="w-3 h-3 shrink-0" />}
                </a>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl border border-[var(--vien-the)] hover:border-amber-500 bg-[var(--nen-the-phu)] text-[var(--nen-toi)] transition cursor-pointer shrink-0"
          title={isExpanded ? "Thu gọn" : "Chi tiết nguồn khảo cứu"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-[var(--vien-the)] space-y-2">
          {trangPhuc.suThat[1] && (
            <p className="text-xs text-[var(--tro-tram)] m-0 flex items-start gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{trangPhuc.suThat[1]}</span>
            </p>
          )}

          {linkedSources.map((src) =>
            src.chuThich ? (
              <div key={src.id} className="text-xs text-[var(--tro-tram)]">
                <span className="font-semibold text-[var(--nen-toi)]">{src.ten}: </span>
                <span>{src.chuThich}</span>
              </div>
            ) : null
          )}

          {onOpenFullStory && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onOpenFullStory}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Mở thẻ tra cứu</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
