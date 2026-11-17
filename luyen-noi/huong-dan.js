/*!
 * huong-dan.js – Khung "Cách học, mục tiêu và học xong em sẽ…" ở đầu trang Luyện nói – Luyện thanh.
 * Lấy nội dung từ window.CONG_GT.luyennoi (chung/gioi-thieu-goc.js): sửa một chỗ, cổng và trang cùng đổi.
 */
(function () {
  "use strict";
  var CHU = {
    vi: { cachHoc: "Học thế nào", mucTieu: "Mục tiêu", hocXong: "Học xong, em sẽ…" },
    en: { cachHoc: "How to learn", mucTieu: "Goals", hocXong: "After practising, you will…" }
  };
  var KHOA = "luyen-noi-da-xem-cach-hoc";
  function nn() { return (window.CONG && window.CONG.ngonNgu && window.CONG.ngonNgu() === "en") ? "en" : "vi"; }
  function tao(t, l, c) { var e = document.createElement(t); if (l) e.className = l; if (c != null) e.textContent = c; return e; }
  function ve() {
    var hop = document.getElementById("ln-cach-hoc-noi-dung");
    var g = window.CONG_GT && window.CONG_GT.luyennoi;
    if (!hop || !g) return;
    var c = CHU[nn()], chu = function (o) { return nn() === "en" ? o.en : o.vi; };
    hop.textContent = "";
    if (g.gioiThieu) hop.appendChild(tao("p", "ln-ch-mo-ta", chu(g.gioiThieu)));
    var luoi = tao("div", "ln-ch-luoi");
    [["buoc", c.cachHoc, "ol"], ["mucTieu", "🎯 " + c.mucTieu, "ul"], ["hocXong", "🏅 " + c.hocXong, "ul"]].forEach(function (k) {
      var ds = g[k[0]];
      if (!ds || !ds.length) return;
      var o = tao("div", "ln-ch-o");
      o.appendChild(tao("h3", "ln-nho", k[1]));
      var l = tao(k[2], "ln-ch-ds");
      ds.forEach(function (m) { l.appendChild(tao("li", null, (m.e ? m.e + " " : "") + chu(m))); });
      o.appendChild(l);
      luoi.appendChild(o);
    });
    hop.appendChild(luoi);
  }
  function khoiDong() {
    ve();
    var d = document.getElementById("ln-cach-hoc");
    if (d) {
      // Lần đầu mở trang: mở sẵn phần hướng dẫn; các lần sau gập lại (bé bấm để xem lại).
      var daXem = false;
      try { daXem = window.localStorage.getItem(KHOA) === "1"; } catch (e) {}
      d.open = !daXem;
      try { window.localStorage.setItem(KHOA, "1"); } catch (e) {}
    }
    if (window.CONG && window.CONG.khiDoiChu) window.CONG.khiDoiChu(ve);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong); else khoiDong();
})();
