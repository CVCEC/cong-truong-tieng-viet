/*!
 * bang-am.js – Thẻ "Bảng âm (IPA)" của trang Luyện nói – Luyện thanh.
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC). Nguồn ký hiệu: xem luyen-noi/NGUON.md.
 *
 * Gồm: bảng âm đầu, nguyên âm, nguyên âm đôi, âm đệm, âm cuối, thanh điệu, bảng vần,
 * và phần "Ghép âm vần" (chọn âm đầu + vần + âm cuối + thanh → tiếng, phiên âm IPA, các bước đánh vần).
 *
 * Giọng mẫu: CHỈ dùng tệp giọng Trâu Con (Elio) do luyen-noi/studio.html tạo (window.LUYEN_NOI_GIONG).
 * KHÔNG dùng giọng máy của thiết bị. Câu nào chưa có tệp giọng thì nút loa mờ đi.
 * Danh sách mọi câu cần giọng: BangAm.tatCaAm() (studio.html đọc danh sách này).
 *
 * Ký hiệu IPA ghi theo âm vị, giọng Hà Nội làm chuẩn; chỗ giọng Sài Gòn khác ghi ở "sg".
 * Nguồn: Kirby (2011) JIPA 41(3); Thompson (1965) A Vietnamese Grammar; Đoàn Thiện Thuật (1977) Ngữ âm tiếng Việt;
 * Vũ Thanh Phương (1982) cho thanh điệu giọng Nam.
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) {
    module.exports = tao(require("./ghep-tieng.js"), require("./cao-do.js"), require("./cham-cau.js"));
  } else {
    goc.BangAm = tao(goc.GhepTieng, goc.CaoDo, goc.ChamCau);
  }
})(typeof self !== "undefined" ? self : this, function (GhepTieng, CaoDo, ChamCau) {
  "use strict";

  /* =====================================================================
     DỮ LIỆU
     doc: chữ Trâu Con đọc khi bấm loa (đọc theo âm: bờ, cờ, dờ…); vd: tiếng ví dụ.
     ===================================================================== */
  var AM_DAU = [
    { ma: "b", chu: "b", ipa: "ɓ", doc: "bờ", vd: ["bà"] },
    { ma: "c", chu: "c · k · q", ipa: "k", doc: "cờ", vd: ["cá", "kẹo"], ghiChu: { vi: "k trước e, ê, i; q luôn đi với u (qu)", en: "k before e, ê, i; q always comes with u (qu)" } },
    { ma: "ch", chu: "ch", ipa: "c", doc: "chờ", vd: ["chó"] },
    { ma: "d", chu: "d", ipa: "z", sg: "j", doc: "dờ", vd: ["dê"] },
    { ma: "đ", chu: "đ", ipa: "ɗ", doc: "đờ", vd: ["đỏ"] },
    { ma: "g", chu: "g · gh", ipa: "ɣ", doc: "gờ", vd: ["gà", "ghế"], ghiChu: { vi: "gh trước e, ê, i", en: "gh before e, ê, i" } },
    { ma: "gi", chu: "gi", ipa: "z", sg: "j", doc: "di", vd: ["giỏ"] },
    { ma: "h", chu: "h", ipa: "h", doc: "hờ", vd: ["hoa"] },
    { ma: "kh", chu: "kh", ipa: "x", doc: "khờ", vd: ["khế"] },
    { ma: "l", chu: "l", ipa: "l", doc: "lờ", vd: ["lá"] },
    { ma: "m", chu: "m", ipa: "m", doc: "mờ", vd: ["mẹ"] },
    { ma: "n", chu: "n", ipa: "n", doc: "nờ", vd: ["nơ"] },
    { ma: "ng", chu: "ng · ngh", ipa: "ŋ", doc: "ngờ", vd: ["ngựa", "nghé"], ghiChu: { vi: "ngh trước e, ê, i", en: "ngh before e, ê, i" } },
    { ma: "nh", chu: "nh", ipa: "ɲ", doc: "nhờ", vd: ["nhà"] },
    { ma: "ph", chu: "ph", ipa: "f", doc: "phờ", vd: ["phở"] },
    { ma: "qu", chu: "qu", ipa: "kw", sg: "w", doc: "quờ", vd: ["quà"], ghiChu: { vi: "q + âm đệm u", en: "q + the glide u" } },
    { ma: "r", chu: "r", ipa: "z", sg: "ɹ ~ r", doc: "rờ", vd: ["rổ"] },
    { ma: "s", chu: "s", ipa: "s", sg: "ʂ", doc: "sờ", vd: ["sẻ"] },
    { ma: "t", chu: "t", ipa: "t", doc: "tờ", vd: ["tô"] },
    { ma: "th", chu: "th", ipa: "tʰ", doc: "thờ", vd: ["thỏ"] },
    { ma: "tr", chu: "tr", ipa: "c", sg: "ʈ", doc: "trờ", vd: ["tre"], ghiChu: { vi: "giọng Hà Nội đọc giống ch", en: "sounds like ch in the Hà Nội accent" } },
    { ma: "v", chu: "v", ipa: "v", sg: "j ~ v", doc: "vờ", vd: ["voi"] },
    { ma: "x", chu: "x", ipa: "s", doc: "xờ", vd: ["xe"] }
  ];

  var NGUYEN_AM = [
    { ma: "a", chu: "a", ipa: "aː", doc: "a", vd: ["ba"] },
    { ma: "ă", chu: "ă", ipa: "a", doc: "á", vd: ["ăn"], ghiChu: { vi: "a ngắn, luôn có âm cuối", en: "short a, always has a final" } },
    { ma: "â", chu: "â", ipa: "ə", doc: "ớ", vd: ["cân"], ghiChu: { vi: "ơ ngắn, luôn có âm cuối", en: "short ơ, always has a final" } },
    { ma: "e", chu: "e", ipa: "ɛ", doc: "e", vd: ["mẹ"] },
    { ma: "ê", chu: "ê", ipa: "e", doc: "ê", vd: ["dê"] },
    { ma: "i", chu: "i · y", ipa: "i", doc: "i", vd: ["bi", "ý"] },
    { ma: "o", chu: "o", ipa: "ɔ", doc: "o", vd: ["bò"] },
    { ma: "ô", chu: "ô", ipa: "o", doc: "ô", vd: ["cô"] },
    { ma: "ơ", chu: "ơ", ipa: "əː", doc: "ơ", vd: ["nơ"] },
    { ma: "u", chu: "u", ipa: "u", doc: "u", vd: ["thu"] },
    { ma: "ư", chu: "ư", ipa: "ɨ", doc: "ư", vd: ["thư"] }
  ];

  var NGUYEN_AM_DOI = [
    { ma: "iê", chu: "iê · yê · ia · ya", ipa: "iə", doc: "ia", vd: ["mía", "tiên"], ghiChu: { vi: "không có âm cuối viết ia", en: "written ia with no final" } },
    { ma: "uô", chu: "uô · ua", ipa: "uə", doc: "ua", vd: ["cua", "chuông"], ghiChu: { vi: "không có âm cuối viết ua", en: "written ua with no final" } },
    { ma: "ươ", chu: "ươ · ưa", ipa: "ɨə", doc: "ưa", vd: ["mưa", "vườn"], ghiChu: { vi: "không có âm cuối viết ưa", en: "written ưa with no final" } }
  ];

  var AM_DEM = [
    { ma: "w", chu: "o · u", ipa: "w", vd: ["hoa", "thuỷ"], ghiChu: { vi: "o trước a, ă, e; u trước â, ê, y và sau q", en: "o before a, ă, e; u before â, ê, y and after q" } }
  ];

  var AM_CUOI = [
    { ma: "p", chu: "p", ipa: "p̚", vd: ["đẹp"] },
    { ma: "t", chu: "t", ipa: "t̚", vd: ["mặt"] },
    { ma: "c", chu: "c", ipa: "k̚", vd: ["học"] },
    { ma: "ch", chu: "ch", ipa: "c̚", vd: ["sách"], ghiChu: { vi: "sau a, ê, i", en: "after a, ê, i" } },
    { ma: "m", chu: "m", ipa: "m", vd: ["cơm"] },
    { ma: "n", chu: "n", ipa: "n", sg: "ŋ (sau một số vần)", vd: ["bàn"] },
    { ma: "ng", chu: "ng", ipa: "ŋ", vd: ["vàng"] },
    { ma: "nh", chu: "nh", ipa: "ɲ", sg: "n", vd: ["xanh"], ghiChu: { vi: "sau a, ê, i", en: "after a, ê, i" } },
    { ma: "i", chu: "i · y", ipa: "j", vd: ["tai", "tay"] },
    { ma: "u", chu: "o · u", ipa: "w", vd: ["cao", "rau"] }
  ];
  var CUOI_IPA = { "": "", p: "p̚", t: "t̚", c: "k̚", ch: "c̚", m: "m", n: "n", ng: "ŋ", nh: "ɲ", i: "j", y: "j", o: "w", u: "w" };

  var THANH = [
    { ma: "ngang", ten: "ngang", dau: "", doc: "thanh ngang", tenDau: "", vd: "ma" },
    { ma: "huyen", ten: "huyền", dau: "`", doc: "thanh huyền", tenDau: "huyền", vd: "mà" },
    { ma: "nga", ten: "ngã", dau: "~", doc: "thanh ngã", tenDau: "ngã", vd: "mã" },
    { ma: "hoi", ten: "hỏi", dau: "ˀ", doc: "thanh hỏi", tenDau: "hỏi", vd: "mả" },
    { ma: "sac", ten: "sắc", dau: "´", doc: "thanh sắc", tenDau: "sắc", vd: "má" },
    { ma: "nang", ten: "nặng", dau: ".", doc: "thanh nặng", tenDau: "nặng", vd: "mạ" }
  ];

  var IPA_DAU = { "": "ʔ", b: "ɓ", c: "k", ch: "c", d: "z", "đ": "ɗ", g: "ɣ", gi: "z", h: "h", kh: "x", l: "l", m: "m",
    n: "n", ng: "ŋ", nh: "ɲ", ph: "f", r: "z", s: "s", t: "t", th: "tʰ", tr: "c", v: "v", x: "s" };
  var IPA_DAU_SG = { d: "j", gi: "j", r: "ɹ", s: "ʂ", tr: "ʈ", v: "j" };
  var IPA_CHINH = { a: "aː", "ă": "a", "â": "ə", e: "ɛ", "ê": "e", i: "i", o: "ɔ", "ô": "o", "ơ": "əː", u: "u", "ư": "ɨ",
    "iê": "iə", "uô": "uə", "ươ": "ɨə" };

  /* =====================================================================
     GHÉP, PHIÊN ÂM, ĐÁNH VẦN
     ===================================================================== */
  function nfc(s) { return String(s).normalize("NFC"); }

  function timVan(ma) { for (var i = 0; i < GhepTieng.VAN.length; i++) if (GhepTieng.VAN[i].ma === ma) return GhepTieng.VAN[i]; return null; }

  /** Chữ viết của vần (không có âm đầu, thanh ngang): an, iên, uyên, ia, ưa… */
  function chuVan(van, cuoi) {
    var g = GhepTieng.ghep("t", van, cuoi, "ngang");
    if (!g.hopLe && g.lyDo !== "tac") return ""; // vần tắc (ac, ich, ôp…) viết như thường, chỉ khác thanh
    if (!g.chu) return "";
    return g.chu.slice(1); // bỏ "t"
  }

  /** Phiên âm IPA (âm vị) của một tiếng. giong: "hanoi" | "saigon". */
  function ipaTieng(dau, van, cuoi, thanh, giong) {
    var v = timVan(van);
    if (!v || !GhepTieng.hopLe(dau, van, cuoi)) return "";
    var sg = giong === "saigon";
    var dauIpa = (sg && IPA_DAU_SG[dau]) || IPA_DAU[dau] || "";
    if (dau === "c" && v.dem && sg) dauIpa = ""; // qu giọng Nam: /w/
    var dem = v.dem ? "w" : "";
    var chinh = IPA_CHINH[v.chinh] || "";
    // a + y, a + u là a ngắn (ay, au); â + y, â + u giữ ə
    if (v.chinh === "a" && (cuoi === "y" || cuoi === "u")) chinh = "a";
    var cuoiIpa = CUOI_IPA[cuoi] || "";
    var tac = GhepTieng.laTac(cuoi);
    var m = CaoDo.layMau(sg ? "saigon" : "hanoi", thanh || "ngang", tac);
    var thanhIpa = m ? CaoDo.chuIPA(m.chao) : "";
    return "/" + dauIpa + dem + chinh + cuoiIpa + thanhIpa + "/";
  }

  /** Các bước đánh vần theo cách của lớp tiếng Việt: bờ – a – ba – huyền – bà. Trả [{chu, loai}] */
  function danhVan(dau, van, cuoi, thanh) {
    var tiengCoDau = GhepTieng.ghep(dau, van, cuoi, thanh || "ngang");
    if (!tiengCoDau.hopLe) return [];
    var buoc = [];
    var am = null;
    for (var i = 0; i < AM_DAU.length; i++) if (AM_DAU[i].ma === dau) am = AM_DAU[i];
    var v = timVan(van);
    // qu: đánh vần "quờ" + phần vần sau âm đệm (qua: quờ – a – qua)
    var laQu = dau === "c" && v && v.dem;
    var vanChu = chuVan(van, cuoi);
    if (laQu) {
      for (var j = 0; j < AM_DAU.length; j++) if (AM_DAU[j].ma === "qu") am = AM_DAU[j];
      vanChu = vanChu.slice(1); // bỏ âm đệm u/o: "oa" → "a", "uy" → "y"
    }
    if (am && dau !== "") buoc.push({ chu: am.doc, loai: "am" });
    buoc.push({ chu: vanChu, loai: "van" });
    var ngang = GhepTieng.ghep(dau, van, cuoi, "ngang").chu;
    if (dau !== "" || thanh !== "ngang") buoc.push({ chu: ngang, loai: "tieng" });
    if (thanh && thanh !== "ngang") {
      var th = null;
      for (var k = 0; k < THANH.length; k++) if (THANH[k].ma === thanh) th = THANH[k];
      buoc.push({ chu: th.tenDau, loai: "dau" });
      buoc.push({ chu: tiengCoDau.chu, loai: "tieng" });
    }
    // bỏ bước trùng liền nhau (ví dụ tiếng không có âm đầu, thanh ngang: "an")
    return buoc.filter(function (b, n) { return b.chu && !(n > 0 && buoc[n - 1].chu === b.chu); });
  }

  /** Tách một tiếng đã viết thành {dau, van, cuoi, thanh} (tra bảng mọi cách ghép). */
  var BANG_TACH = null;
  function tachTieng(chu) {
    if (!BANG_TACH) {
      BANG_TACH = {};
      GhepTieng.AM_DAU.forEach(function (d) {
        GhepTieng.VAN.forEach(function (v) {
          GhepTieng.AM_CUOI.forEach(function (c) {
            if (!GhepTieng.hopLe(d.ma, v.ma, c.ma)) return;
            GhepTieng.thanhDung(c.ma).forEach(function (t) {
              var g = GhepTieng.ghep(d.ma, v.ma, c.ma, t);
              if (g.hopLe && !BANG_TACH[g.chu]) BANG_TACH[g.chu] = { dau: d.ma, van: v.ma, cuoi: c.ma, thanh: t };
            });
          });
        });
      });
    }
    return BANG_TACH[nfc(chu).toLowerCase()] || null;
  }

  /** Bảng vần, chia nhóm: vần không có âm cuối, có âm cuối, có âm đệm. */
  function bangVan() {
    var nhom = { mo: [], cuoi: [], dem: [] }, co = {};
    GhepTieng.VAN.forEach(function (v) {
      v.cuoi.forEach(function (c) {
        var chu = chuVan(v.ma, c);
        if (!chu || co[chu]) return;
        co[chu] = true;
        var muc = { chu: chu, van: v.ma, cuoi: c };
        if (v.dem) nhom.dem.push(muc); else if (c === "") nhom.mo.push(muc); else nhom.cuoi.push(muc);
      });
    });
    return nhom;
  }

  function maCau(chu) { return ChamCau.maCau(chu); }

  /** Mọi câu cần giọng mẫu cho thẻ Bảng âm (studio.html tạo giọng Elio cho các câu này). */
  function tatCaAm() {
    var ra = [], co = {};
    function them(chu, loai) {
      chu = nfc(chu || "").trim();
      if (!chu) return;
      var ma = maCau(chu);
      if (co[ma]) return;
      co[ma] = true;
      ra.push({ ma: ma, chu: chu, loai: loai });
    }
    [AM_DAU, NGUYEN_AM, NGUYEN_AM_DOI].forEach(function (ds) { ds.forEach(function (a) { them(a.doc, "am"); }); });
    [AM_DAU, NGUYEN_AM, NGUYEN_AM_DOI, AM_DEM, AM_CUOI].forEach(function (ds) {
      ds.forEach(function (a) { (a.vd || []).forEach(function (w) { them(w, "vi-du"); }); });
    });
    THANH.forEach(function (t) { them(t.doc, "thanh"); them(t.tenDau, "dau"); them(t.vd, "vi-du"); });
    var bv = bangVan();
    bv.mo.concat(bv.cuoi, bv.dem).forEach(function (m) { them(m.chu, "van"); });
    // Bước 3 (Đường đi học): đủ các thanh của mỗi tiếng gợi ý, để nút "Nghe mẫu" có giọng
    GhepTieng.GOI_Y.forEach(function (g) {
      GhepTieng.thanhDung(g.cuoi).forEach(function (th) { them(GhepTieng.ghep(g.dau, g.van, g.cuoi, th).chu, "luyen-thanh"); });
    });
    // Các bước đánh vần của mọi tiếng ví dụ và tiếng gợi ý
    var tieng = [];
    [AM_DAU, NGUYEN_AM, NGUYEN_AM_DOI, AM_DEM, AM_CUOI].forEach(function (ds) { ds.forEach(function (a) { tieng = tieng.concat(a.vd || []); }); });
    THANH.forEach(function (t) { tieng.push(t.vd); });
    GhepTieng.GOI_Y.forEach(function (g) { tieng.push(g.chu); });
    tieng.forEach(function (w) {
      var t = tachTieng(w);
      if (!t) return;
      danhVan(t.dau, t.van, t.cuoi, t.thanh).forEach(function (b) { them(b.chu, "danh-van"); });
    });
    return ra;
  }

  /* =====================================================================
     GIAO DIỆN (chỉ chạy trong trình duyệt)
     ===================================================================== */
  var CHU = {
    vi: {
      gioiThieu: "Bấm 🔈 để nghe Trâu Con đọc mẫu. Ký hiệu trong /…/ là IPA (bảng phiên âm quốc tế), ghi theo giọng phổ thông (Hà Nội).",
      chuaCoGiong: "Trâu Con đang tập đọc mẫu cho bảng này. Nút loa mờ là chưa có giọng đọc mẫu, các bạn quay lại sau nhé.",
      amDau: "Âm đầu (phụ âm đầu)", nguyenAm: "Nguyên âm", nguyenAmDoi: "Nguyên âm đôi", amDem: "Âm đệm",
      amCuoi: "Âm cuối", thanh: "Thanh điệu", bangVan: "Bảng vần", ghep: "Ghép âm vần",
      vanMo: "Vần không có âm cuối", vanCuoi: "Vần có âm cuối", vanDem: "Vần có âm đệm",
      sg: "Giọng Sài Gòn", nghe: "Nghe", viDu: "Ví dụ",
      thanhCot: ["Thanh", "Dấu", "Ví dụ", "Hướng giọng", ""],
      luyenThanh: "Luyện thanh", khongDau: "không dấu",
      ghepHuongDan: "Chọn âm đầu, vần, âm cuối và thanh. Trâu Con ghép thành tiếng, ghi phiên âm và đánh vần cho các bạn.",
      ghepDau: "Âm đầu", ghepVan: "Vần", ghepCuoi: "Âm cuối", ghepThanh: "Thanh", khongCo: "không có",
      tieng: "Tiếng ghép được", phienAm: "Phiên âm IPA", danhVan: "Đánh vần", docCaChuoi: "Nghe đánh vần",
      ghiChuGhep: "Tiếng ghép ra có thể không có nghĩa. Âm bị làm mờ là âm không ghép được với lựa chọn hiện tại.",
      tac: "Tiếng kết thúc bằng p, t, c, ch chỉ có thanh sắc và thanh nặng.",
      moVan: "Xem bảng vần", dongVan: "Thu gọn bảng vần"
    },
    en: {
      gioiThieu: "Press 🔈 to hear Trâu Con read the model. Symbols in /…/ are IPA (the International Phonetic Alphabet) for standard Vietnamese (Hà Nội).",
      chuaCoGiong: "Trâu Con is still recording this chart. Faded speaker buttons have no model audio yet — please come back later.",
      amDau: "Initial consonants", nguyenAm: "Vowels", nguyenAmDoi: "Diphthongs", amDem: "Glide",
      amCuoi: "Final sounds", thanh: "Tones", bangVan: "Rhyme chart", ghep: "Blend sounds into a syllable",
      vanMo: "Rhymes without a final", vanCuoi: "Rhymes with a final", vanDem: "Rhymes with a glide",
      sg: "Sài Gòn accent", nghe: "Listen", viDu: "Example",
      thanhCot: ["Tone", "Mark", "Example", "Voice goes", ""],
      luyenThanh: "Practise tone", khongDau: "no mark",
      ghepHuongDan: "Choose an initial, rhyme, final and tone. Trâu Con blends them into a syllable, writes the IPA and spells it out for you.",
      ghepDau: "Initial", ghepVan: "Rhyme", ghepCuoi: "Final", ghepThanh: "Tone", khongCo: "none",
      tieng: "Syllable", phienAm: "IPA", danhVan: "Spelling out", docCaChuoi: "Hear it spelled out",
      ghiChuGhep: "The syllable you build may not be a real word. Faded sounds can't be combined with your current choice.",
      tac: "Syllables ending in p, t, c, ch only take the sắc and nặng tones.",
      moVan: "Show the rhyme chart", dongVan: "Hide the rhyme chart"
    }
  };

  function giaoDien() {
    var doc = document;
    function nn() { return (window.CONG && window.CONG.ngonNgu && window.CONG.ngonNgu() === "en") ? "en" : "vi"; }
    function T(k) { return CHU[nn()][k]; }
    function chuNN(o) { return o ? (nn() === "en" ? o.en : o.vi) : ""; }
    function tao(the, lop, chu) { var e = doc.createElement(the); if (lop) e.className = lop; if (chu != null) e.textContent = chu; return e; }

    /* ---------- Giọng mẫu (Elio) ---------- */
    var dangPhat = null;
    function coGiong(chu) {
      var g = window.LUYEN_NOI_GIONG, ma = maCau(chu);
      return !!(g && g.files && g.files[ma] && g.sprites && g.sprites[g.files[ma][0]]);
    }
    function coGiongNao() {
      var g = window.LUYEN_NOI_GIONG;
      if (!g || !g.files) return false;
      return tatCaAm().some(function (a) { return !!g.files[a.ma]; });
    }
    function dungPhat() {
      if (dangPhat) { try { dangPhat.am.pause(); } catch (e) {} clearTimeout(dangPhat.hen); var x = dangPhat.xong; dangPhat = null; if (x) x(); }
    }
    function phat(chu) {
      dungPhat();
      if (!coGiong(chu)) return Promise.resolve();
      var g = window.LUYEN_NOI_GIONG, f = g.files[maCau(chu)];
      return new Promise(function (xong) {
        var am = new Audio(); am.preload = "auto"; am.src = "/luyen-noi/" + g.sprites[f[0]];
        var p = { am: am, hen: 0, xong: xong };
        dangPhat = p;
        var batDau = function () {
          try { am.currentTime = f[1]; } catch (e) {}
          var r = am.play();
          if (r && r.catch) r.catch(function () { if (dangPhat === p) { dangPhat = null; xong(); } });
          p.hen = setTimeout(function () { if (dangPhat === p) { am.pause(); dangPhat = null; xong(); } }, f[2] * 1000 + 150);
        };
        if (am.readyState >= 1) batDau(); else am.addEventListener("loadedmetadata", batDau, { once: true });
        am.addEventListener("error", function () { if (dangPhat === p) { dangPhat = null; xong(); } }, { once: true });
      });
    }
    function nutLoa(chu, nhan) {
      var b = tao("button", "ba-loa");
      b.type = "button";
      b.lang = "vi";
      b.appendChild(tao("span", "ba-loa-icon", "🔈"));
      if (nhan) b.appendChild(tao("span", "ba-loa-chu", nhan));
      var co = coGiong(chu);
      b.setAttribute("aria-label", T("nghe") + ": " + chu);
      if (!co) { b.disabled = true; b.classList.add("ba-chua-co"); b.title = T("chuaCoGiong"); }
      b.addEventListener("click", function () {
        b.classList.add("ba-dang-phat");
        phat(chu).then(function () { b.classList.remove("ba-dang-phat"); });
      });
      return b;
    }

    /* ---------- Ô âm ---------- */
    function oAm(a, coDoc) {
      var o = tao("div", "ba-o");
      var dau = tao("div", "ba-o-dau");
      var chu = tao("span", "ba-chu", a.chu); chu.lang = "vi";
      dau.appendChild(chu);
      if (a.ipa) dau.appendChild(tao("span", "ba-ipa", "/" + a.ipa + "/"));
      o.appendChild(dau);
      if (a.ghiChu) o.appendChild(tao("p", "ba-ghi-chu", chuNN(a.ghiChu)));
      var hang = tao("div", "ba-loa-hang");
      if (coDoc && a.doc) hang.appendChild(nutLoa(a.doc, a.doc));
      (a.vd || []).forEach(function (w) { hang.appendChild(nutLoa(w, w)); });
      o.appendChild(hang);
      return o;
    }
    function phanLuoi(tieuDe, ds, coDoc, id) {
      var s = tao("section", "ln-the ba-phan");
      if (id) s.id = id;
      s.appendChild(tao("h2", null, tieuDe));
      var l = tao("div", "ba-luoi");
      ds.forEach(function (a) { l.appendChild(oAm(a, coDoc)); });
      s.appendChild(l);
      return s;
    }

    /* ---------- Bảng thanh ---------- */
    function phanThanh() {
      var s = tao("section", "ln-the ba-phan");
      s.appendChild(tao("h2", null, T("thanh")));
      var bang = tao("table", "ba-bang-thanh");
      var tr = tao("tr");
      T("thanhCot").forEach(function (c) { tr.appendChild(tao("th", null, c)); });
      var thead = tao("thead"); thead.appendChild(tr); bang.appendChild(thead);
      var tb = tao("tbody");
      THANH.forEach(function (t) {
        var r = tao("tr");
        var c1 = tao("td"); c1.appendChild(nutLoa(t.doc, t.ten)); r.appendChild(c1);
        r.appendChild(tao("td", "ba-dau", t.dau || T("khongDau")));
        var c3 = tao("td"); c3.appendChild(nutLoa(t.vd, t.vd)); r.appendChild(c3);
        // Mũi tên chỉ hướng giọng (giọng phổ thông), cùng hình với Bước 3 Luyện thanh
        var cmt = tao("td", "cd-the-" + t.ma);
        if (window.ConDuong) cmt.appendChild(window.ConDuong.veMuiTen(t.ma));
        r.appendChild(cmt);
        var c6 = tao("td");
        var a = tao("button", "ttv-nut-phu ba-nut-nho", "🎵 " + T("luyenThanh"));
        a.type = "button";
        a.addEventListener("click", function () { sangLuyenThanh("m", "a", ""); });
        c6.appendChild(a); r.appendChild(c6);
        tb.appendChild(r);
      });
      bang.appendChild(tb);
      var cuon = tao("div", "ba-cuon"); cuon.appendChild(bang);
      s.appendChild(cuon);
      return s;
    }

    /* ---------- Bảng vần ---------- */
    function phanVan() {
      var s = tao("section", "ln-the ba-phan");
      s.appendChild(tao("h2", null, T("bangVan")));
      var chiTiet = tao("details", "ba-van-mo");
      var tom = tao("summary", "ttv-nut-phu", T("moVan"));
      chiTiet.appendChild(tom);
      chiTiet.addEventListener("toggle", function () { tom.textContent = chiTiet.open ? T("dongVan") : T("moVan"); });
      var bv = bangVan();
      [["mo", T("vanMo")], ["cuoi", T("vanCuoi")], ["dem", T("vanDem")]].forEach(function (n) {
        chiTiet.appendChild(tao("h3", "ln-nho", n[1]));
        var h = tao("div", "ba-van-hang");
        bv[n[0]].forEach(function (m) { h.appendChild(nutLoa(m.chu, m.chu)); });
        chiTiet.appendChild(h);
      });
      s.appendChild(chiTiet);
      return s;
    }

    /* ---------- Ghép âm vần ---------- */
    var chon = { dau: "b", van: "a", cuoi: "", thanh: "huyen" };
    function hopLe(c) { return GhepTieng.hopLe(c.dau, c.van, c.cuoi) && GhepTieng.thanhDung(c.cuoi).indexOf(c.thanh) >= 0; }
    function datChon(slot, ma) {
      chon[slot] = ma;
      if (hopLe(chon)) return;
      var nguon = { dau: GhepTieng.AM_DAU, van: GhepTieng.VAN, cuoi: GhepTieng.AM_CUOI };
      ["cuoi", "van", "dau"].forEach(function (s2) {
        if (s2 === slot || GhepTieng.hopLe(chon.dau, chon.van, chon.cuoi)) return;
        for (var i = 0; i < nguon[s2].length; i++) {
          var thu = { dau: chon.dau, van: chon.van, cuoi: chon.cuoi }; thu[s2] = nguon[s2][i].ma;
          if (GhepTieng.hopLe(thu.dau, thu.van, thu.cuoi)) { chon[s2] = nguon[s2][i].ma; break; }
        }
      });
      if (GhepTieng.thanhDung(chon.cuoi).indexOf(chon.thanh) < 0) chon.thanh = "sac";
    }
    function phanGhep() {
      var s = tao("section", "ln-the ba-phan");
      s.id = "ba-ghep";
      s.appendChild(tao("h2", null, T("ghep")));
      s.appendChild(tao("p", "ln-ghi-chu-nho", T("ghepHuongDan")));
      var noi = tao("div");
      s.appendChild(noi);
      function ve() {
        noi.textContent = "";
        var thanhDs = THANH.map(function (t) { return { ma: t.ma, nhan: t.ten }; });
        [["dau", T("ghepDau"), GhepTieng.AM_DAU], ["van", T("ghepVan"), GhepTieng.VAN], ["cuoi", T("ghepCuoi"), GhepTieng.AM_CUOI], ["thanh", T("ghepThanh"), thanhDs]].forEach(function (nhom) {
          var slot = nhom[0];
          var fs = tao("fieldset", "ln-nhom-ghep");
          fs.appendChild(tao("legend", null, nhom[1]));
          var hang = tao("div", "ln-chip-hang");
          nhom[2].forEach(function (o) {
            var b = tao("button", "ln-chip", o.ma === "" ? T("khongCo") : o.nhan);
            b.type = "button"; b.lang = "vi";
            b.setAttribute("aria-pressed", chon[slot] === o.ma ? "true" : "false");
            var thu = { dau: chon.dau, van: chon.van, cuoi: chon.cuoi, thanh: chon.thanh }; thu[slot] = o.ma;
            if (!hopLe(thu)) b.classList.add("ln-mo");
            b.addEventListener("click", function () { datChon(slot, o.ma); ve(); });
            hang.appendChild(b);
          });
          fs.appendChild(hang);
          noi.appendChild(fs);
        });
        var g = GhepTieng.ghep(chon.dau, chon.van, chon.cuoi, chon.thanh);
        var kq = tao("div", "ba-ket-qua");
        var o1 = tao("div", "ba-kq-o");
        o1.appendChild(tao("span", "ba-kq-nhan", T("tieng")));
        var to = tao("strong", "ln-chu-to", g.chu); to.lang = "vi";
        o1.appendChild(to);
        kq.appendChild(o1);
        var o2 = tao("div", "ba-kq-o");
        o2.appendChild(tao("span", "ba-kq-nhan", T("phienAm")));
        o2.appendChild(tao("span", "ba-ipa ba-ipa-to", ipaTieng(chon.dau, chon.van, chon.cuoi, chon.thanh, "hanoi")));
        kq.appendChild(o2);
        noi.appendChild(kq);

        noi.appendChild(tao("h3", "ln-nho", T("danhVan")));
        var buoc = danhVan(chon.dau, chon.van, chon.cuoi, chon.thanh);
        var hb = tao("div", "ba-danh-van");
        buoc.forEach(function (b, i) {
          if (i) hb.appendChild(tao("span", "ba-gach", "–")).setAttribute("aria-hidden", "true");
          hb.appendChild(nutLoa(b.chu, b.chu));
        });
        noi.appendChild(hb);
        var hang2 = tao("div", "ln-the-nut");
        var caChuoi = tao("button", "ttv-nut ba-nut-nho", "🔈 " + T("docCaChuoi"));
        caChuoi.type = "button";
        var coDu = buoc.some(function (b) { return coGiong(b.chu); });
        if (!coDu) { caChuoi.disabled = true; caChuoi.title = T("chuaCoGiong"); }
        caChuoi.addEventListener("click", function () {
          var ds = buoc.filter(function (b) { return coGiong(b.chu); });
          (function tiep(n) { if (n < ds.length) phat(ds[n].chu).then(function () { setTimeout(function () { tiep(n + 1); }, 250); }); })(0);
        });
        hang2.appendChild(caChuoi);
        var lt = tao("button", "ttv-nut-phu ba-nut-nho", "🎵 " + T("luyenThanh"));
        lt.type = "button";
        lt.addEventListener("click", function () { sangLuyenThanh(chon.dau, chon.van, chon.cuoi); });
        hang2.appendChild(lt);
        noi.appendChild(hang2);
        noi.appendChild(tao("p", "ln-ghi-chu-nho", T("ghiChuGhep") + (GhepTieng.laTac(chon.cuoi) ? " " + T("tac") : "")));
      }
      ve();
      return s;
    }

    function sangLuyenThanh(dau, van, cuoi) {
      dungPhat();
      if (window.LuyenNoi && typeof window.LuyenNoi.chonTieng === "function") window.LuyenNoi.chonTieng(dau, van, cuoi);
      try { location.hash = "#luyen-thanh"; } catch (e) {}
      var b3 = doc.getElementById("ln-buoc-3");
      if (b3 && b3.scrollIntoView) setTimeout(function () { b3.scrollIntoView({ block: "start", behavior: "smooth" }); }, 80);
    }

    function veHet() {
      var hop = doc.getElementById("ln-panel-bang-am-noi-dung");
      if (!hop) return;
      dungPhat();
      hop.textContent = "";
      var gt = tao("div", "ln-ghi-chu ba-gioi-thieu");
      gt.appendChild(tao("p", null, T("gioiThieu")));
      if (!coGiongNao()) gt.appendChild(tao("p", "ba-chua-co-giong", T("chuaCoGiong")));
      hop.appendChild(gt);
      // Mục lục nhanh
      var ml = tao("nav", "ln-chip-hang ba-muc-luc");
      [["ba-dau", T("amDau")], ["ba-nguyen-am", T("nguyenAm")], ["ba-cuoi", T("amCuoi")], ["ba-thanh", T("thanh")], ["ba-ghep", T("ghep")]].forEach(function (m) {
        var a = tao("a", "ln-chip", m[1]); a.href = "#" + m[0];
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var el = doc.getElementById(m[0]);
          if (el && el.scrollIntoView) el.scrollIntoView({ block: "start", behavior: "smooth" });
        });
        ml.appendChild(a);
      });
      hop.appendChild(ml);
      hop.appendChild(phanLuoi(T("amDau"), AM_DAU, true, "ba-dau"));
      var na = phanLuoi(T("nguyenAm"), NGUYEN_AM, true, "ba-nguyen-am");
      na.appendChild(tao("h3", "ln-nho", T("nguyenAmDoi")));
      var l2 = tao("div", "ba-luoi"); NGUYEN_AM_DOI.forEach(function (a) { l2.appendChild(oAm(a, true)); }); na.appendChild(l2);
      hop.appendChild(na);
      var ac = phanLuoi(T("amCuoi"), AM_CUOI, false, "ba-cuoi");
      ac.appendChild(tao("h3", "ln-nho", T("amDem")));
      var l3 = tao("div", "ba-luoi"); AM_DEM.forEach(function (a) { l3.appendChild(oAm(a, false)); }); ac.appendChild(l3);
      hop.appendChild(ac);
      var th = phanThanh(); th.id = "ba-thanh"; hop.appendChild(th);
      hop.appendChild(phanVan());
      hop.appendChild(phanGhep());
    }

    veHet();
    if (window.CONG && window.CONG.khiDoiChu) window.CONG.khiDoiChu(function () { veHet(); });
    // Rời thẻ Bảng âm thì dừng tiếng
    window.addEventListener("hashchange", function () { if (location.hash !== "#bang-am") dungPhat(); });
  }

  if (typeof document !== "undefined" && typeof window !== "undefined" && !(typeof module === "object" && module.exports)) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", giaoDien);
    else giaoDien();
  }

  return {
    AM_DAU: AM_DAU, NGUYEN_AM: NGUYEN_AM, NGUYEN_AM_DOI: NGUYEN_AM_DOI, AM_DEM: AM_DEM, AM_CUOI: AM_CUOI, THANH: THANH,
    chuVan: chuVan, ipaTieng: ipaTieng, danhVan: danhVan, tachTieng: tachTieng, bangVan: bangVan, tatCaAm: tatCaAm
  };
});
