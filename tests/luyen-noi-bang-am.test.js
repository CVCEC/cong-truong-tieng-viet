// Kiểm thử thẻ Bảng âm (luyen-noi/bang-am.js): phiên âm IPA, đánh vần, bảng vần, danh sách câu cần giọng.
// Chạy: node --test tests/*.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const B = require("../luyen-noi/bang-am.js");
const ChamCau = require("../luyen-noi/cham-cau.js");

const dv = (d, v, c, t) => B.danhVan(d, v, c, t).map(x => x.chu).join(" – ");

test("đánh vần theo cách của lớp tiếng Việt", () => {
  assert.equal(dv("b", "a", "", "huyen"), "bờ – a – ba – huyền – bà");
  assert.equal(dv("b", "a", "n", "huyen"), "bờ – an – ban – huyền – bàn");
  assert.equal(dv("h", "o", "c", "nang"), "hờ – oc – hoc – nặng – học");
  assert.equal(dv("c", "oa", "", "huyen"), "quờ – a – qua – huyền – quà");
  assert.equal(dv("ng", "ươ", "i", "huyen"), "ngờ – ươi – ngươi – huyền – người");
  assert.equal(dv("m", "a", "", "ngang"), "mờ – a – ma");
  assert.equal(dv("", "a", "n", "sac"), "an – sắc – án");
});

test("phiên âm IPA giọng Hà Nội và Sài Gòn", () => {
  assert.equal(B.ipaTieng("b", "a", "", "huyen", "hanoi"), "/ɓaː˧˨/");
  assert.equal(B.ipaTieng("b", "a", "", "huyen", "saigon"), "/ɓaː˨˩/");
  assert.equal(B.ipaTieng("t", "iê", "ng", "sac", "hanoi"), "/tiəŋ˨˦/");
  assert.equal(B.ipaTieng("h", "o", "c", "nang", "hanoi"), "/hɔk̚˨˩/");
  assert.equal(B.ipaTieng("tr", "e", "", "ngang", "saigon"), "/ʈɛ˧˧/");
  assert.equal(B.ipaTieng("m", "a", "y", "ngang", "hanoi"), "/maj˧˧/");
  assert.equal(B.ipaTieng("c", "oa", "", "huyen", "hanoi"), "/kwaː˧˨/");
});

test("bảng vần có đủ ba nhóm, có cả vần tắc, không trùng", () => {
  const bv = B.bangVan();
  const tat = bv.mo.concat(bv.cuoi, bv.dem).map(x => x.chu);
  assert.equal(new Set(tat).size, tat.length);
  for (const v of ["a", "ia", "ưa", "an", "anh", "ach", "oc", "iêng", "ươu", "oa", "oang", "uyên", "uya", "uynh"]) assert.ok(tat.includes(v), v);
  assert.ok(!tat.includes("ing") && !tat.includes("êng"), "không có vần ing, êng");
});

test("tách tiếng ví dụ ra âm đầu, vần, âm cuối, thanh", () => {
  assert.deepEqual(B.tachTieng("quà"), { dau: "c", van: "oa", cuoi: "", thanh: "huyen" });
  assert.deepEqual(B.tachTieng("sách"), { dau: "s", van: "a", cuoi: "ch", thanh: "sac" });
  const tat = [].concat(...[B.AM_DAU, B.NGUYEN_AM, B.NGUYEN_AM_DOI, B.AM_DEM, B.AM_CUOI].map(ds => ds.flatMap(a => a.vd || [])));
  for (const w of tat) assert.ok(B.tachTieng(w), "tách được " + w);
});

test("danh sách câu cần giọng Elio: có âm đọc theo âm, mã khớp cách tính của trang", () => {
  const ds = B.tatCaAm();
  const chu = ds.map(x => x.chu);
  for (const w of ["bờ", "cờ", "dờ", "di", "a", "á", "ớ", "huyền", "thanh ngang", "bà", "an", "oc"]) assert.ok(chu.includes(w), w);
  for (const x of ds) assert.equal(x.ma, ChamCau.maCau(x.chu));
  assert.equal(new Set(ds.map(x => x.ma)).size, ds.length);
});
