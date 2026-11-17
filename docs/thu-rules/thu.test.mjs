// Thử Security Rules trên trình giả lập Firestore (không đụng tới dự án thật)
import { readFileSync } from 'node:fs';
import { test, before, after, beforeEach } from 'node:test';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, writeBatch, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

let env;
const RULES = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'truong-tieng-viet-cvcec', firestore: { rules: RULES, host: '127.0.0.1', port: 8080 } });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

const ma20 = (c) => (c.repeat(20)).slice(0, 20);
const nguoi = (uid, email) => env.authenticatedContext(uid, { email }).firestore();
const taiKhoan = (o = {}) => ({ hoTen: 'Phụ Huynh A', email: 'a@x.org', ngayTao: serverTimestamp(), nuoc: 'CA', vaiTro: 'phu-huynh', nhomTuoi: '18+', dongYLuc: serverTimestamp(), phienBanDieuKhoan: '2026-11', ...o });
const hoSo = (o = {}) => ({ tenGoi: 'Bé Na', bietDanh: 'Mèo Con', conVat: 'meo', nhomTuoi: '6-9', doiTuong: 'con-em-kieu-bao', nuoc: 'CA', choXepHang: true, maCongKhai: ma20('A'), dongYGiamHoLuc: serverTimestamp(), ngayTao: serverTimestamp(), capNhat: serverTimestamp(), ...o });

async function taoTaiKhoanVaHoSo(db, uid, tk = {}, hs = {}) {
  await assertSucceeds(setDoc(doc(db, 'users', uid), taiKhoan(tk)));
  await assertSucceeds(setDoc(doc(db, 'users', uid, 'hoSo', 'chinh'), hoSo(hs)));
}

// Giống cách cổng sẽ ghi một lượt chơi (đọc trạng thái hiện tại rồi ghi một lượt)
async function ghiLuot(db, uid, { ct = 'baihoc', bai = 'bai-12', hd = 'g1', sao = 3, soTroChoi = 2, giay = 120, ngay = '2026-11-16', thang = '2026-11', tuan = '2026-W47', sua = {} } = {}) {
  const goc = `users/${uid}/hoSo/chinh`;
  const maBai = `${ct}__${bai}`;
  const hs = (await getDoc(doc(db, goc))).data();
  const baiCu = (await getDoc(doc(db, `${goc}/bai/${maBai}`))).data();
  const thCu = (await getDoc(doc(db, `${goc}/tongHop/tatCa`))).data() || { soBaiXong: 0, tongSao: 0, tongGiay: 0, soHoatDong: 0, chuoiNgay: 0, theoChuongTrinh: {} };
  const thgCu = (await getDoc(doc(db, `${goc}/thang/${thang}`))).data() || { soBaiXong: 0, tongSao: 0, tongGiay: 0, soHoatDong: 0, ngay: {} };
  const saoTroChoi = { ...(baiCu ? baiCu.saoTroChoi : {}) };
  const truoc = saoTroChoi[hd] || 0;
  saoTroChoi[hd] = Math.max(truoc, sao);
  const tang = saoTroChoi[hd] - truoc;
  const daXong = !!(baiCu && baiCu.xong);
  const xongMoi = !daXong && Object.keys(saoTroChoi).length >= soTroChoi;
  const b = writeBatch(db);
  b.set(doc(collection(db, `${goc}/lichSu`)), { thoiDiem: serverTimestamp(), chuongTrinh: ct, bai, hoatDong: hd, ketQua: 'hoan-thanh', diem: 8, diemToiDa: 10, sao, thoiGianGiay: giay, ...(sua.lichSu || {}) });
  b.set(doc(db, `${goc}/bai/${maBai}`), { chuongTrinh: ct, bai, saoTroChoi, tongSao: (baiCu ? baiCu.tongSao : 0) + tang, soTroChoi, xong: daXong || xongMoi, xongLuc: daXong ? baiCu.xongLuc : (xongMoi ? serverTimestamp() : null), lanCuoi: serverTimestamp(), hoatDongCuoi: hd, ...(sua.bai || {}) });
  const th = { soBaiXong: thCu.soBaiXong + (xongMoi ? 1 : 0), tongSao: thCu.tongSao + tang, tongGiay: thCu.tongGiay + giay, soHoatDong: thCu.soHoatDong + 1, chuoiNgay: Math.max(1, thCu.chuoiNgay), ngayHocCuoi: ngay, theoChuongTrinh: thCu.theoChuongTrinh || {}, baiCuoi: maBai, capNhat: serverTimestamp(), ...(sua.tongHop || {}) };
  if (!sua.boTongHop) b.set(doc(db, `${goc}/tongHop/tatCa`), th);
  const ngayTh = { ...(thgCu.ngay || {}) };
  if (!sua.boThang) b.set(doc(db, `${goc}/thang/${thang}`), { soBaiXong: thgCu.soBaiXong + (xongMoi ? 1 : 0), tongSao: thgCu.tongSao + tang, tongGiay: thgCu.tongGiay + giay, soHoatDong: thgCu.soHoatDong + 1, ngay: ngayTh, capNhat: serverTimestamp(), ...(sua.thang || {}) });
  if (hs.choXepHang && !sua.boBxh) {
    const dong = (so, sao2) => ({ bietDanh: hs.bietDanh, conVat: hs.conVat, nuoc: hs.nuoc, nhomTuoi: hs.nhomTuoi, soBaiXong: so, tongSao: sao2, capNhat: serverTimestamp() });
    const tuanCu = (await getDoc(doc(db, `bangXepHang/tuan-${tuan}/hoSo/${hs.maCongKhai}`))).data() || { soBaiXong: 0, tongSao: 0 };
    b.set(doc(db, `bangXepHang/tat-ca/hoSo/${hs.maCongKhai}`), { ...dong(th.soBaiXong, th.tongSao), ...(sua.bxh || {}) });
    b.set(doc(db, `bangXepHang/thang-${thang}/hoSo/${hs.maCongKhai}`), dong(thgCu.soBaiXong + (xongMoi ? 1 : 0), thgCu.tongSao + tang));
    b.set(doc(db, `bangXepHang/tuan-${tuan}/hoSo/${hs.maCongKhai}`), dong(tuanCu.soBaiXong + (xongMoi ? 1 : 0), tuanCu.tongSao + tang));
  }
  return b.commit();
}

// ---------------- Tài khoản ----------------
test('chưa đăng nhập không đọc/ghi được tài khoản', async () => {
  const a = nguoi('a', 'a@x.org');
  await setDoc(doc(a, 'users', 'a'), taiKhoan());
  const khach = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(khach, 'users', 'a')));
  await assertFails(setDoc(doc(khach, 'users', 'x'), taiKhoan()));
});
test('tạo tài khoản hợp lệ; thiếu đồng ý hoặc dưới 13 tuổi thì bị chặn', async () => {
  const a = nguoi('a', 'a@x.org');
  await assertFails(setDoc(doc(a, 'users', 'a'), taiKhoan({ nhomTuoi: 'duoi-13' })));
  const { dongYLuc, ...thieu } = taiKhoan();
  await assertFails(setDoc(doc(a, 'users', 'a'), thieu));
  await assertFails(setDoc(doc(a, 'users', 'a'), taiKhoan({ email: 'khac@x.org' })));
  await assertSucceeds(setDoc(doc(a, 'users', 'a'), taiKhoan()));
});
test('tài khoản cũ (trang thử) được bổ sung đủ ô', async () => {
  await env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), 'users', 'a'), { hoTen: 'Cũ', email: 'a@x.org', ngayTao: new Date() }); });
  const a = nguoi('a', 'a@x.org');
  const cu = (await getDoc(doc(a, 'users', 'a'))).data();
  await assertSucceeds(setDoc(doc(a, 'users', 'a'), { ...taiKhoan(), ngayTao: cu.ngayTao }));
});
test('A không đọc được tài khoản, hồ sơ, tổng hợp, lịch sử của B', async () => {
  const b = nguoi('b', 'b@x.org');
  await taoTaiKhoanVaHoSo(b, 'b', { email: 'b@x.org' }, { maCongKhai: ma20('B') });
  await assertSucceeds(ghiLuot(b, 'b'));
  const a = nguoi('a', 'a@x.org');
  await assertFails(getDoc(doc(a, 'users', 'b')));
  await assertFails(getDoc(doc(a, 'users/b/hoSo/chinh')));
  await assertFails(getDoc(doc(a, 'users/b/hoSo/chinh/tongHop/tatCa')));
  await assertFails(getDocs(collection(a, 'users/b/hoSo/chinh/lichSu')));
  await assertFails(setDoc(doc(a, 'users/b/hoSo/chinh'), hoSo()));
});

// ---------------- Hồ sơ ----------------
test('mỗi tài khoản đúng 1 hồ sơ "chinh"', async () => {
  const a = nguoi('a', 'a@x.org');
  await setDoc(doc(a, 'users', 'a'), taiKhoan());
  await assertFails(setDoc(doc(a, 'users/a/hoSo/thu-hai'), hoSo()));
  await assertSucceeds(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo()));
});
test('hồ sơ dưới 13 tuổi: bắt buộc cha mẹ đồng ý và chủ tài khoản 18+', async () => {
  const a = nguoi('a', 'a@x.org');
  await setDoc(doc(a, 'users', 'a'), taiKhoan());
  await assertFails(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ dongYGiamHoLuc: null })));
  const t = nguoi('t', 't@x.org');
  await setDoc(doc(t, 'users', 't'), taiKhoan({ email: 't@x.org', nhomTuoi: '13-17', vaiTro: 'nguoi-hoc' }));
  await assertFails(setDoc(doc(t, 'users/t/hoSo/chinh'), hoSo()));
  await assertSucceeds(setDoc(doc(t, 'users/t/hoSo/chinh'), hoSo({ nhomTuoi: '13-17', dongYGiamHoLuc: null })));
});
test('biệt danh: tối đa 20 ký tự, không email, không số điện thoại', async () => {
  const a = nguoi('a', 'a@x.org');
  await setDoc(doc(a, 'users', 'a'), taiKhoan());
  await assertFails(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ bietDanh: 'be@gmail.com' })));
  await assertFails(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ bietDanh: 'Na 647 897 2358' })));
  await assertFails(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ bietDanh: 'Một biệt danh dài quá hai mươi' })));
  await assertFails(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ conVat: 'rong' })));
  await assertSucceeds(setDoc(doc(a, 'users/a/hoSo/chinh'), hoSo({ bietDanh: 'Na lớp 3' })));
});
test('không đổi được mã công khai của hồ sơ', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await assertFails(updateDoc(doc(a, 'users/a/hoSo/chinh'), { maCongKhai: ma20('Z'), capNhat: serverTimestamp() }));
  await assertSucceeds(updateDoc(doc(a, 'users/a/hoSo/chinh'), { bietDanh: 'Mèo Vàng', capNhat: serverTimestamp() }));
});

// ---------------- Ghi tiến độ ----------------
test('ghi lượt chơi hợp lệ; xong bài một lần; chơi lại giữ sao cao nhất', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await assertSucceeds(ghiLuot(a, 'a', { hd: 'g1', sao: 2 }));
  await assertSucceeds(ghiLuot(a, 'a', { hd: 'g2', sao: 3 }));          // đủ 2 trò → xong bài
  await assertSucceeds(ghiLuot(a, 'a', { hd: 'g1', sao: 1 }));          // chơi lại kém hơn: giữ 2 sao
  await assertSucceeds(ghiLuot(a, 'a', { hd: 'g1', sao: 3 }));          // chơi lại tốt hơn: lên 3 sao
  const th = (await getDoc(doc(a, 'users/a/hoSo/chinh/tongHop/tatCa'))).data();
  const bxh = (await getDoc(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`))).data();
  const tuan = (await getDoc(doc(a, `bangXepHang/tuan-2026-W47/hoSo/${ma20('A')}`))).data();
  if (th.soBaiXong !== 1 || th.tongSao !== 6 || th.soHoatDong !== 4) throw new Error('tổng hợp sai ' + JSON.stringify(th));
  if (bxh.soBaiXong !== 1 || bxh.tongSao !== 6 || tuan.tongSao !== 6) throw new Error('bảng xếp hạng sai');
});
test('gian lận: sao > 3, tự cộng sao/bài, sửa riêng kết quả bài, tháng hoặc bảng xếp hạng → bị chặn', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await assertFails(ghiLuot(a, 'a', { sao: 5 }));
  await assertFails(ghiLuot(a, 'a', { sua: { tongHop: { tongSao: 9 } } }));
  await assertFails(ghiLuot(a, 'a', { sua: { tongHop: { soBaiXong: 1 } } }));
  await assertFails(ghiLuot(a, 'a', { giay: 99999 }));
  await assertFails(ghiLuot(a, 'a', { sua: { boTongHop: true } }));
  await assertFails(ghiLuot(a, 'a', { sua: { thang: { tongSao: 50 } } }));
  await assertFails(ghiLuot(a, 'a', { sua: { bxh: { tongSao: 500 } } }));
  await assertFails(ghiLuot(a, 'a', { sua: { bai: { xong: true, xongLuc: serverTimestamp() } } }));   // chưa chơi đủ trò mà báo xong
  await assertFails(ghiLuot(a, 'a', { sua: { lichSu: { diem: 50 } } }));
  await assertSucceeds(ghiLuot(a, 'a', { hd: 'g1', sao: 3 }));
  // hạ sao đã có xuống
  await assertFails(ghiLuot(a, 'a', { hd: 'g1', sao: 3, sua: { bai: { saoTroChoi: { g1: 1 }, tongSao: 1 }, tongHop: { tongSao: 1 } } }));
  // sửa dòng bảng xếp hạng riêng lẻ
  await assertFails(setDoc(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 100, tongSao: 300, capNhat: serverTimestamp() }));
  // lịch sử không sửa được
  const ls = await getDocs(collection(a, 'users/a/hoSo/chinh/lichSu'));
  await assertFails(updateDoc(ls.docs[0].ref, { sao: 3 }));
});
test('hồ sơ không cho xếp hạng thì không ghi được lên bảng; người khác không ghi thay được', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a', {}, { choXepHang: false });
  await assertSucceeds(ghiLuot(a, 'a'));
  await assertFails(setDoc(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 3, capNhat: serverTimestamp() }));
  const b = nguoi('b', 'b@x.org');
  await taoTaiKhoanVaHoSo(b, 'b', { email: 'b@x.org' }, { maCongKhai: ma20('B') });
  await assertFails(setDoc(doc(b, `bangXepHang/tat-ca/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 0, capNhat: serverTimestamp() }));
});
test('bật xếp hạng sau khi đã học: dòng mới phải khớp số liệu thật; tắt thì xoá được', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a', {}, { choXepHang: false });
  await assertSucceeds(ghiLuot(a, 'a', { sao: 2 }));
  const b = writeBatch(a);
  b.update(doc(a, 'users/a/hoSo/chinh'), { choXepHang: true, capNhat: serverTimestamp() });
  b.set(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 2, capNhat: serverTimestamp() });
  b.set(doc(a, `bangXepHang/thang-2026-11/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 2, capNhat: serverTimestamp() });
  b.set(doc(a, `bangXepHang/tuan-2026-W47/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 0, capNhat: serverTimestamp() });
  await assertSucceeds(b.commit());
  const sai = writeBatch(a);
  sai.set(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`), { bietDanh: 'Mèo Con', conVat: 'meo', nuoc: 'CA', nhomTuoi: '6-9', soBaiXong: 0, tongSao: 30, capNhat: serverTimestamp() });
  await assertFails(sai.commit());
  await assertSucceeds(deleteDoc(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`)));
});
test('ai cũng đọc được bảng xếp hạng (top 50), không có tên thật hay email', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await assertSucceeds(ghiLuot(a, 'a'));
  const khach = env.unauthenticatedContext().firestore();
  const kq = await assertSucceeds(getDocs(query(collection(khach, 'bangXepHang/tat-ca/hoSo'), orderBy('soBaiXong', 'desc'), limit(50))));
  const d = kq.docs[0].data();
  if ('tenGoi' in d || 'email' in d || 'hoTen' in d) throw new Error('lộ thông tin');
});

// ---------------- Xoá tài khoản, quản trị viên ----------------
test('chủ tài khoản xoá được toàn bộ dữ liệu của mình', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await assertSucceeds(ghiLuot(a, 'a'));
  const b = writeBatch(a);
  for (const ky of ['tat-ca', 'thang-2026-11', 'tuan-2026-W47']) b.delete(doc(a, `bangXepHang/${ky}/hoSo/${ma20('A')}`));
  for (const ten of ['lichSu', 'bai', 'thang', 'tongHop']) for (const d of (await getDocs(collection(a, `users/a/hoSo/chinh/${ten}`))).docs) b.delete(d.ref);
  b.delete(doc(a, 'users/a/hoSo/chinh'));
  b.delete(doc(a, 'users/a'));
  await assertSucceeds(b.commit());
  await env.withSecurityRulesDisabled(async (c) => {
    const con = await getDocs(collection(c.firestore(), 'users/a/hoSo/chinh/lichSu'));
    const bxh = await getDocs(collection(c.firestore(), 'bangXepHang/tat-ca/hoSo'));
    if (!con.empty || !bxh.empty || (await getDoc(doc(c.firestore(), 'users/a'))).exists()) throw new Error('còn sót dữ liệu');
  });
});
test('quản trị viên chỉ xem, không sửa; không ai tự thêm mình làm quản trị viên', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  await env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), 'admins', 'qt'), { ten: 'Quản trị' }); });
  const qt = nguoi('qt', 'qt@x.org');
  await assertSucceeds(getDoc(doc(qt, 'users/a/hoSo/chinh')));
  await assertFails(updateDoc(doc(qt, 'users/a/hoSo/chinh'), { bietDanh: 'Đổi', capNhat: serverTimestamp() }));
  await assertFails(setDoc(doc(a, 'admins', 'a'), { ten: 'Tự phong' }));
});

// ---------------- Cổng ghi kết quả bằng js/luot-choi.js (đúng mã trang dùng) ----------------
import { lamSachKetQua, tinhLuot, ganThoiGian } from '../../js/luot-choi.js';
async function ghiBangCong(db, uid, tin, ky = { thang: '2026-11', tuan: '2026-W47' }, homNay = '2026-11-17') {
  const goc = `users/${uid}/hoSo/chinh`;
  const kq = lamSachKetQua(tin);
  if (!kq) throw new Error('kết quả không hợp lệ');
  const maBai = `${kq.chuongTrinh}__${kq.bai}`;
  const lay = async (p) => { const s = await getDoc(doc(db, p)); return s.exists() ? s.data() : null; };
  const hoSo = await lay(goc);
  const tuanBxh = hoSo.choXepHang ? await lay(`bangXepHang/tuan-${ky.tuan}/hoSo/${hoSo.maCongKhai}`) : null;
  const l = ganThoiGian(tinhLuot(kq, { hoSo, bai: await lay(`${goc}/bai/${maBai}`), tongHop: await lay(`${goc}/tongHop/tatCa`), thang: await lay(`${goc}/thang/${ky.thang}`), tuanBxh }, ky, homNay), serverTimestamp());
  const b = writeBatch(db);
  b.set(doc(collection(db, `${goc}/lichSu`)), l.lichSu);
  b.set(doc(db, `${goc}/bai/${l.maBai}`), l.bai);
  b.set(doc(db, `${goc}/tongHop/tatCa`), l.tongHop);
  b.set(doc(db, `${goc}/thang/${ky.thang}`), l.thang);
  if (l.bxh) for (const k of Object.keys(l.bxh)) b.set(doc(db, `bangXepHang/${k}/hoSo/${hoSo.maCongKhai}`), l.bxh[k]);
  return b.commit();
}
test('cổng ghi kết quả từ TTV.ghiKetQua: xong bài, giữ sao cao nhất, chuỗi ngày, bảng xếp hạng', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a');
  const tin = (o) => ({ loai: 'ttv-ket-qua', chuongTrinh: 'vuihoc', bai: 'q1-b01', hoatDong: 'tn1', soTroChoi: 2, diem: 8, diemToiDa: 10, sao: 2, thoiGianGiay: 90, ketQua: 'hoan-thanh', ...o });
  await assertSucceeds(ghiBangCong(a, 'a', tin({}), undefined, '2026-11-16'));
  await assertSucceeds(ghiBangCong(a, 'a', tin({ hoatDong: 'tn2', sao: 3 }), undefined, '2026-11-17'));   // đủ 2 trò → xong; ngày kế tiếp → chuỗi 2
  await assertSucceeds(ghiBangCong(a, 'a', tin({ sao: 1 }), undefined, '2026-11-17'));                    // chơi lại kém hơn: giữ 2 sao
  await assertSucceeds(ghiBangCong(a, 'a', tin({ chuongTrinh: 'baihoc', bai: 'bai-3', hoatDong: 'g1', soTroChoi: 11, sao: 3 }), undefined, '2026-11-17'));
  const th = (await getDoc(doc(a, 'users/a/hoSo/chinh/tongHop/tatCa'))).data();
  if (th.soBaiXong !== 1 || th.tongSao !== 8 || th.soHoatDong !== 4 || th.chuoiNgay !== 2) throw new Error('tổng hợp sai ' + JSON.stringify(th));
  if (th.theoChuongTrinh.vuihoc.soBaiXong !== 1 || th.theoChuongTrinh.baihoc.tongSao !== 3) throw new Error('theo góc sai ' + JSON.stringify(th.theoChuongTrinh));
  const bxh = (await getDoc(doc(a, `bangXepHang/tat-ca/hoSo/${ma20('A')}`))).data();
  if (bxh.tongSao !== 8 || bxh.soBaiXong !== 1) throw new Error('bảng xếp hạng sai');
  // Tin nhắn sai dạng bị loại trước khi ghi
  if (lamSachKetQua(tin({ chuongTrinh: 'Vui Học' })) !== null) throw new Error('phải loại mã góc sai');
});
test('cổng ghi kết quả khi hồ sơ tắt xếp hạng (không đụng bảng xếp hạng)', async () => {
  const a = nguoi('a', 'a@x.org');
  await taoTaiKhoanVaHoSo(a, 'a', {}, { choXepHang: false });
  await assertSucceeds(ghiBangCong(a, 'a', { chuongTrinh: 'nguphap', bai: 'bai-12', hoatDong: 'tro-1', soTroChoi: 3, diem: 3, diemToiDa: 3, sao: 3, thoiGianGiay: 60 }));
  await assertSucceeds(ghiBangCong(a, 'a', { chuongTrinh: 'nguphap', bai: 'bai-12', hoatDong: 'tro-2', soTroChoi: 3, diem: 1, diemToiDa: 3, sao: 1, thoiGianGiay: 9999 }));
  const th = (await getDoc(doc(a, 'users/a/hoSo/chinh/tongHop/tatCa'))).data();
  if (th.tongGiay !== 60 + 7200 || th.tongSao !== 4) throw new Error('tổng hợp sai ' + JSON.stringify(th));
});
