#!/usr/bin/env node
/* Tạo lại giong-ai/can-doc.tsv (danh sách câu robot giọng đọc AI cần đọc cho trang Luyện nói)
   từ luyen-noi/noi-dung.txt (từ, câu, hội thoại) và Bảng âm (luyen-noi/bang-am.js).
   Chạy sau khi sửa noi-dung.txt:  node tools/tao-can-doc.js
   Câu mới hoặc câu đã sửa chữ có mã mới (FNV-1a của chữ) nên robot sẽ đọc ở lần chạy sau;
   tệp của câu cũ vẫn giữ trong luyen-noi/audio/kore/ (không xoá tự động). */
"use strict";
var fs = require("fs"), path = require("path");
var GOC = path.join(__dirname, "..");
var ChamCau = require(path.join(GOC, "luyen-noi/cham-cau.js"));
var BangAm = require(path.join(GOC, "luyen-noi/bang-am.js"));

var nd = ChamCau.docNoiDung(fs.readFileSync(path.join(GOC, "luyen-noi/noi-dung.txt"), "utf8"));
if (nd.loi.length) {
  console.error("noi-dung.txt có dòng máy chưa hiểu: " + nd.loi.map(function (l) { return "dòng " + l.dong; }).join(", "));
  process.exit(1);
}
var am = BangAm.tatCaAm();
var laAm = {}; am.forEach(function (x) { laAm[x.ma] = true; });

var dong = ["tep\tchu\tnhom\tcach"], co = {};
function them(ma, chu, nhom, cach) {
  if (co[ma]) return; co[ma] = true;
  dong.push("luyen-noi/audio/kore/" + ma + ".mp3\t" + chu.replace(/\t|\n/g, " ") + "\t" + nhom + "\t" + cach);
}
// cach "van" = đọc theo âm (chữ cái, vần, đánh vần); từ trùng với một mục Bảng âm cũng đọc theo cách đó
ChamCau.tatCaCau(nd).forEach(function (x) { them(x.ma, x.chu, x.chuDe, laAm[x.ma] ? "van" : ""); });
am.forEach(function (x) { them(x.ma, x.chu, "bang-am", "van"); });

fs.writeFileSync(path.join(GOC, "giong-ai/can-doc.tsv"), dong.join("\n") + "\n");
console.log("Đã ghi giong-ai/can-doc.tsv: " + (dong.length - 1) + " câu.");
