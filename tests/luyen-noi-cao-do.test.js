// Kiểm thử phần dò cao độ của trang Luyện nói (luyen-noi/cao-do.js).
// Chạy: node --test tests/
// Tạo sóng âm giả có cao độ đi lên, đi xuống, đi ngang (kèm lặng hai đầu và chút tiếng ồn),
// rồi kiểm tra máy nhận đúng hướng, đo mốc đúng và chấm điểm hợp lý.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const CaoDo = require("../luyen-noi/cao-do.js");

// Ngẫu nhiên có hạt giống để kết quả lặp lại được
function taoNgauNhien(hat) { let s = hat >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** Sóng giả giống giọng nói: tần số cơ bản + bội âm, cao độ đi theo hàm f(u), u từ 0→1. */
function taoSong({ sr = 48000, giay = 0.6, lang = 0.3, f, onAm = 0.01, hat = 1 }) {
  const rnd = taoNgauNhien(hat);
  const nLang = Math.round(lang * sr), nTieng = Math.round(giay * sr);
  const mau = new Float32Array(nLang * 2 + nTieng);
  let pha = 0;
  for (let i = 0; i < mau.length; i++) {
    let v = (rnd() * 2 - 1) * onAm;
    const k = i - nLang;
    if (k >= 0 && k < nTieng) {
      const u = k / nTieng;
      pha += 2 * Math.PI * f(u) / sr;
      const bao = Math.min(1, k / (0.03 * sr), (nTieng - k) / (0.03 * sr)); // vào ra êm
      v += 0.5 * bao * (Math.sin(pha) + 0.5 * Math.sin(2 * pha) + 0.3 * Math.sin(3 * pha) + 0.15 * Math.sin(4 * pha));
    }
    mau[i] = v;
  }
  return { mau, sr };
}

function duongTu(song, moc) {
  const pt = CaoDo.phanTich(song.mau, song.sr);
  const d = CaoDo.duongGiong(pt, moc);
  assert.ok(d, "phải tìm thấy tiếng");
  return d;
}

const GIONG = [
  { ten: "trẻ em", moc: 280 },
  { ten: "nữ", moc: 210 },
  { ten: "nam", moc: 115 }
];

for (const g of GIONG) {
  test(`giọng ${g.ten}: đường đi lên được nhận là "lên"`, () => {
    const s = taoSong({ f: u => g.moc * Math.pow(2, (-2 + 6 * u) / 12) });
    const d = duongTu(s, g.moc);
    assert.equal(CaoDo.huong(d.diem.map(p => p.st)), "len");
  });
  test(`giọng ${g.ten}: đường đi xuống được nhận là "xuống"`, () => {
    const s = taoSong({ f: u => g.moc * Math.pow(2, (2 - 6 * u) / 12), hat: 2 });
    const d = duongTu(s, g.moc);
    assert.equal(CaoDo.huong(d.diem.map(p => p.st)), "xuong");
  });
  test(`giọng ${g.ten}: đường đi ngang được nhận là "ngang"`, () => {
    const s = taoSong({ f: () => g.moc, hat: 3 });
    const d = duongTu(s, g.moc);
    assert.equal(CaoDo.huong(d.diem.map(p => p.st)), "ngang");
    const tb = d.diem.reduce((a, p) => a + p.st, 0) / d.diem.length;
    assert.ok(Math.abs(tb) < 0.3, `cao độ trung bình phải gần mốc (lệch ${tb.toFixed(2)} st)`);
  });
  test(`giọng ${g.ten}: đo mốc giọng sai dưới 2%`, () => {
    const s = taoSong({ f: () => g.moc, giay: 1.2, hat: 4 });
    const moc = CaoDo.doMoc(CaoDo.phanTich(s.mau, s.sr));
    assert.ok(Math.abs(moc / g.moc - 1) < 0.02, `đo được ${moc} Hz, cần ${g.moc} Hz`);
  });
}

test("chạy được với tần số lấy mẫu 44,1 kHz và 16 kHz", () => {
  for (const sr of [44100, 16000]) {
    const s = taoSong({ sr, f: u => 250 * Math.pow(2, (-3 + 6 * u) / 12) });
    assert.equal(CaoDo.huong(duongTu(s, 250).diem.map(p => p.st)), "len");
  }
});

test("chỉ có tiếng ồn hoặc im lặng: không có đường giọng, không có mốc", () => {
  const rnd = taoNgauNhien(9);
  const on = new Float32Array(48000).map(() => (rnd() * 2 - 1) * 0.2);
  const pt = CaoDo.phanTich(on, 48000);
  assert.equal(CaoDo.duongGiong(pt, 250), null);
  assert.equal(CaoDo.doMoc(pt), null);
  const lang = new Float32Array(48000);
  assert.equal(CaoDo.duongGiong(CaoDo.phanTich(lang, 48000), 250), null);
});

test("khung lặng hai đầu bị bỏ: đường giọng nằm trong đoạn có tiếng", () => {
  const s = taoSong({ f: () => 250, lang: 0.4, giay: 0.5 });
  const d = duongTu(s, 250);
  assert.ok(d.batDau > 0.35 && d.ketThuc < 0.95, `đoạn tiếng ${d.batDau}–${d.ketThuc} s`);
});

test("chấm điểm: đọc đúng hình dáng thì điểm cao, sai hướng thì điểm thấp", () => {
  const moc = 260;
  const theoMau = (mau) => taoSong({ f: u => moc * Math.pow(2, CaoDo.giaTriMau(mau, u) / 12), hat: 5 });
  for (const giong of ["hanoi", "saigon"]) {
    const sac = CaoDo.layMau(giong, "sac"), huyen = CaoDo.layMau(giong, "huyen"), ngang = CaoDo.layMau(giong, "ngang");
    const docSac = duongTu(theoMau(sac), moc);
    const docHuyen = duongTu(theoMau(huyen), moc);
    const docNgang = duongTu(theoMau(ngang), moc);
    assert.ok(CaoDo.chamDiem(docSac, sac).diem >= 80, `${giong}: sắc đọc đúng`);
    assert.ok(CaoDo.chamDiem(docHuyen, huyen).diem >= 80, `${giong}: huyền đọc đúng`);
    assert.ok(CaoDo.chamDiem(docNgang, ngang).diem >= 80, `${giong}: ngang đọc đúng`);
    assert.ok(CaoDo.chamDiem(docSac, huyen).diem < 50, `${giong}: đọc sắc khi cần huyền`);
    assert.ok(CaoDo.chamDiem(docHuyen, sac).diem < 50, `${giong}: đọc huyền khi cần sắc`);
    assert.ok(CaoDo.chamDiem(docNgang, sac).diem < 50, `${giong}: đọc ngang khi cần sắc`);
  }
});

test("chấm điểm không phụ thuộc giọng cao hay thấp (đã chuẩn hoá semitone)", () => {
  const sac = CaoDo.layMau("hanoi", "sac");
  const diem = [110, 220, 330].map(moc => {
    const s = taoSong({ f: u => moc * Math.pow(2, CaoDo.giaTriMau(sac, u) / 12), hat: 6 });
    return CaoDo.chamDiem(duongTu(s, moc), sac).diem;
  });
  assert.ok(Math.max(...diem) - Math.min(...diem) <= 6, `điểm ${diem.join(", ")}`);
});

test("đường mẫu: đủ 6 thanh mỗi giọng, tiếng tắc chỉ có sắc và nặng, hỏi ngã chưa chấm", () => {
  for (const giong of ["hanoi", "saigon"]) {
    for (const th of ["ngang", "huyen", "nga", "hoi", "sac", "nang"]) assert.ok(CaoDo.layMau(giong, th), `${giong} ${th}`);
    assert.equal(CaoDo.layMau(giong, "hoi").cham, false);
    assert.equal(CaoDo.layMau(giong, "nga").cham, false);
    assert.equal(CaoDo.layMau(giong, "sac", true).dai < 1, true);
    assert.equal(CaoDo.layMau(giong, "huyen", true), null);
  }
  assert.equal(CaoDo.chuIPA("312"), "˧˩˨");
  assert.equal(CaoDo.mucDiem(49), "can-luyen");
  assert.equal(CaoDo.mucDiem(50), "gan-dung");
  assert.equal(CaoDo.mucDiem(80), "tot");
});
