// Kiểm thử bộ ghép âm đúng chính tả (luyen-noi/ghep-tieng.js). Chạy: node --test tests/*.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../luyen-noi/ghep-tieng.js");

const viet = (dau, van, cuoi, thanh) => {
  const kq = G.ghep(dau, van, cuoi, thanh);
  assert.ok(kq.hopLe, `${dau}+${van}+${cuoi} phải ghép được (${kq.lyDo})`);
  return kq.chu;
};

test("c / k / q", () => {
  assert.equal(viet("c", "a", ""), "ca");
  assert.equal(viet("c", "e", "", "nang"), "kẹ");
  assert.equal(viet("c", "i", "m", "sac"), "kím");
  assert.equal(viet("c", "iê", "n"), "kiên");
  assert.equal(viet("c", "iê", "", "nga"), "kĩa");
  assert.equal(viet("c", "oa", ""), "qua");
  assert.equal(viet("c", "uy", "", "sac"), "quý");
  assert.equal(viet("c", "uyê", "n", "hoi"), "quyển");
  assert.equal(viet("c", "uô", "c", "sac"), "cuốc");
});

test("g / gh, ng / ngh, gi", () => {
  assert.equal(viet("g", "a", "", "huyen"), "gà");
  assert.equal(viet("g", "e", ""), "ghe");
  assert.equal(viet("g", "i", ""), "ghi");
  assert.equal(viet("ng", "e", ""), "nghe");
  assert.equal(viet("ng", "iê", "ng"), "nghiêng");
  assert.equal(viet("ng", "ô", ""), "ngô");
  assert.equal(viet("gi", "i", "", "huyen"), "gì");
  assert.equal(viet("gi", "i", "n", "huyen"), "gìn");
  assert.equal(viet("gi", "iê", "ng", "sac"), "giếng");
  assert.equal(viet("gi", "a", ""), "gia");
  assert.equal(G.hopLe("gi", "iê", ""), false);
});

test("âm đệm o / u", () => {
  assert.equal(viet("h", "oa", "", "huyen"), "hoà");
  assert.equal(viet("x", "oă", "n"), "xoăn");
  assert.equal(viet("kh", "oe", "", "hoi"), "khoẻ");
  assert.equal(viet("t", "uâ", "n"), "tuân");
  assert.equal(viet("h", "uê", "", "sac"), "huế");
  assert.equal(viet("th", "uy", "", "hoi"), "thuỷ");
  assert.equal(viet("kh", "uyê", "", ""), "khuya");
  assert.equal(viet("", "oa", "i"), "oai");
  assert.equal(G.hopLe("b", "oa", ""), false, "b không đi với âm đệm");
});

test("i / y và nguyên âm đôi", () => {
  assert.equal(viet("", "i", "", "sac"), "ý");
  assert.equal(viet("", "i", "n"), "in");
  assert.equal(viet("m", "i", ""), "mi");
  assert.equal(viet("", "iê", "n"), "yên");
  assert.equal(viet("", "iê", "u"), "yêu");
  assert.equal(viet("m", "iê", "", "sac"), "mía");
  assert.equal(viet("m", "uô", "", "sac"), "múa");
  assert.equal(viet("m", "ươ", ""), "mưa");
  assert.equal(viet("ng", "ươ", "i", "huyen"), "người");
  assert.equal(viet("m", "uô", "i", "sac"), "muối");
  assert.equal(viet("t", "iê", "ng", "sac"), "tiếng");
  assert.equal(viet("h", "iê", "u", "sac"), "hiếu");
  assert.equal(viet("m", "a", "y"), "may");
  assert.equal(viet("c", "â", "y"), "cây");
  assert.equal(viet("s", "a", "o", "sac"), "sáo");
});

test("âm cuối và vần không ghép được thì báo lỗi", () => {
  assert.equal(G.hopLe("b", "ă", ""), false, "ă cần âm cuối");
  assert.equal(G.hopLe("b", "â", ""), false, "â cần âm cuối");
  assert.equal(G.hopLe("b", "o", "ch"), false, "o không đi với ch");
  assert.equal(G.hopLe("b", "i", "ng"), false, "i không đi với ng");
  assert.equal(G.hopLe("b", "ê", "c"), false, "ê không đi với c");
  assert.equal(G.hopLe("b", "a", "ch"), true);
  assert.equal(viet("s", "a", "ch", "sac"), "sách");
  assert.equal(viet("", "ê", "ch", "sac"), "ếch");
});

test("tiếng tắc chỉ có thanh sắc và thanh nặng", () => {
  assert.deepEqual(G.thanhDung("c"), ["sac", "nang"]);
  assert.deepEqual(G.thanhDung("ch"), ["sac", "nang"]);
  assert.deepEqual(G.thanhDung("n"), ["ngang", "huyen", "nga", "hoi", "sac", "nang"]);
  assert.equal(viet("h", "o", "c", "nang"), "học");
  assert.equal(G.ghep("h", "o", "c", "huyen").hopLe, false);
});

test("tiếng gợi ý ghép lại đúng chữ trong bài", () => {
  for (const g of G.GOI_Y) assert.equal(viet(g.dau, g.van, g.cuoi, g.thanh), g.chu.normalize("NFC"));
});

test("kết quả luôn ở dạng NFC", () => {
  const chu = viet("ng", "ươ", "i", "nga");
  assert.equal(chu, chu.normalize("NFC"));
  assert.equal(chu, "ngưỡi");
});
