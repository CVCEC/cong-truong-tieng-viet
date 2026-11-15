/*!
 * Tài khoản dùng chung cho cổng vietclass.cvcec.org (module ES).
 * - Nút "Đăng nhập" / con vật + biệt danh ở góc phải thanh trên, kèm menu.
 * - Danh mục chọn (con vật, nhóm tuổi, đối tượng, nước), kiểm tra biệt danh.
 * - Đọc tài khoản và hồ sơ; bật/tắt bảng xếp hạng; tải dữ liệu; xoá hồ sơ, xoá tài khoản.
 * Nạp SAU /chung/cong.js:  <script type="module" src="/js/tai-khoan.js?v=1"></script>
 * Mỗi tài khoản (một email) có đúng 1 hồ sơ học viên: users/{uid}/hoSo/chinh. Xem docs/firestore.rules.
 */
import { auth, db } from "./firebase-cvcec.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  doc, getDoc, getDocs, collection, writeBatch, serverTimestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const PHIEN_BAN_DIEU_KHOAN = "2026-11";
const KHOA_TAM = "cvcec-tk-tam"; // sessionStorage: tóm tắt hồ sơ để đỡ đọc lại mỗi trang

/* ================= Danh mục ================= */
export const CON_VAT = [
  { id: "trau", e: "🐃", vi: "Trâu", en: "Buffalo" }, { id: "meo", e: "🐱", vi: "Mèo", en: "Cat" },
  { id: "cho", e: "🐶", vi: "Chó", en: "Dog" }, { id: "tho", e: "🐰", vi: "Thỏ", en: "Rabbit" },
  { id: "ga", e: "🐔", vi: "Gà", en: "Chicken" }, { id: "vit", e: "🦆", vi: "Vịt", en: "Duck" },
  { id: "ca", e: "🐟", vi: "Cá", en: "Fish" }, { id: "voi", e: "🐘", vi: "Voi", en: "Elephant" },
  { id: "khi", e: "🐵", vi: "Khỉ", en: "Monkey" }, { id: "gau", e: "🐻", vi: "Gấu", en: "Bear" },
  { id: "cu", e: "🦉", vi: "Cú", en: "Owl" }, { id: "rua", e: "🐢", vi: "Rùa", en: "Turtle" }
];
export const NHOM_TUOI = [
  { id: "duoi-6", vi: "Dưới 6", en: "Under 6" }, { id: "6-9", vi: "6–9", en: "6–9" }, { id: "10-12", vi: "10–12", en: "10–12" },
  { id: "13-17", vi: "13–17", en: "13–17" }, { id: "18-34", vi: "18–34", en: "18–34" }, { id: "35-54", vi: "35–54", en: "35–54" },
  { id: "55+", vi: "55 trở lên", en: "55 and over" }
];
export const DUOI_13 = ["duoi-6", "6-9", "10-12"];
export const DOI_TUONG = [
  { id: "con-em-kieu-bao", vi: "Con em kiều bào", en: "Child of an overseas Vietnamese family" },
  { id: "nguoi-viet-o-nuoc-ngoai", vi: "Người Việt ở nước ngoài", en: "Vietnamese living abroad" },
  { id: "hoc-sinh-viet-nam", vi: "Học sinh tại Việt Nam", en: "Student in Vietnam" },
  { id: "nguoi-nuoc-ngoai", vi: "Người nước ngoài học tiếng Việt", en: "Non-Vietnamese learner of Vietnamese" },
  { id: "khac", vi: "Khác", en: "Other" }
];
export const VAI_TRO = [
  { id: "nguoi-hoc", vi: "Người học", en: "Learner" },
  { id: "phu-huynh", vi: "Phụ huynh", en: "Parent or guardian" },
  { id: "giao-vien", vi: "Giáo viên", en: "Teacher" }
];
// Mã nước ISO 3166-1 (tên lấy từ trình duyệt theo ngôn ngữ đang chọn)
const MA_NUOC = ("AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW").split(" ");

export function nn() { return window.CONG ? window.CONG.ngonNgu() : "vi"; }
export function nhan(muc) { return muc ? (nn() === "en" ? muc.en : muc.vi) : ""; }
export function conVat(id) { return CON_VAT.find((c) => c.id === id) || CON_VAT[0]; }
export function coNuoc(ma) {
  if (!/^[A-Z]{2}$/.test(ma || "")) return "";
  return String.fromCodePoint(...[...ma].map((ch) => 0x1F1E6 + ch.charCodeAt(0) - 65));
}
export function tenNuoc(ma) {
  try { return new Intl.DisplayNames([nn() === "en" ? "en" : "vi"], { type: "region" }).of(ma) || ma; } catch (e) { return ma; }
}
export function dsNuoc() {
  const ds = MA_NUOC.map((ma) => ({ ma, ten: tenNuoc(ma) }));
  ds.sort((a, b) => a.ten.localeCompare(b.ten, nn() === "en" ? "en" : "vi"));
  return ds;
}
export function doanNuoc() {
  const ls = [].concat(navigator.languages || [], navigator.language || []);
  for (const l of ls) { const m = /-([A-Z]{2})$/i.exec(l); if (m && MA_NUOC.includes(m[1].toUpperCase())) return m[1].toUpperCase(); }
  return "CA";
}

/* ================= Kiểm tra biệt danh ================= */
// Từ thô tục thường gặp (tiếng Việt có/không dấu, tiếng Anh). So sánh sau khi bỏ dấu, chữ thường.
// Chỉ giữ từ không thể nhầm với từ thường khi bỏ dấu (vd. "lớn", "các", "dài" không bị chặn).
const TU_CAM = ["dit", "djt", "du ma", "duma", "dmm", "dcm", "vcl", "vkl", "cho chet", "fuck", "fuk", "shit", "bitch", "cunt", "porn", "sex", "nazi", "asshole"];
function boDau(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase(); }
export function kiemTraBietDanh(b) {
  const s = (b || "").normalize("NFC").trim();
  if (!s) return "bdTrong";
  if (s.length > 20) return "bdDai";
  if (/@/.test(s) || /\S+\.(com|org|net|ca|vn)\b/i.test(s)) return "bdEmail";
  if (/([0-9][ .()+-]*){7,}/.test(s)) return "bdSo";
  if (/(https?:|www\.)/i.test(s)) return "bdEmail";
  const tu = " " + boDau(s).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ") + " ";
  const lien = boDau(s).replace(/[^a-z0-9]/g, "");
  for (const t of TU_CAM) {
    if (tu.includes(" " + t + " ")) return "bdTho";
    if (t.length >= 4 && lien.includes(t.replace(/ /g, ""))) return "bdTho";
  }
  return null;
}
export function maNgauNhien(n = 20) {
  const k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const so = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(so, (x) => k[x % k.length]).join("");
}

/* ================= Kỳ bảng xếp hạng (giờ UTC, tuần ISO bắt đầu thứ Hai) ================= */
export function kyThang(d = new Date()) { return d.toISOString().slice(0, 7); }
export function kyTuan(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const thu = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - thu);
  const dauNam = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const tuan = Math.ceil(((t - dauNam) / 86400000 + 1) / 7);
  return t.getUTCFullYear() + "-W" + String(tuan).padStart(2, "0");
}

/* ================= Đọc tài khoản, hồ sơ ================= */
export const TAI_KHOAN_DU = ["hoTen", "email", "ngayTao", "nuoc", "vaiTro", "nhomTuoi", "dongYLuc", "phienBanDieuKhoan"];
export async function docTaiKhoan(uid) {
  const s = await getDoc(doc(db, "users", uid));
  return s.exists() ? s.data() : null;
}
export async function docHoSo(uid) {
  const s = await getDoc(doc(db, "users", uid, "hoSo", "chinh"));
  return s.exists() ? s.data() : null;
}
export function taiKhoanDu(tk) { return !!tk && TAI_KHOAN_DU.every((k) => tk[k] != null) && tk.phienBanDieuKhoan === PHIEN_BAN_DIEU_KHOAN; }
export function luuTam(uid, hs) {
  try { sessionStorage.setItem(KHOA_TAM, JSON.stringify(hs ? { uid, bietDanh: hs.bietDanh, conVat: hs.conVat } : { uid, chuaXong: true })); } catch (e) {}
}
export function xoaTam() { try { sessionStorage.removeItem(KHOA_TAM); } catch (e) {} }
function docTam(uid) {
  try { const v = JSON.parse(sessionStorage.getItem(KHOA_TAM) || "null"); return v && v.uid === uid ? v : null; } catch (e) { return null; }
}

/* Trạng thái đăng nhập cho các trang: goi(trangThai) mỗi khi đổi.
   trangThai = { user, tomTat: {bietDanh, conVat} | {chuaXong:true} | null } */
const nghe = [];
let trangThai = { daBiet: false, user: null, tomTat: null };
export function theoDoi(fn) { nghe.push(fn); if (trangThai.daBiet) fn(trangThai); }
function bao() {
  nghe.forEach((fn) => { try { fn(trangThai); } catch (e) { console.error(e); } });
  // Cho các mã thường (không phải module), ví dụ trang chủ cần biết đã đăng nhập chưa trước khi mở góc học
  window.CVCEC_TK = { trangThai };
  try { document.dispatchEvent(new CustomEvent("cvcec-tk", { detail: trangThai })); } catch (e) {}
}
onAuthStateChanged(auth, async (user) => {
  if (!user) { xoaTam(); trangThai = { daBiet: true, user: null, tomTat: null }; bao(); return; }
  let tomTat = docTam(user.uid);
  if (!tomTat) {
    try {
      const [tk, hs] = await Promise.all([docTaiKhoan(user.uid), docHoSo(user.uid)]);
      tomTat = taiKhoanDu(tk) && hs ? { uid: user.uid, bietDanh: hs.bietDanh, conVat: hs.conVat } : { uid: user.uid, chuaXong: true };
      if (!tomTat.chuaXong) luuTam(user.uid, hs);
    } catch (e) { tomTat = { uid: user.uid, chuaXong: true }; }
  }
  trangThai = { daBiet: true, user, tomTat };
  bao();
});
export async function dangXuat(veTrang = "/") {
  xoaTam();
  await signOut(auth);
  if (veTrang) location.href = veTrang;
}

/* ================= Bảng xếp hạng: bật, tắt, cập nhật dòng ================= */
function dongBxh(hs, soBaiXong, tongSao) {
  return { bietDanh: hs.bietDanh, conVat: hs.conVat, nuoc: hs.nuoc, nhomTuoi: hs.nhomTuoi, soBaiXong, tongSao, capNhat: serverTimestamp() };
}
// Ghi (vào batch b) 3 dòng của kỳ hiện tại, số liệu lấy đúng từ bản tổng hợp riêng.
export async function ghiDongBxh(b, uid, hsMoi) {
  const goc = `users/${uid}/hoSo/chinh`;
  const thang = kyThang(), tuan = kyTuan();
  const [th, thg, dongTuan] = await Promise.all([
    getDoc(doc(db, `${goc}/tongHop/tatCa`)),
    getDoc(doc(db, `${goc}/thang/${thang}`)),
    getDoc(doc(db, `bangXepHang/tuan-${tuan}/hoSo/${hsMoi.maCongKhai}`))
  ]);
  const a = th.exists() ? th.data() : { soBaiXong: 0, tongSao: 0 };
  const m = thg.exists() ? thg.data() : { soBaiXong: 0, tongSao: 0 };
  const w = dongTuan.exists() ? dongTuan.data() : { soBaiXong: 0, tongSao: 0 };
  b.set(doc(db, `bangXepHang/tat-ca/hoSo/${hsMoi.maCongKhai}`), dongBxh(hsMoi, a.soBaiXong, a.tongSao));
  b.set(doc(db, `bangXepHang/thang-${thang}/hoSo/${hsMoi.maCongKhai}`), dongBxh(hsMoi, m.soBaiXong, m.tongSao));
  b.set(doc(db, `bangXepHang/tuan-${tuan}/hoSo/${hsMoi.maCongKhai}`), dongBxh(hsMoi, w.soBaiXong, w.tongSao));
}
// Mọi kỳ (tháng, tuần) từ ngày tạo hồ sơ tới nay – để xoá sạch khi tắt xếp hạng hoặc xoá tài khoản
function moiKy(tuNgay) {
  const ky = ["tat-ca"];
  const dau = tuNgay instanceof Date ? tuNgay : new Date(Date.now() - 400 * 86400000);
  const nay = new Date();
  for (let d = new Date(Date.UTC(dau.getUTCFullYear(), dau.getUTCMonth(), 1)); d <= nay; d.setUTCMonth(d.getUTCMonth() + 1)) ky.push("thang-" + kyThang(d));
  const tuan = new Set();
  for (let d = new Date(dau.getTime() - 7 * 86400000); d <= new Date(nay.getTime() + 7 * 86400000); d = new Date(d.getTime() + 86400000)) tuan.add("tuan-" + kyTuan(d));
  return ky.concat([...tuan]);
}
export function xoaDongBxh(b, hs) {
  const ngay = hs.ngayTao && hs.ngayTao.toDate ? hs.ngayTao.toDate() : null;
  moiKy(ngay).forEach((ky) => b.delete(doc(db, `bangXepHang/${ky}/hoSo/${hs.maCongKhai}`)));
}

/* ================= Lưu hồ sơ (tạo / sửa), kèm cập nhật bảng xếp hạng ================= */
export async function luuHoSo(uid, duLieu, hsCu) {
  const hs = { ...duLieu, capNhat: serverTimestamp() };
  if (!hsCu) {
    hs.ngayTao = serverTimestamp();
    hs.maCongKhai = maNgauNhien(20);
    hs.dongYGiamHoLuc = DUOI_13.includes(hs.nhomTuoi) ? serverTimestamp() : null;
  } else {
    hs.ngayTao = hsCu.ngayTao;
    hs.maCongKhai = hsCu.maCongKhai;
    hs.dongYGiamHoLuc = DUOI_13.includes(hs.nhomTuoi) ? (hsCu.dongYGiamHoLuc || serverTimestamp()) : null;
  }
  // Ghi từng phần, tối đa 400 thao tác một lượt (giới hạn của Firestore là 500)
  const ds = [];
  let b = writeBatch(db), dem = 0;
  const them = (fn) => { fn(b); dem++; if (dem >= 400) { ds.push(b); b = writeBatch(db); dem = 0; } };
  them((x) => x.set(doc(db, "users", uid, "hoSo", "chinh"), hs));
  if (hs.choXepHang && !hsCu) {
    // Hồ sơ mới: rules xác nhận chủ dòng xếp hạng bằng hồ sơ đã có, nên ghi hồ sơ trước, dòng xếp hạng sau
    await b.commit();
    b = writeBatch(db); dem = 0;
    await ghiDongBxh(b, uid, hs); dem += 3;
  } else if (hs.choXepHang) {
    await ghiDongBxh(b, uid, hs); dem += 3;
  } else if (hsCu && hsCu.choXepHang) {
    xoaDongBxh({ delete: (r) => them((x) => x.delete(r)) }, hsCu);
  }
  ds.push(b);
  for (const lo of ds) await lo.commit();
  const hsSau = { ...hs };
  luuTam(uid, hsSau);
  return hsSau;
}

/* ================= Tải dữ liệu của tôi ================= */
function sangJson(v) {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(sangJson);
  if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v)) o[k] = sangJson(v[k]); return o; }
  return v;
}
export async function layDuLieu(uid) {
  const goc = `users/${uid}/hoSo/chinh`;
  const kq = { taiXuong: new Date().toISOString(), nguon: "Trường Tiếng Việt Của Em – vietclass.cvcec.org", taiKhoan: await docTaiKhoan(uid), hoSo: await docHoSo(uid) };
  for (const ten of ["tongHop", "thang", "bai", "lichSu"]) {
    const s = await getDocs(collection(db, `${goc}/${ten}`));
    kq[ten] = s.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  if (kq.hoSo && kq.hoSo.choXepHang) {
    const s = await getDoc(doc(db, `bangXepHang/tat-ca/hoSo/${kq.hoSo.maCongKhai}`));
    kq.bangXepHang = s.exists() ? s.data() : null;
  }
  return sangJson(kq);
}
export function taiTep(ten, noiDung) {
  const blob = new Blob([JSON.stringify(noiDung, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = ten;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ================= Xoá hồ sơ học viên / xoá tài khoản ================= */
async function xoaTheoLo(dsRef) {
  for (let i = 0; i < dsRef.length; i += 400) {
    const b = writeBatch(db);
    dsRef.slice(i, i + 400).forEach((r) => b.delete(r));
    await b.commit();
  }
}
// Xoá hồ sơ học viên và mọi dữ liệu học tập của hồ sơ (kể cả các dòng bảng xếp hạng)
export async function xoaHoSo(uid) {
  const goc = `users/${uid}/hoSo/chinh`;
  const hs = await docHoSo(uid);
  const ds = [];
  if (hs && hs.maCongKhai) xoaDongBxh({ delete: (r) => ds.push(r) }, hs);
  for (const ten of ["lichSu", "bai", "thang", "tongHop"]) {
    const s = await getDocs(collection(db, `${goc}/${ten}`));
    s.docs.forEach((d) => ds.push(d.ref));
  }
  await xoaTheoLo(ds);                                  // bảng xếp hạng phải xoá khi hồ sơ còn
  await xoaTheoLo([doc(db, goc)]);
  xoaTam();
}
// Xoá toàn bộ: hồ sơ, tiến độ, bảng xếp hạng, tài khoản trên Firestore, rồi tài khoản đăng nhập
export async function xoaTaiKhoan(user) {
  await xoaHoSo(user.uid);
  await xoaTheoLo([doc(db, "users", user.uid)]);
  xoaTam();
  await user.delete(); // cần đăng nhập gần đây; trang Hồ sơ lo phần đăng nhập lại
}

/* ================= Nút tài khoản trên thanh trên ================= */
const CHU_TK = {
  vi: { tkDangNhap: "Đăng nhập", tkGocHocTap: "Góc học tập của em", tkHoSo: "Hồ sơ", tkDangXuat: "Đăng xuất", tkHoanTat: "Hoàn tất đăng ký", tkMenu: "Tài khoản của {ten}", tkChao: "Chào {ten}!" },
  en: { tkDangNhap: "Sign in", tkGocHocTap: "My learning corner", tkHoSo: "Profile", tkDangXuat: "Sign out", tkHoanTat: "Finish signing up", tkMenu: "{ten}'s account", tkChao: "Hello, {ten}!" }
};
function chuTk(k, ten) { return CHU_TK[nn()][k].replace("{ten}", ten || ""); }
function veNutTaiKhoan(tt) {
  const cho = document.querySelectorAll("[data-cong-tk]");
  cho.forEach((o) => {
    o.textContent = "";
    if (!tt.user) {
      const a = document.createElement("a");
      a.className = "tk-nut";
      a.href = "/dang-nhap/?ve=" + encodeURIComponent(location.pathname + location.hash);
      a.textContent = chuTk("tkDangNhap");
      o.appendChild(a);
      return;
    }
    if (!tt.tomTat || tt.tomTat.chuaXong) {
      const a = document.createElement("a");
      a.className = "tk-nut";
      a.href = "/dang-nhap/";
      a.textContent = chuTk("tkHoanTat");
      o.appendChild(a);
      return;
    }
    const cv = conVat(tt.tomTat.conVat);
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "tk-nut";
    nut.setAttribute("aria-expanded", "false");
    nut.setAttribute("aria-haspopup", "true");
    nut.setAttribute("aria-label", chuTk("tkMenu", tt.tomTat.bietDanh));
    nut.innerHTML = '<span class="tk-con-vat" aria-hidden="true"></span><span class="tk-ten"></span>';
    nut.querySelector(".tk-con-vat").textContent = cv.e;
    nut.querySelector(".tk-ten").textContent = tt.tomTat.bietDanh;
    const menu = document.createElement("ul");
    menu.className = "tk-menu";
    menu.hidden = true;
    const dau = document.createElement("li");
    dau.className = "tk-menu-dau";
    dau.textContent = chuTk("tkChao", tt.tomTat.bietDanh);
    menu.appendChild(dau);
    [["/goc-hoc-tap/", "📚", "tkGocHocTap"], ["/ho-so/", "🪪", "tkHoSo"]].forEach(([href, icon, k]) => {
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = href;
      a.innerHTML = '<span aria-hidden="true"></span>';
      a.firstChild.textContent = icon;
      a.appendChild(document.createTextNode(chuTk(k)));
      li.appendChild(a); menu.appendChild(li);
    });
    const li = document.createElement("li"), ra = document.createElement("button");
    ra.type = "button";
    ra.innerHTML = '<span aria-hidden="true">🚪</span>';
    ra.appendChild(document.createTextNode(chuTk("tkDangXuat")));
    ra.addEventListener("click", () => dangXuat("/"));
    li.appendChild(ra); menu.appendChild(li);
    const dong = () => { menu.hidden = true; nut.setAttribute("aria-expanded", "false"); };
    nut.addEventListener("click", (e) => {
      e.stopPropagation();
      const mo = menu.hidden;
      menu.hidden = !mo;
      nut.setAttribute("aria-expanded", String(mo));
      if (mo) { const a = menu.querySelector("a"); if (a) a.focus(); }
    });
    document.addEventListener("click", (e) => { if (!o.contains(e.target)) dong(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { dong(); nut.focus(); } });
    o.appendChild(nut);
    o.appendChild(menu);
  });
}
let ttCuoi = null;
theoDoi((tt) => { ttCuoi = tt; veNutTaiKhoan(tt); });
if (window.CONG) window.CONG.khiDoiChu(() => { if (ttCuoi) veNutTaiKhoan(ttCuoi); });
