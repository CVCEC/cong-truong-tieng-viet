/*!
 * con-duong.js – "Đường đi học của Trâu Con": 6 thanh điệu là 6 nhân vật trên đường.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC).
 *
 *  - Thanh ngang: Trâu Con thong thả trên đường bằng   - Thanh sắc: anh Sắc leo dốc
 *  - Thanh huyền: bà Huyền đi xuống đồi                 - Thanh hỏi: chú Hỏi hay thắc mắc (xuống rồi vòng lên)
 *  - Thanh ngã: chị Ngã vấp ổ gà rồi bật dậy           - Thanh nặng: bác Nặng ngồi phịch xuống bậc thềm
 *
 * Con đường vẽ đúng theo đường cao độ mẫu (giọng phổ thông Hà Nội, cao-do.js). Giọng của bé hiện thành
 * dấu chân Trâu Con chồng lên con đường. Không hiện điểm số: bé thu sao (1–3) và nhân vật nói một câu khích lệ.
 * Nhân vật là chính dấu thanh, có mắt và miệng cười (vẽ SVG). Thanh ngang dùng ảnh Trâu Con chính thức.
 * Muốn thay bằng ảnh do hoạ sĩ vẽ: đặt ảnh vào /luyen-noi/nhan-vat/<thanh>.png (ví dụ sac.png) và
 * ghi tên vào ANH_NHAN_VAT bên dưới.
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.ConDuong = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Ảnh nhân vật do hoạ sĩ vẽ (khi có): { sac: "/luyen-noi/nhan-vat/sac.png", … }. Trống thì dùng hình dấu thanh.
  var ANH_NHAN_VAT = {};

  /* ---------- Nhân vật, câu giới thiệu, mũi tên, câu khích lệ ---------- */
  var NHAN_VAT = {
    ngang: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi thong thả trên đường bằng.", en: "Trâu Con strolls along a flat road." },
      muiTen: [[0, 0.5], [1, 0.5]],
      khen: {
        3: { vi: "Trâu Con khen: Các bạn đi đều quá, giỏi lắm!", en: "Trâu Con says: So smooth and steady — great job!" },
        2: { vi: "Trâu Con nhắc: Giữ giọng bằng phẳng thêm chút nhé!", en: "Trâu Con says: Keep your voice a little flatter!" },
        1: { vi: "Trâu Con nhắc: Mình đi thẳng, không lên không xuống nhé!", en: "Trâu Con says: Walk straight — not up, not down!" }
      }
    },
    sac: {
      ten: { vi: "Anh Sắc", en: "Mr Sắc" },
      gioiThieu: { vi: "Anh Sắc leo dốc, giọng đi lên cao.", en: "Mr Sắc climbs the hill — your voice goes up." },
      muiTen: [[0, 0.85], [1, 0.15]],
      khen: {
        3: { vi: "Anh Sắc khen: Em leo dốc giỏi lắm!", en: "Mr Sắc says: Great hill climbing!" },
        2: { vi: "Anh Sắc nhắc: Gần tới đỉnh rồi, leo cao thêm chút nữa nhé!", en: "Mr Sắc says: Almost at the top — climb a little higher!" },
        1: { vi: "Anh Sắc nhắc: Mình cùng leo dốc lên cao nhé!", en: "Mr Sắc says: Let's climb up high together!" }
      }
    },
    huyen: {
      ten: { vi: "Bà Huyền", en: "Grandma Huyền" },
      gioiThieu: { vi: "Bà Huyền đi xuống đồi, giọng thấp dần.", en: "Grandma Huyền walks down the hill — your voice goes low." },
      muiTen: [[0, 0.3], [1, 0.8]],
      khen: {
        3: { vi: "Bà Huyền khen: Em xuống đồi thật êm!", en: "Grandma Huyền says: Such a gentle walk down!" },
        2: { vi: "Bà Huyền nhắc: Mình xuống đồi chậm thêm chút nhé!", en: "Grandma Huyền says: Walk down a little more slowly!" },
        1: { vi: "Bà Huyền nhắc: Giọng mình đi xuống thấp dần nhé!", en: "Grandma Huyền says: Let your voice go down, low and soft!" }
      }
    },
    hoi: {
      ten: { vi: "Chú Hỏi", en: "Uncle Hỏi" },
      gioiThieu: { vi: "Chú Hỏi hay thắc mắc: xuống rồi vòng lên.", en: "Uncle Hỏi is curious: down, then curling up." },
      muiTen: [[0, 0.35], [0.5, 0.85], [1, 0.55]],
      khen: {
        1: { vi: "Chú Hỏi khen: Em đi đường vòng rồi! Các bạn so dấu chân với con đường nhé.", en: "Uncle Hỏi says: You took the curvy road! Compare your footprints with the road." }
      }
    },
    nga: {
      ten: { vi: "Chị Ngã", en: "Sister Ngã" },
      gioiThieu: { vi: "Chị Ngã vấp ổ gà rồi bật dậy thật cao.", en: "Sister Ngã trips on a bump, then springs up high." },
      muiTen: [[0, 0.5], [0.42, 0.6], null, [0.58, 0.55], [1, 0.1]],
      khen: {
        1: { vi: "Chị Ngã khen: Em vấp rồi bật dậy, giỏi lắm! Các bạn so dấu chân với con đường nhé.", en: "Sister Ngã says: You tripped and sprang up — well done! Compare your footprints with the road." }
      }
    },
    nang: {
      ten: { vi: "Bác Nặng", en: "Uncle Nặng" },
      gioiThieu: { vi: "Bác Nặng ngồi phịch xuống bậc thềm.", en: "Uncle Nặng plops down on the step." },
      muiTen: [[0, 0.45], [0.7, 0.9]],
      dung: true,
      khen: {
        3: { vi: "Bác Nặng khen: Ngồi phịch thật gọn, giỏi lắm!", en: "Uncle Nặng says: A neat little plop — great!" },
        2: { vi: "Bác Nặng nhắc: Xuống nhanh rồi dừng ngay nhé!", en: "Uncle Nặng says: Go down quickly, then stop!" },
        1: { vi: "Bác Nặng nhắc: Giọng mình đi xuống thấp, ngắn gọn nhé!", en: "Uncle Nặng says: Make it low and short!" }
      }
    }
  };

  /** Số sao từ kết quả so đường (chỉ dùng bên trong, không hiện điểm). Thanh không chấm: 1 sao cho lần thử. */
  function soSao(diem, coCham) {
    if (!coCham || diem == null) return 1;
    if (diem >= 80) return 3;
    if (diem >= 50) return 2;
    return 1;
  }
  function cauKhen(thanh, sao, nn) {
    var nv = NHAN_VAT[thanh];
    var k = nv.khen[sao] || nv.khen[1];
    return nn === "en" ? k.en : k.vi;
  }

  /* ---------- Vẽ SVG ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function el(the, thuocTinh, cha) {
    var e = document.createElementNS(NS, the);
    for (var k in thuocTinh) if (thuocTinh.hasOwnProperty(k)) e.setAttribute(k, thuocTinh[k]);
    if (cha) cha.appendChild(e);
    return e;
  }

  // Khung vẽ con đường: viewBox 0 0 320 170; trục cao độ −7…+7 semitone
  var W = 320, H = 170, TRAI = 26, PHAI = 294, TREN = 30, DUOI = 128, ST_MAX = 7;
  function xU(u) { return TRAI + u * (PHAI - TRAI); }
  function yST(st) { st = Math.max(-ST_MAX, Math.min(ST_MAX, st)); return TREN + (ST_MAX - st) / (2 * ST_MAX) * (DUOI - TREN); }

  /** Các điểm của con đường mẫu (toạ độ SVG). */
  function diemDuong(CaoDo, mau, n) {
    n = n || 48;
    var ra = [];
    for (var i = 0; i < n; i++) { var u = i / (n - 1); ra.push([xU(u * mau.dai), yST(CaoDo.giaTriMau(mau, u))]); }
    return ra;
  }
  function chuoiDuong(ds) { return ds.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" "); }

  /** Hình nhân vật dấu thanh có mắt và miệng cười (SVG 60×60). */
  function veNhanVat(thanh, cha, x, y, coAnhTrau) {
    var g = el("g", { "class": "cd-nv cd-nv-" + thanh, transform: "translate(" + x + " " + y + ")" }, cha);
    if (ANH_NHAN_VAT[thanh]) { el("image", { href: ANH_NHAN_VAT[thanh], x: -30, y: -30, width: 60, height: 60 }, g); return g; }
    if (thanh === "ngang") {
      if (coAnhTrau) el("image", { href: coAnhTrau, x: -26, y: -32, width: 52, height: 62, preserveAspectRatio: "xMidYMid meet" }, g);
      return g;
    }
    var than;
    if (thanh === "sac") than = el("path", { d: "M -14 22 L 10 -24 Q 14 -30 19 -26 Q 23 -22 19 -17 L -4 25 Z" }, g);
    else if (thanh === "huyen") than = el("path", { d: "M 14 22 L -10 -24 Q -14 -30 -19 -26 Q -23 -22 -19 -17 L 4 25 Z" }, g);
    else if (thanh === "hoi") than = el("path", { d: "M -16 -10 Q -16 -28 2 -28 Q 20 -28 20 -12 Q 20 0 6 4 L 6 14 L -6 14 L -6 -2 Q 8 -4 8 -12 Q 8 -18 2 -18 Q -4 -18 -4 -10 Z" }, g);
    else if (thanh === "nga") {
      // Dấu ngã: nét lượn sóng dày (viền + lõi màu)
      el("path", { d: "M -24 8 C -18 -14 -6 -12 0 0 S 18 12 24 -10", "class": "cd-nga-vien" }, g);
      than = el("path", { d: "M -24 8 C -18 -14 -6 -12 0 0 S 18 12 24 -10", "class": "cd-nga-loi" }, g);
    }
    else than = el("circle", { r: 18, cy: 4 }, g);
    if (thanh !== "nga") than.setAttribute("class", "cd-than");
    // Mắt và miệng cười
    var mat = { sac: [[2, -8], [10, -12]], huyen: [[-2, -8], [-10, -12]], hoi: [[-4, -20], [8, -20]], nga: [[-15, -6], [-7, -8]], nang: [[-6, 0], [6, 0]] }[thanh];
    mat.forEach(function (m) { el("circle", { cx: m[0], cy: m[1], r: 2.6, "class": "cd-mat" }, g); });
    var mieng = { sac: "M 0 -2 Q 6 2 10 -4", huyen: "M 0 -2 Q -6 2 -10 -4", hoi: "M -2 -14 Q 2 -10 6 -14", nga: "M -16 1 Q -11 5 -6 0", nang: "M -6 8 Q 0 14 6 8" }[thanh];
    el("path", { d: mieng, "class": "cd-mieng" }, g);
    return g;
  }

  var demMui = 0;
  /** Mũi tên nhỏ chỉ hướng giọng (SVG riêng, 90×40). */
  function veMuiTen(thanh) {
    var svg = el("svg", { viewBox: "0 0 90 40", "class": "cd-mui-ten", "aria-hidden": "true" });
    svg.style.setProperty("--cd-mau", "var(--cd-" + thanh + ")"); // màu nhân vật, dùng được ở mọi chỗ (cả bảng thanh)
    var maMui = "cd-mui-" + thanh + "-" + (++demMui); // mỗi mũi tên một id riêng (trùng id thì đầu mũi tên có thể không hiện)
    var ds = NHAN_VAT[thanh].muiTen, doan = [[]];
    ds.forEach(function (p) { if (p) doan[doan.length - 1].push(p); else doan.push([]); });
    var defs = el("defs", {}, svg);
    var mk = el("marker", { id: maMui, viewBox: "0 0 10 10", refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M 0 0 L 10 5 L 0 10 Z", "class": "cd-mui-dau" }, mk);
    doan.forEach(function (d, i) {
      var p = el("path", { d: d.map(function (q, j) { return (j ? "L" : "M") + (6 + q[0] * 74) + " " + (4 + q[1] * 32); }).join(" "), "class": "cd-mui-than" }, svg);
      if (i === doan.length - 1) p.setAttribute("marker-end", "url(#" + maMui + ")");
    });
    if (NHAN_VAT[thanh].dung) el("path", { d: "M 64 36 L 82 36", "class": "cd-mui-than" }, svg);
    return svg;
  }

  /**
   * Vẽ cả con đường cho một thẻ. Trả về đối tượng điều khiển:
   *   chay(tienDo 0–1): đặt Trâu Con tại vị trí tienDo trên đường
   *   dauChan(duongBe): vẽ dấu chân theo giọng của bé (CaoDo.duongGiong), hiện dần
   */
  function veConDuong(hop, CaoDo, mau, thanh, anhTrauChay, anhTrauNgang) {
    hop.textContent = "";
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, "class": "cd-svg", role: "img" }, hop);
    var ds = diemDuong(CaoDo, mau);
    var cuoi = ds[ds.length - 1];
    // Nền: trời, đồi xa
    el("rect", { x: 0, y: 0, width: W, height: H, "class": "cd-troi" }, svg);
    el("path", { d: "M 0 120 Q 60 96 120 116 T 240 112 T 320 118 L 320 170 L 0 170 Z", "class": "cd-doi-xa" }, svg);
    // Đất dưới con đường
    el("path", { d: chuoiDuong(ds) + " L " + cuoi[0].toFixed(1) + " " + H + " L " + ds[0][0].toFixed(1) + " " + H + " Z", "class": "cd-dat" }, svg);
    if (mau.dai < 1) el("rect", { x: cuoi[0], y: cuoi[1], width: W - cuoi[0], height: H - cuoi[1], "class": "cd-dat" }, svg);
    // Mặt đường + vạch giữa
    el("path", { d: chuoiDuong(ds), "class": "cd-mat-duong" }, svg);
    el("path", { d: chuoiDuong(ds), "class": "cd-vach" }, svg);
    // Chi tiết riêng: ổ gà (ngã), bậc thềm (nặng)
    if (mau.ngat != null && thanh === "nga") {
      var pn = [xU(mau.ngat * mau.dai), yST(CaoDo.giaTriMau(mau, mau.ngat))];
      el("ellipse", { cx: pn[0], cy: pn[1] + 3, rx: 11, ry: 4, "class": "cd-o-ga" }, svg);
    }
    if (thanh === "nang") {
      el("rect", { x: cuoi[0] - 2, y: cuoi[1] - 2, width: 30, height: 10, rx: 2, "class": "cd-bac-them" }, svg);
      el("rect", { x: cuoi[0] + 8, y: cuoi[1] + 8, width: 30, height: 10, rx: 2, "class": "cd-bac-them" }, svg);
    }
    // Cờ đích
    el("path", { d: "M " + (cuoi[0] + (thanh === "nang" ? 22 : 0)) + " " + (cuoi[1] - 2) + " l 0 -26 l 14 5 l -14 5", "class": "cd-co" }, svg);
    // Lớp dấu chân
    var lopChan = el("g", { "class": "cd-lop-chan" }, svg);
    // Trâu Con (ảnh chính thức "đang chạy", chỉ di chuyển, không vẽ lại)
    var trau = el("image", { href: thanh === "ngang" && anhTrauNgang ? anhTrauNgang : anhTrauChay, width: 44, height: 52, "class": "cd-trau" }, svg);
    function chay(t) {
      t = Math.max(0, Math.min(1, t));
      var u = t, x = xU(u * mau.dai), y = yST(CaoDo.giaTriMau(mau, u));
      trau.setAttribute("x", (x - 22).toFixed(1));
      trau.setAttribute("y", (y - 50).toFixed(1));
    }
    chay(0);
    function dauChan(duong, hienDan) {
      lopChan.textContent = "";
      if (!duong || !duong.diem || duong.diem.length < 2) return;
      var d = duong.diem, t0 = duong.batDau, dai = Math.max(0.05, duong.ketThuc - t0);
      var pts = d.map(function (p) { return [xU((p.t - t0) / dai * mau.dai), yST(p.st)]; });
      // Đặt dấu chân cách đều ~14 đơn vị dọc đường của bé, chân trái/phải xen kẽ
      var chan = [], tichLuy = 0, trai = true;
      for (var i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], l = Math.sqrt(dx * dx + dy * dy);
        tichLuy += l;
        if (tichLuy >= 14 || i === 1) {
          tichLuy = 0;
          var goc = Math.atan2(dy, dx) * 180 / Math.PI, lech = trai ? -5 : 5;
          var nx = -dy / (l || 1), ny = dx / (l || 1);
          chan.push({ x: pts[i][0] + nx * lech, y: pts[i][1] + ny * lech, goc: goc });
          trai = !trai;
        }
      }
      chan.forEach(function (c, n) {
        var g = el("g", { transform: "translate(" + c.x.toFixed(1) + " " + c.y.toFixed(1) + ") rotate(" + (c.goc + 90).toFixed(0) + ")", "class": "cd-chan" }, lopChan);
        // Dấu chân trâu: hai móng
        el("ellipse", { cx: -2.4, cy: 0, rx: 2, ry: 3.4 }, g);
        el("ellipse", { cx: 2.4, cy: 0, rx: 2, ry: 3.4 }, g);
        if (hienDan) { g.style.opacity = "0"; g.style.animationDelay = (n * 0.06).toFixed(2) + "s"; g.classList.add("cd-chan-hien"); }
      });
    }
    return { svg: svg, chay: chay, dauChan: dauChan };
  }

  return {
    NHAN_VAT: NHAN_VAT, ANH_NHAN_VAT: ANH_NHAN_VAT, soSao: soSao, cauKhen: cauKhen,
    veConDuong: veConDuong, veNhanVat: veNhanVat, veMuiTen: veMuiTen, diemDuong: diemDuong
  };
});
