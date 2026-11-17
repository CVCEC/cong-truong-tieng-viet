// Kiểm thử đọc noi-dung.txt và chấm câu (luyen-noi/cham-cau.js). Chạy: node --test tests/*.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const C = require("../luyen-noi/cham-cau.js");

test("tách dấu thanh, coi hoà và hòa là một", () => {
  assert.deepEqual(C.tachThanh("hoà"), C.tachThanh("hòa"));
  assert.deepEqual(C.tachThanh("Khỏe"), C.tachThanh("khoẻ"));
  assert.deepEqual(C.tachThanh("người"), { goc: "ngươi", thanh: "huyen" });
  assert.deepEqual(C.tachThanh("ăn"), { goc: "ăn", thanh: "ngang" });
  assert.equal(C.tachThanh("mẹ").thanh, "nang");
  assert.equal(C.tachThanh("mã").thanh, "nga");
});

test("tách tiếng: bỏ dấu câu, chữ thường, đổi số ra chữ", () => {
  assert.deepEqual(C.tachTieng("Em chào cô ạ."), ["em", "chào", "cô", "ạ"]);
  assert.deepEqual(C.tachTieng("Nhà em có 4 người!"), ["nhà", "em", "có", "bốn", "người"]);
  assert.equal(C.soRaChu(15), "mười lăm");
  assert.equal(C.soRaChu(21), "hai mươi mốt");
  assert.equal(C.soRaChu(24), "hai mươi tư");
  assert.equal(C.soRaChu(105), "một trăm linh năm");
});

test("đọc đúng hết: 100 điểm", () => {
  const r = C.soCau("Em chào cô ạ.", "em chào cô ạ");
  assert.equal(r.diem, 100);
  assert.ok(r.tieng.every(t => t.ketQua === "dung"));
});

test("đúng chữ sai dấu: tô cam, nửa điểm", () => {
  const r = C.soCau("Em yêu bố mẹ.", "em yêu bố me");
  assert.equal(r.tieng[3].ketQua, "sai-thanh");
  assert.equal(r.tieng[3].nghe, "me");
  assert.equal(r.diem, Math.round(3.5 / 4 * 100));
});

test("sai chữ, thiếu tiếng, thừa tiếng", () => {
  const r = C.soCau("Con mèo đang ngủ.", "con chó ngủ");
  assert.equal(r.tieng[0].ketQua, "dung");
  assert.equal(r.tieng[3].ketQua, "dung");
  assert.deepEqual([r.dung, r.sai, r.thieu], [2, 1, 1]);
  assert.equal(r.diem, 50);
  const thua = C.soCau("Con mèo đang ngủ.", "à con mèo đang ngủ rồi");
  assert.equal(thua.diem, 100);
  const rong = C.soCau("Con mèo đang ngủ.", "");
  assert.equal(rong.diem, 0);
  assert.ok(rong.tieng.every(t => t.ketQua === "thieu"));
});

test("chọn cách nghe cho điểm cao nhất", () => {
  const r = C.chamTotNhat("Mình khỏe, cảm ơn bạn.", ["mình khoe cảm ơn bạn", "mình khoẻ cảm ơn bạn"]);
  assert.equal(r.diem, 100);
  assert.equal(C.mucDiem(100), "tot");
  assert.equal(C.mucDiem(70), "gan-dung");
  assert.equal(C.mucDiem(30), "can-luyen");
});

test("mã câu ổn định, đổi khi sửa chữ", () => {
  assert.equal(C.maCau("Em chào cô ạ."), C.maCau("  Em chào cô ạ. ".normalize("NFD")));
  assert.notEqual(C.maCau("Em chào cô ạ."), C.maCau("Em chào thầy ạ."));
  assert.match(C.maCau("xin chào"), /^[0-9a-f]{8}$/);
});

test("đọc tệp nội dung: chủ đề, từ, câu, hội thoại, dòng lỗi", () => {
  const nd = C.docNoiDung([
    "# ghi chú",
    "TU: lạc chỗ",
    "CHỦ ĐỀ: Chào hỏi | Greetings",
    "MỨC: 1",
    "ảnh: wave.png",
    "TỪ: xin chào | hello",
    "Cau: Em chào cô ạ. | Hello, teacher.",
    "TRAU CON: Chào các bạn!",
    "BẠN: Chào Trâu Con! | Hi!",
    "HỘI THOẠI: Đoạn hai",
    "TRÂU CON: Tạm biệt!",
    "linh tinh",
    "CHỦ ĐỀ: Chào hỏi",
    "MUC: 9"
  ].join("\n"));
  assert.equal(nd.chuDe.length, 2);
  const cd = nd.chuDe[0];
  assert.equal(cd.id, "chao-hoi");
  assert.equal(nd.chuDe[1].id, "chao-hoi-2");
  assert.equal(cd.tenEn, "Greetings");
  assert.equal(cd.anh, "wave.png");
  assert.equal(cd.muc, 1);
  assert.equal(nd.chuDe[1].muc, 2, "mức sai thì giữ mặc định 2");
  assert.deepEqual(cd.tu.map(m => m.chu), ["xin chào"]);
  assert.equal(cd.cau[0].en, "Hello, teacher.");
  assert.equal(cd.hoiThoai.length, 2);
  assert.deepEqual(cd.hoiThoai[0].luot.map(l => l.ai), ["trau", "ban"]);
  assert.equal(cd.hoiThoai[1].ten, "Đoạn hai");
  assert.deepEqual(nd.loi.map(l => [l.dong, l.lyDo]), [[2, "chua-co-chu-de"], [12, "khong-hieu"], [14, "muc-sai"]]);
});

test("tệp noi-dung.txt của trường đọc được, không lỗi, đủ chủ đề", () => {
  const van = fs.readFileSync(path.join(__dirname, "../luyen-noi/noi-dung.txt"), "utf8");
  const nd = C.docNoiDung(van);
  assert.deepEqual(nd.loi, []);
  assert.ok(nd.chuDe.length >= 24);
  // Mỗi chủ đề ghi rõ mức; mỗi mức có ít nhất 6 chủ đề.
  nd.chuDe.forEach(cd => assert.ok(cd.coMuc, cd.ten + " cần dòng MỨC:"));
  [1, 2, 3, 4].forEach(m => assert.ok(nd.chuDe.filter(c => c.muc === m).length >= 6, "Mức " + m + " cần ít nhất 6 chủ đề"));
  const anh = fs.readdirSync(path.join(__dirname, "../assets/trau"));
  nd.chuDe.forEach(cd => {
    assert.ok(cd.tu.length >= 6, cd.ten + " cần ít nhất 6 từ");
    assert.ok(cd.cau.length >= 4, cd.ten + " cần ít nhất 4 câu");
    assert.ok(cd.hoiThoai.length >= 1, cd.ten + " cần một hội thoại");
    cd.hoiThoai.forEach(h => assert.ok(h.luot.some(l => l.ai === "ban"), h.ten + " cần lượt của các bạn"));
    // Độ dài câu theo mức (số tiếng): mức 1 ngắn, lên mức thì dài dần.
    const dai = m => C.tachTieng(m.chu).length;
    const tran = { 1: 6, 2: 8, 3: 13, 4: 16 }[cd.muc];
    cd.cau.forEach(m => assert.ok(dai(m) <= tran, `${cd.ten}: câu quá dài cho mức ${cd.muc}: ${m.chu}`));
    if (cd.muc >= 3) assert.ok(cd.cau.some(m => dai(m) >= 7), cd.ten + " (mức " + cd.muc + ") cần câu dài hơn");
    if (cd.muc >= 3) cd.hoiThoai.forEach(h => assert.ok(h.luot.length >= 8, h.ten + " cần 8 lượt"));
    // Trâu Con xưng "mình", gọi "các bạn": không xưng "tớ", "tôi" hay gọi "cậu".
    cd.hoiThoai.forEach(h => h.luot.filter(l => l.ai === "trau").forEach(l =>
      assert.ok(!/(^|\s)(tớ|tôi|cậu)(\s|[.,!?]|$)/i.test(l.chu), "Trâu Con: " + l.chu)));
    // Mọi chữ đều chuẩn NFC
    cd.cau.concat(cd.tu).forEach(m => assert.equal(m.chu, m.chu.normalize("NFC")));
    assert.ok(!cd.anh || anh.includes(cd.anh), "Không có ảnh " + cd.anh);
    // Mọi câu mẫu tự chấm với chính nó được 100 điểm.
    cd.cau.concat(cd.tu).forEach(m => assert.equal(C.soCau(m.chu, m.chu).diem, 100, m.chu));
  });
  const all = C.tatCaCau(nd);
  assert.equal(new Set(all.map(x => x.ma)).size, all.length);
});
