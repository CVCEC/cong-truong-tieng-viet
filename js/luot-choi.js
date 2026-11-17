/*!
 * Tính một lượt chơi (module ES, không phụ thuộc Firebase – dùng được cả trong bộ thử rules).
 * Đầu vào: kết quả trò chơi do góc học gửi (qua TTV.ghiKetQua của bộ mẫu) và trạng thái hiện tại
 * của hồ sơ. Đầu ra: nội dung các tài liệu cần ghi CÙNG MỘT LƯỢT, đúng như docs/firestore.rules đòi:
 *   lichSu (thêm 1 dòng), bai/{chuongTrinh__bai}, tongHop/tatCa, thang/{yyyy-mm}, và các dòng bảng xếp hạng.
 * Trường thời điểm để giá trị DAU_THOI_GIAN; trang thay bằng serverTimestamp() khi ghi.
 */
export const DAU_THOI_GIAN = "__thoiDiemMayChu__";

const MA = /^[a-z0-9-]{1,40}$/;
const MA_CT = /^[a-z0-9-]{1,30}$/;

function soNguyen(v, tu, den) {
  v = Math.round(Number(v));
  if (!Number.isFinite(v)) v = tu;
  return Math.max(tu, Math.min(den, v));
}

// Kiểm tra và làm sạch tin nhắn "ttv-ket-qua". Trả null nếu không hợp lệ.
export function lamSachKetQua(d) {
  if (!d || typeof d !== "object") return null;
  const chuongTrinh = String(d.chuongTrinh || "");
  const bai = String(d.bai || "");
  const hoatDong = String(d.hoatDong || "");
  if (!MA_CT.test(chuongTrinh) || !MA.test(bai) || !MA.test(hoatDong)) return null;
  const diemToiDa = soNguyen(d.diemToiDa, 0, 1000);
  return {
    chuongTrinh, bai, hoatDong,
    soTroChoi: soNguyen(d.soTroChoi, 1, 50),
    diemToiDa,
    diem: soNguyen(d.diem, 0, diemToiDa),
    sao: soNguyen(d.sao, 0, 3),
    thoiGianGiay: soNguyen(d.thoiGianGiay, 0, 7200),
    ketQua: d.ketQua === "chua-xong" ? "chua-xong" : "hoan-thanh"
  };
}

// Ngày theo giờ máy người học, dạng yyyy-mm-dd
export function ngayCucBo(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
// Kỳ bảng xếp hạng (giờ UTC, tuần ISO bắt đầu thứ Hai) – giống js/tai-khoan.js
export function kyThang(d = new Date()) { return d.toISOString().slice(0, 7); }
export function kyTuan(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const thu = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - thu);
  const dauNam = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const tuan = Math.ceil(((t - dauNam) / 86400000 + 1) / 7);
  return t.getUTCFullYear() + "-W" + String(tuan).padStart(2, "0");
}
function ngayHomTruoc(ngay) {
  const [y, m, d] = ngay.split("-").map(Number);
  return ngayCucBo(new Date(y, m - 1, d - 1));
}

/*
 * cu = { hoSo, bai (tài liệu bài cũ hoặc null), tongHop (hoặc null), thang (hoặc null), tuanBxh (dòng tuần cũ hoặc null) }
 * ky = { thang: "2026-11", tuan: "2026-W47" } (giờ UTC, giống bảng xếp hạng), homNay = "2026-11-17" (giờ máy)
 * Trả { maBai, lichSu, bai, tongHop, thang, bxh: { "tat-ca": {...}, "thang-…": {...}, "tuan-…": {...} } | null }
 */
export function tinhLuot(kq, cu, ky, homNay) {
  const { chuongTrinh: ct, bai, hoatDong: hd } = kq;
  const maBai = `${ct}__${bai}`;
  const baiCu = cu.bai || null;
  const thCu = cu.tongHop || { soBaiXong: 0, tongSao: 0, tongGiay: 0, soHoatDong: 0, chuoiNgay: 0, theoChuongTrinh: {} };
  const thgCu = cu.thang || { soBaiXong: 0, tongSao: 0, tongGiay: 0, soHoatDong: 0, ngay: {} };

  // Sao cao nhất của từng trò; chơi lại kém hơn thì giữ sao cũ
  const saoTroChoi = { ...(baiCu ? baiCu.saoTroChoi : {}) };
  const truoc = saoTroChoi[hd] || 0;
  saoTroChoi[hd] = Math.max(truoc, kq.sao);
  const tang = saoTroChoi[hd] - truoc;
  const daXong = !!(baiCu && baiCu.xong);
  const xongMoi = !daXong && Object.keys(saoTroChoi).length >= kq.soTroChoi;
  const coThemBai = xongMoi ? 1 : 0;

  const lichSu = {
    thoiDiem: DAU_THOI_GIAN, chuongTrinh: ct, bai, hoatDong: hd, ketQua: kq.ketQua,
    diem: kq.diem, diemToiDa: kq.diemToiDa, sao: kq.sao, thoiGianGiay: kq.thoiGianGiay
  };
  const baiMoi = {
    chuongTrinh: ct, bai, saoTroChoi,
    tongSao: (baiCu ? baiCu.tongSao : 0) + tang,
    soTroChoi: kq.soTroChoi,
    xong: daXong || xongMoi,
    xongLuc: daXong ? baiCu.xongLuc : (xongMoi ? DAU_THOI_GIAN : null),
    lanCuoi: DAU_THOI_GIAN,
    hoatDongCuoi: hd
  };

  // Chuỗi ngày học liên tiếp
  let chuoiNgay;
  if (thCu.ngayHocCuoi === homNay) chuoiNgay = Math.max(1, thCu.chuoiNgay);
  else if (thCu.ngayHocCuoi && thCu.ngayHocCuoi === ngayHomTruoc(homNay)) chuoiNgay = thCu.chuoiNgay + 1;
  else chuoiNgay = 1;

  // Số liệu theo góc học (tối đa 20 góc theo rules)
  const theoChuongTrinh = { ...(thCu.theoChuongTrinh || {}) };
  if (theoChuongTrinh[ct] || Object.keys(theoChuongTrinh).length < 20) {
    const g = theoChuongTrinh[ct] || { soBaiXong: 0, tongSao: 0, soHoatDong: 0 };
    theoChuongTrinh[ct] = { soBaiXong: g.soBaiXong + coThemBai, tongSao: g.tongSao + tang, soHoatDong: g.soHoatDong + 1 };
  }

  const tongHop = {
    soBaiXong: thCu.soBaiXong + coThemBai,
    tongSao: thCu.tongSao + tang,
    tongGiay: thCu.tongGiay + kq.thoiGianGiay,
    soHoatDong: thCu.soHoatDong + 1,
    chuoiNgay,
    ngayHocCuoi: homNay,
    theoChuongTrinh,
    baiCuoi: maBai,
    capNhat: DAU_THOI_GIAN
  };

  // Theo tháng: số hoạt động từng ngày (khoá là ngày trong tháng, tối đa 31)
  const ngay = { ...(thgCu.ngay || {}) };
  const ngayTrongThang = String(Number(homNay.slice(8, 10)));
  if (ngay[ngayTrongThang] != null || Object.keys(ngay).length < 31) ngay[ngayTrongThang] = (ngay[ngayTrongThang] || 0) + 1;
  const thang = {
    soBaiXong: thgCu.soBaiXong + coThemBai,
    tongSao: thgCu.tongSao + tang,
    tongGiay: thgCu.tongGiay + kq.thoiGianGiay,
    soHoatDong: thgCu.soHoatDong + 1,
    ngay,
    capNhat: DAU_THOI_GIAN
  };

  let bxh = null;
  const hs = cu.hoSo;
  if (hs && hs.choXepHang) {
    const dong = (soBaiXong, tongSao) => ({ bietDanh: hs.bietDanh, conVat: hs.conVat, nuoc: hs.nuoc, nhomTuoi: hs.nhomTuoi, soBaiXong, tongSao, capNhat: DAU_THOI_GIAN });
    const tuanCu = cu.tuanBxh || { soBaiXong: 0, tongSao: 0 };
    bxh = {
      "tat-ca": dong(tongHop.soBaiXong, tongHop.tongSao),
      ["thang-" + ky.thang]: dong(thang.soBaiXong, thang.tongSao),
      ["tuan-" + ky.tuan]: dong(tuanCu.soBaiXong + coThemBai, tuanCu.tongSao + tang)
    };
  }
  return { maBai, lichSu, bai: baiMoi, tongHop, thang, bxh };
}

// Thay DAU_THOI_GIAN bằng giá trị thật (serverTimestamp() của Firebase)
export function ganThoiGian(o, giaTri) {
  if (o === DAU_THOI_GIAN) return giaTri;
  if (Array.isArray(o)) return o.map((x) => ganThoiGian(x, giaTri));
  if (o && typeof o === "object" && Object.getPrototypeOf(o) === Object.prototype) {
    const r = {};
    for (const k of Object.keys(o)) r[k] = ganThoiGian(o[k], giaTri);
    return r;
  }
  return o;
}
