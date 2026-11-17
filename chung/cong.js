/*!
 * Phần dùng chung cho các trang của cổng vietclass.cvcec.org:
 * thanh trên, chân trang, đổi ngôn ngữ VI/EN, băng trượt, nút sao chép.
 * Nạp SAU bộ mẫu:  <script src="https://mau.cvcec.org/v1/cvcec-chung.js" defer></script>
 *                  <script src="/chung/cong.js" defer></script>
 * Trang đánh dấu mình bằng <body data-trang="hoc-tap"> (để tô mục đang mở),
 * đặt <header class="cong-dau" data-cong-dau></header> và
 * <footer class="cong-chan" data-cong-chan><div data-ttv-chan></div></footer>.
 * Chữ riêng của trang: khai báo window.CONG_CHU = {vi:{...}, en:{...}} trong <head>,
 * hoặc gọi CONG.them({...}) rồi CONG.capNhat().
 */
(function () {
  "use strict";

  var TEN_TRUONG = "Trường Tiếng Việt Của Em";
  var KHOA_NGON_NGU = "ttv-ngon-ngu"; // khoá của bộ mẫu, không đổi

  // Các trang của cổng (thanh trên). Không phải góc học, không thuộc TTV_DANH_SACH.
  var TRANG = [
    { id: "trang-chu", href: "/", chu: "navTrangChu" },
    { id: "hoc-tap", href: "/hoc-tap/", chu: "navHocTap" },
    { id: "hoat-dong", href: "/hoat-dong/", chu: "navHoatDong" },
    { id: "tin-tuc", href: "/tin-tuc/", chu: "navTinTuc" },
    { id: "gioi-thieu", href: "/gioi-thieu/", chu: "navGioiThieu" },
    { id: "trien-lam", href: "/trien-lam/", chu: "navTrienLam" },
    { id: "chung-tay", href: "/chung-tay/", chu: "navChungTay" },
    { id: "giao-vien", href: "/giao-vien/", chu: "navGiaoVien" }
  ];

  // Góc trong TTV_DANH_SACH được tách thành trang riêng của cổng (không nằm trong "Học tập").
  // Vẫn giữ trong TTV_DANH_SACH để có màu và ảnh Trâu Con; địa chỉ cũ /#id tự chuyển sang trang riêng.
  var GOC_TACH_RIENG = { trienlam: "/trien-lam/" };
  function laGocHoc(muc) { return !Object.prototype.hasOwnProperty.call(GOC_TACH_RIENG, muc.id); }

  var CHU = {
    vi: {
      navTrangChu: "Trang chủ", navHocTap: "Học tập", navHoatDong: "Hoạt động", navTinTuc: "Tin tức", navGioiThieu: "Giới thiệu", navTrienLam: "Triển lãm", navChungTay: "Chung tay", navGiaoVien: "Giáo viên",
      navChao: "Điều hướng chính", ngonNgu: "Ngôn ngữ", veCong: "Về trang chủ Trường Tiếng Việt Của Em",
      chanCau: "Nền tảng học tiếng Việt dành cho mọi đối tượng yêu tiếng Việt.",
      chanDong: "Một chương trình của Canada Vietnam Cultural & Educational Council (CVCEC)",
      chanHocTap: "Học tập", chanTrang: "Cổng trường", chanDieuKhoan: "Điều khoản sử dụng", chanBaoMat: "Chính sách bảo mật",
      chanUyBan: "Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao",
      truoc: "Trước", sau: "Sau", denTrang: "Đến trang ",
      saoChep: "Sao chép", daChep: "Đã sao chép: ", khongChep: "Không sao chép được, các bạn chép tay giúp nhé.",
      tabMoi: "(mở tab mới)",
      canhVanMieu: "Khuê Văn Các – Văn Miếu, Hà Nội", canhHoiAn: "Phố cổ Hội An", canhHoGuom: "Hồ Gươm – Tháp Rùa, Hà Nội",
      canhHaLong: "Vịnh Hạ Long", canhDinhLang: "Đình làng và cây đa", canhHue: "Cầu Trường Tiền – sông Hương, Huế", canhChoNoi: "Chợ nổi Cái Răng, Cần Thơ", canhLangQue: "Cánh đồng lúa và làng quê"
    },
    en: {
      navTrangChu: "Home", navHocTap: "Learning", navHoatDong: "Activities", navTinTuc: "News", navGioiThieu: "About", navTrienLam: "Exhibition", navChungTay: "Donate", navGiaoVien: "Teachers",
      navChao: "Main navigation", ngonNgu: "Language", veCong: "Back to the Trường Tiếng Việt Của Em home page",
      chanCau: "A Vietnamese learning platform for everyone who loves the Vietnamese language.",
      chanDong: "A program of the Canada Vietnam Cultural & Educational Council (CVCEC)",
      chanHocTap: "Learning", chanTrang: "School portal", chanDieuKhoan: "Terms of use", chanBaoMat: "Privacy policy",
      chanUyBan: "State Committee for Overseas Vietnamese Affairs – Ministry of Foreign Affairs",
      truoc: "Previous", sau: "Next", denTrang: "Go to page ",
      saoChep: "Copy", daChep: "Copied: ", khongChep: "Couldn't copy. Please copy it by hand.",
      tabMoi: "(opens in a new tab)",
      canhVanMieu: "Khue Van Cac – Temple of Literature, Hanoi", canhHoiAn: "Hoi An Ancient Town", canhHoGuom: "Hoan Kiem Lake – Turtle Tower, Hanoi",
      canhHaLong: "Ha Long Bay", canhDinhLang: "Village communal house and banyan tree", canhHue: "Truong Tien Bridge – Perfume River, Hue", canhChoNoi: "Cai Rang Floating Market, Can Tho", canhLangQue: "Rice fields and village"
    }
  };

  var MXH = [
    { ten: "Facebook", href: "https://facebook.com/cvcec.org", d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" },
    { ten: "YouTube", href: "https://youtube.com/@CVCEC2024", d: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
    { ten: "LinkedIn", href: "https://linkedin.com/company/cvcec/", d: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" },
    { ten: "WhatsApp", href: "https://api.whatsapp.com/send?phone=16478972358", d: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 8 4.42zm8.03-17.47A11.33 11.33 0 0 0 12.05.7C5.8.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.1 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" }
  ];

  var ngonNgu = "vi";
  var DS = [];
  var dsTruot = [];
  var mocDoiChu = [];

  function tao(the, lop, chu) {
    var el = document.createElement(the);
    if (lop) el.className = lop;
    if (chu != null) el.textContent = chu;
    return el;
  }
  function docNgonNgu() {
    if (window.TTV && typeof window.TTV.ngonNgu === "function") return window.TTV.ngonNgu();
    try { var v = window.localStorage.getItem(KHOA_NGON_NGU); if (v === "vi" || v === "en") return v; } catch (e) {}
    return "vi";
  }
  function c() { return CHU[ngonNgu]; }
  function anhBoMau(ten) {
    return (window.TTV && typeof window.TTV.anh === "function") ? window.TTV.anh(ten) : "https://mau.cvcec.org/assets/" + ten;
  }

  /* ---------- Thanh trên ---------- */
  function dungThanhTren(dau) {
    var trangNay = document.body.getAttribute("data-trang") || "";
    var ruot = tao("div", "cong-ruot");
    var logo = tao("a", "cong-logo");
    logo.href = "/";
    logo.setAttribute("data-nhan", "veCong");
    logo.setAttribute("data-ve-chao", "");
    var img = tao("img");
    img.src = anhBoMau("logo.png");
    img.width = 124; img.height = 48;
    img.alt = TEN_TRUONG;
    logo.appendChild(img);
    ruot.appendChild(logo);

    var nav = tao("nav", "cong-dau-nav");
    nav.setAttribute("data-nhan", "navChao");
    var ul = tao("ul");
    TRANG.forEach(function (t) {
      var li = tao("li"), a = tao("a");
      a.href = t.href;
      a.setAttribute("data-chu", t.chu);
      a.textContent = CHU.vi[t.chu];
      if (t.id === trangNay) a.setAttribute("aria-current", "page");
      if (t.id === "trang-chu") a.setAttribute("data-ve-chao", ""); // trên trang chủ: thoát chế độ đang học
      li.appendChild(a); ul.appendChild(li);
    });
    nav.appendChild(ul);
    // Chỗ cho nút Đăng nhập / tài khoản (do /js/tai-khoan.js dựng)
    var tk = tao("div", "cong-tk");
    tk.setAttribute("data-cong-tk", "");
    nav.appendChild(tk);
    var nhom = tao("div", "ttv-thanh-ngon-ngu");
    nhom.setAttribute("role", "group");
    nhom.setAttribute("data-nhan", "ngonNgu");
    nav.appendChild(nhom);
    ruot.appendChild(nav);
    dau.textContent = "";
    dau.appendChild(ruot);
  }

  function dungNutNgonNgu() {
    var nhom = document.querySelectorAll(".ttv-thanh-ngon-ngu[data-nhan='ngonNgu']");
    for (var i = 0; i < nhom.length; i++) {
      if (nhom[i].childElementCount) continue;
      ["vi", "en"].forEach(function (ma) {
        var b = tao("button", "", ma.toUpperCase());
        b.type = "button"; b.lang = ma;
        b.setAttribute("data-ma", ma);
        b.setAttribute("aria-label", ma === "vi" ? "Tiếng Việt" : "English");
        b.addEventListener("click", function () { datNgonNgu(ma); });
        nhom[i].appendChild(b);
      });
    }
  }

  // Trên điện thoại thanh mục cuộn ngang: đưa mục đang mở vào tầm nhìn.
  function hienMucDangMo() {
    var a = document.querySelector('.cong-dau-nav a[aria-current="page"]');
    if (!a) return;
    var ul = a.closest("ul");
    if (ul && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = a.parentNode.offsetLeft - 12;
  }

  /* ---------- Chân trang ---------- */
  function dungChanTrang(chan) {
    var ruot = tao("div", "cong-ruot chan-luoi");
    var trai = tao("div");
    var logo = tao("img", "chan-logo");
    logo.src = anhBoMau("logo.png"); logo.width = 144; logo.height = 56; logo.alt = TEN_TRUONG;
    logo.loading = "lazy";
    trai.appendChild(logo);
    var p1 = tao("p", "chan-cau"); p1.setAttribute("data-chu", "chanCau"); trai.appendChild(p1);
    var p2 = tao("p", "chan-chuong-trinh"); p2.setAttribute("data-chu", "chanDong"); trai.appendChild(p2);
    var mxh = tao("ul", "chan-mxh");
    MXH.forEach(function (m) {
      var li = tao("li"), a = tao("a");
      a.href = m.href; a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", m.ten);
      a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + m.d + '"/></svg>';
      li.appendChild(a); mxh.appendChild(li);
    });
    trai.appendChild(mxh);
    var dt = tao("div", "chan-doi-tac");
    var uy = tao("img"); uy.src = "/assets/doi-tac/uy-ban.png"; uy.width = 503; uy.height = 496; uy.loading = "lazy";
    uy.setAttribute("data-alt", "chanUyBan");
    var cv = tao("img"); cv.src = "/assets/doi-tac/cvcec.jpg"; cv.width = 1200; cv.height = 1200; cv.loading = "lazy";
    cv.alt = "Canada Vietnam Cultural & Educational Council (CVCEC)";
    dt.appendChild(uy); dt.appendChild(cv);
    trai.appendChild(dt);
    ruot.appendChild(trai);

    var phai = tao("div", "chan-cot-nhom");
    var cot1 = tao("nav", "chan-cot");
    cot1.setAttribute("aria-labelledby", "chan-hoc-tap");
    var h1 = tao("h2"); h1.id = "chan-hoc-tap"; h1.setAttribute("data-chu", "chanHocTap"); cot1.appendChild(h1);
    var ul1 = tao("ul"); ul1.id = "chan-goc";
    DS.filter(laGocHoc).forEach(function (muc) {
      var li = tao("li"), a = tao("a");
      a.href = "/#" + muc.id;
      a.setAttribute("data-goc", muc.id);
      li.appendChild(a); ul1.appendChild(li);
    });
    cot1.appendChild(ul1);
    phai.appendChild(cot1);
    var cot2 = tao("nav", "chan-cot chan-cot-trang");
    cot2.setAttribute("aria-labelledby", "chan-trang");
    var h2 = tao("h2"); h2.id = "chan-trang"; h2.setAttribute("data-chu", "chanTrang"); cot2.appendChild(h2);
    var ul2 = tao("ul");
    TRANG.concat([{ href: "/dieu-khoan/", chu: "chanDieuKhoan" }, { href: "/bao-mat/", chu: "chanBaoMat" }]).forEach(function (t) {
      var li = tao("li"), a = tao("a");
      a.href = t.href; a.setAttribute("data-chu", t.chu);
      li.appendChild(a); ul2.appendChild(li);
    });
    cot2.appendChild(ul2);
    phai.appendChild(cot2);
    ruot.appendChild(phai);
    chan.insertBefore(ruot, chan.firstChild);
  }

  /* ---------- Băng trượt: trang, chấm, nút trước/sau ---------- */
  function taoTruot(goc) {
    var ray = goc.querySelector(".truot-ray");
    var cham = goc.querySelector(".truot-cham");
    var nutBoc = goc.querySelector(".truot-nut");
    var truoc = tao("button");
    var sau = tao("button");
    truoc.type = sau.type = "button";
    truoc.innerHTML = '<span aria-hidden="true">←</span>';
    sau.innerHTML = '<span aria-hidden="true">→</span>';
    nutBoc.appendChild(truoc);
    nutBoc.appendChild(sau);
    var soTrang = 0, dang = -1, cho = 0;

    function rong() { return ray.clientWidth || 1; }
    function tinhSoTrang() {
      var conLai = ray.scrollWidth - ray.clientWidth;
      return conLai <= 2 ? 1 : Math.ceil(conLai / rong() - 0.02) + 1;
    }
    function trangHienTai() {
      var conLai = ray.scrollWidth - ray.clientWidth;
      if (ray.scrollLeft >= conLai - 4) return soTrang - 1;
      return Math.min(soTrang - 1, Math.round(ray.scrollLeft / rong()));
    }
    function den(i) {
      var conLai = ray.scrollWidth - ray.clientWidth;
      var x = Math.max(0, Math.min(conLai, i * rong()));
      var tot = x, lech = Infinity;
      for (var k = 0; k < ray.children.length; k++) {
        var o = ray.children[k].offsetLeft - ray.firstElementChild.offsetLeft;
        if (Math.abs(o - x) < lech) { lech = Math.abs(o - x); tot = o; }
      }
      if (i >= soTrang - 1) tot = conLai;
      ray.scrollTo({ left: Math.min(tot, conLai), behavior: "smooth" });
    }
    function ve() {
      if (!ray.clientWidth) return;
      soTrang = tinhSoTrang();
      cham.textContent = "";
      var nho = 44 * soTrang > cham.parentNode.clientWidth - 110;
      cham.classList.toggle("nho", nho);
      for (var i = 0; i < soTrang; i++) {
        if (nho) cham.appendChild(tao("span"));
        else (function (k) {
          var b = tao("button");
          b.type = "button";
          b.addEventListener("click", function () { den(k); });
          cham.appendChild(b);
        })(i);
      }
      if (nho) cham.setAttribute("aria-hidden", "true"); else cham.removeAttribute("aria-hidden");
      goc.querySelector(".truot-dieu-khien").hidden = soTrang <= 1;
      dang = -1;
      capNhat();
      nhan();
    }
    function capNhat() {
      var t = trangHienTai();
      truoc.disabled = ray.scrollLeft <= 4;
      sau.disabled = t >= soTrang - 1;
      if (t === dang) return;
      dang = t;
      var con = cham.children;
      for (var i = 0; i < con.length; i++) {
        if (con[i].tagName === "BUTTON") con[i].setAttribute("aria-current", i === t ? "true" : "false");
        else con[i].classList.toggle("dang", i === t);
      }
    }
    function nhan() {
      var cc = c();
      truoc.setAttribute("aria-label", cc.truoc);
      sau.setAttribute("aria-label", cc.sau);
      var con = cham.querySelectorAll("button");
      for (var i = 0; i < con.length; i++) con[i].setAttribute("aria-label", cc.denTrang + (i + 1) + "/" + soTrang);
    }
    truoc.addEventListener("click", function () { den(trangHienTai() - 1); });
    sau.addEventListener("click", function () { den(trangHienTai() + 1); });
    ray.addEventListener("scroll", function () {
      if (cho) return;
      cho = window.requestAnimationFrame(function () { cho = 0; capNhat(); });
    }, { passive: true });
    ray.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); den(trangHienTai() + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); den(trangHienTai() - 1); }
    });
    return { ve: ve, nhan: nhan };
  }
  function khoiTruot(phamVi) {
    var ds = (phamVi || document).querySelectorAll("[data-truot]:not([data-truot-xong])");
    for (var i = 0; i < ds.length; i++) {
      ds[i].setAttribute("data-truot-xong", "");
      var t = taoTruot(ds[i]);
      dsTruot.push(t);
      t.ve();
    }
  }
  function veLaiTruot() { for (var i = 0; i < dsTruot.length; i++) dsTruot[i].ve(); }

  /* ---------- Nút sao chép (data-chep="chữ", data-chep-nhan="khoá chữ") ---------- */
  function khoiSaoChep() {
    var nut = document.querySelectorAll("[data-chep]:not([data-chep-xong])");
    if (!nut.length) return;
    var thongBao = document.querySelector("[data-chep-thong-bao]");
    var hen = 0;
    function bao(chu) {
      if (!thongBao) return;
      thongBao.textContent = chu;
      clearTimeout(hen);
      hen = setTimeout(function () { thongBao.textContent = ""; }, 4000);
    }
    function chepCu(text) {
      var t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
      return ok;
    }
    for (var i = 0; i < nut.length; i++) {
      nut[i].setAttribute("data-chep-xong", "");
      nut[i].addEventListener("click", function () {
        var text = this.getAttribute("data-chep");
        var cc = c();
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { bao(cc.daChep + text); },
            function () { bao(chepCu(text) ? cc.daChep + text : cc.khongChep); });
        } else {
          bao(chepCu(text) ? cc.daChep + text : cc.khongChep);
        }
      });
    }
  }

  /* ---------- Đổi chữ theo ngôn ngữ ---------- */
  function capNhat() {
    var cc = c();
    document.documentElement.lang = ngonNgu;
    var ds = document.querySelectorAll("[data-chu]");
    for (var i = 0; i < ds.length; i++) { var k = ds[i].getAttribute("data-chu"); if (cc[k] != null) ds[i].textContent = cc[k]; }
    var dsHtml = document.querySelectorAll("[data-chu-html]");
    for (var h = 0; h < dsHtml.length; h++) {
      var kh = dsHtml[h].getAttribute("data-chu-html");
      if (cc[kh] != null) dsHtml[h].innerHTML = cc[kh]; // chuỗi cố định trong mã, không lấy từ bên ngoài
    }
    var nhan = document.querySelectorAll("[data-nhan]");
    for (var j = 0; j < nhan.length; j++) { var kn = nhan[j].getAttribute("data-nhan"); if (cc[kn] != null) nhan[j].setAttribute("aria-label", cc[kn]); }
    var alt = document.querySelectorAll("[data-alt]");
    for (var a = 0; a < alt.length; a++) { var ka = alt[a].getAttribute("data-alt"); if (cc[ka] != null) alt[a].alt = cc[ka]; }
    var nut = document.querySelectorAll(".ttv-thanh-ngon-ngu button[data-ma]");
    for (var n = 0; n < nut.length; n++) nut[n].setAttribute("aria-pressed", nut[n].getAttribute("data-ma") === ngonNgu ? "true" : "false");
    var chep = document.querySelectorAll("[data-chep-nhan]");
    for (var cp = 0; cp < chep.length; cp++) {
      chep[cp].setAttribute("aria-label", cc.saoChep + " " + (cc[chep[cp].getAttribute("data-chep-nhan")] || "") + ": " + chep[cp].getAttribute("data-chep"));
    }
    var tabMoi = document.querySelectorAll("[data-tab-moi]");
    for (var tm = 0; tm < tabMoi.length; tm++) tabMoi[tm].textContent = " " + cc.tabMoi;
    var goc = document.querySelectorAll("#chan-goc a[data-goc]");
    for (var g = 0; g < goc.length; g++) {
      for (var d = 0; d < DS.length; d++) if (DS[d].id === goc[g].getAttribute("data-goc")) goc[g].textContent = ngonNgu === "en" ? DS[d].ten_en : DS[d].ten_vi;
    }
    for (var t = 0; t < dsTruot.length; t++) dsTruot[t].nhan();
    var khoaTieuDe = document.body.getAttribute("data-tieu-de");
    if (khoaTieuDe && cc[khoaTieuDe]) document.title = cc[khoaTieuDe] + " · " + TEN_TRUONG;
    for (var m = 0; m < mocDoiChu.length; m++) { try { mocDoiChu[m](ngonNgu); } catch (e) {} }
  }

  function datNgonNgu(ma) {
    if (ma !== "vi" && ma !== "en") return;
    ngonNgu = ma;
    if (window.TTV && typeof window.TTV.datNgonNgu === "function") window.TTV.datNgonNgu(ma); // bộ mẫu ghi khoá "ttv-ngon-ngu"
    else { try { window.localStorage.setItem(KHOA_NGON_NGU, ma); } catch (e) {} }
    capNhat();
  }

  function them(chu) {
    ["vi", "en"].forEach(function (nn) {
      if (!chu || !chu[nn]) return;
      for (var k in chu[nn]) if (Object.prototype.hasOwnProperty.call(chu[nn], k)) CHU[nn][k] = chu[nn][k];
    });
  }

  /* ---------- Chạm chắc chắn trên iPad / điện thoại ----------
     Một số iPad (Safari) không phát sự kiện bấm sau khi chạm vào link lớn.
     Chạm gọn (không trượt, dưới 0,6 giây) vào link mở cùng tab thì tự mở link. */
  function khoiChamChac() {
    var dau = null;
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { dau = null; return; }
      var t = e.touches[0];
      dau = { x: t.clientX, y: t.clientY, luc: Date.now() };
    }, { passive: true, capture: true });
    document.addEventListener("touchmove", function (e) {
      if (!dau || !e.touches.length) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - dau.x) > 10 || Math.abs(t.clientY - dau.y) > 10) dau = null;
    }, { passive: true, capture: true });
    document.addEventListener("touchend", function (e) {
      var d = dau; dau = null;
      if (!d || Date.now() - d.luc > 600) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var href = a.getAttribute("href") || "";
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      e.preventDefault();   // không chờ sự kiện bấm của trình duyệt
      a.click();            // gọi bấm ngay: chạy các xử lý của trang rồi mở link
    }, { passive: false, capture: true });
  }

  /* ---------- Chế độ kiểm tra (?kiem-tra=1): ghi lại chạm, bấm và lỗi ---------- */
  function khoiKiemTra() {
    if (!/[?&]kiem-tra=1/.test(location.search)) return;
    var bang = tao("pre");
    bang.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;max-height:40vh;overflow:auto;z-index:99999;margin:0;padding:8px;background:rgba(255,255,255,.95);color:#003060;border:2px solid #003060;border-radius:12px;font:12px/1.4 monospace;white-space:pre-wrap;pointer-events:none";
    document.body.appendChild(bang);
    function ghi(chu) { bang.textContent = (new Date().toTimeString().slice(0, 8)) + " " + chu + "\n" + bang.textContent.slice(0, 4000); }
    function ta(el) {
      if (!el || !el.tagName) return String(el);
      var a = el.closest && el.closest("a");
      return el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "") + (a ? " → a[" + a.getAttribute("href") + "]" : "");
    }
    ghi("UA: " + navigator.userAgent);
    ghi("Màn: " + innerWidth + "×" + innerHeight + ", cảm ứng: " + ("ontouchstart" in window) + ", hover: " + matchMedia("(hover: hover)").matches);
    ["touchstart", "touchend", "pointerdown", "pointerup", "click"].forEach(function (ten) {
      document.addEventListener(ten, function (e) {
        var p = e.changedTouches ? e.changedTouches[0] : e;
        var o = (p && p.clientX != null) ? document.elementFromPoint(p.clientX, p.clientY) : null;
        ghi(ten + ": " + ta(e.target) + (o && o !== e.target ? " | ở điểm chạm: " + ta(o) : "") + (e.defaultPrevented ? " (đã chặn)" : ""));
      }, { capture: true, passive: true });
    });
    window.addEventListener("error", function (e) { ghi("LỖI: " + e.message + " @" + (e.filename || "").split("/").pop() + ":" + e.lineno); });
    window.addEventListener("pagehide", function () { ghi("rời trang"); });
  }

  /* ---------- Banner địa danh (data-canh, cảnh vẽ trong /chung/canh.js) ---------- */
  var ICON_GHIM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>';
  function themNhanCanh(noi, khoa) {
    var nhan = tao("p", "canh-ten");
    nhan.innerHTML = ICON_GHIM + '<span data-chu="' + khoa + '"></span>';
    noi.appendChild(nhan);
  }
  function dungCanh() {
    var CANH = window.CONG_CANH || {};
    var ds = document.querySelectorAll("[data-canh]");
    for (var i = 0; i < ds.length; i++) {
      var c = CANH[ds[i].getAttribute("data-canh")];
      if (!c || ds[i].querySelector(".canh-trang-svg")) continue;
      var tam = document.createElement("div");
      tam.innerHTML = '<svg class="vn-hero-canh canh-trang-svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' + c.svg + '</svg>';
      ds[i].insertBefore(tam.firstChild, ds[i].firstChild);
      themNhanCanh(ds[i], c.ten);
    }
    var nhanTinh = document.querySelectorAll("[data-canh-ten]");
    for (var j = 0; j < nhanTinh.length; j++) themNhanCanh(nhanTinh[j], nhanTinh[j].getAttribute("data-canh-ten"));
  }

  /* ---------- Khởi động ---------- */
  function khoiDong() {
    if (window.CONG_CHU) them(window.CONG_CHU); // chữ riêng của trang, khai báo trước khi nạp tệp này
    DS = Array.isArray(window.TTV_DANH_SACH) ? window.TTV_DANH_SACH : [];
    ngonNgu = docNgonNgu();
    var dau = document.querySelectorAll("[data-cong-dau]");
    for (var i = 0; i < dau.length; i++) dungThanhTren(dau[i]);
    var chan = document.querySelector("[data-cong-chan]");
    if (chan) dungChanTrang(chan);
    dungNutNgonNgu();
    dungCanh();
    capNhat();
    hienMucDangMo();
    khoiTruot();
    khoiSaoChep();
    khoiChamChac();
    khoiKiemTra();

    document.addEventListener("ttv-ngon-ngu", function (e) {
      var ma = e && e.detail && e.detail.ngonNgu;
      if ((ma === "vi" || ma === "en") && ma !== ngonNgu) { ngonNgu = ma; capNhat(); }
    });
    var hen = 0;
    window.addEventListener("resize", function () { clearTimeout(hen); hen = setTimeout(veLaiTruot, 150); });
    window.addEventListener("load", veLaiTruot);
  }

  window.CONG = {
    TEN_TRUONG: TEN_TRUONG,
    tao: tao,
    anhBoMau: anhBoMau,
    ngonNgu: function () { return ngonNgu; },
    chu: function () { return c(); },
    danhSach: function () { return DS; },
    // Các góc học (bỏ những góc đã tách thành trang riêng, ví dụ Triển lãm)
    gocHoc: function () { return DS.filter(laGocHoc); },
    gocTachRieng: GOC_TACH_RIENG,
    them: them,
    capNhat: capNhat,
    datNgonNgu: datNgonNgu,
    khiDoiChu: function (fn) { mocDoiChu.push(fn); },
    khoiTruot: khoiTruot,
    veLaiTruot: veLaiTruot,
    khoiSaoChep: khoiSaoChep
  };

  // Chạy sau cvcec-chung.js (defer giữ thứ tự); DOM đã sẵn sàng.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong);
  else khoiDong();
})();
