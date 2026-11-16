/*!
 * luyen-cau.js – Ba thẻ "Luyện từ", "Luyện câu", "Hội thoại cùng Trâu Con" của trang Luyện nói (vietclass.cvcec.org/luyen-noi/).
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC).
 *
 * - Nội dung lấy từ luyen-noi/noi-dung.txt (đọc bằng ChamCau.docNoiDung).
 * - Giọng mẫu: chỉ dùng tệp giọng Elio do luyen-noi/studio.html tạo (window.LUYEN_NOI_GIONG). KHÔNG dùng giọng máy.
 * - Chấm câu: nhận dạng giọng nói của trình duyệt (Web Speech API, vi-VN). Trình duyệt gửi giọng đọc tới dịch vụ
 *   nhận dạng của Google (Chrome, Edge) hoặc Apple (Safari). CVCEC không ghi lại, không lưu âm thanh hay điểm.
 *
 * Khoá localStorage (mới, chỉ trang này dùng):
 *   "luyen-noi-chu-de"  – chủ đề đang chọn
 *   "luyen-noi-hien-anh" – "1" hiện nghĩa tiếng Anh, "0" ẩn
 *   "luyen-noi-the"      – thẻ đang mở (luyen-thanh | luyen-tu | luyen-cau | hoi-thoai)
 */
(function () {
  "use strict";

  var ChamCau = window.ChamCau, GhepTieng = window.GhepTieng;
  var KHOA_CHU_DE = "luyen-noi-chu-de", KHOA_ANH = "luyen-noi-hien-anh", KHOA_THE = "luyen-noi-the";
  var CAC_THE = ["luyen-thanh", "luyen-tu", "luyen-cau", "hoi-thoai"];

  /* ---------- Chữ trên trang (VI / EN) ---------- */
  var CHU = {
    vi: {
      dangTai: "Mình đang lấy bài…",
      loiTai: "Mình chưa lấy được bài luyện nói. Các bạn kiểm tra mạng rồi tải lại trang nhé.",
      chonChuDe: "Chọn chủ đề", hienAnh: "Hiện nghĩa tiếng Anh",
      ngheMau: "Nghe mẫu", doc: "Đọc", dangNghe: "Mình đang nghe…", docLai: "Đọc lại",
      chuaCoGiong: "Câu này chưa có giọng mẫu của Trâu Con.",
      tuHuongDan: "Bấm “Nghe mẫu”, rồi bấm “Đọc” và đọc to từ đó.",
      cauHuongDan: "Bấm “Nghe mẫu”, rồi bấm “Đọc” và đọc cả câu thật rõ.",
      ghiChuNghe: "Máy nghe và chấm câu",
      ghiChuNgheNd: "Khi các bạn bấm “Đọc”, trình duyệt gửi giọng đọc tới dịch vụ nhận dạng giọng nói của Google (Chrome, Edge) hoặc Apple (Safari) để viết lại câu. CVCEC không ghi lại và không lưu âm thanh hay điểm. Các bạn nhỏ hỏi bố mẹ trước khi dùng nhé.",
      ghiChuCham: "Điểm chỉ để tham khảo",
      ghiChuChamNd: "Máy có thể nghe nhầm, nhất là khi phòng ồn. Thầy cô vẫn là người nghe giỏi nhất.",
      khongHoTro: "Trình duyệt này chưa nghe và chấm được câu. Các bạn dùng Chrome, Edge hoặc Safari nhé. Các bạn vẫn nghe mẫu và tự đọc theo được.",
      mayNghe: "Máy nghe được:", khongNghe: "(chưa nghe thấy gì)",
      chuGiai: { dung: "Đúng", "sai-thanh": "Sai dấu", sai: "Chưa đúng", thieu: "Chưa đọc" },
      luyenThanh: function (t) { return "Luyện thanh “" + t + "”"; },
      diem: "điểm", muc: { tot: "Tốt", "gan-dung": "Gần đúng", "can-luyen": "Cần luyện thêm" },
      khen: {
        tot: "Tuyệt quá! Các bạn đọc rất rõ.",
        "gan-dung": "Gần đúng rồi! Các bạn xem chữ màu cam, màu đỏ rồi đọc lại nhé.",
        "can-luyen": "Mình cùng luyện thêm nhé! Các bạn nghe mẫu rồi đọc chậm lại một chút."
      },
      loi: {
        "not-allowed": "Máy chưa cho dùng micro. Các bạn nhờ bố mẹ bật quyền micro cho trang này (bấm biểu tượng ổ khoá hoặc “aA” cạnh địa chỉ trang), rồi bấm lại nhé.",
        "service-not-allowed": "Máy chưa cho nhận dạng giọng nói. Trên iPad, các bạn nhờ bố mẹ bật Cài đặt → Cài đặt chung → Bàn phím → Bật Đọc chính tả, rồi thử lại nhé.",
        "no-speech": "Mình chưa nghe thấy gì. Các bạn đọc to hơn, gần micro hơn nhé.",
        "audio-capture": "Mình không tìm thấy micro. Các bạn kiểm tra tai nghe hoặc micro rồi thử lại nhé.",
        "network": "Máy cần có mạng internet để chấm câu. Các bạn kiểm tra mạng rồi thử lại nhé.",
        "language-not-supported": "Trình duyệt này chưa nghe được tiếng Việt. Các bạn thử Chrome hoặc Safari nhé.",
        chung: "Có lỗi khi nghe. Các bạn thử lại nhé."
      },
      htChon: "Chọn đoạn hội thoại", htBatDau: "Bắt đầu nói chuyện", htTiep: "Tiếp", htLamLai: "Nói chuyện lại",
      htLuotBan: "Đến lượt các bạn đọc:", htTrau: "Trâu Con", htBan: "Các bạn",
      htXong: function (d) { return "Mình nói chuyện xong rồi! Điểm trung bình của các bạn: " + d + " điểm."; },
      htXongKhongDiem: "Mình nói chuyện xong rồi! Cảm ơn các bạn nhé.",
      htGoiY: "Các bạn đọc xong thì bấm “Tiếp” nhé.",
      tuTrong: "Chủ đề này chưa có từ.", cauTrong: "Chủ đề này chưa có câu.", htTrong: "Chủ đề này chưa có hội thoại."
    },
    en: {
      dangTai: "Loading the lessons…",
      loiTai: "I couldn't load the speaking lessons. Please check your internet and reload the page.",
      chonChuDe: "Choose a topic", hienAnh: "Show English meaning",
      ngheMau: "Listen", doc: "Read", dangNghe: "I'm listening…", docLai: "Read again",
      chuaCoGiong: "Trâu Con hasn't recorded this one yet.",
      tuHuongDan: "Press “Listen”, then press “Read” and say the word out loud.",
      cauHuongDan: "Press “Listen”, then press “Read” and say the whole sentence clearly.",
      ghiChuNghe: "The browser listens and scores",
      ghiChuNgheNd: "When you press “Read”, your browser sends your voice to Google’s (Chrome, Edge) or Apple’s (Safari) speech recognition service to write down what you said. CVCEC does not record or keep any audio or scores. Kids, please ask a parent before using it.",
      ghiChuCham: "Scores are for reference only",
      ghiChuChamNd: "The computer can mishear, especially in a noisy room. Your teacher is still the best listener.",
      khongHoTro: "This browser can't listen and score yet. Please use Chrome, Edge or Safari. You can still listen and read along.",
      mayNghe: "The computer heard:", khongNghe: "(nothing heard yet)",
      chuGiai: { dung: "Correct", "sai-thanh": "Wrong tone", sai: "Not quite", thieu: "Not read" },
      luyenThanh: function (t) { return "Practise the tone of “" + t + "”"; },
      diem: "points", muc: { tot: "Great", "gan-dung": "Almost", "can-luyen": "Keep practising" },
      khen: {
        tot: "Wonderful! You read very clearly.",
        "gan-dung": "Almost there! Look at the orange and red words, then read again.",
        "can-luyen": "Let's practise more! Listen to the model, then read a little more slowly."
      },
      loi: {
        "not-allowed": "The microphone isn't allowed yet. Ask a parent to allow the microphone for this page (tap the lock or “aA” icon next to the address), then try again.",
        "service-not-allowed": "Speech recognition isn't allowed. On iPad, ask a parent to turn on Settings → General → Keyboard → Enable Dictation, then try again.",
        "no-speech": "I didn't hear anything. Please speak louder and closer to the microphone.",
        "audio-capture": "I can't find a microphone. Check your headset or microphone and try again.",
        "network": "Scoring needs an internet connection. Please check your internet and try again.",
        "language-not-supported": "This browser can't recognise Vietnamese yet. Please try Chrome or Safari.",
        chung: "Something went wrong while listening. Please try again."
      },
      htChon: "Choose a conversation", htBatDau: "Start talking", htTiep: "Next", htLamLai: "Talk again",
      htLuotBan: "Your turn to read:", htTrau: "Trâu Con", htBan: "You",
      htXong: function (d) { return "We finished talking! Your average score: " + d + " points."; },
      htXongKhongDiem: "We finished talking! Thank you.",
      htGoiY: "When you've finished reading, press “Next”.",
      tuTrong: "This topic has no words yet.", cauTrong: "This topic has no sentences yet.", htTrong: "This topic has no conversation yet."
    }
  };
  function ngonNgu() { return (window.CONG && window.CONG.ngonNgu && window.CONG.ngonNgu() === "en") ? "en" : "vi"; }
  function T(k) { return CHU[ngonNgu()][k]; }

  function doc(khoa) { try { return window.localStorage.getItem(khoa); } catch (e) { return null; } }
  function ghi(khoa, v) { try { window.localStorage.setItem(khoa, v); } catch (e) {} }

  function $(sel, goc) { return (goc || document).querySelector(sel); }
  function tao(the, lop, chu) {
    var el = document.createElement(the);
    if (lop) el.className = lop;
    if (chu != null) el.textContent = chu;
    return el;
  }
  function nut(lop, chu, khiBam) {
    var b = tao("button", lop, chu); b.type = "button";
    if (khiBam) b.addEventListener("click", khiBam);
    return b;
  }
  function anhTrau(ten) { return "/assets/trau/" + ten; }
  function imgTrau(ten, lop) { var i = tao("img", lop); i.src = anhTrau(ten); i.alt = ""; i.width = 300; i.height = 360; i.loading = "lazy"; return i; }

  /* ---------- Trạng thái ---------- */
  var S = {
    nd: null, loiTai: false,
    chuDe: doc(KHOA_CHU_DE) || "",
    hienAnh: doc(KHOA_ANH) !== "0",
    ketQua: {},          // ma câu → kết quả chấm gần nhất
    dangNghe: false,
    ht: { chuDe: "", so: 0, buoc: -1, diem: {} } // hội thoại: buoc = số lượt đã hiện (-1: chưa bắt đầu)
  };
  function chuDeDangChon() {
    if (!S.nd || !S.nd.chuDe.length) return null;
    for (var i = 0; i < S.nd.chuDe.length; i++) if (S.nd.chuDe[i].id === S.chuDe) return S.nd.chuDe[i];
    return S.nd.chuDe[0];
  }

  /* =====================================================================
     GIỌNG MẪU (tệp giọng Elio, không dùng giọng máy)
     ===================================================================== */
  var dangPhat = null;
  function coGiong(ma) {
    var g = window.LUYEN_NOI_GIONG;
    return !!(g && g.files && g.files[ma] && g.sprites && g.sprites[g.files[ma][0]]);
  }
  function dungPhat() {
    if (dangPhat) { try { dangPhat.am.pause(); } catch (e) {} clearTimeout(dangPhat.hen); if (dangPhat.xong) dangPhat.xong(); dangPhat = null; }
  }
  /** Phát một câu trong gói giọng. Trả về Promise xong khi phát hết (hoặc khi bị dừng). */
  function phatGiong(ma) {
    dungPhat();
    if (!coGiong(ma)) return Promise.resolve();
    var g = window.LUYEN_NOI_GIONG, f = g.files[ma];
    var src = "/luyen-noi/" + g.sprites[f[0]];
    return new Promise(function (xong) {
      var am = new Audio(); am.preload = "auto"; am.src = src;
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

  /* =====================================================================
     NHẬN DẠNG GIỌNG NÓI
     ===================================================================== */
  var NhanDang = window.SpeechRecognition || window.webkitSpeechRecognition;
  var dangChay = null;

  /** Nghe một lần. moiLuc(chuTamThoi) cho chữ đang nghe. Trả về Promise<[các cách máy nghe]>. */
  function nghe(soTieng, moiLuc) {
    if (!NhanDang) return Promise.reject({ ma: "khong-ho-tro" });
    return new Promise(function (xong, loi) {
      var r;
      try { r = new NhanDang(); } catch (e) { loi({ ma: "chung" }); return; }
      r.lang = "vi-VN";
      r.interimResults = true;
      r.maxAlternatives = 5;
      r.continuous = false;
      var ds = [], tam = "", daXong = false, coLoi = null;
      var hetGio = setTimeout(function () { try { r.stop(); } catch (e) {} }, Math.min(20000, 5000 + soTieng * 900));
      r.onresult = function (ev) {
        tam = "";
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          var kq = ev.results[i];
          if (kq.isFinal) {
            for (var j = 0; j < kq.length; j++) ds.push(kq[j].transcript);
          } else tam += kq[0].transcript;
        }
        if (moiLuc) moiLuc(tam || (ds[0] || ""));
      };
      r.onerror = function (ev) { coLoi = ev.error || "chung"; };
      r.onend = function () {
        clearTimeout(hetGio);
        if (daXong) return;
        daXong = true; dangChay = null;
        if (!ds.length && tam) ds.push(tam);
        if (ds.length) xong(ds);
        else if (coLoi && coLoi !== "aborted") loi({ ma: coLoi });
        else if (coLoi === "aborted") loi({ ma: "aborted" });
        else loi({ ma: "no-speech" });
      };
      dangChay = r;
      try { r.start(); } catch (e) { clearTimeout(hetGio); dangChay = null; loi({ ma: "chung" }); }
    });
  }
  function dungNghe() { if (dangChay) { try { dangChay.abort(); } catch (e) {} dangChay = null; } }
  window.addEventListener("pagehide", function () { dungNghe(); dungPhat(); });

  function loiNghe(e) {
    var bang = T("loi");
    if (e && e.ma === "khong-ho-tro") return T("khongHoTro");
    return (e && bang[e.ma]) || bang.chung;
  }

  /* =====================================================================
     TÁCH TIẾNG ĐỂ LUYỆN THANH (tìm âm đầu + vần + âm cuối của một tiếng)
     ===================================================================== */
  var bangTach = null;
  function tachTiengGhep(tieng) {
    if (!GhepTieng) return null;
    if (!bangTach) {
      bangTach = {};
      GhepTieng.AM_DAU.forEach(function (d) {
        GhepTieng.VAN.forEach(function (v) {
          GhepTieng.AM_CUOI.forEach(function (c) {
            GhepTieng.thanhDung(c.ma).forEach(function (th) {
              var g = GhepTieng.ghep(d.ma, v.ma, c.ma, th);
              if (g.hopLe && !bangTach[g.chu]) bangTach[g.chu] = { dau: d.ma, van: v.ma, cuoi: c.ma, thanh: th };
            });
          });
        });
      });
    }
    var k = ChamCau.tachThanh(tieng), t = String(tieng).normalize("NFC").toLowerCase();
    if (bangTach[t]) return bangTach[t];
    // Kiểu đặt dấu cũ (hòa ↔ hoà): tìm theo phần chữ + thanh.
    for (var chu in bangTach) {
      var k2 = ChamCau.tachThanh(chu);
      if (k2.goc === k.goc && k2.thanh === k.thanh) return bangTach[chu];
    }
    return null;
  }

  /* =====================================================================
     THẺ (TAB)
     ===================================================================== */
  function moThe(ten, cuon) {
    if (CAC_THE.indexOf(ten) < 0) ten = "luyen-thanh";
    dungNghe(); dungPhat();
    CAC_THE.forEach(function (t) {
      var b = $("#ln-tab-" + t), p = $("#ln-panel-" + t);
      var mo = t === ten;
      if (b) { b.setAttribute("aria-selected", mo ? "true" : "false"); b.tabIndex = mo ? 0 : -1; }
      if (p) p.hidden = !mo;
    });
    ghi(KHOA_THE, ten);
    if (ten === "luyen-thanh") { try { window.dispatchEvent(new Event("resize")); } catch (e) {} }
    if (cuon) { var bar = $(".ln-tabs"); if (bar && bar.scrollIntoView) bar.scrollIntoView({ block: "start", behavior: "smooth" }); }
  }

  function ganThe() {
    var bar = $(".ln-tabs");
    if (!bar) return;
    CAC_THE.forEach(function (t, i) {
      var b = $("#ln-tab-" + t);
      if (!b) return;
      b.addEventListener("click", function () {
        moThe(t);
        try { history.replaceState(null, "", "#" + t); } catch (e) {}
      });
      b.addEventListener("keydown", function (e) {
        var di = e.key === "ArrowRight" ? 1 : (e.key === "ArrowLeft" ? -1 : 0);
        if (!di) return;
        e.preventDefault();
        var t2 = CAC_THE[(i + di + CAC_THE.length) % CAC_THE.length];
        moThe(t2); $("#ln-tab-" + t2).focus();
      });
    });
    var bat = (location.hash || "").replace("#", "");
    moThe(CAC_THE.indexOf(bat) >= 0 ? bat : (doc(KHOA_THE) || "luyen-thanh"));
    window.addEventListener("hashchange", function () {
      var h = (location.hash || "").replace("#", "");
      if (CAC_THE.indexOf(h) >= 0) moThe(h);
      else if (h.indexOf("ln-buoc-") === 0) moThe("luyen-thanh");
    });
  }

  /** Mở thẻ Luyện thanh với tiếng đã chọn. */
  function sangLuyenThanh(tieng) {
    var t = tachTiengGhep(tieng);
    moThe("luyen-thanh");
    try { history.replaceState(null, "", "#luyen-thanh"); } catch (e) {}
    if (t && window.LuyenNoi && typeof window.LuyenNoi.chonTieng === "function") window.LuyenNoi.chonTieng(t.dau, t.van, t.cuoi);
    var b3 = $("#ln-buoc-3");
    if (b3 && b3.scrollIntoView) setTimeout(function () { b3.scrollIntoView({ block: "start", behavior: "smooth" }); }, 60);
  }

  /* =====================================================================
     PHẦN CHUNG CỦA 3 THẺ MỚI: ghi chú, chọn chủ đề, hiện tiếng Anh
     ===================================================================== */
  function veDauPanel(hop) {
    var gc = tao("div", "ln-ghi-chu");
    [["🎤", T("ghiChuNghe"), T("ghiChuNgheNd")], ["⭐", T("ghiChuCham"), T("ghiChuChamNd")]].forEach(function (x) {
      var p = tao("p");
      var bt = tao("span", "ln-bieu-tuong", x[0]); bt.setAttribute("aria-hidden", "true");
      p.appendChild(bt);
      var s = tao("span"); s.appendChild(tao("strong", null, x[1])); s.appendChild(tao("br")); s.appendChild(tao("span", null, x[2]));
      p.appendChild(s);
      gc.appendChild(p);
    });
    hop.appendChild(gc);
    if (!NhanDang) { var kh = tao("p", "ln-tin ln-tin-sai ln-khong-ho-tro", T("khongHoTro")); kh.setAttribute("role", "note"); hop.appendChild(kh); }

    var the = tao("section", "ln-the ln-chu-de");
    var h = tao("h2"); h.appendChild(tao("span", null, T("chonChuDe"))); the.appendChild(h);
    var hang = tao("div", "ln-chu-de-hang");
    hang.setAttribute("role", "group"); hang.setAttribute("aria-label", T("chonChuDe"));
    var cd = chuDeDangChon();
    S.nd.chuDe.forEach(function (c) {
      var b = nut("ln-chu-de-nut", null, function () {
        if (S.dangNghe) return;
        S.chuDe = c.id; ghi(KHOA_CHU_DE, c.id);
        S.ht = { chuDe: c.id, so: 0, buoc: -1, diem: {} };
        dungPhat(); veMoi();
      });
      b.setAttribute("aria-pressed", cd && cd.id === c.id ? "true" : "false");
      b.appendChild(imgTrau(c.anh || "wave.png"));
      var ten = tao("span", "ln-chu-de-ten"); ten.lang = "vi"; ten.textContent = c.ten;
      b.appendChild(ten);
      if (c.tenEn) { var en = tao("span", "ln-chu-de-en", c.tenEn); en.lang = "en"; b.appendChild(en); }
      hang.appendChild(b);
    });
    the.appendChild(hang);
    var nhan = tao("label", "ln-hien-anh");
    var o = tao("input"); o.type = "checkbox"; o.checked = S.hienAnh;
    o.addEventListener("change", function () { S.hienAnh = o.checked; ghi(KHOA_ANH, o.checked ? "1" : "0"); document.body.classList.toggle("ln-an-tieng-anh", !S.hienAnh); });
    nhan.appendChild(o); nhan.appendChild(document.createTextNode(" " + T("hienAnh")));
    the.appendChild(nhan);
    hop.appendChild(the);
  }

  /* =====================================================================
     MỘT THẺ ĐỌC (dùng cho từ, câu và lượt của các bạn trong hội thoại)
     ===================================================================== */
  function chuMau(m, lop) {
    var p = tao("p", lop); p.lang = "vi";
    var r = S.ketQua[m.ma];
    if (!r) { p.textContent = m.chu; return p; }
    // Tô màu từng chữ theo kết quả: mỗi chữ của câu mẫu ứng với một hoặc nhiều tiếng (ví dụ số "4" = "bốn").
    var tu = m.chu.split(/(\s+)/), k = 0, hang = { dung: 0, "sai-thanh": 1, sai: 2, thieu: 3 };
    tu.forEach(function (w) {
      if (/^\s+$/.test(w) || !w) { p.appendChild(document.createTextNode(w)); return; }
      var n = ChamCau.tachTieng(w).length;
      if (!n) { p.appendChild(document.createTextNode(w)); return; }
      var xau = "dung";
      for (var i = 0; i < n && k < r.tieng.length; i++, k++) if (hang[r.tieng[k].ketQua] > hang[xau]) xau = r.tieng[k].ketQua;
      var s = tao("span", "ln-t ln-t-" + xau, w);
      s.title = T("chuGiai")[xau];
      p.appendChild(s);
    });
    return p;
  }

  function veKetQuaCau(hop, m, r) {
    hop.textContent = "";
    if (!r) return;
    var muc = ChamCau.mucDiem(r.diem);
    var o = tao("div", "ln-diem ln-diem-" + muc);
    o.appendChild(imgTrau({ tot: "cheer.png", "gan-dung": "thumbs-up.png", "can-luyen": "thinking.png" }[muc]));
    var chu = tao("div");
    var dong = tao("p", "ln-diem-so");
    dong.appendChild(tao("strong", null, String(r.diem)));
    dong.appendChild(document.createTextNode(" " + T("diem") + " · " + T("muc")[muc]));
    chu.appendChild(dong);
    chu.appendChild(tao("p", "ln-khen", T("khen")[muc]));
    var ng = tao("p", "ln-may-nghe");
    ng.appendChild(tao("span", null, T("mayNghe") + " "));
    var q = tao("q", null, r.nghe || T("khongNghe")); q.lang = "vi";
    ng.appendChild(q);
    chu.appendChild(ng);
    o.appendChild(chu);
    hop.appendChild(o);

    // Chú giải màu
    var cg = tao("p", "ln-chu-giai-mau");
    ["dung", "sai-thanh", "sai", "thieu"].forEach(function (k) {
      var dem = { dung: r.dung, "sai-thanh": r.saiThanh, sai: r.sai, thieu: r.thieu }[k];
      if (!dem && k !== "dung") return;
      cg.appendChild(tao("span", "ln-t ln-t-" + k, T("chuGiai")[k] + ": " + dem));
    });
    hop.appendChild(cg);

    // Tiếng sai dấu: mời sang luyện thanh
    var daCo = {};
    var hangNut = tao("div", "ln-the-nut");
    r.tieng.forEach(function (t) {
      if (t.ketQua !== "sai-thanh" || daCo[t.chu]) return;
      daCo[t.chu] = true;
      if (!tachTiengGhep(t.chu)) return;
      hangNut.appendChild(nut("ttv-nut-phu ln-nut-nho", "🎵 " + T("luyenThanh")(t.chu), function () { sangLuyenThanh(t.chu); }));
    });
    if (hangNut.childNodes.length) hop.appendChild(hangNut);
  }

  function khoaNutDoc(khoa) {
    var ds = document.querySelectorAll(".ln-nut-doc, .ln-chu-de-nut, .ln-ht-nut");
    for (var i = 0; i < ds.length; i++) { if (khoa) ds[i].setAttribute("disabled", ""); else ds[i].removeAttribute("disabled"); }
  }

  /** Thẻ đọc: m = { chu, en, ma }; loai = "tu" | "cau" | "ban"; xongCham(r) khi chấm xong. */
  function theDoc(m, loai, xongCham) {
    var the = tao("article", "ln-the-cau ln-the-" + loai);
    var chuHop = tao("div", "ln-cau-chu-hop");
    chuHop.appendChild(chuMau(m, "ln-cau-chu" + (loai === "tu" ? " ln-cau-chu-to" : "")));
    if (m.en) { var en = tao("p", "ln-cau-en", m.en); en.lang = "en"; chuHop.appendChild(en); }
    the.appendChild(chuHop);

    var hang = tao("div", "ln-the-nut");
    if (coGiong(m.ma)) {
      var bNghe = nut("ttv-nut-phu ln-nut-nghe", "▶ " + T("ngheMau"), function () {
        if (S.dangNghe) return;
        bNghe.classList.add("ln-dang-phat");
        phatGiong(m.ma).then(function () { bNghe.classList.remove("ln-dang-phat"); });
      });
      hang.appendChild(bNghe);
    }
    var bDoc = nut("ttv-nut ln-nut-doc", "🎤 " + (S.ketQua[m.ma] ? T("docLai") : T("doc")));
    if (!NhanDang) bDoc.disabled = true;
    hang.appendChild(bDoc);
    the.appendChild(hang);
    if (!coGiong(m.ma) && loai !== "ban") the.appendChild(tao("p", "ln-ghi-chu-nho", T("chuaCoGiong")));

    var tam = tao("p", "ln-nghe-tam"); tam.lang = "vi"; tam.setAttribute("aria-live", "polite");
    the.appendChild(tam);
    var kq = tao("div", "ln-ket-qua"); kq.setAttribute("aria-live", "polite");
    the.appendChild(kq);
    if (S.ketQua[m.ma]) veKetQuaCau(kq, m, S.ketQua[m.ma]);

    bDoc.addEventListener("click", function () {
      if (S.dangNghe) return;
      dungPhat();
      S.dangNghe = true; khoaNutDoc(true);
      bDoc.textContent = "🎤 " + T("dangNghe"); bDoc.classList.add("ln-dang-ghi");
      tam.textContent = "";
      nghe(ChamCau.tachTieng(m.chu).length, function (s) { tam.textContent = s; })
        .then(function (ds) {
          var r = ChamCau.chamTotNhat(m.chu, ds);
          S.ketQua[m.ma] = r;
          if (window.LuyenNoi && typeof window.LuyenNoi.khiChamCau === "function") {
            try { window.LuyenNoi.khiChamCau({ cau: m.chu, loai: loai, diem: r.diem }); } catch (e) {}
          }
          xongNghe();
          chuHop.replaceChild(chuMau(m, "ln-cau-chu" + (loai === "tu" ? " ln-cau-chu-to" : "")), chuHop.firstChild);
          tam.textContent = "";
          veKetQuaCau(kq, m, r);
          if (xongCham) xongCham(r);
        })
        .catch(function (e) {
          xongNghe();
          tam.textContent = "";
          if (e && e.ma === "aborted") return;
          kq.textContent = "";
          kq.appendChild(tao("p", "ln-tin ln-tin-sai", loiNghe(e)));
        });
      function xongNghe() {
        S.dangNghe = false; khoaNutDoc(false);
        bDoc.classList.remove("ln-dang-ghi");
        bDoc.textContent = "🎤 " + T("docLai");
        if (!NhanDang) bDoc.disabled = true;
      }
    });
    return the;
  }

  /* =====================================================================
     THẺ LUYỆN TỪ, LUYỆN CÂU
     ===================================================================== */
  function veDanhSach(id, loai) {
    var hop = $("#ln-panel-" + id + "-noi-dung");
    if (!hop) return;
    hop.textContent = "";
    if (!veTrangThaiTai(hop)) return;
    veDauPanel(hop);
    var cd = chuDeDangChon();
    var the = tao("section", "ln-the");
    var h = tao("h2");
    h.appendChild(imgTrau(cd.anh || "wave.png", "ln-h2-trau"));
    var t = tao("span", null, cd.ten); t.lang = "vi"; h.appendChild(t);
    the.appendChild(h);
    the.appendChild(tao("p", "ln-ghi-chu-nho", loai === "tu" ? T("tuHuongDan") : T("cauHuongDan")));
    var ds = loai === "tu" ? cd.tu : cd.cau;
    if (!ds.length) the.appendChild(tao("p", "ln-tin", loai === "tu" ? T("tuTrong") : T("cauTrong")));
    var luoi = tao("div", loai === "tu" ? "ln-luoi-tu" : "ln-luoi-cau");
    ds.forEach(function (m) { luoi.appendChild(theDoc(m, loai)); });
    the.appendChild(luoi);
    hop.appendChild(the);
  }

  /* =====================================================================
     THẺ HỘI THOẠI CÙNG TRÂU CON
     ===================================================================== */
  function veHoiThoai() {
    var hop = $("#ln-panel-hoi-thoai-noi-dung");
    if (!hop) return;
    hop.textContent = "";
    if (!veTrangThaiTai(hop)) return;
    veDauPanel(hop);
    var cd = chuDeDangChon();
    if (S.ht.chuDe !== cd.id) S.ht = { chuDe: cd.id, so: 0, buoc: -1, diem: {} };
    var the = tao("section", "ln-the ln-ht");
    var h = tao("h2");
    h.appendChild(imgTrau("wave.png", "ln-h2-trau"));
    var t = tao("span", null, cd.ten); t.lang = "vi"; h.appendChild(t);
    the.appendChild(h);
    if (!cd.hoiThoai.length) { the.appendChild(tao("p", "ln-tin", T("htTrong"))); hop.appendChild(the); return; }

    if (cd.hoiThoai.length > 1) {
      var chon = tao("div", "ln-chip-hang");
      chon.setAttribute("role", "group"); chon.setAttribute("aria-label", T("htChon"));
      cd.hoiThoai.forEach(function (doan, i) {
        var b = nut("ln-chip ln-ht-nut", doan.ten, function () { dungPhat(); S.ht = { chuDe: cd.id, so: i, buoc: -1, diem: {} }; veHoiThoai(); });
        b.lang = "vi";
        b.setAttribute("aria-pressed", S.ht.so === i ? "true" : "false");
        chon.appendChild(b);
      });
      the.appendChild(chon);
    }
    var doan = cd.hoiThoai[Math.min(S.ht.so, cd.hoiThoai.length - 1)];
    var tieuDe = tao("p", "ln-ht-ten");
    var tv = tao("strong", null, doan.ten); tv.lang = "vi"; tieuDe.appendChild(tv);
    if (doan.tenEn) { var te = tao("span", "ln-cau-en", " · " + doan.tenEn); te.lang = "en"; tieuDe.appendChild(te); }
    the.appendChild(tieuDe);

    var khung = tao("div", "ln-ht-khung");
    the.appendChild(khung);
    var cuoi = tao("div", "ln-ht-cuoi");
    the.appendChild(cuoi);
    hop.appendChild(the);

    if (S.ht.buoc < 0) {
      khung.appendChild(dongTrau({ chu: "", en: "" }, true));
      cuoi.appendChild(nut("ttv-nut ln-nut-to ln-ht-nut", "💬 " + T("htBatDau"), function () { S.ht.buoc = 0; tienLen(doan, true); }));
      return;
    }
    veCacLuot(doan, khung, cuoi);
  }

  function dongTrau(l, cho) {
    var d = tao("div", "ln-ht-dong ln-ht-trau");
    d.appendChild(imgTrau(cho ? "wave.png" : "listening.png", "ln-ht-anh"));
    var b = tao("div", "ln-ht-bong");
    b.appendChild(tao("span", "ln-ht-ai", T("htTrau")));
    if (cho) { var p = tao("p", "ln-cau-chu", "…"); b.appendChild(p); d.appendChild(b); return d; }
    var c = tao("p", "ln-cau-chu", l.chu); c.lang = "vi"; b.appendChild(c);
    if (l.en) { var en = tao("p", "ln-cau-en", l.en); en.lang = "en"; b.appendChild(en); }
    if (coGiong(l.ma)) {
      var bn = nut("ttv-nut-phu ln-nut-nho", "▶ " + T("ngheMau"), function () { if (!S.dangNghe) phatGiong(l.ma); });
      b.appendChild(bn);
    }
    d.appendChild(b);
    return d;
  }

  /** Hiện các lượt tới lượt của các bạn tiếp theo; phát giọng Trâu Con nếu có. */
  function tienLen(doan, phat) {
    var L = doan.luot, phatDs = [];
    while (S.ht.buoc < L.length) {
      var l = L[S.ht.buoc];
      S.ht.buoc++;
      if (l.ai === "trau") phatDs.push(l.ma);
      else break; // dừng ở lượt của các bạn (đã hiện)
    }
    veHoiThoai();
    var khung = $(".ln-ht-khung");
    if (khung && khung.lastChild && khung.lastChild.scrollIntoView) khung.lastChild.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (phat && phatDs.length) {
      var chuoi = Promise.resolve();
      phatDs.forEach(function (ma) { chuoi = chuoi.then(function () { return phatGiong(ma); }); });
    }
  }

  function veCacLuot(doan, khung, cuoi) {
    var L = doan.luot, n = Math.min(S.ht.buoc, L.length);
    for (var i = 0; i < n; i++) {
      var l = L[i];
      if (l.ai === "trau") { khung.appendChild(dongTrau(l)); continue; }
      var d = tao("div", "ln-ht-dong ln-ht-ban");
      var b = tao("div", "ln-ht-bong ln-ht-bong-ban");
      b.appendChild(tao("span", "ln-ht-ai", i === n - 1 && S.ht.diem[i] == null ? T("htLuotBan") : T("htBan")));
      (function (vt) {
        b.appendChild(theDoc(l, "ban", function (r) {
          S.ht.diem[vt] = r.diem;
          var bt = $(".ln-ht-tiep");
          if (bt) { bt.disabled = false; bt.classList.add("ln-nhac"); }
        }));
      })(i);
      d.appendChild(b);
      khung.appendChild(d);
    }
    var hetLuot = S.ht.buoc >= L.length;
    var luotCuoi = L[n - 1];
    if (hetLuot && (!luotCuoi || luotCuoi.ai === "trau" || S.ht.diem[n - 1] != null)) {
      // Xong đoạn hội thoại
      var dsDiem = Object.keys(S.ht.diem).map(function (k) { return S.ht.diem[k]; }).filter(function (d) { return d >= 0; });
      var tb = dsDiem.length ? Math.round(dsDiem.reduce(function (a, b) { return a + b; }, 0) / dsDiem.length) : null;
      var xong = tao("div", "ln-trau");
      xong.appendChild(imgTrau("cheer.png"));
      xong.appendChild(tao("p", "ln-bong", tb == null ? T("htXongKhongDiem") : T("htXong")(tb)));
      cuoi.appendChild(xong);
      cuoi.appendChild(nut("ttv-nut-phu ln-nut-to ln-ht-nut", "↻ " + T("htLamLai"), function () {
        S.ht = { chuDe: S.ht.chuDe, so: S.ht.so, buoc: 0, diem: {} };
        tienLen(doan, true);
      }));
      return;
    }
    // Đang chờ lượt của các bạn
    var cho = luotCuoi && luotCuoi.ai === "ban";
    if (cho) {
      cuoi.appendChild(tao("p", "ln-ghi-chu-nho", T("htGoiY")));
      var bt = nut("ttv-nut ln-nut-to ln-ht-tiep ln-ht-nut", T("htTiep") + " →", function () {
        if (S.dangNghe) return;
        if (S.ht.diem[n - 1] == null) S.ht.diem[n - 1] = -1; // bấm Tiếp khi chưa đọc: bỏ qua lượt này, không tính điểm
        if (S.ht.buoc >= L.length) { veHoiThoai(); return; }
        tienLen(doan, true);
      });
      cuoi.appendChild(bt);
    }
  }

  /* =====================================================================
     TẢI NỘI DUNG, VẼ, KHỞI ĐỘNG
     ===================================================================== */
  function veTrangThaiTai(hop) {
    if (S.nd && S.nd.chuDe.length) return true;
    hop.appendChild(tao("p", "ln-tin" + (S.loiTai ? " ln-tin-sai" : ""), S.loiTai ? T("loiTai") : T("dangTai")));
    return false;
  }

  function veMoi() {
    if (S.dangNghe) return;
    document.body.classList.toggle("ln-an-tieng-anh", !S.hienAnh);
    veDanhSach("luyen-tu", "tu");
    veDanhSach("luyen-cau", "cau");
    veHoiThoai();
  }

  function taiNoiDung() {
    var url = "/luyen-noi/noi-dung.txt";
    return fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.arrayBuffer(); })
      .then(function (ab) { return new TextDecoder("utf-8").decode(ab); })
      .then(function (van) {
        S.nd = ChamCau.docNoiDung(van);
        if (S.nd.loi.length && window.console) console.warn("luyen-noi/noi-dung.txt: có dòng máy chưa hiểu", S.nd.loi);
        if (!S.nd.chuDe.length) S.loiTai = true;
      })
      .catch(function (e) { S.loiTai = true; if (window.console) console.warn("Không tải được noi-dung.txt", e); });
  }

  function khoiDong() {
    if (!ChamCau) return;
    ganThe();
    veMoi();
    taiNoiDung().then(veMoi);
    if (window.CONG && window.CONG.khiDoiChu) window.CONG.khiDoiChu(function () { veMoi(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong);
  else khoiDong();
})();
