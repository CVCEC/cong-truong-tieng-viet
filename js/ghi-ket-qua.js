/*!
 * Ghi kết quả học vào tài khoản (module ES) – cổng vietclass.cvcec.org.
 * Góc học gọi TTV.ghiKetQua(...) (bộ mẫu chung) → tin nhắn "ttv-ket-qua" lên cổng → trang chủ
 * kiểm tra nguồn và phát sự kiện "cvcec-ket-qua" → module này ghi một lượt (docs/firestore.rules).
 * Mất mạng hoặc lỗi: giữ kết quả trong hàng chờ trên máy (khoá localStorage "cvcec-ket-qua-cho")
 * và gửi lại khi có mạng. Ghi lần lượt từng kết quả để số liệu tổng hợp luôn khớp.
 * Nạp SAU /js/tai-khoan.js:  <script type="module" src="/js/ghi-ket-qua.js?v=1"></script>
 */
import { auth, db } from "./firebase-cvcec.js";
import { doc, getDoc, collection, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { lamSachKetQua, tinhLuot, ganThoiGian, ngayCucBo, kyThang, kyTuan } from "./luot-choi.js";

const KHOA_CHO = "cvcec-ket-qua-cho";   // hàng chờ trên máy (đã ghi trong Chính sách bảo mật)
const TOI_DA_CHO = 200;

function docCho() {
  try { const v = JSON.parse(localStorage.getItem(KHOA_CHO) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function ghiCho(ds) {
  try {
    if (ds.length) localStorage.setItem(KHOA_CHO, JSON.stringify(ds.slice(-TOI_DA_CHO)));
    else localStorage.removeItem(KHOA_CHO);
  } catch (e) {}
}

async function ghiMotLuot(uid, kq, luc) {
  const goc = `users/${uid}/hoSo/chinh`;
  const thoiDiem = new Date(luc || Date.now());
  const ky = { thang: kyThang(thoiDiem), tuan: kyTuan(thoiDiem) };
  const homNay = ngayCucBo(thoiDiem);
  const maBai = `${kq.chuongTrinh}__${kq.bai}`;
  const [hs, bai, th, thg] = await Promise.all([
    getDoc(doc(db, goc)), getDoc(doc(db, `${goc}/bai/${maBai}`)),
    getDoc(doc(db, `${goc}/tongHop/tatCa`)), getDoc(doc(db, `${goc}/thang/${ky.thang}`))
  ]);
  if (!hs.exists()) return "khong-ho-so";
  const hoSo = hs.data();
  let tuanBxh = null;
  if (hoSo.choXepHang) {
    const t = await getDoc(doc(db, `bangXepHang/tuan-${ky.tuan}/hoSo/${hoSo.maCongKhai}`));
    tuanBxh = t.exists() ? t.data() : null;
  }
  const l = ganThoiGian(tinhLuot(kq, {
    hoSo, bai: bai.exists() ? bai.data() : null,
    tongHop: th.exists() ? th.data() : null, thang: thg.exists() ? thg.data() : null, tuanBxh
  }, ky, homNay), serverTimestamp());

  const b = writeBatch(db);
  b.set(doc(collection(db, `${goc}/lichSu`)), l.lichSu);
  b.set(doc(db, `${goc}/bai/${l.maBai}`), l.bai);
  b.set(doc(db, `${goc}/tongHop/tatCa`), l.tongHop);
  b.set(doc(db, `${goc}/thang/${ky.thang}`), l.thang);
  if (l.bxh) for (const kyBxh of Object.keys(l.bxh)) b.set(doc(db, `bangXepHang/${kyBxh}/hoSo/${hoSo.maCongKhai}`), l.bxh[kyBxh]);
  await b.commit();
  try { document.dispatchEvent(new CustomEvent("cvcec-da-ghi", { detail: { maBai: l.maBai, tongHop: { soBaiXong: l.tongHop.soBaiXong, chuoiNgay: l.tongHop.chuoiNgay } } })); } catch (e) {}
  return "da-ghi";
}

let dangGui = false;
async function guiHangCho() {
  if (dangGui) return;
  const user = auth.currentUser;
  if (!user) return;
  dangGui = true;
  try {
    let ds = docCho();
    while (ds.length) {
      const muc = ds[0];
      if (muc.uid !== user.uid) { ds.shift(); continue; }   // kết quả của tài khoản khác trên cùng máy: bỏ
      let kq;
      try { kq = await ghiMotLuot(user.uid, muc.kq, muc.luc); }
      catch (e) {
        // Rules từ chối (dữ liệu không hợp lệ): bỏ kết quả này; lỗi mạng: để lần sau gửi lại
        if (e && e.code === "permission-denied") { console.warn("Bỏ kết quả không hợp lệ", muc.kq, e); kq = "bo"; }
        else break;
      }
      ds = docCho(); ds.shift(); ghiCho(ds);
      if (kq === "khong-ho-so") break;
    }
  } finally { dangGui = false; }
}

document.addEventListener("cvcec-ket-qua", (e) => {
  const kq = lamSachKetQua(e.detail);
  const user = auth.currentUser;
  if (!kq || !user) return;
  const ds = docCho();
  ds.push({ uid: user.uid, kq, luc: Date.now() });
  ghiCho(ds);
  guiHangCho();
});
window.addEventListener("online", guiHangCho);
auth.onAuthStateChanged((u) => { if (u) guiHangCho(); });
