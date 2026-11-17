// Xuất dữ liệu nghiên cứu đã ẩn danh – Trường Tiếng Việt Của Em (CVCEC)
// Chỉ lấy hồ sơ có users/{uid}/hoSo/chinh/dongY/nghienCuu.dongY == true.
// Không xuất: họ tên, email, tên gọi, biệt danh, mã tài khoản, mã công khai. Mỗi lần xuất dùng mã ngẫu nhiên mới.
// Nước có dưới NGUONG người trong bộ dữ liệu được gộp thành "khac" để không đoán ra từng người.
//
// Chạy: GOOGLE_APPLICATION_CREDENTIALS=/duong/dan/khoa-quan-tri.json node xuat.mjs [thu-muc-ra]
// (khoá service account KHÔNG bao giờ đưa vào kho). Thử với trình giả lập: npm run thu
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const NGUONG = 10;
const PROJECT_ID = "truong-tieng-viet-cvcec";

// Nhãn bậc lấy từ bộ mẫu chung (tệp trên máy nếu có, không thì tải từ mau.cvcec.org)
async function napLoTrinh() {
  let ma;
  try { ma = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../../mau-chung/v1/ttv-lo-trinh.js"), "utf8"); }
  catch (e) { ma = await (await fetch("https://mau.cvcec.org/v1/ttv-lo-trinh.js")).text(); }
  const hop = { window: {} };
  vm.runInNewContext(ma, hop);
  return hop.window.TTV_LO_TRINH;
}

function csv(hang) {
  const o = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  return hang.map((h) => h.map(o).join(",")).join("\n") + "\n";
}
const ngay = (t) => (t && t.toDate ? t.toDate().toISOString().slice(0, 10) : "");

export async function xuat(db, thuMucRa) {
  const L = await napLoTrinh();
  const dongY = await db.collectionGroup("dongY").get();
  const nguoiHoc = [], lichSu = [];
  for (const d of dongY.docs) {
    if (d.id !== "nghienCuu" || d.data().dongY !== true) continue;
    const refHs = d.ref.parent.parent;                 // users/{uid}/hoSo/chinh
    if (!refHs || refHs.id !== "chinh") continue;
    const hs = await refHs.get();
    if (!hs.exists) continue;
    const h = hs.data();
    const ma = "NH-" + randomBytes(6).toString("hex"); // mã ngẫu nhiên mới cho lần xuất này
    nguoiHoc.push({ ma, nhomTuoi: h.nhomTuoi, doiTuong: h.doiTuong, nuoc: h.nuoc, dongYTu: ngay(d.data().luc) });
    const ls = await refHs.collection("lichSu").get();
    ls.docs.forEach((x) => {
      const r = x.data();
      const nh = L ? L.nhanCuaBai(r.chuongTrinh, r.bai) : null;
      lichSu.push([ma, ngay(r.thoiDiem), r.chuongTrinh, r.bai, nh ? nh.bac : "", r.hoatDong, r.ketQua, r.diem, r.diemToiDa, r.sao, r.thoiGianGiay]);
    });
  }
  // Gộp nước ít người
  const demNuoc = {};
  nguoiHoc.forEach((n) => { demNuoc[n.nuoc] = (demNuoc[n.nuoc] || 0) + 1; });
  nguoiHoc.forEach((n) => { if (demNuoc[n.nuoc] < NGUONG) n.nuoc = "khac"; });
  // Xáo thứ tự để thứ tự dòng không lộ thứ tự tài khoản
  nguoiHoc.sort(() => Math.random() - 0.5);
  lichSu.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));

  mkdirSync(thuMucRa, { recursive: true });
  writeFileSync(join(thuMucRa, "nguoi-hoc.csv"), csv([["ma", "nhom_tuoi", "doi_tuong", "nuoc", "dong_y_tu"], ...nguoiHoc.map((n) => [n.ma, n.nhomTuoi, n.doiTuong, n.nuoc, n.dongYTu])]));
  writeFileSync(join(thuMucRa, "lich-su.csv"), csv([["ma", "ngay", "goc_hoc", "bai", "bac", "hoat_dong", "ket_qua", "diem", "diem_toi_da", "sao", "thoi_gian_giay"], ...lichSu]));
  writeFileSync(join(thuMucRa, "DOC-TOI.txt"), `Dữ liệu nghiên cứu đã ẩn danh – Trường Tiếng Việt Của Em (CVCEC)
Xuất lúc: ${new Date().toISOString()}
Số người học (đã đồng ý): ${nguoiHoc.length}; số lượt chơi: ${lichSu.length}
Chỉ dùng cho nghiên cứu đã được hội đồng đạo đức nghiên cứu phê duyệt. Không tìm cách nhận diện người học.
Nước có dưới ${NGUONG} người được ghi là "khac". Mã người học đổi mỗi lần xuất. Bậc theo TTV_LO_TRINH ${L ? L.phienBan : "?"}.
`);
  return { nguoiHoc: nguoiHoc.length, lichSu: lichSu.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = initializeApp(process.env.FIRESTORE_EMULATOR_HOST ? { projectId: PROJECT_ID } : { credential: applicationDefault(), projectId: PROJECT_ID });
  const ra = process.argv[2] || "du-lieu-nghien-cuu-" + new Date().toISOString().slice(0, 10);
  const kq = await xuat(getFirestore(app), ra);
  console.log(`Đã xuất ${kq.nguoiHoc} người học, ${kq.lichSu} lượt chơi vào ${ra}/`);
}
