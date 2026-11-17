// Kiểm thử "Đường đi học của Trâu Con" (luyen-noi/con-duong.js): sao, câu khích lệ, nhân vật.
// Chạy: node --test tests/*.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../luyen-noi/con-duong.js");

test("đủ 6 nhân vật, có tên, câu giới thiệu và mũi tên bằng hai thứ tiếng", () => {
  for (const th of ["ngang", "sac", "huyen", "hoi", "nga", "nang"]) {
    const nv = D.NHAN_VAT[th];
    assert.ok(nv && nv.ten.vi && nv.ten.en && nv.gioiThieu.vi && nv.gioiThieu.en, th);
    assert.ok(nv.muiTen.length >= 2, th);
    assert.ok(nv.khen[1].vi && nv.khen[1].en, th);
  }
});

test("sao: 3 / 2 / 1 theo mức so đường; thanh không chấm (hỏi, ngã) được 1 sao cho lần thử", () => {
  assert.equal(D.soSao(95, true), 3);
  assert.equal(D.soSao(80, true), 3);
  assert.equal(D.soSao(60, true), 2);
  assert.equal(D.soSao(10, true), 1);
  assert.equal(D.soSao(null, false), 1);
  assert.equal(D.soSao(95, false), 1);
});

test("câu khích lệ đúng nhân vật, không có số điểm", () => {
  assert.equal(D.cauKhen("sac", 3, "vi"), "Anh Sắc khen: Em leo dốc giỏi lắm!");
  assert.equal(D.cauKhen("huyen", 2, "vi"), "Bà Huyền nhắc: Mình xuống đồi chậm thêm chút nhé!");
  assert.match(D.cauKhen("hoi", 3, "vi"), /^Chú Hỏi/); // hỏi chỉ có một câu chung
  for (const th of Object.keys(D.NHAN_VAT)) for (const s of [1, 2, 3]) assert.doesNotMatch(D.cauKhen(th, s, "vi"), /\d/);
});
