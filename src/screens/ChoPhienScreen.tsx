/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChoPhienScreen — Trung Tâm Cộng Đồng & Làng Nghề Việt Phục
 * Được tái cấu trúc thành các phân hệ component độc lập trong `src/components/cho-phien/*`:
 * 1. CommunityShowcaseTab: Trưng bày & Bình chọn bản phối từ cộng đồng
 * 2. CraftVillagesTab: Chợ Phiên Làng Nghề & Nghệ Nhân Di Sản
 * 3. WorkshopsCommitmentTab: Hội Làng & Workshop Di Sản kèm Phiếu Cam Kết Tham Dự
 */

import React, { useState } from "react";
import { docBinhChonCuaToi, type LyDoBinhChon } from "../lib/choPhien";
import { useAdminStoreData, useToastNotification } from "../hooks/useAppSync";
import { ToastBanner } from "../components/common/SharedUI";
import CommunityShowcaseTab from "../components/cho-phien/CommunityShowcaseTab";
import CraftVillagesTab from "../components/cho-phien/CraftVillagesTab";
import WorkshopsCommitmentTab from "../components/cho-phien/WorkshopsCommitmentTab";
import AppFooter from "../components/AppFooter";
import {
  ArrowLeft,
  Sparkles,
  Store,
  Calendar,
  Users,
} from "lucide-react";

interface Props {
  onBack: () => void;
  onOpenCostumeDetail?: (trangPhucId: string) => void;
  onOpenStudioWithCostume?: (
    trangPhucId: string,
    mauId?: string,
    phuKienIds?: string[]
  ) => void;
}

type MainTab = "cong_dong" | "lang_nghe" | "workshop";

export default function ChoPhienScreen({
  onBack,
  onOpenStudioWithCostume,
}: Props) {
  const [activeTab, setActiveTab] = useState<MainTab>("cong_dong");
  const [myVotes, setMyVotes] = useState<Record<string, LyDoBinhChon>>(() =>
    docBinhChonCuaToi()
  );
  const { toastMsg, showToast, clearToast } = useToastNotification(3500);
  const {
    settings: projectSettings,
    posts,
    setPosts,
    villages,
    workshops,
  } = useAdminStoreData(false);

  return (
    <main className="min-h-screen bg-[var(--nen-bright)] text-[var(--nen-toi)] pb-14">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* THANH TIÊU ĐỀ & CHUYỂN TAB */}
        <header className="p-4 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-[var(--nen-the-phu)] hover:bg-amber-500/15 border border-[var(--vien-the)] text-[var(--nen-toi)] transition cursor-pointer"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-[var(--nen-toi)] m-0">
                Chợ Phiên Cộng Đồng & Làng Nghề
              </h1>
              <p className="text-xs text-[var(--tro-tram)] m-0">
                Không gian giao lưu bản phối Việt phục, kết nối nghệ nhân làng nghề & đăng ký thực hành thủ công di sản
              </p>
            </div>
          </div>

          {/* 3 TAB CHÍNH TINH GỌN */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("cong_dong")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "cong_dong"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/40"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bản Phối Cộng Đồng</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("lang_nghe")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "lang_nghe"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-amber-500/40"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Làng Nghề Di Sản</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("workshop")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "workshop"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-indigo-500/40"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Workshop Thực Hành</span>
            </button>
          </div>
        </header>

        {projectSettings.announcementBanner && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs font-semibold text-[var(--nen-toi)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{projectSettings.announcementBanner}</span>
          </div>
        )}

        {/* THÔNG BÁO NHANH */}
        <ToastBanner message={toastMsg} onClose={clearToast} />

        {/* 3 PHÂN KHU COMPONENT ĐỘC LẬP */}
        {activeTab === "cong_dong" && (
          <CommunityShowcaseTab
            posts={posts}
            myVotes={myVotes}
            onPostsChange={setPosts}
            onVotesChange={setMyVotes}
            onShowToast={showToast}
            onOpenStudioWithCostume={onOpenStudioWithCostume}
          />
        )}

        {activeTab === "lang_nghe" && (
          <CraftVillagesTab
            villages={villages}
            onShowToast={showToast}
            onOpenStudioWithCostume={onOpenStudioWithCostume}
          />
        )}

        {activeTab === "workshop" && (
          <WorkshopsCommitmentTab
            workshops={workshops}
            onShowToast={showToast}
            onOpenStudioWithCostume={onOpenStudioWithCostume}
          />
        )}
      </div>

      <AppFooter />
    </main>
  );
}
