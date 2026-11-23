/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArtifactVisualId, DoVatVanHoa } from "../../lib/soiChiChung";
import { Nguon } from "../../types";
import { ExternalLink, BookOpen } from "lucide-react";

/**
 * Minh họa SVG trực quan cho ĐỒ VẬT / HIỆN VẬT VĂN HÓA ĐẶC TRƯNG
 */
export function CulturalArtifactSVG({
  artifactId,
  className = "w-20 h-20",
}: {
  artifactId: ArtifactVisualId;
  className?: string;
}) {
  switch (artifactId) {
    case "khung_cui":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Khung dệt và con thoi">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <line x1="24" y1="18" x2="24" y2="82" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <line x1="76" y1="18" x2="76" y2="82" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="26" x2="80" y2="26" stroke="#92400E" strokeWidth="3.5" />
          <line x1="20" y1="74" x2="80" y2="74" stroke="#92400E" strokeWidth="3.5" />
          {[32, 38, 44, 50, 56, 62, 68].map((x) => (
            <line key={x} x1={x} y1="26" x2={x} y2="74" stroke="#B45309" strokeWidth="1.2" opacity="0.6" />
          ))}
          <rect x="28" y="34" width="44" height="10" fill="#DC2626" rx="1" />
          <path d="M 30 39 L 36 35 L 42 39 L 48 35 L 54 39 L 60 35 L 66 39 L 70 36" fill="none" stroke="#FDE047" strokeWidth="1.8" />
          <rect x="28" y="46" width="44" height="8" fill="#1E3A8A" rx="1" />
          <path d="M 18 60 Q 50 52 82 60 Q 50 68 18 60 Z" fill="#92400E" stroke="#F59E0B" strokeWidth="1.5" />
          <ellipse cx="50" cy="60" rx="12" ry="2.5" fill="#FDE047" />
        </svg>
      );

    case "but_sap_ong":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Bút đồng vẽ sáp ong và chậu chàm">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
          <rect x="18" y="46" width="46" height="34" rx="4" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
          <circle cx="32" cy="63" r="7" fill="none" stroke="#F8FAFC" strokeWidth="1.6" strokeDasharray="3,1.5" />
          <circle cx="50" cy="63" r="7" fill="none" stroke="#F8FAFC" strokeWidth="1.6" strokeDasharray="3,1.5" />
          <path d="M 62 66 Q 62 80 74 80 Q 86 80 86 66 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="74" cy="66" rx="12" ry="3.5" fill="#FBBF24" />
          <line x1="78" y1="18" x2="46" y2="50" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
          <polygon points="46,50 38,56 43,45" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
        </svg>
      );

    case "cuc_buom_bac":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Hàng cúc bướm bạc Mák Pém">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <line x1="50" y1="14" x2="50" y2="86" stroke="#0F172A" strokeWidth="4" />
          {[28, 50, 72].map((y) => (
            <g key={y}>
              <path
                d={`M 50 ${y} L 26 ${y - 9} L 22 ${y} L 26 ${y + 9} Z`}
                fill="#E2E8F0"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <path
                d={`M 50 ${y} L 74 ${y - 9} L 78 ${y} L 74 ${y + 9} Z`}
                fill="#E2E8F0"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <circle cx="34" cy={y} r="2.2" fill="#94A3B8" />
              <circle cx="66" cy={y} r="2.2" fill="#94A3B8" />
              <circle cx="50" cy={y} r="3" fill="#F59E0B" />
            </g>
          ))}
        </svg>
      );

    case "cap_vay_dong_son":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Cạp váy thổ cẩm Đông Sơn">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#FEFCE8" stroke="#CA8A04" strokeWidth="1.5" />
          <rect x="16" y="22" width="68" height="16" fill="#991B1B" rx="2" />
          <rect x="16" y="40" width="68" height="22" fill="#1E293B" rx="2" />
          <rect x="16" y="64" width="68" height="14" fill="#B45309" rx="2" />
          <circle cx="50" cy="51" r="6" fill="#FACC15" />
          <polygon points="32,45 37,51 32,57 27,51" fill="#F87171" />
          <polygon points="68,45 73,51 68,57 63,51" fill="#F87171" />
          <path d="M 18 30 L 82 30" stroke="#FDE047" strokeWidth="2" strokeDasharray="4,3" />
          <path d="M 18 71 L 82 71" stroke="#FEF08A" strokeWidth="2" strokeDasharray="3,3" />
        </svg>
      );

    case "kieng_bac_cham":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Kiềng bạc và chuông bạc chạm khắc">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          <path
            d="M 26 42 A 24 22 0 1 0 74 42"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 31 43 A 19 17 0 1 0 69 43"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line x1="38" y1="62" x2="36" y2="75" stroke="#64748B" strokeWidth="1.8" />
          <line x1="50" y1="64" x2="50" y2="78" stroke="#64748B" strokeWidth="1.8" />
          <line x1="62" y1="62" x2="64" y2="75" stroke="#64748B" strokeWidth="1.8" />
          <circle cx="36" cy="78" r="4.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
          <circle cx="50" cy="81" r="5" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="64" cy="78" r="4.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
        </svg>
      );

    case "khuy_ngu_than":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Năm hạt khuy đồng và khánh ngọc">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M 36 22 L 50 32 L 66 42 L 66 82" fill="none" stroke="#854D0E" strokeWidth="3" />
          {[
            [50, 32],
            [58, 37],
            [66, 44],
            [66, 58],
            [66, 72],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="4" fill="#FACC15" stroke="#92400E" strokeWidth="1.5" />
          ))}
          <polygon points="34,54 44,48 54,54 44,64" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <line x1="44" y1="64" x2="44" y2="78" stroke="#DC2626" strokeWidth="2.5" />
        </svg>
      );

    case "khan_van_non":
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Nón lá và khăn truyền thống">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
          <polygon points="50,20 16,58 84,58" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          <line x1="50" y1="20" x2="36" y2="58" stroke="#D97706" strokeWidth="1" opacity="0.6" />
          <line x1="50" y1="20" x2="64" y2="58" stroke="#D97706" strokeWidth="1" opacity="0.6" />
          <path d="M 30 58 Q 50 84 70 58" fill="none" stroke="#DC2626" strokeWidth="2.5" />
        </svg>
      );
  }
}

/**
 * Hiển thị khối Đồ vật văn hóa + chú thích ngắn gọn
 */
export function ArtifactHighlightBox({ doVat }: { doVat: DoVatVanHoa }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-300/60 dark:border-amber-500/30">
      <div className="shrink-0">
        <CulturalArtifactSVG artifactId={doVat.id} className="w-14 h-14 sm:w-16 sm:h-16" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
          🏺 Hiện vật / Đồ vật đặc trưng
        </div>
        <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
          {doVat.ten}
        </div>
        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
          <span className="font-semibold">Chất liệu:</span> {doVat.chatLieu}
        </div>
      </div>
    </div>
  );
}

/**
 * Hiển thị danh sách Link tham khảo có chú thích rõ ràng
 */
export function AnnotatedReferenceLinks({ sources }: { sources: Nguon[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/80 space-y-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
        <BookOpen className="w-3 h-3" />
        <span>Link tham khảo & Khảo cứu có chú thích:</span>
      </div>
      <div className="space-y-1.5">
        {sources.map((src) => (
          <div
            key={src.id}
            className="p-2 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/80 text-left"
          >
            {src.url ? (
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 leading-snug"
              >
                <span>{src.ten}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {src.ten}
              </span>
            )}
            {src.chuThich && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mt-0.5 leading-snug">
                {src.chuThich}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
