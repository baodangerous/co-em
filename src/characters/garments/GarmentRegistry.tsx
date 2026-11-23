/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ ĐIỀU PHỐI CÁC LỚP TRANG PHỤC (GARMENTS REGISTRY)
 * Kết nối toàn bộ trang phục văn hóa Việt Nam cùng phụ kiện và hoa văn.
 */

import React from "react";
import { SoDoNhanVat, HuongNhin } from "../types";
import { renderAoDaiGarment } from "./AoDaiGarment";
import { renderNguThanGarment } from "./NguThanGarment";
import { renderTuThanGarment } from "./TuThanGarment";
import { renderBaBaGarment } from "./BaBaGarment";
import { renderCoThaiGarment } from "./CoThaiGarment";
import { renderMongGarment } from "./MongGarment";
import { renderEDeGarment } from "./EDeGarment";
import { renderChamGarment } from "./ChamGarment";
import { renderSampotGarment } from "./SampotGarment";
import { renderYemGarment } from "./YemGarment";
import {
  renderAoTacGarment,
  renderAoGiaoLinhGarment,
  renderDaoDoGarment,
  renderTayChamGarment,
  renderMuongVayGarment,
  renderLoLoHoaGarment,
  renderHaNhiGarment,
  renderPaThenGarment,
  renderBaNaGarment,
  renderCoHoGarment,
} from "./EthnicGarmentsExtended";
import { renderHeadwear } from "../accessories/HeadwearRenderer";
import { renderBodyAccessories } from "../accessories/BodyAccessoriesRenderer";
import { renderFootwear } from "../accessories/FootwearRenderer";
import { CroquisBodyType } from "../croquis/BodyPartLayering";
import {
  validateClothingDynamicFit,
  ClothingDynamicFitResult,
} from "../dimensions/clothingDynamicFit";

export {
  validateClothingDynamicFit,
  type ClothingDynamicFitResult,
};

export interface GarmentLayersProps {
  trangPhucId: string;
  soDo: SoDoNhanVat;
  mauHex: string;
  phuKienIds: string[];
  footwearId?: string | null;
  hoaVanThem?: string | null;
  phongCach?: string | null;
  bodyType?: CroquisBodyType;
  huongNhin?: HuongNhin;
}

export interface GarmentLayersResult {
  childrenVayQuan: React.ReactNode;
  childrenAo: React.ReactNode;
  childrenPhuKienThan: React.ReactNode;
  childrenTocTruocKhanNon: React.ReactNode;
  fitAdjustment: ClothingDynamicFitResult;
}

export function renderGarmentLayers({
  trangPhucId,
  soDo,
  mauHex,
  phuKienIds,
  footwearId,
  hoaVanThem,
  bodyType = "adult",
  huongNhin = "truoc",
}: GarmentLayersProps): GarmentLayersResult {
  const fitAdjustment = validateClothingDynamicFit(bodyType, soDo.isMale);

  const patternFill = hoaVanThem ? `url(#hoa-van-${hoaVanThem})` : null;

  const commonProps = {
    soDo,
    mauHex,
    patternFill,
    hasSneaker: false,
    bodyType,
    huongNhin,
  };

  let garmentResult;

  switch (trangPhucId) {
    case "aodai":
    case "ao_dai_lemur":
      garmentResult = renderAoDaiGarment(commonProps);
      break;
    case "ngu_than":
    case "ao_vien_linh":
    case "hoa_suon_xam_gam":
      garmentResult = renderNguThanGarment(commonProps);
      break;
    case "tu_than":
      garmentResult = renderTuThanGarment(commonProps);
      break;
    case "yem_dao":
    case "yem":
      garmentResult = renderYemGarment(commonProps);
      break;
    case "ba_ba":
    case "ao_ba_ba_lanh_my_a":
      garmentResult = renderBaBaGarment(commonProps);
      break;
    case "co_thai":
    case "thai_trang":
    case "thai_le_hoi_xoe":
    case "lao_sinh":
    case "khomu_ao_bac":
    case "lu_ao_canh_buom":
    case "odu_tho_cam_to_tam":
      garmentResult = renderCoThaiGarment(commonProps);
      break;
    case "mong_lanh":
    case "hmong_hoa":
    case "hmong_trang":
    case "hmong_do":
    case "hmong_den":
    case "boy_vay_xoe":
      garmentResult = renderMongGarment(commonProps);
      break;
    case "ede_tho_cam":
    case "ede_le_phuc_ktam":
    case "giarai_tho_cam":
    case "giarai_le_hoi_pothi":
      garmentResult = renderEDeGarment(commonProps);
      break;
    case "champa_tho_cam":
    case "cham_kate":
    case "raglai_tho_cam":
      garmentResult = renderChamGarment(commonProps);
      break;
    case "sampot":
    case "khmer_ao_tam_vong":
      garmentResult = renderSampotGarment(commonProps);
      break;
    case "ao_tac":
    case "ao_nhat_binh":
    case "hoang_bao_nguyen":
    case "phuong_bao_hoang_hau":
    case "ao_menh_phu":
    case "ao_nghi_le_quan_van":
    case "ao_nghi_le_quan_vo":
      garmentResult = renderAoTacGarment(commonProps);
      break;
    case "ao_giao_linh":
    case "ao_doi_kham":
    case "ao_truc_linh":
      garmentResult = renderAoGiaoLinhGarment(commonProps);
      break;
    case "dao_do":
    case "dao_tien":
    case "dao_ao_dai":
    case "dao_quan_trang":
      garmentResult = renderDaoDoGarment(commonProps);
      break;
    case "tay_cham":
    case "tay_ao_luong":
    case "tay_le_cuoi":
    case "nung_cham":
    case "nung_phan_slinh":
    case "san_chay":
    case "giay_ao_vien":
    case "sandiu_vay_la":
    case "lachi_ao_tu_than_cham":
      garmentResult = renderTayChamGarment(commonProps);
      break;
    case "muong_vay":
    case "muong_le_phuc":
      garmentResult = renderMuongVayGarment(commonProps);
      break;
    case "lo_lo_hoa":
    case "lolo_den":
    case "pupeo_ghep_vai_mat_troi":
      garmentResult = renderLoLoHoaGarment(commonProps);
      break;
    case "ha_nhi":
    case "hanhi_hoa":
    case "phula_dinh_cuom_y_di":
      garmentResult = renderHaNhiGarment(commonProps);
      break;
    case "pa_then":
      garmentResult = renderPaThenGarment(commonProps);
      break;
    case "bana_tho_cam":
    case "cotu_tho_cam":
    case "xodang_tho_cam":
    case "bru_van_kieu":
    case "taoi_deng":
    case "hre_lang_teng":
      garmentResult = renderBaNaGarment(commonProps);
      break;
    case "caho_tho_cam":
    case "mnong_tho_cam":
    case "xtieng_bom_bo":
      garmentResult = renderCoHoGarment(commonProps);
      break;
    default:
      garmentResult = renderAoDaiGarment(commonProps);
      break;
  }

  return {
    childrenVayQuan: (
      <>
        {garmentResult.childrenVayQuan}
        {renderFootwear(soDo, phuKienIds, footwearId)}
      </>
    ),
    childrenAo: garmentResult.childrenAo,
    childrenPhuKienThan: renderBodyAccessories(soDo, phuKienIds, bodyType),
    childrenTocTruocKhanNon: renderHeadwear(soDo, phuKienIds, bodyType),
    fitAdjustment,
  };
}
