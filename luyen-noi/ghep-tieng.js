/*!
 * ghep-tieng.js – Bộ ghép âm đầu + vần + âm cuối, tự viết đúng chính tả tiếng Việt.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC). Dùng trong trình duyệt (window.GhepTieng) và trong Node (kiểm thử).
 * Nguồn quy tắc: Bộ Giáo dục và Đào tạo (2018), Quyết định số 1989/QĐ-BGDĐT ban hành Quy định về chính tả
 * tiếng Việt và thuật ngữ tiếng Việt trong sách giáo khoa giáo dục phổ thông (dấu thanh đặt trên âm chính),
 * cùng quy tắc chính tả c/k/q, g/gh, ng/ngh dạy trong sách Tiếng Việt lớp 1.
 *
 * Quy tắc chính tả được xử lý:
 *  - c / k / q: "k" trước e, ê, i (iê); "qu" khi có âm đệm; còn lại "c".
 *  - g / gh, ng / ngh: "gh", "ngh" trước e, ê, i (iê).
 *  - gi: "gi" + i → "gi" (gì); "gi" + iê → "giê" (giếng).
 *  - Âm đệm o / u: viết "o" trước a, ă, e (hoa, xoăn, khoẻ); viết "u" trước â, ê, y (tuân, huế, thuỷ) và luôn viết "u" sau q (qua, que, quy).
 *  - i / y: đứng một mình không có âm đầu, âm cuối → "y" (y, ý); sau âm đệm u → "y" (uy, quy); còn lại "i".
 *  - Nguyên âm đôi: iê / ia / yê, uô / ua, ươ / ưa (không có âm cuối viết ia, ua, ưa; không có âm đầu viết yê).
 *  - Âm cuối: ch, nh chỉ sau a, ê, i (và oa, uê, uy); c, ng không đứng sau ê, i.
 *  - Dấu thanh đặt trên âm chính (hoà, khoẻ, thuỷ, mía, múa, mưa, tiếng, muốn, người).
 *  - Tiếng tắc (âm cuối p, t, c, ch) chỉ mang thanh sắc hoặc thanh nặng.
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.GhepTieng = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Âm đầu: ma = mã dùng trong máy, nhan = chữ hiện trên nút
  var AM_DAU = [
    { ma: "", nhan: "–" }, { ma: "b", nhan: "b" }, { ma: "c", nhan: "c / k / q" }, { ma: "ch", nhan: "ch" },
    { ma: "d", nhan: "d" }, { ma: "đ", nhan: "đ" }, { ma: "g", nhan: "g / gh" }, { ma: "gi", nhan: "gi" },
    { ma: "h", nhan: "h" }, { ma: "kh", nhan: "kh" }, { ma: "l", nhan: "l" }, { ma: "m", nhan: "m" },
    { ma: "n", nhan: "n" }, { ma: "ng", nhan: "ng / ngh" }, { ma: "nh", nhan: "nh" }, { ma: "ph", nhan: "ph" },
    { ma: "r", nhan: "r" }, { ma: "s", nhan: "s" }, { ma: "t", nhan: "t" }, { ma: "th", nhan: "th" },
    { ma: "tr", nhan: "tr" }, { ma: "v", nhan: "v" }, { ma: "x", nhan: "x" }
  ];

  // Vần (âm đệm + âm chính). dem: có âm đệm; chinh: âm chính; cuoi: các âm cuối ghép được ("" = không có);
  // canCuoi: bắt buộc có âm cuối.
  var VAN = [
    { ma: "a",   nhan: "a",   chinh: "a",  cuoi: ["", "i", "y", "o", "u", "c", "ch", "m", "n", "ng", "nh", "p", "t"] },
    { ma: "ă",   nhan: "ă",   chinh: "ă",  cuoi: ["c", "m", "n", "ng", "p", "t"], canCuoi: true },
    { ma: "â",   nhan: "â",   chinh: "â",  cuoi: ["y", "u", "c", "m", "n", "ng", "p", "t"], canCuoi: true },
    { ma: "e",   nhan: "e",   chinh: "e",  cuoi: ["", "o", "c", "m", "n", "ng", "p", "t"] },
    { ma: "ê",   nhan: "ê",   chinh: "ê",  cuoi: ["", "u", "ch", "m", "n", "nh", "p", "t"] },
    { ma: "i",   nhan: "i / y", chinh: "i", cuoi: ["", "u", "ch", "m", "n", "nh", "p", "t"] },
    { ma: "o",   nhan: "o",   chinh: "o",  cuoi: ["", "i", "c", "m", "n", "ng", "p", "t"] },
    { ma: "ô",   nhan: "ô",   chinh: "ô",  cuoi: ["", "i", "c", "m", "n", "ng", "p", "t"] },
    { ma: "ơ",   nhan: "ơ",   chinh: "ơ",  cuoi: ["", "i", "m", "n", "p", "t"] },
    { ma: "u",   nhan: "u",   chinh: "u",  cuoi: ["", "i", "c", "m", "n", "ng", "p", "t"] },
    { ma: "ư",   nhan: "ư",   chinh: "ư",  cuoi: ["", "i", "u", "c", "ng", "t"] },
    { ma: "iê",  nhan: "iê / ia", chinh: "iê", cuoi: ["", "u", "c", "m", "n", "ng", "p", "t"] },
    { ma: "uô",  nhan: "uô / ua", chinh: "uô", cuoi: ["", "i", "c", "m", "n", "ng", "t"] },
    { ma: "ươ",  nhan: "ươ / ưa", chinh: "ươ", cuoi: ["", "i", "u", "c", "m", "n", "ng", "p", "t"] },
    { ma: "oa",  nhan: "oa",  dem: true, chinh: "a",  cuoi: ["", "i", "y", "c", "ch", "m", "n", "ng", "nh", "t"] },
    { ma: "oă",  nhan: "oă",  dem: true, chinh: "ă",  cuoi: ["c", "m", "n", "ng", "t"], canCuoi: true },
    { ma: "oe",  nhan: "oe",  dem: true, chinh: "e",  cuoi: ["", "o", "n", "t"] },
    { ma: "uâ",  nhan: "uâ",  dem: true, chinh: "â",  cuoi: ["y", "n", "ng", "t"], canCuoi: true },
    { ma: "uê",  nhan: "uê",  dem: true, chinh: "ê",  cuoi: ["", "ch", "nh"] },
    { ma: "uy",  nhan: "uy",  dem: true, chinh: "i",  cuoi: ["", "u", "ch", "n", "nh", "p", "t"] },
    { ma: "uyê", nhan: "uyê / uya", dem: true, chinh: "iê", cuoi: ["", "n", "t"] }
  ];

  var AM_CUOI = [
    { ma: "", nhan: "–" }, { ma: "c", nhan: "c" }, { ma: "ch", nhan: "ch" }, { ma: "m", nhan: "m" },
    { ma: "n", nhan: "n" }, { ma: "ng", nhan: "ng" }, { ma: "nh", nhan: "nh" }, { ma: "p", nhan: "p" },
    { ma: "t", nhan: "t" }, { ma: "i", nhan: "i" }, { ma: "y", nhan: "y" }, { ma: "o", nhan: "o" }, { ma: "u", nhan: "u" }
  ];

  var THANH = ["ngang", "huyen", "nga", "hoi", "sac", "nang"]; // thứ tự hiện thẻ
  var DAU_THANH = { ngang: "", huyen: "̀", sac: "́", hoi: "̉", nga: "̃", nang: "̣" };
  var CUOI_TAC = { c: 1, ch: 1, p: 1, t: 1 };
  var DAU_MOI = { b: 1, m: 1, ph: 1, v: 1, gi: 1 }; // âm đầu không đi với âm đệm

  function timVan(ma) { for (var i = 0; i < VAN.length; i++) if (VAN[i].ma === ma) return VAN[i]; return null; }
  function laTac(cuoi) { return !!CUOI_TAC[cuoi]; }

  // Kiểm tra một bộ ghép; trả "" nếu hợp lệ, hoặc lý do (mã) nếu không.
  function lyDoKhongGhep(dau, van, cuoi) {
    var v = timVan(van);
    if (!v) return "van";
    if (v.cuoi.indexOf(cuoi) < 0) return v.canCuoi && cuoi === "" ? "can-cuoi" : "cuoi";
    if (v.dem && DAU_MOI[dau]) return "dem";
    if (dau === "gi") {
      if (v.chinh === "iê" && cuoi === "") return "gi-ia"; // "gia" là gi + a
    }
    return "";
  }
  function hopLe(dau, van, cuoi) { return lyDoKhongGhep(dau, van, cuoi) === ""; }

  // Viết âm chính; tra ve {chu, viTriDau} – viTriDau là vị trí (trong chu) nhận dấu thanh.
  function vietChinh(v, dau, cuoi) {
    var mo = cuoi === "";
    switch (v.chinh) {
      case "i":
        if (v.dem) return { chu: "y", dau: 0 };
        if (dau === "" && mo) return { chu: "y", dau: 0 };
        if (dau === "gi") return { chu: "", dau: -1 }; // gi + i → "gi", dấu đặt trên i của "gi"
        return { chu: "i", dau: 0 };
      case "iê":
        if (v.dem) return mo ? { chu: "ya", dau: 0 } : { chu: "yê", dau: 1 };
        if (dau === "gi") return { chu: "ê", dau: 0 };
        if (mo) return { chu: "ia", dau: 0 };
        if (dau === "") return { chu: "yê", dau: 1 };
        return { chu: "iê", dau: 1 };
      case "uô": return mo ? { chu: "ua", dau: 0 } : { chu: "uô", dau: 1 };
      case "ươ": return mo ? { chu: "ưa", dau: 0 } : { chu: "ươ", dau: 1 };
      default: return { chu: v.chinh, dau: 0 };
    }
  }

  function datDau(ch, thanh) { return (ch + DAU_THANH[thanh]).normalize("NFC"); }

  /** Ghép một tiếng. Trả { chu, hopLe, tac, lyDo } – chu đã có dấu thanh (NFC). */
  function ghep(dau, van, cuoi, thanh) {
    thanh = thanh || "ngang";
    var lyDo = lyDoKhongGhep(dau, van, cuoi);
    if (lyDo) return { chu: "", hopLe: false, tac: laTac(cuoi), lyDo: lyDo };
    var v = timVan(van);
    var chinh = vietChinh(v, dau, cuoi);
    var dauChinhChu = chinh.chu.charAt(0) || "";
    var truocTrongE = /^[eêiy]/.test(dauChinhChu) && !v.dem; // e, ê, i, iê, yê đứng ngay sau âm đầu

    // Âm đầu
    var vietDau = dau;
    if (dau === "c") vietDau = v.dem ? "q" : (truocTrongE ? "k" : "c");
    else if (dau === "g") vietDau = truocTrongE ? "gh" : "g";
    else if (dau === "ng") vietDau = truocTrongE ? "ngh" : "ng";

    // Âm đệm: sau q luôn là u; còn lại o trước a, ă, e và u trước â, ê, i/y.
    var vietDem = "";
    if (v.dem) vietDem = (dau === "c" || /^[âêiy]/.test(chinh.chu)) ? "u" : "o";

    // Âm cuối: giữ nguyên chữ người chọn (đã kiểm tra hợp lệ ở trên).
    var vietCuoi = cuoi;

    // Đặt dấu thanh
    var chinhCoDau = chinh.chu;
    var dauCoDau = vietDau;
    if (thanh !== "ngang") {
      if (chinh.dau >= 0 && chinh.chu) {
        var cs = Array.from(chinh.chu);
        cs[chinh.dau] = datDau(cs[chinh.dau], thanh);
        chinhCoDau = cs.join("");
      } else if (dau === "gi") { // gì, gỉ…
        dauCoDau = "g" + datDau("i", thanh);
      }
    }
    var chu = (dauCoDau + vietDem + chinhCoDau + vietCuoi).normalize("NFC");
    var tac = laTac(cuoi);
    if (tac && thanh !== "sac" && thanh !== "nang") return { chu: chu, hopLe: false, tac: true, lyDo: "tac" };
    return { chu: chu, hopLe: true, tac: tac, lyDo: "" };
  }

  /** Các thanh dùng được cho một bộ ghép: tiếng tắc chỉ có sắc và nặng. */
  function thanhDung(cuoi) { return laTac(cuoi) ? ["sac", "nang"] : THANH.slice(); }

  /** Tiếng gợi ý lấy từ các bài đầu (Bài 1–10): chu là cách viết trong bài, kèm cách ghép. */
  var GOI_Y = [
    { chu: "ta", dau: "t", van: "a", cuoi: "", thanh: "ngang" },
    { chu: "ma", dau: "m", van: "a", cuoi: "", thanh: "ngang" },
    { chu: "ba", dau: "b", van: "a", cuoi: "", thanh: "ngang" },
    { chu: "mẹ", dau: "m", van: "e", cuoi: "", thanh: "nang" },
    { chu: "cô", dau: "c", van: "ô", cuoi: "", thanh: "ngang" },
    { chu: "học", dau: "h", van: "o", cuoi: "c", thanh: "nang" },
    { chu: "bố", dau: "b", van: "ô", cuoi: "", thanh: "sac" },
    { chu: "bé", dau: "b", van: "e", cuoi: "", thanh: "sac" },
    { chu: "gà", dau: "g", van: "a", cuoi: "", thanh: "huyen" },
    { chu: "nhà", dau: "nh", van: "a", cuoi: "", thanh: "huyen" },
    { chu: "lá", dau: "l", van: "a", cuoi: "", thanh: "sac" },
    { chu: "sách", dau: "s", van: "a", cuoi: "ch", thanh: "sac" }
  ];

  return {
    AM_DAU: AM_DAU, VAN: VAN, AM_CUOI: AM_CUOI, THANH: THANH, GOI_Y: GOI_Y,
    ghep: ghep, hopLe: hopLe, lyDoKhongGhep: lyDoKhongGhep, laTac: laTac, thanhDung: thanhDung
  };
});
