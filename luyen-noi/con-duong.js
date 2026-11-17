/*!
 * con-duong.js – "Đường đi học của Trâu Con": 6 thanh điệu là 6 nhân vật trên đường.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC).
 *
 *  Mọi nhân vật đều là Trâu Con. Mỗi con đường có hình giống hệt dấu thanh: ngang – đường bằng; sắc – dốc lên như dấu sắc;
 *  huyền – dốc xuống như dấu huyền; hỏi – đường cong móc câu như dấu hỏi; ngã – đường lượn sóng như dấu ngã;
 *  nặng – đường xuống ngắn, dừng trên một chấm tròn như dấu nặng.
 *
 * Giọng của bé hiện thành dấu chân Trâu Con dọc con đường: khớp đường cao độ mẫu (giọng phổ thông Hà Nội, cao-do.js)
 * thì dấu chân nằm trên đường; cao hơn mẫu thì lệch lên, thấp hơn thì lệch xuống. Không hiện điểm số: bé thu sao (1–3) và nhân vật nói một câu khích lệ.
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
  // Mọi nhân vật đều là Trâu Con (xưng "mình", gọi "các bạn"). hinhDuong: hình con đường giống hệt dấu thanh,
  // các điểm [ngang 0–1 từ trái sang phải, dọc 0–1 từ trên xuống], nối mượt.
  var NHAN_VAT = {
    ngang: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi thong thả trên đường bằng.", en: "Trâu Con strolls along a flat road." },
      muiTen: [[0, 0.5], [1, 0.5]],
      hinhDuong: [[0, 0.55], [1, 0.55]],
      khen: {
        3: { vi: "Trâu Con khen: Các bạn đi đều quá, giỏi lắm!", en: "Trâu Con says: So smooth and steady — great job!" },
        2: { vi: "Trâu Con nhắc: Mình giữ giọng bằng phẳng thêm chút nhé!", en: "Trâu Con says: Keep your voice a little flatter!" },
        1: { vi: "Trâu Con nhắc: Mình đi thẳng, không lên không xuống nhé!", en: "Trâu Con says: Walk straight — not up, not down!" }
      }
    },
    sac: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con leo dốc như dấu sắc, giọng đi lên cao.", en: "Trâu Con climbs a slope shaped like the sắc mark — your voice goes up." },
      muiTen: [[0, 0.85], [1, 0.15]],
      hinhDuong: [[0, 0.9], [1, 0.1]],
      khen: {
        3: { vi: "Trâu Con khen: Các bạn leo dốc giỏi lắm!", en: "Trâu Con says: Great hill climbing!" },
        2: { vi: "Trâu Con nhắc: Gần tới đỉnh rồi, mình leo cao thêm chút nữa nhé!", en: "Trâu Con says: Almost at the top — climb a little higher!" },
        1: { vi: "Trâu Con nhắc: Mình cùng leo dốc lên cao nhé!", en: "Trâu Con says: Let's climb up high together!" }
      }
    },
    huyen: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi xuống dốc như dấu huyền, giọng thấp dần.", en: "Trâu Con walks down a slope shaped like the huyền mark — your voice goes low." },
      muiTen: [[0, 0.3], [1, 0.8]],
      hinhDuong: [[0, 0.1], [1, 0.9]],
      khen: {
        3: { vi: "Trâu Con khen: Các bạn xuống dốc thật êm!", en: "Trâu Con says: Such a gentle walk down!" },
        2: { vi: "Trâu Con nhắc: Mình xuống dốc chậm thêm chút nhé!", en: "Trâu Con says: Walk down a little more slowly!" },
        1: { vi: "Trâu Con nhắc: Giọng mình đi xuống thấp dần nhé!", en: "Trâu Con says: Let your voice go down, low and soft!" }
      }
    },
    hoi: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi đường cong như dấu hỏi: lên, vòng qua rồi xuống.", en: "Trâu Con follows a road curled like the hỏi mark: up, around and down." },
      muiTen: [[0, 0.35], [0.5, 0.85], [1, 0.55]],
      hinhDuong: [[0, 0.62], [0.14, 0.26], [0.4, 0.08], [0.66, 0.16], [0.74, 0.4], [0.6, 0.62], [0.56, 0.92]],
      khen: {
        1: { vi: "Trâu Con khen: Các bạn đi đường dấu hỏi rồi! Mình so dấu chân với con đường nhé.", en: "Trâu Con says: You walked the hỏi road! Compare your hoofprints with the road." }
      }
    },
    nga: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi đường lượn sóng như dấu ngã, rồi bật lên cao.", en: "Trâu Con follows a wavy road like the ngã mark, then springs up high." },
      muiTen: [[0, 0.5], [0.42, 0.6], null, [0.58, 0.55], [1, 0.1]],
      hinhDuong: [[0, 0.72], [0.24, 0.36], [0.5, 0.64], [0.76, 0.3], [1, 0.12]],
      khen: {
        1: { vi: "Trâu Con khen: Các bạn đi đường dấu ngã rồi, giỏi lắm! Mình so dấu chân với con đường nhé.", en: "Trâu Con says: You walked the ngã road — well done! Compare your hoofprints with the road." }
      }
    },
    nang: {
      ten: { vi: "Trâu Con", en: "Trâu Con" },
      gioiThieu: { vi: "Trâu Con đi xuống rồi ngồi phịch lên dấu nặng.", en: "Trâu Con goes down, then plops onto the nặng dot." },
      muiTen: [[0, 0.45], [0.7, 0.9]],
      hinhDuong: [[0, 0.32], [0.62, 0.62]],
      cham: [0.74, 0.78], // dấu chấm (hòn đá tròn) ở cuối đường
      dung: true,
      khen: {
        3: { vi: "Trâu Con khen: Ngồi phịch thật gọn, giỏi lắm!", en: "Trâu Con says: A neat little plop — great!" },
        2: { vi: "Trâu Con nhắc: Mình xuống nhanh rồi dừng ngay nhé!", en: "Trâu Con says: Go down quickly, then stop!" },
        1: { vi: "Trâu Con nhắc: Giọng mình đi xuống thấp, ngắn gọn nhé!", en: "Trâu Con says: Make it low and short!" }
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
    else if (thanh === "hoi") {
      // Dấu hỏi: móc câu cong (nửa trên của "?"), không có chấm
      el("path", { d: "M -13 -10 C -13 -28 15 -28 15 -11 C 15 0 1 1 1 16", "class": "cd-net-vien" }, g);
      than = el("path", { d: "M -13 -10 C -13 -28 15 -28 15 -11 C 15 0 1 1 1 16", "class": "cd-net-loi cd-net-hoi" }, g);
    }
    else if (thanh === "nga") {
      // Dấu ngã: nét lượn sóng dày (viền + lõi màu)
      el("path", { d: "M -24 8 C -18 -14 -6 -12 0 0 S 18 12 24 -10", "class": "cd-net-vien" }, g);
      than = el("path", { d: "M -24 8 C -18 -14 -6 -12 0 0 S 18 12 24 -10", "class": "cd-net-loi cd-net-nga" }, g);
    }
    else than = el("circle", { r: 18, cy: 4 }, g);
    if (thanh !== "nga" && thanh !== "hoi") than.setAttribute("class", "cd-than");
    // Mắt và miệng cười
    var mat = { sac: [[2, -8], [10, -12]], huyen: [[-2, -8], [-10, -12]], hoi: [[-7, -19], [5, -21]], nga: [[-15, -6], [-7, -8]], nang: [[-6, 0], [6, 0]] }[thanh];
    mat.forEach(function (m) { el("circle", { cx: m[0], cy: m[1], r: 2.6, "class": "cd-mat" }, g); });
    var mieng = { sac: "M 0 -2 Q 6 2 10 -4", huyen: "M 0 -2 Q -6 2 -10 -4", hoi: "M 6 -9 Q 10 -6 13 -10", nga: "M -16 1 Q -11 5 -6 0", nang: "M -6 8 Q 0 14 6 8" }[thanh];
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

  /* ---------- Hình con đường giống dấu thanh ---------- */
  var KHUNG = { trai: 34, phai: 288, tren: 50, duoi: 138 }; // chừa chỗ phía trên để Trâu Con không bị cắt đầu
  // Nối các điểm bằng đường cong Catmull-Rom rồi lấy dày, kèm độ dài cộng dồn để đi theo đường.
  function duongMuot(hinh) {
    var P = hinh.map(function (q) { return [KHUNG.trai + q[0] * (KHUNG.phai - KHUNG.trai), KHUNG.tren + q[1] * (KHUNG.duoi - KHUNG.tren)]; });
    var ra = [];
    if (P.length === 2) { for (var k = 0; k <= 40; k++) ra.push([P[0][0] + (P[1][0] - P[0][0]) * k / 40, P[0][1] + (P[1][1] - P[0][1]) * k / 40]); }
    else {
      for (var i = 0; i < P.length - 1; i++) {
        var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
        for (var j = 0; j < 20; j++) {
          var t = j / 20, t2 = t * t, t3 = t2 * t;
          ra.push([0, 1].map(function (c) {
            return 0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3);
          }));
        }
      }
      ra.push(P[P.length - 1]);
    }
    var dai = [0];
    for (var n = 1; n < ra.length; n++) dai.push(dai[n - 1] + Math.hypot(ra[n][0] - ra[n - 1][0], ra[n][1] - ra[n - 1][1]));
    return { diem: ra, dai: dai, tong: dai[dai.length - 1] };
  }
  /** Điểm và hướng tại vị trí t (0–1 theo chiều dài con đường). */
  function tai(d, t) {
    t = Math.max(0, Math.min(1, t));
    var can = t * d.tong, i = 1;
    while (i < d.dai.length - 1 && d.dai[i] < can) i++;
    var a = d.diem[i - 1], b = d.diem[i], l = (d.dai[i] - d.dai[i - 1]) || 1, u = (can - d.dai[i - 1]) / l;
    var dx = (b[0] - a[0]) / l, dy = (b[1] - a[1]) / l;
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, dx: dx, dy: dy };
  }

  /**
   * Vẽ cả con đường cho một thẻ. Trả về đối tượng điều khiển:
   *   chay(tienDo 0–1): đặt Trâu Con tại vị trí tienDo trên đường (Trâu Con quay mặt theo hướng đi)
   *   dauChan(duongBe): vẽ dấu chân theo giọng của bé, hiện dần. Giọng khớp mẫu thì dấu chân nằm trên đường;
   *   giọng cao hơn mẫu thì dấu chân lệch lên trên, thấp hơn thì lệch xuống dưới con đường.
   */
  function veConDuong(hop, CaoDo, mau, thanh, anhTrauChay) {
    hop.textContent = "";
    var nv = NHAN_VAT[thanh];
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, "class": "cd-svg", role: "img" }, hop);
    var d = duongMuot(nv.hinhDuong);
    var chuoi = chuoiDuong(d.diem);
    // Nền: trời, đồi xa, ruộng
    el("rect", { x: 0, y: 0, width: W, height: H, "class": "cd-troi" }, svg);
    el("path", { d: "M 0 128 Q 60 108 120 124 T 240 120 T 320 126 L 320 170 L 0 170 Z", "class": "cd-doi-xa" }, svg);
    el("path", { d: "M 0 150 Q 160 138 320 150 L 320 170 L 0 170 Z", "class": "cd-dat" }, svg);
    // Con đường hình dấu thanh: viền, mặt đường, vạch giữa
    el("path", { d: chuoi, "class": "cd-vien-duong" }, svg);
    el("path", { d: chuoi, "class": "cd-mat-duong" }, svg);
    el("path", { d: chuoi, "class": "cd-vach" }, svg);
    var cuoi = d.diem[d.diem.length - 1];
    if (nv.cham) { // dấu nặng: hòn đá tròn ở cuối đường
      var cx = KHUNG.trai + nv.cham[0] * (KHUNG.phai - KHUNG.trai), cy = KHUNG.tren + nv.cham[1] * (KHUNG.duoi - KHUNG.tren);
      el("circle", { cx: cx, cy: cy, r: 16, "class": "cd-cham-nang" }, svg);
      cuoi = [cx, cy - 16];
    }
    // Cờ đích
    el("path", { d: "M " + (cuoi[0] + 10).toFixed(1) + " " + (cuoi[1] - 2).toFixed(1) + " l 0 -24 l 13 5 l -13 5", "class": "cd-co" }, svg);
    // Lớp dấu chân
    var lopChan = el("g", { "class": "cd-lop-chan" }, svg);
    // Trâu Con: ảnh chính thức "đang chạy"; chỉ di chuyển và quay mặt theo hướng đi (lật ngang), không vẽ lại.
    var trauG = el("g", { "class": "cd-trau" }, svg);
    el("image", { href: anhTrauChay, x: -22, y: -50, width: 44, height: 52 }, trauG);
    function chay(t) {
      var p;
      if (nv.cham && t > 0.86) { // đoạn cuối: ngồi phịch lên dấu chấm
        var e = tai(d, 1);
        p = { x: e.x + (cuoi[0] - e.x) * (t - 0.86) / 0.14, y: e.y + (cuoi[1] - e.y) * (t - 0.86) / 0.14, dx: 1 };
      } else p = tai(d, nv.cham ? t / 0.86 : t);
      // Ảnh gốc Trâu Con chạy sang trái: lật ngang để Trâu Con quay mặt sang phải khi đi về bên phải
      var lat = p.dx >= -0.05 ? -1 : 1;
      trauG.setAttribute("transform", "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ") scale(" + lat + " 1)");
    }
    chay(0);
    function dauChan(duong, hienDan) {
      lopChan.textContent = "";
      if (!duong || !duong.diem || duong.diem.length < 2) return;
      var ds = duong.diem, t0 = duong.batDau, dai = Math.max(0.05, duong.ketThuc - t0);
      // Độ lệch giọng so với mẫu (semitone), bỏ phần lệch đều cả tiếng (bé đọc cao/thấp hơn lúc đo giọng)
      var lech = ds.map(function (q) { var u = (q.t - t0) / dai; return q.st - CaoDo.giaTriMau(mau, u); });
      var tb = lech.reduce(function (a, b) { return a + b; }, 0) / lech.length;
      tb = Math.max(-1.5, Math.min(1.5, tb));
      var PX_MOI_ST = 7, TOI_DA = 40;
      var chan = [], quang = 0, trai = true, truoc = null;
      ds.forEach(function (q, n) {
        var u = (q.t - t0) / dai, p = tai(d, nv.cham ? u * 0.98 : u);
        var lechPx = Math.max(-TOI_DA, Math.min(TOI_DA, (lech[n] - tb) * PX_MOI_ST));
        // pháp tuyến hướng "lên trên" của con đường (giọng cao hơn → lệch lên)
        var nx = p.dy, ny = -p.dx;
        if (ny > 0) { nx = -nx; ny = -ny; }
        var x = p.x + nx * lechPx, y = p.y + ny * lechPx;
        if (truoc) quang += Math.hypot(x - truoc[0], y - truoc[1]);
        if (!truoc || quang >= 14) {
          quang = 0;
          var lechChan = trai ? -4 : 4;
          chan.push({ x: x + p.dy * lechChan, y: y - p.dx * lechChan, goc: Math.atan2(p.dy, p.dx) * 180 / Math.PI });
          trai = !trai;
        }
        truoc = [x, y];
      });
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
