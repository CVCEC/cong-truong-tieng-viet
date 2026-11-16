/*!
 * cham-cau.js – Đọc tệp noi-dung.txt và chấm câu đọc so với câu mẫu.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC). Dùng trong trình duyệt (window.ChamCau) và trong Node (kiểm thử).
 *
 * Cách chấm (CVCEC tự đặt, chỉ để tham khảo):
 *  - Máy nhận dạng giọng nói viết lại câu các bạn đọc. Mỗi tiếng được tách thành "phần chữ" (không dấu thanh)
 *    và "dấu thanh", nên "hoà" và "hòa" được coi là một.
 *  - So hai dãy tiếng bằng khoảng cách sửa (Levenshtein): đúng cả chữ và dấu → "dung"; đúng chữ, sai dấu → "sai-thanh";
 *    khác chữ → "sai"; máy không nghe thấy → "thieu".
 *  - Điểm = (số tiếng đúng + nửa số tiếng sai thanh) / số tiếng của câu mẫu × 100. Lấy điểm cao nhất trong các cách
 *    máy nghe (maxAlternatives).
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.ChamCau = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- Chuẩn hoá chữ ---------- */
  // Dấu thanh dạng tổ hợp (sau NFD): huyền, sắc, ngã, hỏi, nặng. Giữ lại dấu mũ (̂), dấu trăng (̆), dấu móc (̛).
  var DAU_THANH = { "̀": "huyen", "́": "sac", "̃": "nga", "̉": "hoi", "̣": "nang" };

  function nfc(s) { return String(s == null ? "" : s).normalize("NFC"); }

  /** Tách một tiếng thành { goc: chữ không dấu thanh, thanh: tên thanh }. */
  function tachThanh(tieng) {
    var d = nfc(tieng).toLowerCase().normalize("NFD"), thanh = "ngang", goc = "";
    for (var i = 0; i < d.length; i++) {
      var c = d[i];
      if (DAU_THANH[c]) thanh = DAU_THANH[c]; else goc += c;
    }
    return { goc: goc.normalize("NFC"), thanh: thanh };
  }

  /* ---------- Đổi số ra chữ (máy nhận dạng hay viết "4" thay cho "bốn") ---------- */
  var SO = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  function soRaChu(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0 || n > 999) return null;
    if (n < 10) return SO[n];
    if (n < 20) return "mười" + (n % 10 ? " " + (n % 10 === 5 ? "lăm" : SO[n % 10]) : "");
    if (n < 100) {
      var ch = Math.floor(n / 10), dv = n % 10, s = SO[ch] + " mươi";
      if (dv === 1) s += " mốt"; else if (dv === 4) s += " tư"; else if (dv === 5) s += " lăm"; else if (dv) s += " " + SO[dv];
      return s;
    }
    var tr = Math.floor(n / 100), du = n % 100, kq = SO[tr] + " trăm";
    if (du === 0) return kq;
    if (du < 10) return kq + " linh " + SO[du];
    return kq + " " + soRaChu(du);
  }

  /** Câu → dãy tiếng (chữ thường, bỏ dấu câu, đổi số ra chữ). */
  function tachTieng(cau) {
    // Giữ mọi chữ cái (\p{L}) và chữ số; mọi dấu câu thành khoảng trắng.
    var s = nfc(cau).toLowerCase()
      .replace(/(\d)[.,](\d{3})/g, "$1$2")
      .replace(/\d+/g, function (so) { var c = soRaChu(so); return c ? " " + c + " " : " " + so + " "; })
      .replace(/[^\p{L}\p{N}\s]/gu, " ");
    return s.split(/\s+/).filter(Boolean);
  }

  /* ---------- So câu ---------- */
  /**
   * So câu mẫu với câu máy nghe được.
   * Trả về { diem, tieng: [{ chu, ketQua: "dung"|"sai-thanh"|"sai"|"thieu", nghe }], dung, saiThanh, sai, thieu }.
   */
  function soCau(mau, nghe) {
    var A = tachTieng(mau), B = tachTieng(nghe);
    var a = A.map(tachThanh), b = B.map(tachThanh);
    var n = A.length, m = B.length, i, j;
    var gia = function (x, y) {
      if (x.goc === y.goc) return x.thanh === y.thanh ? 0 : 0.5;
      return 1;
    };
    // Bảng chi phí: thêm tiếng thừa (máy nghe thêm) tốn 0.6 để câu nói chậm, lặp lại vẫn không bị phạt nặng.
    var THUA = 0.6, THIEU = 1;
    var D = [];
    for (i = 0; i <= n; i++) { D.push(new Array(m + 1)); D[i][0] = i * THIEU; }
    for (j = 0; j <= m; j++) D[0][j] = j * THUA;
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        D[i][j] = Math.min(D[i - 1][j - 1] + gia(a[i - 1], b[j - 1]), D[i - 1][j] + THIEU, D[i][j - 1] + THUA);
      }
    }
    // Lần ngược để gắn kết quả cho từng tiếng của câu mẫu.
    var kq = new Array(n);
    i = n; j = m;
    while (i > 0) {
      if (j > 0 && Math.abs(D[i][j] - (D[i - 1][j - 1] + gia(a[i - 1], b[j - 1]))) < 1e-9) {
        var g = gia(a[i - 1], b[j - 1]);
        kq[i - 1] = { chu: A[i - 1], ketQua: g === 0 ? "dung" : (g === 0.5 ? "sai-thanh" : "sai"), nghe: B[j - 1] };
        i--; j--;
      } else if (Math.abs(D[i][j] - (D[i - 1][j] + THIEU)) < 1e-9) {
        kq[i - 1] = { chu: A[i - 1], ketQua: "thieu", nghe: "" };
        i--;
      } else {
        j--;
      }
    }
    var dem = { dung: 0, "sai-thanh": 0, sai: 0, thieu: 0 };
    kq.forEach(function (t) { dem[t.ketQua]++; });
    var diem = n ? Math.round((dem.dung + 0.5 * dem["sai-thanh"]) / n * 100) : 0;
    return { diem: diem, tieng: kq, dung: dem.dung, saiThanh: dem["sai-thanh"], sai: dem.sai, thieu: dem.thieu, nghe: nfc(nghe) };
  }

  /** Chấm với nhiều cách máy nghe; lấy cách cho điểm cao nhất. */
  function chamTotNhat(mau, dsNghe) {
    var tot = null;
    (dsNghe || []).forEach(function (s) {
      if (!s || !String(s).trim()) return;
      var r = soCau(mau, s);
      if (!tot || r.diem > tot.diem) tot = r;
    });
    return tot || soCau(mau, "");
  }

  function mucDiem(d) { return d >= 85 ? "tot" : (d >= 60 ? "gan-dung" : "can-luyen"); }

  /* ---------- Mã của từng câu (để gắn tệp giọng Elio) ---------- */
  // FNV-1a 32 bit trên chữ đã chuẩn hoá NFC. Sửa chữ của câu → mã đổi → câu cần tạo lại giọng.
  function maCau(chu) {
    var s = nfc(chu).trim().replace(/\s+/g, " "), h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul ? Math.imul(h, 0x01000193) : (h * 0x01000193) | 0;
    }
    return ("0000000" + (h >>> 0).toString(16)).slice(-8);
  }

  /* ---------- Đọc noi-dung.txt ---------- */
  function boDau(s) { return nfc(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D"); }
  function khoaDong(k) { return boDau(k).toUpperCase().replace(/\s+/g, " ").trim(); }
  var LOAI = {
    "CHU DE": "chuDe", "ANH": "anh", "TU": "tu", "CAU": "cau", "HOI THOAI": "hoiThoai",
    "TRAU CON": "trau", "BAN": "ban", "EM": "ban"
  };
  function tenFileAn(chu) {
    return boDau(chu).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "chu-de";
  }

  /**
   * Đọc nội dung. Trả về { chuDe: [...], loi: [{ dong, noiDung, lyDo }] }.
   * Mỗi chủ đề: { id, ten, tenEn, anh, tu: [muc], cau: [muc], hoiThoai: [{ ten, tenEn, luot: [{ ai: "trau"|"ban", chu, en, ma }] }] }.
   * Mỗi mục: { chu, en, ma }.
   */
  function docNoiDung(van) {
    var dongs = nfc(van).replace(/^﻿/, "").split(/\r?\n/);
    var ds = [], loi = [], cd = null, ht = null, daCoId = {};
    function muc(phan) {
      var p = phan.split("|");
      var chu = p[0].trim().replace(/\s+/g, " "), en = (p.slice(1).join("|") || "").trim();
      return { chu: chu, en: en, ma: maCau(chu) };
    }
    for (var i = 0; i < dongs.length; i++) {
      var d = dongs[i].trim();
      if (!d || d.charAt(0) === "#") continue;
      var hai = d.indexOf(":");
      var loai = hai > 0 ? LOAI[khoaDong(d.slice(0, hai))] : null;
      var phan = hai > 0 ? d.slice(hai + 1).trim() : "";
      if (!loai) { loi.push({ dong: i + 1, noiDung: d, lyDo: "khong-hieu" }); continue; }
      if (loai === "chuDe") {
        var m = muc(phan);
        var id = tenFileAn(m.chu), k = 2;
        while (daCoId[id]) id = tenFileAn(m.chu) + "-" + (k++);
        daCoId[id] = true;
        cd = { id: id, ten: m.chu, tenEn: m.en, anh: "", tu: [], cau: [], hoiThoai: [] };
        ht = null;
        ds.push(cd);
        continue;
      }
      if (!cd) { loi.push({ dong: i + 1, noiDung: d, lyDo: "chua-co-chu-de" }); continue; }
      if (!phan) { loi.push({ dong: i + 1, noiDung: d, lyDo: "trong" }); continue; }
      if (loai === "anh") { cd.anh = phan.replace(/[^a-zA-Z0-9._-]/g, ""); continue; }
      if (loai === "tu") { cd.tu.push(muc(phan)); continue; }
      if (loai === "cau") { cd.cau.push(muc(phan)); continue; }
      if (loai === "hoiThoai") { var mh = muc(phan); ht = { ten: mh.chu, tenEn: mh.en, luot: [] }; cd.hoiThoai.push(ht); continue; }
      if (loai === "trau" || loai === "ban") {
        if (!ht) { ht = { ten: cd.ten, tenEn: cd.tenEn, luot: [] }; cd.hoiThoai.push(ht); }
        var ml = muc(phan); ml.ai = loai;
        ht.luot.push(ml);
      }
    }
    return { chuDe: ds, loi: loi };
  }

  /** Mọi câu cần giọng mẫu (để studio tạo giọng Elio), không trùng. */
  function tatCaCau(nd) {
    var ra = [], co = {};
    nd.chuDe.forEach(function (cd) {
      function them(m, loai) { if (!co[m.ma]) { co[m.ma] = true; ra.push({ ma: m.ma, chu: m.chu, chuDe: cd.id, loai: loai }); } }
      cd.tu.forEach(function (m) { them(m, "tu"); });
      cd.cau.forEach(function (m) { them(m, "cau"); });
      cd.hoiThoai.forEach(function (h) { h.luot.forEach(function (l) { them(l, l.ai); }); });
    });
    return ra;
  }

  return {
    tachThanh: tachThanh, tachTieng: tachTieng, soRaChu: soRaChu, soCau: soCau, chamTotNhat: chamTotNhat,
    mucDiem: mucDiem, maCau: maCau, docNoiDung: docNoiDung, tatCaCau: tatCaCau
  };
});
