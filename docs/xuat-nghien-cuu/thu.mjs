// Thử công cụ xuất trên trình giả lập (không đụng dự án thật): 12 người học, 11 đồng ý.
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync, rmSync } from "node:fs";
import { xuat } from "./xuat.mjs";
const db = getFirestore(initializeApp({ projectId: "truong-tieng-viet-cvcec" }));
for (let i = 0; i < 12; i++) {
  const goc = db.doc(`users/u${i}/hoSo/chinh`);
  await db.doc(`users/u${i}`).set({ hoTen: "Tên Thật " + i, email: `u${i}@x.org` });
  await goc.set({ tenGoi: "Bé " + i, bietDanh: "Mèo " + i, nhomTuoi: "6-9", doiTuong: "nguoi-nuoc-ngoai", nuoc: i === 0 ? "FR" : "CA", maCongKhai: "X".repeat(20) });
  if (i !== 5) await goc.collection("dongY").doc("nghienCuu").set({ dongY: true, luc: Timestamp.now(), phienBan: "2026-11-17" });
  await goc.collection("lichSu").add({ thoiDiem: Timestamp.now(), chuongTrinh: "baihoc", bai: "bai-12", hoatDong: "g1", ketQua: "hoan-thanh", diem: 8, diemToiDa: 10, sao: 2, thoiGianGiay: 60 });
}
const ra = "/tmp/claude-0/-home-user-mau-chung/8cbce97b-a4ea-53e9-ae7a-3ecb4a0a8ba8/scratchpad/xuat-thu";
rmSync(ra, { recursive: true, force: true });
const kq = await xuat(db, ra);
const nh = readFileSync(ra + "/nguoi-hoc.csv", "utf8"), ls = readFileSync(ra + "/lich-su.csv", "utf8");
const tatCa = nh + ls;
if (kq.nguoiHoc !== 11 || kq.lichSu !== 11) throw new Error("sai số lượng " + JSON.stringify(kq));
for (const cam of ["Tên Thật", "@x.org", "Mèo ", "Bé ", "u1,", "XXXX", "FR"]) if (tatCa.includes(cam)) throw new Error("lộ thông tin: " + cam);
if (!ls.includes(",2,") && !ls.includes("bai-12,0,")) throw new Error("thiếu bậc");
console.log("ĐẠT", kq); console.log(nh.split("\n").slice(0, 3).join("\n")); console.log(ls.split("\n").slice(0, 2).join("\n"));
