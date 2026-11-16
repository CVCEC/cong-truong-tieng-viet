/*!
 * luyen-noi.js – Giao diện trang Luyện nói – Luyện thanh điệu (vietclass.cvcec.org/luyen-noi/).
 * Tự viết cho Trường Tiếng Việt Của Em (CVCEC). Ý tưởng tham khảo từ VietPhonLab; mã viết mới hoàn toàn.
 *
 * Âm thanh chỉ xử lý trên máy: ghi bằng Web Audio + MediaRecorder, phân tích bằng cao-do.js.
 * KHÔNG gửi âm thanh hay điểm lên máy chủ nào. Không dùng Firebase.
 *
 * Khoá localStorage (mới, chỉ trang này dùng):
 *   "luyen-noi-moc-giong" – mốc giọng {hz, luc}
 *   "luyen-noi-giong"     – giọng mẫu đã chọn ("hanoi" | "saigon")
 */
(function () {
  "use strict";

  var CaoDo = window.CaoDo, GhepTieng = window.GhepTieng;
  var KHOA_MOC = "luyen-noi-moc-giong";
  var KHOA_GIONG = "luyen-noi-giong";
  var GIAY_GHI = 3;

  /* ---------- Chữ trên trang (VI / EN) ---------- */
  var CHU = {
    vi: {
      thanh: { ngang: "Thanh ngang", huyen: "Thanh huyền", nga: "Thanh ngã", hoi: "Thanh hỏi", sac: "Thanh sắc", nang: "Thanh nặng" },
      b1Trau: "Trước tiên, mình nghe giọng các bạn nhé! Bấm nút, rồi đọc “ta” thật đều, không lên không xuống, trong 3 giây.",
      b1Nut: "Đo giọng", b1Lai: "Đo lại",
      b1Co: function (hz) { return "Mình đã nhớ giọng của các bạn (mốc " + hz + " Hz). Lần sau không cần đo lại."; },
      b1Chua: "Chưa có mốc giọng.",
      b1KhongRo: "Mình chưa nghe rõ. Các bạn đọc “taaa” to và đều hơn, gần micro hơn nhé.",
      b1Xong: function (hz) { return "Xong rồi! Mốc giọng của các bạn là " + hz + " Hz."; },
      b2GoiY: "Tiếng gợi ý từ bài học", b2Ghep: "Hoặc tự ghép một tiếng",
      b2Dau: "Âm đầu", b2Van: "Vần", b2Cuoi: "Âm cuối", b2Khong: "không có",
      b2GhiChu: "Tiếng ghép ra có thể không có nghĩa.",
      b2Mo: "Âm bị làm mờ là âm không ghép được với lựa chọn hiện tại.",
      b2DangChon: "Tiếng đang luyện:",
      b2Tac: "Tiếng này kết thúc bằng p, t, c hoặc ch (tiếng tắc), nên chỉ có thanh sắc và thanh nặng.",
      b3Giong: "Giọng mẫu", hanoi: "Hà Nội", saigon: "Sài Gòn",
      b3HuongDan: "Bấm “Ghi âm” trên từng thẻ rồi đọc tiếng đó. Máy tự dừng sau 3 giây.",
      ghiAm: "Ghi âm", taiFile: "Tải file âm thanh", ngheLai: "Nghe lại", luu: "Lưu bản ghi",
      docDi: "Đọc đi!", dangPhanTich: "Mình đang nghe lại…",
      mau: "Đường mẫu", cuaEm: "Giọng của em", nangLuong: "Năng lượng",
      chuaCham: "Thanh hỏi và thanh ngã khó đo chính xác, nên mình chỉ vẽ đường để các bạn so, chưa chấm điểm.",
      khongTieng: "Mình chưa nghe rõ tiếng nào. Các bạn đọc to hơn, gần micro hơn nhé.",
      canMoc: "Các bạn làm Bước 1 – Đo giọng trước nhé.", denBuoc1: "Đến Bước 1",
      diem: "điểm", thamKhao: "(chỉ để tham khảo)",
      muc: { tot: "Tốt", "gan-dung": "Gần đúng", "can-luyen": "Cần luyện thêm" },
      khen: {
        tot: "Tuyệt quá! Đường giọng của các bạn rất giống đường mẫu.",
        "gan-dung": "Gần đúng rồi! Các bạn đọc lại, chú ý chỗ lên, chỗ xuống nhé.",
        "can-luyen": "Mình cùng luyện thêm nhé! Các bạn nhìn đường mẫu rồi đọc chậm lại một chút."
      },
      xinMic: "Máy sẽ hỏi có cho dùng micro không. Các bạn bấm “Cho phép” nhé.",
      loiTuChoi: "Máy chưa cho dùng micro. Các bạn nhờ bố mẹ bật quyền micro cho trang này (bấm biểu tượng ổ khoá hoặc “aA” cạnh địa chỉ trang), rồi bấm lại nhé.",
      loiKhongMic: "Mình không tìm thấy micro. Các bạn kiểm tra tai nghe hoặc micro rồi thử lại nhé.",
      loiKhongHoTro: "Trình duyệt này chưa ghi âm được. Các bạn thử Chrome, Edge, Firefox hoặc Safari mới nhé.",
      loiBaoMat: "Trang cần mở bằng địa chỉ https:// thì mới ghi âm được.",
      loiBan: "Micro đang được ứng dụng khác dùng. Các bạn tắt ứng dụng đó rồi thử lại nhé.",
      loiFile: "Mình không mở được file này. Các bạn chọn file âm thanh khác (mp3, m4a, wav, webm) nhé.",
      loiChung: "Có lỗi khi ghi âm. Các bạn thử lại nhé.",
      dangGhi: "Đang ghi âm"
    },
    en: {
      thanh: { ngang: "Thanh ngang (level)", huyen: "Thanh huyền (low falling)", nga: "Thanh ngã (broken rising)", hoi: "Thanh hỏi (dipping)", sac: "Thanh sắc (rising)", nang: "Thanh nặng (heavy)" },
      b1Trau: "First, let me hear your voice! Press the button and say “ta” in one steady voice — not going up or down — for 3 seconds.",
      b1Nut: "Measure my voice", b1Lai: "Measure again",
      b1Co: function (hz) { return "I remember your voice (baseline " + hz + " Hz). No need to measure again next time."; },
      b1Chua: "No voice baseline yet.",
      b1KhongRo: "I couldn't hear you clearly. Say “taaa” louder and steadier, closer to the microphone.",
      b1Xong: function (hz) { return "Done! Your voice baseline is " + hz + " Hz."; },
      b2GoiY: "Words from the lessons", b2Ghep: "Or build your own syllable",
      b2Dau: "Initial", b2Van: "Rhyme", b2Cuoi: "Final", b2Khong: "none",
      b2GhiChu: "The syllable you build may not be a real word.",
      b2Mo: "Faded sounds can't be combined with your current choice.",
      b2DangChon: "Practising:",
      b2Tac: "This syllable ends in p, t, c or ch (a checked syllable), so it only takes the sắc and nặng tones.",
      b3Giong: "Model accent", hanoi: "Hà Nội", saigon: "Sài Gòn",
      b3HuongDan: "Press “Record” on a card and read that syllable. Recording stops after 3 seconds.",
      ghiAm: "Record", taiFile: "Upload audio file", ngheLai: "Play back", luu: "Save recording",
      docDi: "Read now!", dangPhanTich: "Listening back…",
      mau: "Model", cuaEm: "Your voice", nangLuong: "Energy",
      chuaCham: "Hỏi and ngã are hard to measure reliably, so I only draw the line for you to compare — no score yet.",
      khongTieng: "I couldn't hear a syllable. Read louder and closer to the microphone.",
      canMoc: "Please do Step 1 – Measure my voice first.", denBuoc1: "Go to Step 1",
      diem: "points", thamKhao: "(for reference only)",
      muc: { tot: "Great", "gan-dung": "Almost", "can-luyen": "Keep practising" },
      khen: {
        tot: "Wonderful! Your voice line looks just like the model.",
        "gan-dung": "Almost there! Read it again and watch where it goes up and down.",
        "can-luyen": "Let's practise more! Look at the model line and read a little more slowly."
      },
      xinMic: "Your device will ask to use the microphone. Please press “Allow”.",
      loiTuChoi: "The microphone isn't allowed yet. Ask a parent to allow the microphone for this page (tap the lock or “aA” icon next to the address), then try again.",
      loiKhongMic: "I can't find a microphone. Check your headset or microphone and try again.",
      loiKhongHoTro: "This browser can't record yet. Try a recent Chrome, Edge, Firefox or Safari.",
      loiBaoMat: "The page must be opened with https:// to record.",
      loiBan: "Another app is using the microphone. Close it and try again.",
      loiFile: "I can't open this file. Choose another audio file (mp3, m4a, wav, webm).",
      loiChung: "Something went wrong while recording. Please try again.",
      dangGhi: "Recording"
    }
  };
  function ngonNgu() { return (window.CONG && window.CONG.ngonNgu && window.CONG.ngonNgu() === "en") ? "en" : "vi"; }
  function T(k) { return CHU[ngonNgu()][k]; }

  /* ---------- localStorage (luôn bọc try/catch) ---------- */
  function doc(khoa) { try { return window.localStorage.getItem(khoa); } catch (e) { return null; } }
  function ghi(khoa, v) { try { window.localStorage.setItem(khoa, v); } catch (e) {} }
  function docMoc() {
    try { var o = JSON.parse(doc(KHOA_MOC) || "null"); return o && o.hz > 50 && o.hz < 800 ? o.hz : null; } catch (e) { return null; }
  }

  /* ---------- Trạng thái ---------- */
  var S = {
    moc: docMoc(),
    giong: doc(KHOA_GIONG) === "saigon" ? "saigon" : "hanoi",
    chon: { dau: "t", van: "a", cuoi: "" },
    ketQua: {},       // khoá "chữ|giọng" → kết quả của thẻ
    dangGhi: false
  };

  function $(sel, goc) { return (goc || document).querySelector(sel); }
  function tao(the, lop, chu) {
    var el = document.createElement(the);
    if (lop) el.className = lop;
    if (chu != null) el.textContent = chu;
    return el;
  }
  function anhTrau(ten) { return "/assets/trau/" + ten; }
  function mau(bien) { return getComputedStyle(document.documentElement).getPropertyValue(bien).trim() || "#003060"; }

  /* =====================================================================
     GHI ÂM
     ===================================================================== */
  var AC = null, luong = null;

  function layAC() {
    var Lop = window.AudioContext || window.webkitAudioContext;
    if (!Lop) return null;
    if (!AC) AC = new Lop();
    if (AC.state === "suspended" && AC.resume) AC.resume();
    return AC;
  }

  function chonMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
    var ds = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/aac"];
    for (var i = 0; i < ds.length; i++) if (MediaRecorder.isTypeSupported(ds[i])) return ds[i];
    return "";
  }

  function loiMic(e) {
    var ten = e && e.name;
    if (ten === "NotAllowedError" || ten === "PermissionDeniedError" || ten === "SecurityError") return T("loiTuChoi");
    if (ten === "NotFoundError" || ten === "DevicesNotFoundError" || ten === "OverconstrainedError") return T("loiKhongMic");
    if (ten === "NotReadableError" || ten === "TrackStartError" || ten === "AbortError") return T("loiBan");
    if (e && e.maLoi === "bao-mat") return T("loiBaoMat");
    if ((e && e.maLoi === "khong-ho-tro") || ten === "NotSupportedError" || ten === "TypeError") return T("loiKhongHoTro");
    return T("loiChung");
  }

  function xinMic(baoTin) {
    if (luong && luong.getAudioTracks().some(function (t) { return t.readyState === "live"; })) return Promise.resolve(luong);
    if (!window.isSecureContext && location.hostname !== "localhost") return Promise.reject({ maLoi: "bao-mat" });
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject({ maLoi: "khong-ho-tro" });
    if (baoTin) baoTin(T("xinMic"));
    return navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true, channelCount: 1 }
    }).then(function (s) { luong = s; return s; });
  }

  window.addEventListener("pagehide", function () {
    if (luong) luong.getTracks().forEach(function (t) { t.stop(); });
    luong = null;
  });

  /** Ghi âm GIAY_GHI giây. moiGiay(conLai) chạy mỗi giây; mucAm(0–1) cho thanh mức âm. */
  function ghiAm(moiGiay, mucAm) {
    var ac = layAC(); // tạo/khởi động AudioContext ngay trong lần chạm (Safari cần vậy)
    if (!ac) return Promise.reject({ maLoi: "khong-ho-tro" });
    return xinMic(moiGiay.baoTin).then(function (s) {
      return new Promise(function (xong, loi) {
        var nguon = ac.createMediaStreamSource(s);
        var xuLy = ac.createScriptProcessor(4096, 1, 1);
        var tat = ac.createGain(); tat.gain.value = 0;
        var manh = [];
        xuLy.onaudioprocess = function (ev) {
          var d = ev.inputBuffer.getChannelData(0);
          manh.push(new Float32Array(d));
          if (mucAm) { var t = 0; for (var i = 0; i < d.length; i += 4) t += d[i] * d[i]; mucAm(Math.min(1, Math.sqrt(t / (d.length / 4)) * 6)); }
        };
        nguon.connect(xuLy); xuLy.connect(tat); tat.connect(ac.destination);

        var mime = chonMime(), may = null, mau = [];
        try {
          if (window.MediaRecorder) {
            may = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s);
            may.ondataavailable = function (e) { if (e.data && e.data.size) mau.push(e.data); };
            may.start();
          }
        } catch (e) { may = null; }

        var conLai = GIAY_GHI;
        moiGiay(conLai);
        var dem = setInterval(function () { conLai--; if (conLai > 0) moiGiay(conLai); }, 1000);

        setTimeout(function () {
          clearInterval(dem);
          var ketThuc = function () {
            try { nguon.disconnect(); xuLy.disconnect(); tat.disconnect(); } catch (e) {}
            var dai = 0; manh.forEach(function (m) { dai += m.length; });
            var pcm = new Float32Array(dai), o = 0;
            manh.forEach(function (m) { pcm.set(m, o); o += m.length; });
            var loai = (may && may.mimeType) || mime || "";
            var blob = mau.length ? new Blob(mau, { type: loai || mau[0].type }) : taoWav(pcm, ac.sampleRate);
            xong({ blob: blob, pcm: pcm, sr: ac.sampleRate });
          };
          if (may && may.state !== "inactive") { may.onstop = ketThuc; try { may.stop(); } catch (e) { ketThuc(); } }
          else ketThuc();
        }, GIAY_GHI * 1000 + 150);
      });
    });
  }

  // Dự phòng khi trình duyệt không có MediaRecorder: tự đóng gói WAV 16-bit để nghe lại và lưu.
  function taoWav(pcm, sr) {
    var buf = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(buf);
    function chuoi(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    chuoi(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); chuoi(8, "WAVE"); chuoi(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true);
    v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); chuoi(36, "data");
    v.setUint32(40, pcm.length * 2, true);
    for (var i = 0; i < pcm.length; i++) { var x = Math.max(-1, Math.min(1, pcm[i])); v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true); }
    return new Blob([buf], { type: "audio/wav" });
  }

  // Giải mã blob (webm, ogg, mp4/m4a của Safari, mp3, wav) thành mẫu âm; hỗ trợ cả kiểu gọi lại của Safari cũ.
  function giaiMa(blob) {
    var ac = layAC();
    if (!ac) return Promise.reject(new Error("khong-ho-tro"));
    var docFile = blob.arrayBuffer ? blob.arrayBuffer() : new Promise(function (xong, loi) {
      var r = new FileReader(); r.onload = function () { xong(r.result); }; r.onerror = loi; r.readAsArrayBuffer(blob);
    });
    return docFile.then(function (ab) {
      return new Promise(function (xong, loi) {
        var p = ac.decodeAudioData(ab, function (b) { xong(b); }, function (e) { loi(e || new Error("giai-ma")); });
        if (p && p.then) p.then(xong, loi);
      });
    }).then(function (b) {
      var n = b.numberOfChannels, dai = b.length, ra = new Float32Array(dai);
      for (var c = 0; c < n; c++) { var d = b.getChannelData(c); for (var i = 0; i < dai; i++) ra[i] += d[i] / n; }
      return { mau: ra, sr: b.sampleRate };
    });
  }

  // Lấy mẫu âm để phân tích: ưu tiên giải mã đúng file vừa ghi (giống file bé nghe lại), không được thì dùng PCM thu song song.
  function layMauPhanTich(bg) {
    return giaiMa(bg.blob).then(function (g) {
      return g.mau.length > g.sr * 0.5 ? g : { mau: bg.pcm, sr: bg.sr };
    }, function () { return { mau: bg.pcm, sr: bg.sr }; });
  }

  function duoiFile(blob) {
    var t = (blob.type || "").toLowerCase();
    if (t.indexOf("mp4") >= 0 || t.indexOf("aac") >= 0 || t.indexOf("m4a") >= 0) return "m4a";
    if (t.indexOf("ogg") >= 0) return "ogg";
    if (t.indexOf("wav") >= 0) return "wav";
    if (t.indexOf("mpeg") >= 0 || t.indexOf("mp3") >= 0) return "mp3";
    return "webm";
  }
  function khongDau(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]+/g, "-");
  }

  /* =====================================================================
     BƯỚC 1 – ĐO GIỌNG
     ===================================================================== */
  function veBuoc1() {
    var hop = $("#ln-buoc-1-noi-dung");
    hop.textContent = "";
    var trau = tao("div", "ln-trau");
    var img = tao("img"); img.src = anhTrau("listening.png"); img.alt = ""; img.width = 300; img.height = 360;
    trau.appendChild(img);
    trau.appendChild(tao("p", "ln-bong", T("b1Trau")));
    hop.appendChild(trau);

    var hang = tao("div", "ln-hang-nut");
    var nut = tao("button", "ttv-nut ln-nut-to", S.moc ? T("b1Lai") : T("b1Nut"));
    nut.type = "button"; nut.id = "ln-do-giong";
    if (S.moc) nut.className = "ttv-nut-phu ln-nut-to";
    hang.appendChild(nut);
    var muc = tao("div", "ln-muc-am"); muc.setAttribute("aria-hidden", "true"); muc.appendChild(tao("span"));
    hang.appendChild(muc);
    hop.appendChild(hang);

    var tin = tao("p", "ln-tin" + (S.moc ? " ln-tin-dung" : ""), S.moc ? T("b1Co")(Math.round(S.moc)) : T("b1Chua"));
    tin.setAttribute("role", "status"); tin.setAttribute("aria-live", "polite");
    hop.appendChild(tin);

    nut.addEventListener("click", function () {
      if (S.dangGhi) return;
      S.dangGhi = true; khoaNut(true);
      var thanhMuc = muc.firstChild;
      var demNguoc = function (n) { nut.textContent = T("docDi") + " " + n; nut.classList.add("ln-dang-ghi"); tin.className = "ln-tin"; tin.textContent = T("dangGhi") + "…"; };
      demNguoc.baoTin = function (s) { tin.className = "ln-tin"; tin.textContent = s; };
      ghiAm(demNguoc, function (m) { thanhMuc.style.width = Math.round(m * 100) + "%"; })
        .then(function (bg) {
          nut.textContent = T("dangPhanTich");
          return layMauPhanTich(bg);
        })
        .then(function (m) {
          var hz = CaoDo.doMoc(CaoDo.phanTich(m.mau, m.sr));
          S.dangGhi = false; khoaNut(false);
          if (!hz) { veBuoc1(); var t = $("#ln-buoc-1-noi-dung .ln-tin"); t.className = "ln-tin ln-tin-sai"; t.textContent = T("b1KhongRo"); return; }
          S.moc = hz;
          ghi(KHOA_MOC, JSON.stringify({ hz: Math.round(hz * 10) / 10, luc: new Date().toISOString().slice(0, 10) }));
          S.ketQua = {}; // mốc mới: vẽ lại từ đầu
          veBuoc1(); veBuoc3();
          var t2 = $("#ln-buoc-1-noi-dung .ln-tin"); t2.textContent = T("b1Xong")(Math.round(hz));
        })
        .catch(function (e) {
          S.dangGhi = false; khoaNut(false);
          veBuoc1();
          var t = $("#ln-buoc-1-noi-dung .ln-tin"); t.className = "ln-tin ln-tin-sai"; t.textContent = loiMic(e);
        });
    });
  }

  function khoaNut(khoa) {
    var ds = document.querySelectorAll(".ln-khoa-khi-ghi, #ln-do-giong, .ln-nut-ghi, .ln-nut-file");
    for (var i = 0; i < ds.length; i++) {
      if (khoa) ds[i].setAttribute("disabled", ""); else ds[i].removeAttribute("disabled");
    }
  }

  /* =====================================================================
     BƯỚC 2 – CHỌN TIẾNG
     ===================================================================== */
  function chonHopLe(slot, ma) {
    var c = { dau: S.chon.dau, van: S.chon.van, cuoi: S.chon.cuoi };
    c[slot] = ma;
    return GhepTieng.hopLe(c.dau, c.van, c.cuoi);
  }

  // Chọn một âm; âm khác bị xung đột thì tự đổi sang lựa chọn hợp lệ đầu tiên.
  function datChon(slot, ma) {
    S.chon[slot] = ma;
    if (GhepTieng.hopLe(S.chon.dau, S.chon.van, S.chon.cuoi)) return;
    var thuTu = { dau: ["cuoi", "van"], van: ["cuoi", "dau"], cuoi: ["van", "dau"] }[slot];
    var nguon = { dau: GhepTieng.AM_DAU, van: GhepTieng.VAN, cuoi: GhepTieng.AM_CUOI };
    for (var k = 0; k < thuTu.length; k++) {
      var s2 = thuTu[k], ds = nguon[s2];
      for (var i = 0; i < ds.length; i++) {
        var thu = { dau: S.chon.dau, van: S.chon.van, cuoi: S.chon.cuoi }; thu[s2] = ds[i].ma;
        if (GhepTieng.hopLe(thu.dau, thu.van, thu.cuoi)) { S.chon[s2] = ds[i].ma; return; }
      }
    }
  }

  function veBuoc2() {
    var hop = $("#ln-buoc-2-noi-dung");
    hop.textContent = "";

    hop.appendChild(tao("h3", "ln-nho", T("b2GoiY")));
    var goiY = tao("div", "ln-chip-hang");
    GhepTieng.GOI_Y.forEach(function (g) {
      var b = tao("button", "ln-chip ln-chip-to ln-khoa-khi-ghi", g.chu);
      b.type = "button"; b.lang = "vi";
      var dangChon = g.dau === S.chon.dau && g.van === S.chon.van && g.cuoi === S.chon.cuoi;
      b.setAttribute("aria-pressed", dangChon ? "true" : "false");
      b.addEventListener("click", function () {
        S.chon = { dau: g.dau, van: g.van, cuoi: g.cuoi };
        veBuoc2(); veBuoc3();
      });
      goiY.appendChild(b);
    });
    hop.appendChild(goiY);

    hop.appendChild(tao("h3", "ln-nho", T("b2Ghep")));
    var bo = tao("div", "ln-bo-ghep");
    [["dau", T("b2Dau"), GhepTieng.AM_DAU], ["van", T("b2Van"), GhepTieng.VAN], ["cuoi", T("b2Cuoi"), GhepTieng.AM_CUOI]].forEach(function (nhom) {
      var slot = nhom[0];
      var fs = tao("fieldset", "ln-nhom-ghep");
      fs.appendChild(tao("legend", null, nhom[1]));
      var hang = tao("div", "ln-chip-hang");
      nhom[2].forEach(function (o) {
        var b = tao("button", "ln-chip ln-khoa-khi-ghi", o.ma === "" ? T("b2Khong") : o.nhan);
        b.type = "button"; b.lang = "vi";
        b.setAttribute("aria-pressed", S.chon[slot] === o.ma ? "true" : "false");
        if (!chonHopLe(slot, o.ma)) b.classList.add("ln-mo");
        b.addEventListener("click", function () { datChon(slot, o.ma); veBuoc2(); veBuoc3(); });
        hang.appendChild(b);
      });
      fs.appendChild(hang);
      bo.appendChild(fs);
    });
    hop.appendChild(bo);

    var chu = GhepTieng.ghep(S.chon.dau, S.chon.van, S.chon.cuoi, GhepTieng.laTac(S.chon.cuoi) ? "sac" : "ngang");
    var xem = tao("p", "ln-dang-chon");
    xem.appendChild(document.createTextNode(T("b2DangChon") + " "));
    var to = tao("strong", "ln-chu-to", chu.chu); to.lang = "vi";
    xem.appendChild(to);
    hop.appendChild(xem);
    hop.appendChild(tao("p", "ln-ghi-chu-nho", T("b2GhiChu") + " " + T("b2Mo")));
  }

  /* =====================================================================
     BƯỚC 3 – ĐỌC 6 THANH
     ===================================================================== */
  function veBuoc3() {
    var hop = $("#ln-buoc-3-noi-dung");
    hop.textContent = "";

    var giongHang = tao("div", "ln-giong");
    giongHang.setAttribute("role", "group");
    giongHang.setAttribute("aria-label", T("b3Giong"));
    giongHang.appendChild(tao("span", "ln-giong-nhan", T("b3Giong") + ":"));
    ["hanoi", "saigon"].forEach(function (g) {
      var b = tao("button", "ln-chip ln-chip-to ln-khoa-khi-ghi", T(g));
      b.type = "button";
      b.setAttribute("aria-pressed", S.giong === g ? "true" : "false");
      b.addEventListener("click", function () { S.giong = g; ghi(KHOA_GIONG, g); veBuoc3(); });
      giongHang.appendChild(b);
    });
    hop.appendChild(giongHang);

    var tac = GhepTieng.laTac(S.chon.cuoi);
    hop.appendChild(tao("p", "ln-ghi-chu-nho", T("b3HuongDan")));
    if (tac) hop.appendChild(tao("p", "ln-ghi-chu-tac", T("b2Tac")));

    var luoi = tao("div", "ln-luoi" + (tac ? " ln-luoi-hai" : ""));
    GhepTieng.thanhDung(S.chon.cuoi).forEach(function (th) {
      var g = GhepTieng.ghep(S.chon.dau, S.chon.van, S.chon.cuoi, th);
      var m = CaoDo.layMau(S.giong, th, tac);
      if (!g.hopLe || !m) return;
      luoi.appendChild(taoThe(g.chu, th, m));
    });
    hop.appendChild(luoi);
    requestAnimationFrame(veTatCaBieuDo);
  }

  function taoThe(chu, th, m) {
    var khoa = chu + "|" + S.giong;
    var the = tao("article", "ln-the-thanh");
    the.setAttribute("data-khoa", khoa);
    the._mau = m;

    var dau = tao("div", "ln-the-dau");
    var c = tao("p", "ln-tieng", chu); c.lang = "vi";
    dau.appendChild(c);
    var ten = tao("div", "ln-ten-thanh");
    ten.appendChild(tao("span", "ln-ten", T("thanh")[th]));
    var ipa = tao("span", "ln-ipa", CaoDo.chuIPA(m.chao) + " " + m.chao);
    ipa.title = "IPA / Chao";
    ten.appendChild(ipa);
    dau.appendChild(ten);
    the.appendChild(dau);

    var bd = tao("canvas", "ln-bieu-do");
    bd.setAttribute("role", "img");
    bd.setAttribute("aria-label", T("mau") + " " + m.chao);
    the.appendChild(bd);
    var nl = tao("canvas", "ln-nang-luong");
    nl.setAttribute("aria-hidden", "true");
    the.appendChild(nl);
    var chuGiai = tao("p", "ln-chu-giai");
    chuGiai.appendChild(tao("span", "ln-cg-mau", T("mau")));
    chuGiai.appendChild(tao("span", "ln-cg-em", T("cuaEm")));
    chuGiai.appendChild(tao("span", "ln-cg-nl", T("nangLuong")));
    the.appendChild(chuGiai);

    var nut = tao("div", "ln-the-nut");
    var bGhi = tao("button", "ttv-nut ln-nut-ghi", "● " + T("ghiAm"));
    bGhi.type = "button";
    nut.appendChild(bGhi);
    var nhanFile = tao("label", "ttv-nut-phu ln-nut-file");
    nhanFile.appendChild(document.createTextNode(T("taiFile")));
    var file = tao("input"); file.type = "file"; file.accept = "audio/*,.m4a,.mp3,.wav,.webm,.ogg"; file.className = "ln-an";
    nhanFile.appendChild(file);
    nut.appendChild(nhanFile);
    the.appendChild(nut);

    var kq = tao("div", "ln-ket-qua");
    kq.setAttribute("aria-live", "polite");
    the.appendChild(kq);

    if (!m.cham) the.appendChild(tao("p", "ln-ghi-chu-nho", T("chuaCham")));

    bGhi.addEventListener("click", function () {
      if (S.dangGhi) return;
      if (!S.moc) { baoCanMoc(kq); return; }
      S.dangGhi = true; khoaNut(true);
      var demNguoc = function (n) { bGhi.textContent = T("docDi") + " " + n; bGhi.classList.add("ln-dang-ghi"); };
      demNguoc.baoTin = function (s) { kq.textContent = ""; kq.appendChild(tao("p", "ln-tin", s)); };
      var blobGhi = null;
      ghiAm(demNguoc, null)
        .then(function (bg) { blobGhi = bg.blob; bGhi.textContent = T("dangPhanTich"); return layMauPhanTich(bg); })
        .then(function (mm) { xongPhanTich(the, khoa, chu, th, m, mm, blobGhi); })
        .catch(function (e) { S.dangGhi = false; khoaNut(false); veLaiNut(bGhi); kq.textContent = ""; kq.appendChild(tao("p", "ln-tin ln-tin-sai", loiMic(e))); });
    });

    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      file.value = "";
      if (!f || S.dangGhi) return;
      if (!S.moc) { baoCanMoc(kq); return; }
      S.dangGhi = true; khoaNut(true);
      giaiMa(f).then(function (mm) { xongPhanTich(the, khoa, chu, th, m, mm, f); })
        .catch(function () { S.dangGhi = false; khoaNut(false); kq.textContent = ""; kq.appendChild(tao("p", "ln-tin ln-tin-sai", T("loiFile"))); });
    });

    if (S.ketQua[khoa]) veKetQua(the, S.ketQua[khoa], th);
    return the;
  }

  function veLaiNut(b) { b.textContent = "● " + T("ghiAm"); b.classList.remove("ln-dang-ghi"); }

  function baoCanMoc(kq) {
    kq.textContent = "";
    var p = tao("p", "ln-tin ln-tin-sai", T("canMoc") + " ");
    var a = tao("a", null, T("denBuoc1")); a.href = "#ln-buoc-1";
    p.appendChild(a);
    kq.appendChild(p);
  }

  // Chỗ dành cho bảng thành tích sau này (Firebase gói Spark miễn phí, dự án truong-tieng-viet-cvcec).
  // Hiện tại KHÔNG lưu điểm lên đâu cả. Khi làm bảng thành tích, gán hàm vào window.LuyenNoi.khiCoDiem.
  window.LuyenNoi = window.LuyenNoi || { khiCoDiem: null };

  function xongPhanTich(the, khoa, chu, th, m, mm, blob) {
    var pt = CaoDo.phanTich(mm.mau, mm.sr);
    var duong = CaoDo.duongGiong(pt, S.moc);
    var r = { pt: pt, duong: duong, blob: blob, url: null, diem: null, th: th };
    if (blob) r.url = URL.createObjectURL(blob);
    if (duong && m.cham) {
      r.diem = CaoDo.chamDiem(duong, m).diem;
      if (typeof window.LuyenNoi.khiCoDiem === "function") {
        try { window.LuyenNoi.khiCoDiem({ tieng: chu, thanh: th, giong: S.giong, diem: r.diem }); } catch (e) {}
      }
    }
    var cu = S.ketQua[khoa];
    if (cu && cu.url) URL.revokeObjectURL(cu.url);
    S.ketQua[khoa] = r;
    S.dangGhi = false; khoaNut(false);
    var b = $(".ln-nut-ghi", the); if (b) veLaiNut(b);
    veKetQua(the, r, th);
    veBieuDo(the);
  }

  function veKetQua(the, r, th) {
    var kq = $(".ln-ket-qua", the);
    kq.textContent = "";
    if (!r.duong) {
      kq.appendChild(tao("p", "ln-tin ln-tin-sai", T("khongTieng")));
    } else if (r.diem != null) {
      var muc = CaoDo.mucDiem(r.diem);
      var o = tao("div", "ln-diem ln-diem-" + muc);
      var img = tao("img"); img.alt = ""; img.width = 300; img.height = 360;
      img.src = anhTrau({ tot: "cheer.png", "gan-dung": "thumbs-up.png", "can-luyen": "thinking.png" }[muc]);
      o.appendChild(img);
      var chu = tao("div");
      var dong = tao("p", "ln-diem-so");
      dong.appendChild(tao("strong", null, String(r.diem)));
      dong.appendChild(document.createTextNode(" " + T("diem") + " · " + T("muc")[muc]));
      chu.appendChild(dong);
      chu.appendChild(tao("p", "ln-khen", T("khen")[muc]));
      chu.appendChild(tao("p", "ln-tham-khao", T("thamKhao")));
      o.appendChild(chu);
      kq.appendChild(o);
    }
    if (r.url) {
      var hang = tao("div", "ln-the-nut");
      var am = new Audio(); am.src = r.url; am.preload = "auto";
      var bNghe = tao("button", "ttv-nut-phu ln-nut-nho", "▶ " + T("ngheLai"));
      bNghe.type = "button";
      bNghe.addEventListener("click", function () { try { am.currentTime = 0; } catch (e) {} var p = am.play(); if (p && p.catch) p.catch(function () {}); });
      hang.appendChild(bNghe);
      var tai = tao("a", "ttv-nut-phu ln-nut-nho", "⬇ " + T("luu"));
      tai.href = r.url;
      tai.download = "luyen-noi-" + khongDau($(".ln-tieng", the).textContent) + "-" + th + "." + duoiFile(r.blob);
      hang.appendChild(tai);
      kq.appendChild(hang);
    }
  }

  /* ---------- Vẽ biểu đồ ---------- */
  var ST_TREN = 8, ST_DUOI = -8;

  function chuanBiCanvas(cv, caoCss) {
    var rong = cv.clientWidth || 300, dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(rong * dpr); cv.height = Math.round(caoCss * dpr);
    var g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g: g, w: rong, h: caoCss };
  }

  function veBieuDo(the) {
    var m = the._mau, r = S.ketQua[the.getAttribute("data-khoa")];
    var cv = $(".ln-bieu-do", the);
    var c = chuanBiCanvas(cv, 170), g = c.g;
    var traiL = 22, phai = c.w - 8, tren = 8, duoi = c.h - 8;
    var x = function (u) { return traiL + u * (phai - traiL); };
    var y = function (st) { st = Math.max(ST_DUOI, Math.min(ST_TREN, st)); return tren + (ST_TREN - st) / (ST_TREN - ST_DUOI) * (duoi - tren); };
    g.clearRect(0, 0, c.w, c.h);

    // Lưới 5 bậc Chao
    var mauChu = mau("--ttv-chu"), mauPhu = mau("--ttv-chu-phu"), mauVien = mau("--ttv-vien"), mauEm = mau("--ttv-chinh");
    g.font = "700 11px " + (mau("--ttv-phong") || "sans-serif");
    g.textAlign = "center"; g.textBaseline = "middle";
    for (var b = 1; b <= 5; b++) {
      var yy = y(CaoDo.bacSangSt(b));
      g.strokeStyle = mauVien; g.lineWidth = 1; g.setLineDash([]);
      g.beginPath(); g.moveTo(traiL, yy); g.lineTo(phai, yy); g.stroke();
      g.fillStyle = mauPhu; g.fillText(String(b), 9, yy);
    }

    var i;
    // Đường giọng của bé: nét liền, co theo độ dài đường mẫu
    if (r && r.duong) {
      var d = r.duong.diem, t0 = r.duong.batDau, t1 = r.duong.ketThuc;
      var dai = Math.max(0.05, t1 - t0);
      g.strokeStyle = mauEm; g.lineWidth = 4; g.lineJoin = "round";
      g.beginPath();
      for (i = 0; i < d.length; i++) {
        var px2 = x((d[i].t - t0) / dai * m.dai), py2 = y(d[i].st);
        if (i === 0 || d[i].t - d[i - 1].t > 0.04) g.moveTo(px2, py2); else g.lineTo(px2, py2);
      }
      g.stroke();
    }

    // Đường mẫu: nét đứt, vẽ sau cùng để luôn nhìn thấy dù đường của bé trùng khít
    g.strokeStyle = mauChu; g.lineWidth = 3; g.setLineDash([8, 6]); g.lineCap = "round";
    g.beginPath();
    var N = 60;
    for (i = 0; i < N; i++) {
      var u = i / (N - 1);
      var px = x(u * m.dai), py = y(CaoDo.giaTriMau(m, u));
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.stroke();
    g.setLineDash([]);
    if (m.ngat != null) { // dấu tắc thanh hầu
      var xn = x(m.ngat * m.dai), yn = y(CaoDo.giaTriMau(m, m.ngat));
      g.strokeStyle = mauChu; g.lineWidth = 3; // vạch đứng ngắn: chỗ giọng bị "gãy" (tắc thanh hầu)
      g.beginPath(); g.moveTo(xn, yn - 18); g.lineTo(xn, yn - 6); g.stroke();
    }

    // Cột năng lượng
    var nl = $(".ln-nang-luong", the);
    var c2 = chuanBiCanvas(nl, 36), g2 = c2.g;
    g2.clearRect(0, 0, c2.w, c2.h);
    g2.fillStyle = mauVien; g2.fillRect(traiL, c2.h - 1, phai - traiL, 1);
    if (r && r.pt && r.pt.khung.length) {
      var k = r.pt.khung, max = r.pt.rmsMax || 1;
      var tDau = r.duong ? r.duong.batDau : 0, tCuoi = r.duong ? r.duong.ketThuc : 0;
      var rongCot = Math.max(1, (phai - traiL) / k.length);
      for (i = 0; i < k.length; i++) {
        var h = Math.max(1, Math.sqrt(k[i].rms / max) * (c2.h - 2));
        var trong = r.duong && k[i].t >= tDau && k[i].t <= tCuoi;
        g2.fillStyle = trong ? mauEm : mauPhu;
        g2.globalAlpha = trong ? 0.9 : 0.35;
        g2.fillRect(traiL + i * (phai - traiL) / k.length, c2.h - 1 - h, rongCot, h);
      }
      g2.globalAlpha = 1;
    }
  }

  function veTatCaBieuDo() {
    var ds = document.querySelectorAll(".ln-the-thanh");
    for (var i = 0; i < ds.length; i++) veBieuDo(ds[i]);
  }

  /* ---------- Khởi động ---------- */
  function veHet() {
    if (S.dangGhi) return;
    veBuoc1(); veBuoc2(); veBuoc3();
  }

  function khoiDong() {
    if (!CaoDo || !GhepTieng) return;
    veHet();
    if (window.CONG && window.CONG.khiDoiChu) window.CONG.khiDoiChu(function () { veHet(); });
    var hen = 0;
    window.addEventListener("resize", function () { clearTimeout(hen); hen = setTimeout(veTatCaBieuDo, 120); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong);
  else khoiDong();
})();
