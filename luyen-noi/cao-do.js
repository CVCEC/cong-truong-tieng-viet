/*!
 * cao-do.js – Dò cao độ và so thanh điệu cho trang Luyện nói – Luyện thanh điệu.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC). Chạy hoàn toàn trên máy: không gửi âm thanh đi đâu.
 * Dùng được trong trình duyệt (window.CaoDo) và trong Node (require) để chạy bài kiểm thử.
 *
 * Gồm:
 *  - giamMau: hạ tần số lấy mẫu về ~16 kHz (lọc trung bình rồi lấy cách quãng).
 *  - yin: dò tần số cơ bản (F0) của một khung theo thuật toán YIN
 *    (de Cheveigné & Kawahara 2002, "YIN, a fundamental frequency estimator for speech and music", JASA 111(4)).
 *  - phanTich: chia khung 10 ms, tính năng lượng (RMS) và F0; khung lặng hoặc vô thanh bị bỏ.
 *  - duongGiong: đổi F0 sang semitone so với mốc giọng của bé, sửa lỗi quãng tám, làm mượt, cắt lấy đoạn tiếng chính.
 *  - MAU: đường mẫu 6 thanh (số Chao) cho giọng Hà Nội và Sài Gòn, kèm đường mẫu riêng cho tiếng tắc.
 *  - chamDiem: so đường giọng với đường mẫu sau khi co giãn thời gian (DTW), cho điểm 0–100.
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.CaoDo = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SR_PHAN_TICH = 16000;   // tần số lấy mẫu dùng để phân tích
  var BUOC_GIAY = 0.01;       // mỗi khung cách nhau 10 ms
  var CUA_SO = 512;           // cửa sổ tích phân của YIN (32 ms ở 16 kHz)
  var F0_THAP = 65;           // Hz – giọng nam trầm
  var F0_CAO = 700;           // Hz – giọng trẻ em cao
  var NGUONG_YIN = 0.15;
  var NGUONG_HUU_THANH = 0.35; // độ "không tuần hoàn" lớn hơn mức này coi là vô thanh
  var ST_MOI_BAC = 2.5;        // 1 bậc Chao = 2,5 semitone (5 bậc ≈ 10 semitone, vừa với tầm giọng nói của trẻ)

  /* ---------- Hạ tần số lấy mẫu ---------- */
  function giamMau(mau, sr, srDich) {
    srDich = srDich || SR_PHAN_TICH;
    if (sr <= srDich * 1.05) return { mau: Float32Array.from(mau), sr: sr };
    var tiLe = sr / srDich;
    var dai = Math.floor(mau.length / tiLe);
    var ra = new Float32Array(dai);
    var nua = Math.max(1, Math.round(tiLe / 2));
    // Tổng cộng dồn để lọc trung bình nhanh (chống chồng phổ đơn giản)
    var cong = new Float64Array(mau.length + 1);
    for (var i = 0; i < mau.length; i++) cong[i + 1] = cong[i] + mau[i];
    for (var k = 0; k < dai; k++) {
      var giua = Math.round(k * tiLe);
      var a = Math.max(0, giua - nua), b = Math.min(mau.length, giua + nua);
      ra[k] = b > a ? (cong[b] - cong[a]) / (b - a) : 0;
    }
    return { mau: ra, sr: sr / tiLe };
  }

  /* ---------- YIN cho một khung ---------- */
  // x: mảng mẫu, batDau: vị trí đầu khung. Trả {f0, khongTuanHoan}.
  function yin(x, batDau, sr, cuaSo, tauMin, tauMax, d, cmnd) {
    var W = cuaSo, t, j;
    for (t = 1; t <= tauMax; t++) {
      var tong = 0;
      for (j = 0; j < W; j++) {
        var hieu = x[batDau + j] - x[batDau + j + t];
        tong += hieu * hieu;
      }
      d[t] = tong;
    }
    cmnd[0] = 1;
    var luyKe = 0;
    for (t = 1; t <= tauMax; t++) {
      luyKe += d[t];
      cmnd[t] = luyKe > 0 ? d[t] * t / luyKe : 1;
    }
    var chon = -1;
    for (t = tauMin; t <= tauMax; t++) {
      if (cmnd[t] < NGUONG_YIN) {
        while (t + 1 <= tauMax && cmnd[t + 1] < cmnd[t]) t++;
        chon = t; break;
      }
    }
    if (chon < 0) { // không có điểm nào dưới ngưỡng: lấy điểm nhỏ nhất
      chon = tauMin;
      for (t = tauMin + 1; t <= tauMax; t++) if (cmnd[t] < cmnd[chon]) chon = t;
    }
    // Nội suy parabol quanh điểm chọn để tăng độ chính xác
    var tauTot = chon;
    if (chon > 1 && chon < tauMax) {
      var s0 = cmnd[chon - 1], s1 = cmnd[chon], s2 = cmnd[chon + 1];
      var mauSo = s0 + s2 - 2 * s1;
      if (mauSo !== 0) tauTot = chon + (s0 - s2) / (2 * mauSo);
    }
    return { f0: sr / tauTot, khongTuanHoan: cmnd[chon] };
  }

  /* ---------- Phân tích cả bản ghi ---------- */
  // Trả { sr, buoc, khung: [{t, rms, f0 (null nếu lặng/vô thanh), khongTuanHoan}], rmsMax }
  function phanTich(mauGoc, srGoc) {
    var g = giamMau(mauGoc, srGoc, SR_PHAN_TICH);
    var x = g.mau, sr = g.sr;
    var tauMin = Math.max(2, Math.floor(sr / F0_CAO));
    var tauMax = Math.ceil(sr / F0_THAP);
    var cuaSo = Math.round(CUA_SO * sr / SR_PHAN_TICH);
    var buoc = Math.max(1, Math.round(BUOC_GIAY * sr));
    var daiKhung = cuaSo + tauMax + 1;
    var d = new Float64Array(tauMax + 2), cmnd = new Float64Array(tauMax + 2);
    var khung = [], rmsMax = 0, i, j;
    for (i = 0; i + daiKhung <= x.length; i += buoc) {
      var tong = 0;
      for (j = 0; j < cuaSo; j++) { var v = x[i + j]; tong += v * v; }
      var rms = Math.sqrt(tong / cuaSo);
      if (rms > rmsMax) rmsMax = rms;
      khung.push({ t: (i + cuaSo / 2) / sr, rms: rms, f0: null, khongTuanHoan: 1 });
    }
    // Ngưỡng năng lượng: thấp hơn đỉnh 22 dB, hoặc quá nhỏ tuyệt đối, coi là lặng.
    var nguongRms = Math.max(rmsMax * 0.08, 0.004);
    for (i = 0; i < khung.length; i++) {
      var k = khung[i];
      if (k.rms < nguongRms) continue;
      var kq = yin(x, i * buoc, sr, cuaSo, tauMin, tauMax, d, cmnd);
      k.khongTuanHoan = kq.khongTuanHoan;
      if (kq.khongTuanHoan < NGUONG_HUU_THANH && kq.f0 >= F0_THAP && kq.f0 <= F0_CAO) k.f0 = kq.f0;
    }
    return { sr: sr, buoc: buoc / sr, khung: khung, rmsMax: rmsMax };
  }

  function trungVi(mang) {
    if (!mang.length) return NaN;
    var s = mang.slice().sort(function (a, b) { return a - b; });
    var g = s.length >> 1;
    return s.length % 2 ? s[g] : (s[g - 1] + s[g]) / 2;
  }

  /* ---------- Mốc giọng (bước 1) ---------- */
  // Cao độ trung bình (trung vị, ít bị ảnh hưởng bởi khung lỗi) của các khung hữu thanh. Cần ít nhất 0,4 giây.
  function doMoc(pt) {
    var ds = [];
    for (var i = 0; i < pt.khung.length; i++) if (pt.khung[i].f0) ds.push(pt.khung[i].f0);
    if (ds.length * pt.buoc < 0.4) return null;
    var tv = trungVi(ds);
    var sach = ds.filter(function (f) { return f > tv * 0.7 && f < tv * 1.4; });
    return sach.length ? trungVi(sach) : tv;
  }

  function hzSangSt(hz, moc) { return 12 * Math.log(hz / moc) / Math.LN2; }

  /* ---------- Đường giọng (semitone so với mốc) ---------- */
  // Trả { diem: [{t, st}] (chỉ khung hữu thanh, đã làm mượt), batDau, ketThuc (giây), khung (toàn bộ, cho cột năng lượng) }
  // hoặc null nếu không đủ tiếng.
  function duongGiong(pt, moc) {
    var k = pt.khung, i;
    var huu = [];
    for (i = 0; i < k.length; i++) if (k[i].f0) huu.push(i);
    if (huu.length < 8) return null;

    // 1) Tách thành các đoạn, hai đoạn cách nhau quá 150 ms là hai tiếng khác nhau.
    var khoangToiDa = Math.round(0.15 / pt.buoc);
    var doan = [], hienTai = [huu[0]];
    for (i = 1; i < huu.length; i++) {
      if (huu[i] - huu[i - 1] > khoangToiDa) { doan.push(hienTai); hienTai = []; }
      hienTai.push(huu[i]);
    }
    doan.push(hienTai);
    // 2) Lấy đoạn mạnh nhất (tổng năng lượng lớn nhất) – đó là tiếng bé đọc.
    var tot = doan[0], nangLuongTot = -1;
    doan.forEach(function (d) {
      var e = 0; d.forEach(function (j) { e += k[j].rms; });
      if (e > nangLuongTot) { nangLuongTot = e; tot = d; }
    });
    if (tot.length < 8) return null;

    // 3) Sửa lỗi nhảy quãng tám so với trung vị của đoạn.
    var f = tot.map(function (j) { return k[j].f0; });
    var tv = trungVi(f);
    f = f.map(function (v) {
      if (v > tv * 1.75) return v / 2;
      if (v < tv * 0.58) return v * 2;
      return v;
    });
    // 4) Làm mượt bằng trung vị trượt 5 khung.
    var muot = f.map(function (_, n) {
      var cua = [];
      for (var m = Math.max(0, n - 2); m <= Math.min(f.length - 1, n + 2); m++) cua.push(f[m]);
      return trungVi(cua);
    });
    var diem = tot.map(function (j, n) { return { t: k[j].t, st: hzSangSt(muot[n], moc) }; });
    return { diem: diem, batDau: diem[0].t, ketThuc: diem[diem.length - 1].t, khung: k };
  }

  /* ---------- Hướng đi của đường (dùng cho kiểm thử và gợi ý) ---------- */
  // Hồi quy tuyến tính; tổng thay đổi > 1,5 semitone là lên/xuống, còn lại là ngang.
  function huong(st) {
    var n = st.length;
    if (n < 2) return "ngang";
    var tbX = (n - 1) / 2, tbY = 0, i;
    for (i = 0; i < n; i++) tbY += st[i];
    tbY /= n;
    var tu = 0, mau = 0;
    for (i = 0; i < n; i++) { tu += (i - tbX) * (st[i] - tbY); mau += (i - tbX) * (i - tbX); }
    var tong = tu / mau * (n - 1);
    if (tong > 1.5) return "len";
    if (tong < -1.5) return "xuong";
    return "ngang";
  }

  /* ---------- Đường mẫu thanh điệu ----------
   * Số Chao: 1 = thấp nhất, 5 = cao nhất trong tầm giọng nói; ˀ = có tắc thanh hầu (giọng bị "gãy").
   *
   * NGUỒN ĐỐI CHIẾU
   *  - Hà Nội: Kirby, J. (2011). Vietnamese (Hanoi Vietnamese). Journal of the International Phonetic
   *    Association 41(3), 381–392 – bảng thanh điệu: ngang 33, huyền 32, sắc 24, nặng 21ˀ, hỏi 312, ngã 3ˀ5;
   *    tiếng tắc (-p, -t, -c, -ch) chỉ mang sắc (cao, lên: 45) và nặng (thấp, xuống: 21), ngắn hơn tiếng thường.
   *    Một số tài liệu khác ghi huyền là 21 hoặc 31 (ví dụ Đoàn Thiện Thuật, Ngữ âm tiếng Việt, 1977);
   *    ở đây giữ 32 theo Kirby (2011). Hai cách ghi đều là "đi xuống nhẹ, thấp".
   *  - Sài Gòn: Vũ Thanh Phương (1982). Phonetic properties of Vietnamese tones across dialects.
   *    Papers in South East Asian Linguistics 8: Tonation, Pacific Linguistics A-62, 55–75;
   *    Brunelle, M. (2009). Northern and Southern Vietnamese tone coarticulation: A comparative case study.
   *    Journal of Southeast Asian Linguistics 1, 49–62.
   *    Giọng Nam: hỏi và ngã nhập làm một (214), không có tắc thanh hầu rõ; ngang 33, huyền 21, sắc 45, nặng 212.
   *    Tiếng tắc: sắc 45, nặng 21 (ngắn).
   *  Số Chao là ước lượng theo tai nghe và đo đạc trung bình; giọng từng người có thể khác. Vì vậy điểm chỉ để tham khảo.
   *
   * Mỗi đường mẫu: chao (chữ hiển thị), diem [[thời gian 0–1, bậc Chao]], dai (độ dài so với tiếng thường),
   * ngat (vị trí tắc thanh hầu, nếu có), cham (có chấm điểm hay chỉ hiện đường).
   */
  var MAU = {
    hanoi: {
      ngang: { chao: "33", diem: [[0, 3], [1, 3]], dai: 1 },
      huyen: { chao: "32", diem: [[0, 3], [1, 2]], dai: 1 },
      nga:   { chao: "3ˀ5", diem: [[0, 3], [0.4, 2.6], [0.55, 3], [1, 5]], dai: 1, ngat: 0.47, cham: false },
      hoi:   { chao: "312", diem: [[0, 3], [0.55, 1], [1, 2]], dai: 1, cham: false },
      sac:   { chao: "24", diem: [[0, 2], [1, 4]], dai: 1 },
      nang:  { chao: "21ˀ", diem: [[0, 2], [1, 1]], dai: 0.7, ngat: 1 }
    },
    saigon: {
      ngang: { chao: "33", diem: [[0, 3], [1, 3]], dai: 1 },
      huyen: { chao: "21", diem: [[0, 2], [1, 1]], dai: 1 },
      nga:   { chao: "214", diem: [[0, 2], [0.45, 1], [1, 4]], dai: 1, cham: false },
      hoi:   { chao: "214", diem: [[0, 2], [0.45, 1], [1, 4]], dai: 1, cham: false },
      sac:   { chao: "45", diem: [[0, 4], [1, 5]], dai: 1 },
      nang:  { chao: "212", diem: [[0, 2], [0.5, 1], [1, 2]], dai: 1 }
    },
    // Tiếng tắc (kết thúc bằng p, t, c, ch): chỉ có sắc và nặng, đường ngắn hơn.
    tac: {
      hanoi:  { sac: { chao: "45", diem: [[0, 4], [1, 5]], dai: 0.55 }, nang: { chao: "21", diem: [[0, 2], [1, 1]], dai: 0.55 } },
      saigon: { sac: { chao: "45", diem: [[0, 4], [1, 5]], dai: 0.55 }, nang: { chao: "21", diem: [[0, 2], [1, 1]], dai: 0.55 } }
    }
  };

  function layMau(giong, thanh, tac) {
    var nguon = tac ? MAU.tac[giong] : MAU[giong];
    var m = nguon && nguon[thanh];
    if (!m) return null;
    return {
      chao: m.chao, diem: m.diem, dai: m.dai, ngat: m.ngat,
      cham: m.cham !== false
    };
  }

  // Chữ cái thanh điệu IPA (˥ ˦ ˧ ˨ ˩) từ số Chao, ví dụ "312" → "˧˩˨", "3ˀ5" → "˧ˀ˥"
  var CHU_THANH = { "1": "˩", "2": "˨", "3": "˧", "4": "˦", "5": "˥" };
  function chuIPA(chao) {
    return Array.from(chao).map(function (c) { return CHU_THANH[c] || c; }).join("");
  }

  function bacSangSt(bac) { return (bac - 3) * ST_MOI_BAC; }

  // Giá trị đường mẫu (semitone) tại thời điểm x ∈ [0,1]; nối các điểm bằng đường cong cosin (mượt, không vượt).
  function giaTriMau(mau, x) {
    var d = mau.diem;
    if (x <= d[0][0]) return bacSangSt(d[0][1]);
    for (var i = 1; i < d.length; i++) {
      if (x <= d[i][0]) {
        var a = d[i - 1], b = d[i];
        var u = (x - a[0]) / (b[0] - a[0]);
        var w = (1 - Math.cos(u * Math.PI)) / 2;
        return bacSangSt(a[1] + (b[1] - a[1]) * w);
      }
    }
    return bacSangSt(d[d.length - 1][1]);
  }

  function layDeuMau(mau, n) {
    var ra = [];
    for (var i = 0; i < n; i++) ra.push(giaTriMau(mau, i / (n - 1)));
    return ra;
  }

  // Lấy đều n điểm từ đường giọng (nội suy tuyến tính theo thời gian, lấp chỗ hụt).
  function layDeuGiong(diem, n) {
    var t0 = diem[0].t, t1 = diem[diem.length - 1].t, ra = [], j = 0;
    for (var i = 0; i < n; i++) {
      var t = t0 + (t1 - t0) * i / (n - 1);
      while (j < diem.length - 2 && diem[j + 1].t < t) j++;
      var a = diem[j], b = diem[Math.min(j + 1, diem.length - 1)];
      var u = b.t > a.t ? Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))) : 0;
      ra.push(a.st + (b.st - a.st) * u);
    }
    return ra;
  }

  // Co giãn thời gian động (DTW) có giới hạn dải; trả sai lệch trung bình (semitone) dọc đường đi tốt nhất.
  function dtw(a, b, daiPhanTram) {
    var n = a.length, m = b.length;
    var dai = Math.max(Math.abs(n - m), Math.round(Math.max(n, m) * (daiPhanTram || 0.15)));
    var VC = Infinity;
    var C = [], L = [], i, j;
    for (i = 0; i <= n; i++) { C.push(new Float64Array(m + 1).fill(VC)); L.push(new Float64Array(m + 1)); }
    C[0][0] = 0;
    for (i = 1; i <= n; i++) {
      var tu = Math.max(1, Math.round(i * m / n) - dai), den = Math.min(m, Math.round(i * m / n) + dai);
      for (j = tu; j <= den; j++) {
        var cp = Math.abs(a[i - 1] - b[j - 1]);
        var best = C[i - 1][j - 1], len = L[i - 1][j - 1];
        if (C[i - 1][j] < best) { best = C[i - 1][j]; len = L[i - 1][j]; }
        if (C[i][j - 1] < best) { best = C[i][j - 1]; len = L[i][j - 1]; }
        C[i][j] = best + cp; L[i][j] = len + 1;
      }
    }
    return C[n][m] / L[n][m];
  }

  function doiTong(st) { // tổng thay đổi theo hồi quy tuyến tính
    var n = st.length, tbX = (n - 1) / 2, tbY = 0, i, tu = 0, mau = 0;
    for (i = 0; i < n; i++) tbY += st[i];
    tbY /= n;
    for (i = 0; i < n; i++) { tu += (i - tbX) * (st[i] - tbY); mau += (i - tbX) * (i - tbX); }
    return tu / mau * (n - 1);
  }

  /* ---------- Chấm điểm (chỉ để tham khảo) ----------
   * 1) Lấy đều 40 điểm trên đường giọng và đường mẫu (đã chuẩn hoá về semitone so với mốc giọng).
   * 2) Cho phép lệch cả đường lên/xuống tối đa 1,5 semitone (trẻ thường đọc cao hơn lúc đo mốc).
   * 3) DTW (co giãn thời gian) → sai lệch hình dáng e1; chênh tổng độ lên/xuống e2.
   * 4) Sai số = e1 + 0,35·e2; điểm = 100 / (1 + (sai số / 1,3)²).
   */
  function chamDiem(duong, mau) {
    var N = 40;
    var u = layDeuGiong(duong.diem, N);
    var t = layDeuMau(mau, N);
    var tbU = u.reduce(function (s, v) { return s + v; }, 0) / N;
    var tbT = t.reduce(function (s, v) { return s + v; }, 0) / N;
    var lech = Math.max(-1.5, Math.min(1.5, tbU - tbT));
    var u2 = u.map(function (v) { return v - lech; });
    var e1 = dtw(u2, t, 0.15);
    var e2 = Math.abs(doiTong(u) - doiTong(t));
    var saiSo = e1 + 0.35 * e2;
    var diem = Math.round(100 / (1 + Math.pow(saiSo / 1.3, 2)));
    return { diem: Math.max(0, Math.min(100, diem)), e1: e1, e2: e2 };
  }

  function mucDiem(diem) {
    if (diem >= 80) return "tot";
    if (diem >= 50) return "gan-dung";
    return "can-luyen";
  }

  return {
    SR_PHAN_TICH: SR_PHAN_TICH, ST_MOI_BAC: ST_MOI_BAC, MAU: MAU,
    giamMau: giamMau, phanTich: phanTich, doMoc: doMoc, hzSangSt: hzSangSt,
    duongGiong: duongGiong, huong: huong, layMau: layMau, chuIPA: chuIPA,
    bacSangSt: bacSangSt, giaTriMau: giaTriMau, layDeuMau: layDeuMau, layDeuGiong: layDeuGiong,
    dtw: dtw, chamDiem: chamDiem, mucDiem: mucDiem
  };
});
