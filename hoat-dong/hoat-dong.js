/*!
 * Gợi ý hoạt động học – thư viện, bộ lọc, trang chi tiết và video 2D.
 * Dữ liệu: HOAT_DONG trong du-lieu.js. Địa chỉ: /hoat-dong/ (thư viện), /hoat-dong/#<slug> (một hoạt động).
 * Nạp SAU cvcec-chung.js và cong.js (đều defer). Không dùng giọng máy: video chỉ phát tệp
 * am-thanh/<slug>-<số bước>.mp3 nếu có; chưa có tệp thì chạy cảnh và phụ đề, không tiếng.
 * Không tạo khoá localStorage nào.
 * Kho gốc: toàn bộ hoạt động của "Khơi nguồn sáng tạo hoạt động ESL" được đọc trực tiếp từ
 * esl.trangphan.org/data/games.csv (một nguồn duy nhất). Địa chỉ một hoạt động gốc: /hoat-dong/#goc-<slug>.
 */
(function () {
  "use strict";

  var DS = Array.isArray(window.HOAT_DONG) ? window.HOAT_DONG.slice() : [];
  var SO_CHUYEN_THE = DS.length;
  var GIAY_MOI_CANH = 12;

  /* ---------- Kho gốc ESL ---------- */
  var TRANG_GOC = "https://esl.trangphan.org/";
  var KHO_GOC_CSV = "https://esl.trangphan.org/data/games.csv";
  // Hoạt động gốc đã có bản chuyển thể trong du-lieu.js: không lặp lại
  var GOC_DA_CHUYEN = {
    "find-someone-who": 1, "running-dictation": 1, "hot-seat": 1, "letter-hunters": 1, "phonics-bowling": 1,
    "go-shopping": 1, "sentence-scramble": 1, "simon-says": 1, "story-chain": 1, "fresh-spring-rolls": 1
  };
  var KN_ESL = { "listening-speaking": "nghe-noi", "vocab-grammar": "tu-vung", "reading": "doc", "writing": "viet", "integrated": "tich-hop" };
  var CANH_ESL = { mingle: "di-lai", relay: "tiep-suc", hotseat: "ghe-nong", floor: "san-lop", bowling: "bowling", table: "ban", board: "doi-bang", pairs: "ban" };
  var CAP_ESL = { beginner: [1, 2], intermediate: [3, 4], advanced: [5, 6] };
  var khoGoc = "dang-tai"; // "dang-tai" | "xong" | "loi"

  /* ---------- Chữ VI/EN ---------- */
  var KN = {
    "nghe-noi": { vi: "Nghe – Nói", en: "Listening – Speaking" },
    "doc": { vi: "Đọc", en: "Reading" },
    "viet": { vi: "Viết", en: "Writing" },
    "tu-vung": { vi: "Từ vựng – Ngữ pháp", en: "Vocabulary – Grammar" },
    "tich-hop": { vi: "Hoạt động tích hợp", en: "Integrated activity" }
  };
  var DT = {
    "5-8": { vi: "Trẻ 5–8 tuổi", en: "Children 5–8" },
    "9-14": { vi: "Trẻ 9–14 tuổi", en: "Children 9–14" },
    "nguoi-lon": { vi: "Người lớn", en: "Adults" }
  };
  var CHU = {
    vi: {
      matDay: "Dành cho giáo viên",
      tvTieuDe: "Thư viện hoạt động",
      tvMoTa: "Lọc theo nhu cầu tiết dạy. Các hoạt động đã chuyển thể có video 2D, giáo án và đối chiếu Khung năng lực tiếng Việt 6 bậc; các hoạt động trong kho gốc có các bước, chuẩn bị, giá trị sư phạm và pro-tip.",
      ghiChu: "Dành cho thầy cô dạy tiếng Việt tại lớp học trực tiếp, cho trẻ em gốc Việt và người học nước ngoài. Toàn bộ hoạt động lấy từ thư viện ",
      ghiChuTen: "Khơi nguồn sáng tạo hoạt động ESL",
      ghiChuSau: " của cô Phan Thị Quỳnh Trang.",
      tabMoi: "(mở tab mới)",
      tim: "Tìm theo tên", timGoiY: "Ví dụ: chính tả, đi chợ…",
      kyNang: "Kỹ năng", bac: "Bậc (Khung 6 bậc)", doiTuong: "Đối tượng", thoiLuong: "Thời lượng", siSo: "Sĩ số", thietBi: "Thiết bị",
      tatCa: "Tất cả",
      tlNgan: "≤ 15 phút", tlVua: "16–30 phút", tlDai: "> 30 phút",
      ssNho: "Nhóm nhỏ (≤ 10)", ssDong: "Lớp đông (20+)",
      tbKhong: "Không cần thiết bị", tbCo: "Cần thiết bị",
      bacSo: "Bậc ",
      dem: function (n, t) { return "Hiển thị " + n + " / " + t + " hoạt động"; },
      xoaLoc: "Xoá bộ lọc",
      trong: "Chưa có hoạt động phù hợp. Thầy cô thử bỏ bớt một bộ lọc nhé.",
      phut: "phút", hocVien: "học viên",
      soCap: "Sơ cấp", trungCap: "Trung cấp", caoCap: "Cao cấp",
      ve: "Thư viện",
      tsBac: "Bậc", tsThoiLuong: "Thời lượng", tsSiSo: "Sĩ số", tsDoiTuong: "Đối tượng", tsChuanBi: "Chuẩn bị",
      minhHoa: "Hình minh hoạ 2D · ",
      mucLuc: "Trong trang này",
      mKhung: "Khung năng lực", mGiaTri: "Giá trị sư phạm", mVideo: "Video hướng dẫn 2D", mGiaoAn: "Giáo án", mMeo: "Pro-tip",
      khungTieuDe: "Đối chiếu Khung năng lực tiếng Việt",
      khungNguon: "Khung năng lực tiếng Việt dùng cho người nước ngoài (6 bậc) · Thông tư 17/2015/TT-BGDĐT",
      dungKem: "Dùng kèm trong Trường Tiếng Việt Của Em",
      mienTru: "Mô tả năng lực ở trên được diễn giải ngắn gọn theo Khung, không trích nguyên văn. Hoạt động được thiết kế phù hợp với các bậc này; đây không phải xác nhận chính thức của Bộ Giáo dục và Đào tạo.",
      giaTriPhu: "The why",
      canh: function (i, n) { return "Cảnh " + i + "/" + n; },
      phat: "Phát video", dung: "Tạm dừng", lai: "Xem lại từ đầu",
      phuDeBat: "Phụ đề: Bật", phuDeTat: "Phụ đề: Tắt",
      denCanh: "Đến cảnh ",
      videoGhi: "Video 2D chạy cảnh và phụ đề tiếng Việt. Các bước đánh số bên dưới là lời của video; chạm vào một bước để xem cảnh đó. Giọng đọc chuẩn của trường sẽ được thêm sau.",
      videoGhiCoAm: "Video 2D có giọng đọc chuẩn của trường và phụ đề tiếng Việt. Các bước đánh số bên dưới là lời của video.",
      buoc: "Bước ",
      mucTieu: "Mục tiêu bài học", tieuChi: "Tiêu chí thành công",
      khoiDong: "Khởi động", chinh: "Hoạt động chính", cungCo: "Củng cố",
      phanHoa: "Phân hoá", moi: "Người mới học", kha: "Người học khá, học viên gốc Việt nói tốt",
      danhGia: "Đánh giá", dgVi: "Đánh giá vì học tập", dgLa: "Đánh giá là học tập", dgKq: "Đánh giá kết quả học tập",
      taiLieu: "Tài liệu cần chuẩn bị",
      meoNhan: "Pro-tip", meoAi: "— Phan Thị Quỳnh Trang",
      truoc: "← Hoạt động trước", sau: "Hoạt động sau →",
      ghiEn: "",
      // Tác giả
      tgMatDay: "Tác giả kho hoạt động",
      tgTen: "Cô Phan Thị Quỳnh Trang",
      tgVai: "Nguyên chuyên gia sản xuất tài nguyên tiếng Việt của Nhà xuất bản số Twinkl (Vương quốc Anh)",
      tgMoTa: "Hơn 10 năm giảng dạy ngoại ngữ và đào tạo giáo viên ở Việt Nam và Canada. Cô bắt đầu khoá đào tạo TESOL tại Educap từ năm 2015, sau đó cùng Educap – Australian International TESOL đào tạo giáo viên, đưa kinh nghiệm lớp học vào công nghệ giáo dục và xuất bản (FLYER, Twinkl, ClassIn), và từ năm 2023 tập trung kết nối giáo dục giữa Canada và Việt Nam. Kho hoạt động này gom lại những gì cô đã soạn, đã thử và đã chỉnh trên lớp thật.",
      tgSo: [
        ["13.000+", "lượt tải tài nguyên giảng dạy của cô trên Twinkl"],
        ["10+ năm", "giảng dạy ngoại ngữ và đào tạo giáo viên"],
        ["90", "hoạt động lớp học cô đã soạn và thử trên lớp"],
        ["Từ 2016", "đào tạo giáo viên cùng Educap – Australian International TESOL"]
      ],
      tgMocTieuDe: "Chặng đường nghề",
      tgMoc: [
        ["2016–2020", "Đào tạo giáo viên tại Educap – Australian International TESOL"],
        ["2019–2022", "Đưa kinh nghiệm lớp học vào công nghệ giáo dục và xuất bản: FLYER, Twinkl, ClassIn"],
        ["2021–2022", "Twinkl Vietnam: sản xuất tài nguyên tiếng Việt; Twinkl Ambassadors kết nối giáo viên, phụ huynh qua hội thảo, webinar"],
        ["2021", "Sáng lập Mentoring Program for Professional Development of Educators"],
        ["2023", "Thạc sĩ TESOL, Horizons University (Pháp)"],
        ["2024", "Đồng tác giả chương sách về mentoring trực tuyến cho giáo viên ESL (IGI Global)"]
      ],
      tgHoSo: "Hồ sơ đầy đủ của cô",
      // Lý do
      ldTieuDe: "Vì sao có kho hoạt động này?",
      ldMoTa: "Ở Trường Tiếng Việt Của Em, các bạn đã có bài học và trò chơi trên web để tự học ở nhà. Vì vậy, giờ học trực tiếp quý nhất cho những việc màn hình không làm thay được. Kho hoạt động giúp thầy cô biến mỗi buổi lên lớp thành một buổi tương tác.",
      ldY: [
        ["Lên lớp là để nói và làm cùng nhau", "Hỏi – đáp với bạn, vận động, làm việc nhóm, nghe cô và bạn nói thật: đây là phần người học khó có khi học một mình."],
        ["Mỗi bạn được nói nhiều hơn", "Hoạt động chia lớp thành cặp, nhóm, đội chơi, nên trong vài phút mỗi bạn nói được nhiều lần thay vì ngồi chờ đến lượt."],
        ["Một lớp, nhiều trình độ", "Lớp tiếng Việt thường có cả bạn gốc Việt nói khá lẫn bạn bắt đầu từ số 0. Mỗi hoạt động đều nâng, hạ được độ khó."],
        ["Chuẩn bị đơn giản", "Thẻ giấy, bảng và đồ vật quanh lớp là đủ cho phần lớn hoạt động. Thầy cô lọc theo thời lượng, sĩ số và thiết bị của lớp mình."]
      ],
      ldCach: "Thư viện có hai phần: các hoạt động đã chuyển thể sẵn cho lớp tiếng Việt (video 2D, giáo án, đối chiếu Khung năng lực 6 bậc) và toàn bộ kho gốc của cô (các bước, chuẩn bị, giá trị sư phạm, pro-tip bằng tiếng Việt).",
      // Kho gốc
      nguon: "Nguồn", ngChuyen: "Đã chuyển thể cho lớp tiếng Việt", ngGoc: "Kho gốc",
      nhanChuyen: "Đã chuyển thể · video 2D, giáo án", nhanGoc: "Kho gốc · cô Quỳnh Trang",
      demTai: " · đang tải kho gốc…",
      demLoi: " · chưa tải được kho gốc, thầy cô xem tại trang gốc",
      demThem: function (k) { return " · " + k + " hoạt động đã chuyển thể có video 2D và giáo án"; },
      ctGoc: "Kho gốc",
      gocGhi: "Hoạt động này thuộc kho gốc, soạn cho lớp ngoại ngữ (ESL). Khi dùng cho lớp tiếng Việt, thầy cô giữ cách tổ chức và thay từ, mẫu câu tiếng Anh bằng tiếng Việt cùng chủ đề.",
      gocXem: "Xem bản gốc: giáo án đầy đủ, góc nhìn Canada – Việt Nam",
      gocBuoc: "Các bước tổ chức",
      tsTrinhDo: "Trình độ"
    },
    en: {
      matDay: "For teachers",
      tvTieuDe: "Activity library",
      tvMoTa: "Filter by what your lesson needs. Adapted activities include a 2D video, a lesson plan and links to the 6-level Vietnamese proficiency framework; original-library activities include steps, preparation, rationale and a pro-tip.",
      ghiChu: "For teachers of Vietnamese in in-person classes, for heritage and non-Vietnamese learners. All activities come from ",
      ghiChuTen: "Khơi nguồn sáng tạo hoạt động ESL",
      ghiChuSau: ", Phan Thị Quỳnh Trang's ESL activity library.",
      tabMoi: "(opens in a new tab)",
      tim: "Search by name", timGoiY: "e.g. dictation, market…",
      kyNang: "Skill", bac: "Level (6-level framework)", doiTuong: "Learners", thoiLuong: "Duration", siSo: "Class size", thietBi: "Equipment",
      tatCa: "All",
      tlNgan: "≤ 15 min", tlVua: "16–30 min", tlDai: "> 30 min",
      ssNho: "Small group (≤ 10)", ssDong: "Large class (20+)",
      tbKhong: "No equipment", tbCo: "Needs equipment",
      bacSo: "Level ",
      dem: function (n, t) { return "Showing " + n + " / " + t + " activities"; },
      xoaLoc: "Clear filters",
      trong: "No matching activities. Try removing a filter.",
      phut: "min", hocVien: "learners",
      soCap: "Elementary", trungCap: "Intermediate", caoCap: "Advanced",
      ve: "Library",
      tsBac: "Level", tsThoiLuong: "Duration", tsSiSo: "Class size", tsDoiTuong: "Learners", tsChuanBi: "Preparation",
      minhHoa: "2D illustration · ",
      mucLuc: "On this page",
      mKhung: "Framework", mGiaTri: "Why it works", mVideo: "2D video guide", mGiaoAn: "Lesson plan", mMeo: "Pro-tip",
      khungTieuDe: "Vietnamese Proficiency Framework alignment",
      khungNguon: "Vietnamese Language Proficiency Framework for Foreigners (6 levels) · Circular 17/2015/TT-BGDĐT",
      dungKem: "Use with Trường Tiếng Việt Của Em",
      mienTru: "Descriptors are short paraphrases of the framework, not quotations. Activities are designed to suit these levels; this is not an official endorsement by Vietnam's Ministry of Education and Training.",
      giaTriPhu: "The why",
      canh: function (i, n) { return "Scene " + i + "/" + n; },
      phat: "Play video", dung: "Pause", lai: "Restart",
      phuDeBat: "Subtitles: On", phuDeTat: "Subtitles: Off",
      denCanh: "Go to scene ",
      videoGhi: "The 2D video plays scenes with Vietnamese subtitles. The numbered steps below are its script; tap a step to see that scene. The school's narration will be added later.",
      videoGhiCoAm: "The 2D video has the school's narration and Vietnamese subtitles. The numbered steps below are its script.",
      buoc: "Step ",
      mucTieu: "Learning goals", tieuChi: "Success criteria",
      khoiDong: "Warm-up", chinh: "Main activity", cungCo: "Wrap-up",
      phanHoa: "Differentiation", moi: "New learners", kha: "Stronger learners and fluent heritage speakers",
      danhGia: "Assessment", dgVi: "Assessment for learning", dgLa: "Assessment as learning", dgKq: "Assessment of learning",
      taiLieu: "Materials to prepare",
      meoNhan: "Pro-tip", meoAi: "— Phan Thị Quỳnh Trang",
      truoc: "← Previous activity", sau: "Next activity →",
      ghiEn: "Activity details are written in Vietnamese, for teachers of Vietnamese.",
      tgMatDay: "About the author",
      tgTen: "Phan Thị Quỳnh Trang",
      tgVai: "Former Vietnamese-language resource specialist, Twinkl digital educational publishing (United Kingdom)",
      tgMoTa: "More than 10 years of language teaching and teacher training in Vietnam and Canada. She began her TESOL training at Educap in 2015, went on to train teachers with Educap – Australian International TESOL, brought classroom practice into EdTech and publishing (FLYER, Twinkl, ClassIn), and since 2023 has focused on connecting education between Canada and Vietnam. This library gathers the activities she wrote, tried and refined in real classrooms.",
      tgSo: [
        ["13,000+", "downloads of her teaching resources on Twinkl"],
        ["10+ years", "of language teaching and teacher training"],
        ["90", "classroom activities written and tested in class"],
        ["Since 2016", "training teachers with Educap – Australian International TESOL"]
      ],
      tgMocTieuDe: "Career path",
      tgMoc: [
        ["2016–2020", "Teacher trainer, Educap – Australian International TESOL"],
        ["2019–2022", "Brings classroom practice into EdTech and publishing: FLYER, Twinkl, ClassIn"],
        ["2021–2022", "Twinkl Vietnam: Vietnamese-language resources; Twinkl Ambassadors workshops and webinars for teachers and parents"],
        ["2021", "Founds the Mentoring Program for Professional Development of Educators"],
        ["2023", "MA in TESOL, Horizons University (France)"],
        ["2024", "Co-author of a book chapter on virtual mentoring for ESL teachers (IGI Global)"]
      ],
      tgHoSo: "Her full profile",
      ldTieuDe: "Why this activity library?",
      ldMoTa: "At Trường Tiếng Việt Của Em, learners already have web lessons and games for self-study at home. In-person class time is therefore best spent on what a screen cannot do. This library helps teachers make every class interactive.",
      ldY: [
        ["Class time is for talking and doing together", "Asking a partner, moving, group work and hearing real speech are hard to get when learning alone."],
        ["More speaking time for every learner", "Pairs, groups and teams mean each learner speaks many times in a few minutes instead of waiting for a turn."],
        ["One class, many levels", "Vietnamese classes often mix fluent heritage speakers with complete beginners. Every activity can be made easier or harder."],
        ["Simple preparation", "Paper cards, a board and classroom objects are enough for most activities. Filter by duration, class size and equipment."]
      ],
      ldCach: "The library has two parts: activities already adapted for Vietnamese classes (2D video, lesson plan, 6-level framework links) and her complete original library (steps, preparation, rationale and pro-tips in Vietnamese).",
      nguon: "Source", ngChuyen: "Adapted for Vietnamese classes", ngGoc: "Original library",
      nhanChuyen: "Adapted · 2D video, lesson plan", nhanGoc: "Original library",
      demTai: " · loading the original library…",
      demLoi: " · the original library could not load; see the original site",
      demThem: function (k) { return " · " + k + " adapted with 2D video and lesson plan"; },
      ctGoc: "Original library",
      gocGhi: "This activity comes from the original library, written for ESL classes. For a Vietnamese class, keep the format and replace the English words and sentence patterns with Vietnamese ones on the same topic.",
      gocXem: "See the original: full lesson plan, Canada – Vietnam perspective",
      gocBuoc: "Steps",
      tsTrinhDo: "Level"
    }
  };

  function nn() { return (window.CONG && typeof window.CONG.ngonNgu === "function") ? window.CONG.ngonNgu() : "vi"; }
  function c() { return CHU[nn()] || CHU.vi; }
  function anh(ten) {
    if (window.CONG && typeof window.CONG.anhBoMau === "function") return window.CONG.anhBoMau(ten);
    return "https://mau.cvcec.org/assets/" + ten;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (k) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[k];
    });
  }
  function boDau(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().normalize("NFC");
  }
  function khoang(a, don) { return (a[0] === a[1] ? a[0] : a[0] + "–" + a[1]) + (don ? " " + don : ""); }
  function chuBac(bac) {
    var lo = Math.min.apply(null, bac), hi = Math.max.apply(null, bac);
    return c().bacSo + (lo === hi ? lo : lo + "–" + hi);
  }
  function chuCap(bac) {
    var cc = c(), cap = [];
    function them(x) { if (cap.indexOf(x) < 0) cap.push(x); }
    bac.forEach(function (b) { them(b <= 2 ? cc.soCap : b <= 4 ? cc.trungCap : cc.caoCap); });
    return cap.join(" – ");
  }
  function chuDoiTuong(ds) { return ds.map(function (k) { return DT[k] ? DT[k][nn()] : k; }).join(", "); }
  function tenChinh(hd) { return nn() === "en" ? hd.ten_en : hd.ten; }
  function tenPhu(hd) { return nn() === "en" ? hd.ten : hd.ten_en; }
  function timHd(slug) { for (var i = 0; i < DS.length; i++) if (DS[i].slug === slug) return DS[i]; return null; }

  /* ---------- Cảnh minh hoạ 2D (SVG 640×360) ---------- */
  var BO_CUC = {
    "di-lai": {
      be: [[232, 302, 1, "giay"], [288, 306, 2, "giay"], [392, 302, 3, "giay"], [448, 306, 4, "giay"], [566, 302, 5, "giay"]],
      loi: [[236, 214], [262, 172], [470, 214], [512, 172]]
    },
    "tiep-suc": { be: [[312, 304, 2, "chay"], [478, 300, 3], [548, 302, 5]], loi: [[320, 212], [526, 212]] },
    "ghe-nong": { be: [[214, 304, 1], [260, 308, 4], [320, 298, 3], [430, 304, 2], [478, 308, 5], [526, 304, 1]], loi: [[250, 214], [490, 196], [320, 168]] },
    "san-lop": { be: [[250, 292, 1, "chi"], [352, 296, 3], [452, 292, 2, "chi"], [560, 296, 4]], loi: [[300, 206], [492, 186]] },
    "bowling": { be: [[226, 304, 3], [276, 308, 4], [334, 304, 1, "nem"]], loi: [[290, 214], [560, 200]] },
    "ban": { be: [[272, 290, 1], [352, 286, 3], [440, 290, 2], [520, 286, 4]], loi: [[300, 202], [476, 158]] },
    "doi-bang": { be: [[226, 300, 1, "bang"], [306, 304, 2, "bang"], [396, 300, 3, "bang"], [476, 304, 4, "bang"], [556, 300, 5, "bang"]], loi: [[262, 196], [470, 178]] },
    "cho": { be: [[290, 248, 2], [526, 248, 3], [250, 320, 4, "lung"], [486, 320, 1, "lung"]], loi: [[262, 184], [520, 150]] }
  };

  function cat(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function coChu(len, rong, toiDa, heSo) { return Math.max(10, Math.min(toiDa, rong / Math.max(1, len * heSo))).toFixed(1); }

  function veBe(x, y, ao, kieu, s) {
    s = s || 1;
    var t = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="be">';
    t += '<rect class="quan" x="-10" y="-24" width="8" height="24" rx="4"/><rect class="quan" x="2" y="-24" width="8" height="24" rx="4"/>';
    // tay
    if (kieu === "chi" || kieu === "nem") t += '<rect class="ao-' + ao + '" x="8" y="-50" width="24" height="9" rx="4.5" transform="rotate(-28 8 -46)"/>';
    else if (kieu === "chay") t += '<rect class="ao-' + ao + '" x="8" y="-50" width="20" height="9" rx="4.5" transform="rotate(30 8 -46)"/><rect class="ao-' + ao + '" x="-28" y="-50" width="20" height="9" rx="4.5" transform="rotate(-30 -8 -46)"/>';
    else t += '<rect class="ao-' + ao + '" x="-19" y="-50" width="9" height="24" rx="4.5"/><rect class="ao-' + ao + '" x="10" y="-50" width="9" height="24" rx="4.5"/>';
    t += '<rect class="ao-' + ao + '" x="-14" y="-54" width="28" height="34" rx="11"/>';
    t += '<circle class="da" cx="0" cy="-68" r="15"/>';
    if (kieu === "lung") {
      t += '<circle class="toc" cx="0" cy="-69" r="15"/>';
    } else {
      t += '<path class="toc" d="M-15 -70 a15 15 0 0 1 30 0 q-7 -6 -15 -5 q-8 -1 -15 5z"/>';
      t += '<circle class="mat" cx="-5" cy="-68" r="2"/><circle class="mat" cx="5" cy="-68" r="2"/>';
      t += '<path d="M-5 -61 q5 4 10 0" fill="none" stroke="currentColor" class="mieng" stroke-width="2" stroke-linecap="round"/>';
    }
    if (kieu === "giay") t += '<rect class="giay" x="6" y="-46" width="20" height="24" rx="2"/><path class="dong-ke" d="M10 -38 h12 M10 -32 h12 M10 -26 h8"/>';
    if (kieu === "nem") t += '<circle class="bong" cx="36" cy="-62" r="8"/>';
    t += "</g></g>";
    return t;
  }

  function veBong(x, y, chu, coc) {
    chu = cat(chu, 34);
    var fs = coc ? 17 : 15;
    var w = Math.min(330, 22 + chu.length * fs * 0.5), h = fs + 14;
    var x0 = Math.max(4, Math.min(636 - w, x - w / 2));
    var tx = Math.max(x0 + 14, Math.min(x0 + w - 14, x));
    return '<g><rect class="bong-thoai" x="' + x0.toFixed(1) + '" y="' + (y - h - 8) + '" width="' + w.toFixed(1) + '" height="' + h + '" rx="' + (h / 2) + '"/>' +
      '<path class="bong-thoai" d="M' + (tx - 6) + ' ' + (y - 9) + ' L' + tx + ' ' + y + ' L' + (tx + 6) + ' ' + (y - 9) + '"/>' +
      '<rect x="' + (tx - 7) + '" y="' + (y - 11) + '" width="14" height="3" fill="var(--ttv-the)"/>' +
      '<text class="chu-thoai" x="' + (x0 + w / 2).toFixed(1) + '" y="' + (y - 8 - h / 2 + fs * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + fs + '">' + esc(chu) + "</text></g>";
  }

  function veTheChu(x, y, chu, fs) {
    fs = fs || 18;
    var w = Math.max(34, 18 + String(chu).length * fs * 0.56);
    return '<rect class="the-chu" x="' + (x - w / 2).toFixed(1) + '" y="' + (y - fs - 6) + '" width="' + w.toFixed(1) + '" height="' + (fs + 14) + '" rx="8"/>' +
      '<text class="chu-the" x="' + x + '" y="' + (y + 2) + '" text-anchor="middle" font-size="' + fs + '">' + esc(chu) + "</text>";
  }

  function veDoVat(kieu, mh) {
    var the = (mh && mh.the) || [], s = "";
    if (kieu === "tiep-suc") {
      s += '<rect class="giay" x="186" y="128" width="78" height="104" rx="4"/>';
      s += '<text x="225" y="148" text-anchor="middle" font-size="11" font-weight="800">' + esc(cat(mh.tuong || "", 12)) + "</text>";
      for (var d = 0; d < 6; d++) s += '<path class="dong-ke" d="M196 ' + (160 + d * 11) + " h" + (d % 3 === 2 ? 40 : 58) + '"/>';
      s += '<path class="net-chay" d="M268 262 h-22 M272 278 h-30 M268 294 h-18"/>';
      s += '<rect class="ban-mat" x="440" y="262" width="150" height="14" rx="5"/><rect class="ban-chan" x="452" y="276" width="10" height="40"/><rect class="ban-chan" x="568" y="276" width="10" height="40"/>';
      s += '<rect class="giay" x="492" y="252" width="40" height="12" rx="2"/>';
      if (the[0]) s += '<rect class="o-diem" x="462" y="132" width="168" height="32" rx="16"/><text x="546" y="153" text-anchor="middle" font-size="14" font-weight="800">' + esc(cat(the[0], 24)) + "</text>";
    } else if (kieu === "ghe-nong") {
      s += '<rect class="ghe" x="300" y="262" width="40" height="8" rx="3"/><rect class="ghe" x="304" y="270" width="6" height="40"/><rect class="ghe" x="330" y="270" width="6" height="40"/><rect class="ghe" x="302" y="214" width="36" height="50" rx="8"/>';
      if (mh.diem) s += '<rect class="o-diem" x="462" y="24" width="160" height="40" rx="12"/><text x="542" y="50" text-anchor="middle" font-size="15" font-weight="800">' + esc(mh.diem) + "</text>";
      if (mh.dong_ho) s += '<circle class="dong-ho" cx="476" cy="98" r="20"/><path class="kim" d="M476 98 v-12 M476 98 l9 5"/><text x="512" y="104" font-size="16" font-weight="800">' + esc(mh.dong_ho) + "</text>";
    } else if (kieu === "san-lop") {
      the.slice(0, 6).forEach(function (t, i) { s += veTheChu(232 + i * 72 + (i % 2) * 10, 336 - (i % 2) * 12, t, 18); });
    } else if (kieu === "bowling") {
      var ki = [[560, 300], [590, 300], [620, 300], [575, 276], [605, 276], [590, 252]];
      ki.forEach(function (p, i) {
        s += '<path class="ki" d="M' + (p[0] - 7) + " " + p[1] + " q-3 -14 2 -22 q-3 -6 5 -10 q8 4 5 10 q5 8 2 22 z\"/><rect class=\"ki-soc\" x=\"" + (p[0] - 6) + '" y="' + (p[1] - 22) + '" width="12" height="3"/>';
      });
      s += '<circle class="bong" cx="444" cy="314" r="12"/><path class="net-chay" d="M420 314 h-18 M424 304 h-12"/>';
      if (the.length) s += '<rect class="o-diem" x="462" y="18" width="170" height="' + (22 + Math.ceil(Math.min(6, the.length) / 3) * 26) + '" rx="12"/>' +
        the.slice(0, 6).map(function (t, i) { return '<text x="' + (494 + (i % 3) * 54) + '" y="' + (44 + Math.floor(i / 3) * 26) + '" text-anchor="middle" font-size="17" font-weight="800">' + esc(t) + "</text>"; }).join("");
    } else if (kieu === "cho") {
      [[222, the[0]], [458, the[1]]].forEach(function (q) {
        var x = q[0];
        s += '<path class="mai-sap" d="M' + (x - 6) + " 190 h160 l-14 -26 h-132 z\"/>";
        s += '<rect class="ban-chan" x="' + x + '" y="190" width="6" height="70"/><rect class="ban-chan" x="' + (x + 142) + '" y="190" width="6" height="70"/>';
        s += '<rect class="sap" x="' + (x - 4) + '" y="252" width="156" height="58" rx="6"/>';
        s += '<circle class="qua-cam" cx="' + (x + 30) + '" cy="246" r="11"/><circle class="qua-cam" cx="' + (x + 52) + '" cy="248" r="10"/><circle class="qua-xanh" cx="' + (x + 100) + '" cy="247" r="11"/><circle class="qua-xanh" cx="' + (x + 120) + '" cy="248" r="9"/>';
        if (q[1]) s += veTheChu(x + 118, 290, q[1], 16);
      });
    }
    return s;
  }

  function veBanTruoc(kieu, mh) {
    if (kieu !== "ban") return "";
    var the = (mh && mh.the) || [];
    var Y = 290;
    var s = '<rect class="ban-mat" x="232" y="' + Y + '" width="340" height="18" rx="6"/><rect class="ban-chan" x="250" y="' + (Y + 18) + '" width="12" height="44"/><rect class="ban-chan" x="542" y="' + (Y + 18) + '" width="12" height="44"/>';
    var n = Math.min(5, the.length);
    for (var i = 0; i < n; i++) {
      var fs = coChu(String(the[i]).length, 58, 16, 0.6);
      var x = 262 + i * (280 / Math.max(1, n - 1 || 1)) + (n === 1 ? 140 : 0);
      if (n > 1) x = 266 + i * (272 / (n - 1));
      var g = (i % 2) ? 4 : -4;
      s += '<g transform="rotate(' + g + " " + x + " " + (Y - 11) + ')"><rect class="the-chu" x="' + (x - 30) + '" y="' + (Y - 26) + '" width="60" height="28" rx="6"/>' +
        '<text class="chu-the" x="' + x + '" y="' + (Y - 7) + '" text-anchor="middle" font-size="' + fs + '">' + esc(the[i]) + "</text></g>";
    }
    return s;
  }

  // o: { bang, phu, loi[], the[], video:true }
  function veCanh(hd, o) {
    o = o || {};
    var mh = hd.minh_hoa || {};
    var kieu = BO_CUC[hd.canh] ? hd.canh : "di-lai";
    var bc = BO_CUC[kieu];
    var bang = o.bang != null ? o.bang : (mh.bang || hd.ten);
    var phu = o.phu != null ? o.phu : (mh.phu || "");
    var loi = o.loi || mh.loi || [];
    var s = '<svg class="hd-canh" viewBox="0 0 640 360" role="img" aria-label="' + esc(c().minhHoa + hd.ten) + '" focusable="false">';
    s += '<rect class="tuong" x="0" y="0" width="640" height="252"/><rect class="san" x="0" y="252" width="640" height="108"/><rect class="chan-tuong" x="0" y="244" width="640" height="10"/>';
    s += '<rect class="khung-go" x="188" y="14" width="264" height="104" rx="12"/><rect class="bang" x="197" y="23" width="246" height="86" rx="6"/>';
    s += '<text class="chu-bang hd-bang-chu" x="320" y="62" text-anchor="middle" font-size="' + coChu(String(bang).length, 226, 26, 0.56) + '">' + esc(bang) + "</text>";
    s += '<text class="chu-bang-phu hd-bang-phu" x="320" y="92" text-anchor="middle" font-size="' + coChu(String(phu).length, 230, 14, 0.52) + '">' + esc(phu) + "</text>";
    s += veDoVat(kieu, mh);
    s += '<g class="hd-be-nhom">';
    bc.be.forEach(function (b) {
      var k = b[3];
      if (kieu === "doi-bang") k = "giay";
      s += veBe(b[0], b[1], b[2], k, 1);
    });
    if (kieu === "doi-bang") {
      (mh.the || []).slice(0, bc.be.length).forEach(function (t, i) {
        var b = bc.be[i];
        s += '<rect class="giay" x="' + (b[0] - 26) + '" y="' + (b[1] - 58) + '" width="52" height="30" rx="5"/><text class="chu-the" x="' + b[0] + '" y="' + (b[1] - 37) + '" text-anchor="middle" font-size="' + coChu(String(t).length, 46, 15, 0.58) + '">' + esc(t) + "</text>";
      });
    }
    s += "</g>";
    s += veBanTruoc(kieu, mh);
    s += '<image href="' + esc(anh("trau-pointing.png")) + '" x="0" y="150" width="190" height="200" preserveAspectRatio="xMidYMax meet"/>';
    s += '<g class="hd-loi">' + veLoi(kieu, loi, !o.video) + "</g>";
    s += "</svg>";
    return s;
  }

  function veLoi(kieu, loi, coc) {
    var bc = BO_CUC[kieu] || BO_CUC["di-lai"];
    var s = "";
    for (var i = 0; i < loi.length && i < bc.loi.length; i++) s += veBong(bc.loi[i][0], bc.loi[i][1], loi[i], coc);
    return s;
  }

  function loiTuBuoc(noiDung) {
    var ra = [], m, re = /"([^"]{5,80})"/g;
    while ((m = re.exec(noiDung)) && ra.length < 2) if (ra.indexOf(m[1]) < 0) ra.push(m[1]);
    return ra;
  }

  /* ---------- Thư viện ---------- */
  var loc = { tim: "", ng: "", kn: "", bac: "", dt: "", tl: "", ss: "", tb: "" };
  var tv = document.getElementById("hd-tv");
  var ct = document.getElementById("hd-ct");
  var phanTV = document.getElementById("thu-vien");
  var phanCT = document.getElementById("chi-tiet");

  function luaChon(ten, khoa, ds) {
    var id = "hd-loc-" + khoa;
    var h = '<div><label for="' + id + '">' + esc(ten) + '</label><select id="' + id + '" data-loc="' + khoa + '"><option value="">' + esc(c().tatCa) + "</option>";
    ds.forEach(function (o) { h += '<option value="' + esc(o[0]) + '"' + (loc[khoa] === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; });
    return h + "</select></div>";
  }

  function dungThuVien() {
    var cc = c();
    var bacCo = [];
    DS.forEach(function (hd) { hd.bac.forEach(function (b) { if (bacCo.indexOf(b) < 0) bacCo.push(b); }); });
    bacCo.sort();
    var h = '<div class="hd-dau"><p class="hd-mat-day">' + esc(cc.matDay) + '</p><h2 id="hd-tv-tieu-de">' + esc(cc.tvTieuDe) + "</h2><p>" + esc(cc.tvMoTa) + "</p>";
    h += '<p class="hd-ghi-chu"><img src="' + esc(anh("trau-reading.png")) + '" width="283" height="334" alt=""><span>' + esc(cc.ghiChu) +
      '<a href="https://esl.trangphan.org/" target="_blank" rel="noopener">' + esc(cc.ghiChuTen) + '<span class="cong-an"> ' + esc(cc.tabMoi) + "</span></a>" + esc(cc.ghiChuSau) + "</span></p></div>";
    h += '<form class="hd-loc" role="search" onsubmit="return false">';
    h += '<div class="hd-loc-tim"><div><label for="hd-loc-tim">' + esc(cc.tim) + '</label><input id="hd-loc-tim" type="search" autocomplete="off" placeholder="' + esc(cc.timGoiY) + '" value="' + esc(loc.tim) + '"></div>';
    h += luaChon(cc.nguon, "ng", [["chuyen-the", cc.ngChuyen], ["goc", cc.ngGoc]]) + "</div>";
    h += '<div class="hd-loc-luoi">';
    h += luaChon(cc.kyNang, "kn", Object.keys(KN).map(function (k) { return [k, KN[k][nn()]]; }));
    h += luaChon(cc.bac, "bac", bacCo.map(function (b) { return [String(b), cc.bacSo + b]; }));
    h += luaChon(cc.doiTuong, "dt", Object.keys(DT).map(function (k) { return [k, DT[k][nn()]]; }));
    h += luaChon(cc.thoiLuong, "tl", [["ngan", cc.tlNgan], ["vua", cc.tlVua], ["dai", cc.tlDai]]);
    h += luaChon(cc.siSo, "ss", [["nho", cc.ssNho], ["dong", cc.ssDong]]);
    h += luaChon(cc.thietBi, "tb", [["khong", cc.tbKhong], ["co", cc.tbCo]]);
    h += "</div></form>";
    h += '<div class="hd-dem"><p id="hd-dem" role="status" aria-live="polite" style="margin:0"></p><button type="button" class="ttv-nut-phu" id="hd-xoa-loc">' + esc(cc.xoaLoc) + "</button></div>";
    h += '<ul class="hd-luoi" id="hd-luoi"></ul>';
    tv.innerHTML = h;

    tv.querySelector("#hd-loc-tim").addEventListener("input", function (e) { loc.tim = e.target.value; locLai(); });
    Array.prototype.forEach.call(tv.querySelectorAll("select[data-loc]"), function (sel) {
      sel.addEventListener("change", function () { loc[sel.getAttribute("data-loc")] = sel.value; locLai(); });
    });
    tv.querySelector("#hd-xoa-loc").addEventListener("click", function () {
      for (var k in loc) loc[k] = "";
      dungThuVien();
    });
    locLai();
  }

  function hopLoc(hd) {
    if (loc.tim) {
      var q = boDau(loc.tim.trim());
      if (q && boDau(hd.ten + " " + hd.ten_en + " " + hd.ma).indexOf(q) < 0) return false;
    }
    if (loc.ng === "goc" && !hd.goc) return false;
    if (loc.ng === "chuyen-the" && hd.goc) return false;
    if (loc.kn && hd.ky_nang.indexOf(loc.kn) < 0) return false;
    if (loc.bac && hd.bac.indexOf(Number(loc.bac)) < 0) return false;
    if (loc.dt && hd.doi_tuong.indexOf(loc.dt) < 0) return false;
    if (loc.tl === "ngan" && !(hd.thoi_luong[1] <= 15)) return false;
    if (loc.tl === "vua" && !(hd.thoi_luong[0] <= 30 && hd.thoi_luong[1] >= 16)) return false;
    if (loc.tl === "dai" && !(hd.thoi_luong[1] > 30)) return false;
    if (loc.ss === "nho" && !(hd.si_so[0] <= 10)) return false;
    if (loc.ss === "dong" && !(hd.si_so[1] >= 20)) return false;
    if (loc.tb === "khong" && hd.thiet_bi) return false;
    if (loc.tb === "co" && !hd.thiet_bi) return false;
    return true;
  }

  function nhanKyNang(hd) {
    return hd.ky_nang.map(function (k) { return '<li class="hd-nhan" data-kn="' + esc(k) + '">' + esc(KN[k] ? KN[k][nn()] : k) + "</li>"; }).join("") +
      '<li class="hd-nhan hd-nhan-bac">' + esc(hd.goc ? chuCap(hd.bac) : chuBac(hd.bac)) + "</li>";
  }

  function theHd(hd) {
    var cc = c();
    return '<li><a class="hd-the" href="#' + esc(hd.slug) + '" id="the-' + esc(hd.slug) + '">' +
      '<span class="hd-the-anh">' + veCanh(hd) + "</span>" +
      '<span class="hd-the-duoi"><span class="hd-the-nguon" data-goc="' + (hd.goc ? "1" : "0") + '">' + esc(hd.goc ? cc.nhanGoc : cc.nhanChuyen) + "</span>" +
      '<h3 class="hd-the-ten">' + esc(tenChinh(hd)) + '</h3><p class="hd-the-phu">' + esc(tenPhu(hd)) + "</p>" +
      '<ul class="hd-nhan-hang">' + nhanKyNang(hd) + "</ul>" +
      '<p class="hd-the-thong-so"><span>' + esc(khoang(hd.thoi_luong, cc.phut)) + "</span><span>" + esc(khoang(hd.si_so, cc.hocVien)) + "</span><span>" +
      esc(chuCap(hd.bac)) + "</span><span>" + esc(hd.thiet_bi ? cc.tbCo : cc.tbKhong) + "</span></p></span></a></li>";
  }

  function locLai() {
    var ds = DS.filter(hopLoc);
    var luoi = document.getElementById("hd-luoi");
    if (!luoi) return;
    luoi.innerHTML = ds.length ? ds.map(theHd).join("") :
      '<li class="hd-trong"><div><img src="' + esc(anh("trau-thinking.png")) + '" width="333" height="340" alt="">' + esc(c().trong) + "</div></li>";
    var cc = c();
    document.getElementById("hd-dem").textContent = cc.dem(ds.length, DS.length) +
      (khoGoc === "dang-tai" ? cc.demTai : khoGoc === "loi" ? cc.demLoi : cc.demThem(SO_CHUYEN_THE));
  }

  /* ---------- Trang chi tiết ---------- */
  var videoDangMo = null;

  function li(ds) { return ds.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); }

  function dungChiTiet(hd) {
    if (hd.goc) { dungChiTietGoc(hd); return; }
    var cc = c(), i = DS.indexOf(hd), ga = hd.giao_an || {};
    var h = '<a class="hd-ve" href="#thu-vien"><span aria-hidden="true">←</span> ' + esc(cc.ve) + "</a>";
    h += '<div class="hd-ct-dau"><div>';
    h += '<p class="hd-ct-ma">' + esc(hd.ma + " · " + chuBac(hd.bac) + " · " + chuCap(hd.bac)) + "</p>";
    h += '<h1 id="hd-ct-tieu-de" tabindex="-1">' + esc(tenChinh(hd)) + '</h1><p class="hd-ct-phu">' + esc(tenPhu(hd)) + "</p>";
    h += '<ul class="hd-nhan-hang">' + nhanKyNang(hd) + "</ul>";
    h += '<dl class="hd-thong-so">';
    h += "<div><dt>" + esc(cc.tsBac) + "</dt><dd>" + esc(chuCap(hd.bac)) + "<small>" + esc(chuBac(hd.bac)) + "</small></dd></div>";
    h += "<div><dt>" + esc(cc.tsThoiLuong) + "</dt><dd>" + esc(khoang(hd.thoi_luong, cc.phut)) + "</dd></div>";
    h += "<div><dt>" + esc(cc.tsSiSo) + "</dt><dd>" + esc(khoang(hd.si_so, cc.hocVien)) + "</dd></div>";
    h += "<div><dt>" + esc(cc.tsDoiTuong) + "</dt><dd>" + esc(chuDoiTuong(hd.doi_tuong)) + "</dd></div>";
    h += '<div class="hd-rong"><dt>' + esc(cc.tsChuanBi) + "</dt><dd>" + esc(hd.chuan_bi) + " · " + esc(hd.thiet_bi ? cc.tbCo : cc.tbKhong) + "</dd></div>";
    h += "</dl>";
    if (cc.ghiEn) h += '<p class="hd-ghi-en" lang="en">' + esc(cc.ghiEn) + "</p>";
    h += '</div><figure class="hd-ct-minh-hoa"><div class="hd-khung-anh">' + veCanh(hd) + "</div><figcaption>" + esc(cc.minhHoa + hd.ten) + "</figcaption></figure></div>";

    var muc = [["khung", cc.mKhung], ["gia-tri", cc.mGiaTri], ["video", cc.mVideo], ["giao-an", cc.mGiaoAn], ["pro-tip", cc.mMeo]];
    h += '<div class="hd-ct-than"><nav class="hd-muc-luc" aria-labelledby="hd-ml-tieu-de"><h2 id="hd-ml-tieu-de">' + esc(cc.mucLuc) + "</h2><ul>" +
      muc.map(function (m) { return '<li><button type="button" data-den="hd-m-' + m[0] + '">' + esc(m[1]) + "</button></li>"; }).join("") + "</ul></nav><div>";

    // 1. Khung năng lực
    h += '<section class="hd-muc" id="hd-m-khung" aria-labelledby="hd-m-khung-t"><div class="hd-o hd-khung">';
    h += '<div class="hd-khung-dau"><span class="hd-khung-bieu" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3z"/></svg></span><div><h3 id="hd-m-khung-t">' +
      esc(cc.khungTieuDe) + "</h3><p>" + esc(cc.khungNguon) + "</p></div></div>";
    h += '<ul class="hd-khung-ds">' + (hd.khung || []).map(function (k) {
      return '<li><div class="hd-khung-ma">' + esc(k.bac) + "<span>" + esc(k.kn) + "</span></div><p>" + esc(k.mo_ta) + "</p></li>";
    }).join("") + "</ul>";
    var dsGoc = Array.isArray(window.TTV_DANH_SACH) ? window.TTV_DANH_SACH : [];
    var dk = (hd.dung_kem || []).map(function (d) {
      var g = null;
      for (var j = 0; j < dsGoc.length; j++) if (dsGoc[j].id === d.goc) g = dsGoc[j];
      if (!g) return "";
      var ten = nn() === "en" ? g.ten_en : g.ten_vi;
      // Không dùng ảnh Trâu Con cầm cờ trên trang này
      var hinh = g.trau && !/flag/.test(g.trau) ? '<img src="' + esc(anh(g.trau)) + '" width="40" height="40" alt="">' : "";
      return '<li><a href="/#' + esc(g.id) + '" style="--goc:' + esc(g.mau) + ";--goc-nhat:" + esc(g.mau_nhat) + '">' + hinh + esc(ten) + "</a><span>" + esc(d.ghi) + "</span></li>";
    }).join("");
    if (dk) h += '<div class="hd-dung-kem"><h4>' + esc(cc.dungKem) + "</h4><ul>" + dk + "</ul></div>";
    h += '<p class="hd-mien-tru">' + esc(cc.mienTru) + "</p></div></section>";

    // 2. Giá trị sư phạm
    h += '<section class="hd-muc" id="hd-m-gia-tri" aria-labelledby="hd-m-gia-tri-t"><h2 id="hd-m-gia-tri-t">' + esc(cc.mGiaTri) + " <small>" + esc(cc.giaTriPhu) + "</small></h2>";
    h += '<p class="hd-gia-tri">' + esc(hd.gia_tri) + "</p></section>";

    // 3. Video 2D
    var n = hd.cac_buoc.length;
    h += '<section class="hd-muc" id="hd-m-video" aria-labelledby="hd-m-video-t"><h2 id="hd-m-video-t">' + esc(cc.mVideo) + ' <small id="hd-v-tong"></small></h2>';
    h += '<div class="hd-video" id="hd-video"><div class="hd-san-khau" id="hd-v-san">' + veCanh(hd, { video: true, bang: hd.ten, phu: cc.buoc + "1 · " + hd.cac_buoc[0][0], loi: loiTuBuoc(hd.cac_buoc[0][1]) }) +
      '<p class="hd-canh-so" id="hd-v-so"></p><p class="hd-phu-de" id="hd-v-phu-de" lang="vi"></p></div>';
    h += '<div class="hd-dieu-khien"><button type="button" class="hd-nut-tron hd-chinh" id="hd-v-phat"></button>' +
      '<button type="button" class="hd-nut-tron" id="hd-v-lai" aria-label="' + esc(cc.lai) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg></button>' +
      '<div class="hd-tien-do" id="hd-v-doan">' + hd.cac_buoc.map(function (b, k) {
        return '<button type="button" class="hd-doan" data-canh="' + k + '" aria-label="' + esc(cc.denCanh + (k + 1) + ": " + b[0]) + '"><span><i></i></span></button>';
      }).join("") + "</div>" +
      '<span class="hd-gio" id="hd-v-gio">0:00</span><button type="button" class="hd-nut-phu-de" id="hd-v-pd" aria-pressed="true"></button></div></div>';
    h += '<p class="hd-video-ghi" id="hd-v-ghi">' + esc(cc.videoGhi) + "</p>";
    h += '<ol class="hd-buoc" id="hd-v-buoc">' + hd.cac_buoc.map(function (b, k) {
      return '<li data-canh="' + k + '"><span class="hd-buoc-so" aria-hidden="true">' + (k + 1) + "</span><div><h3>" + esc(b[0]) + "</h3><p>" + esc(b[1]) + "</p></div></li>";
    }).join("") + "</ol></section>";

    // 4. Giáo án
    h += '<section class="hd-muc hd-ga" id="hd-m-giao-an" aria-labelledby="hd-m-giao-an-t"><h2 id="hd-m-giao-an-t">' + esc(cc.mGiaoAn) + "</h2>";
    h += '<div class="hd-ga-hai"><div class="hd-o"><h3>' + esc(cc.mucTieu) + "</h3><ul>" + li(ga.muc_tieu || []) + '</ul></div><div class="hd-o"><h3>' + esc(cc.tieuChi) + "</h3><ul>" + li(ga.tieu_chi || []) + "</ul></div></div>";
    h += '<div class="hd-o" style="margin-bottom:16px"><ol class="hd-ga-tien-trinh">';
    [["khoi_dong", cc.khoiDong], ["chinh", cc.chinh], ["cung_co", cc.cungCo]].forEach(function (p) {
      var x = ga[p[0]];
      if (!x) return;
      h += '<li><div class="hd-ga-pha"><strong>' + esc(p[1]) + '</strong><span class="hd-ga-phut">≈ ' + esc(x.phut) + "′</span></div><ul>" + li(x.viec || []) + "</ul></li>";
    });
    h += "</ol></div>";
    h += '<div class="hd-ga-hai"><div class="hd-o"><h3>' + esc(cc.phanHoa) + '</h3><ul class="hd-ga-phan-hoa">';
    if (ga.phan_hoa) h += "<li><b>" + esc(cc.moi) + "</b>" + esc(ga.phan_hoa.moi) + "</li><li><b>" + esc(cc.kha) + "</b>" + esc(ga.phan_hoa.kha) + "</li>";
    h += '</ul></div><div class="hd-o"><h3>' + esc(cc.danhGia) + "</h3><dl>";
    if (ga.danh_gia) h += "<dt>" + esc(cc.dgVi) + "</dt><dd>" + esc(ga.danh_gia.vi) + "</dd><dt>" + esc(cc.dgLa) + "</dt><dd>" + esc(ga.danh_gia.la) + "</dd><dt>" + esc(cc.dgKq) + "</dt><dd>" + esc(ga.danh_gia.kq) + "</dd>";
    h += "</dl></div></div>";
    h += '<div class="hd-o"><h3>' + esc(cc.taiLieu) + "</h3><ul>" + li(ga.tai_lieu || []) + "</ul></div></section>";

    // 5. Pro-tip
    h += '<section class="hd-muc" id="hd-m-pro-tip" aria-labelledby="hd-m-pro-tip-t"><h2 id="hd-m-pro-tip-t" class="cong-an">' + esc(cc.mMeo) + "</h2>";
    h += '<div class="hd-o hd-meo"><img src="' + esc(anh("trau-thinking.png")) + '" width="333" height="340" alt=""><div><p class="hd-meo-nhan">' + esc(cc.meoNhan) + "</p><p>" + esc(hd.pro_tip) +
      '</p><p class="hd-meo-ai">' + esc(cc.meoAi) + "</p></div></div></section>";

    // Trước / sau
    h += '<nav class="hd-chuyen" aria-label="' + esc(cc.truoc.replace("← ", "") + " / " + cc.sau.replace(" →", "")) + '">';
    h += i > 0 ? '<a class="ttv-nut-phu" href="#' + esc(DS[i - 1].slug) + '">' + esc(cc.truoc) + "</a>" : "<span></span>";
    h += i < DS.length - 1 ? '<a class="ttv-nut-phu" href="#' + esc(DS[i + 1].slug) + '">' + esc(cc.sau) + "</a>" : "";
    h += "</nav></div></div>";
    ct.innerHTML = h;

    // Mục lục: cuộn tới mục, không đổi địa chỉ
    Array.prototype.forEach.call(ct.querySelectorAll(".hd-muc-luc button"), function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById(b.getAttribute("data-den"));
        if (el) el.scrollIntoView({ behavior: chuyenDongIt() ? "auto" : "smooth", block: "start" });
      });
    });
    theoDoiMuc();
    videoDangMo = taoVideo(hd);
  }

  function chuyenDongIt() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  var quanSat = null;
  function theoDoiMuc() {
    if (quanSat) quanSat.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var nut = ct.querySelectorAll(".hd-muc-luc button");
    quanSat = new IntersectionObserver(function (ds) {
      ds.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(nut, function (b) { b.setAttribute("aria-current", b.getAttribute("data-den") === e.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Array.prototype.forEach.call(ct.querySelectorAll(".hd-muc"), function (m) { quanSat.observe(m); });
  }

  /* ---------- Video 2D ---------- */
  var DICH = [0, 16, -12, 20, 4, -8];
  var thieuAm = {}; // slug -> true khi chưa có tệp âm thanh

  function taoVideo(hd) {
    var cc = c(), n = hd.cac_buoc.length;
    var dai = hd.cac_buoc.map(function () { return GIAY_MOI_CANH; });
    var khung = document.getElementById("hd-video");
    var svg = khung.querySelector("svg");
    var nutPhat = document.getElementById("hd-v-phat");
    var gio = document.getElementById("hd-v-gio");
    var soCanh = document.getElementById("hd-v-so");
    var phuDe = document.getElementById("hd-v-phu-de");
    var nutPd = document.getElementById("hd-v-pd");
    var doan = khung.querySelectorAll(".hd-doan i");
    var dsBuoc = document.querySelectorAll("#hd-v-buoc li");
    var tong = document.getElementById("hd-v-tong");
    var i = 0, chay = false, daQua = 0, moc = 0, raf = 0, am = null, coPhuDe = true;

    function phutGiay(x) { x = Math.max(0, Math.round(x)); return Math.floor(x / 60) + ":" + ("0" + (x % 60)).slice(-2); }
    function tongDai() { return dai.reduce(function (a, b) { return a + b; }, 0); }
    function veNut() {
      nutPhat.setAttribute("aria-label", chay ? cc.dung : cc.phat);
      nutPhat.innerHTML = chay ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>' :
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
      khung.setAttribute("data-chay", chay ? "1" : "0");
    }
    function vePd() {
      nutPd.textContent = coPhuDe ? cc.phuDeBat : cc.phuDeTat;
      nutPd.setAttribute("aria-pressed", coPhuDe ? "true" : "false");
      phuDe.hidden = !coPhuDe;
    }
    function veTienDo() {
      var truoc = 0;
      for (var k = 0; k < n; k++) {
        var p = k < i ? 1 : k > i ? 0 : Math.min(1, daQua / dai[k]);
        doan[k].style.width = (p * 100).toFixed(1) + "%";
        if (k < i) truoc += dai[k];
      }
      gio.textContent = phutGiay(truoc + Math.min(daQua, dai[i])) + " / " + phutGiay(tongDai());
    }
    function datCanh(k) {
      i = Math.max(0, Math.min(n - 1, k));
      daQua = 0;
      var b = hd.cac_buoc[i];
      var tPhu = svg.querySelector(".hd-bang-phu");
      var chuPhu = cc.buoc + (i + 1) + " · " + b[0];
      tPhu.textContent = chuPhu;
      tPhu.setAttribute("font-size", coChu(chuPhu.length, 230, 14, 0.52));
      svg.querySelector(".hd-loi").innerHTML = veLoi(BO_CUC[hd.canh] ? hd.canh : "di-lai", loiTuBuoc(b[1]), false);
      svg.querySelector(".hd-be-nhom").style.transform = "translateX(" + DICH[i % DICH.length] + "px)";
      soCanh.textContent = cc.canh(i + 1, n);
      phuDe.textContent = b[1];
      Array.prototype.forEach.call(dsBuoc, function (el, j) { if (j === i) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current"); });
      if (chay) { moc = performance.now(); phatAm(); }
      veTienDo();
    }
    function dungAm() { if (am) { try { am.pause(); } catch (e) {} am = null; } }
    function phatAm() {
      dungAm();
      if (thieuAm[hd.slug]) return;
      var k = i;
      var a = new Audio("am-thanh/" + encodeURIComponent(hd.slug) + "-" + (k + 1) + ".mp3");
      a.addEventListener("error", function () { thieuAm[hd.slug] = true; });
      a.addEventListener("loadedmetadata", function () {
        if (isFinite(a.duration) && a.duration + 0.8 > dai[k]) { dai[k] = a.duration + 0.8; veTienDo(); }
        document.getElementById("hd-v-ghi").textContent = cc.videoGhiCoAm;
      });
      am = a;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    }
    function vong(t) {
      if (!chay) return;
      daQua = (t - moc) / 1000;
      if (daQua >= dai[i]) {
        if (i < n - 1) { datCanh(i + 1); }
        else { daQua = dai[i]; chay = false; dungAm(); veNut(); veTienDo(); return; }
      }
      veTienDo();
      raf = requestAnimationFrame(vong);
    }
    function phat() {
      if (i === n - 1 && daQua >= dai[i]) { datCanh(0); }
      chay = true;
      moc = performance.now() - daQua * 1000;
      veNut();
      if (daQua < 0.2) phatAm(); else if (am) { var p = am.play(); if (p && p.catch) p.catch(function () {}); }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(vong);
    }
    function tamDung() { chay = false; cancelAnimationFrame(raf); if (am) { try { am.pause(); } catch (e) {} } veNut(); }

    nutPhat.addEventListener("click", function () { if (chay) tamDung(); else phat(); });
    document.getElementById("hd-v-lai").addEventListener("click", function () { datCanh(0); if (!chay) phat(); });
    nutPd.addEventListener("click", function () { coPhuDe = !coPhuDe; vePd(); });
    Array.prototype.forEach.call(khung.querySelectorAll(".hd-doan"), function (b) {
      b.addEventListener("click", function () { datCanh(Number(b.getAttribute("data-canh"))); });
    });
    Array.prototype.forEach.call(dsBuoc, function (el) {
      el.addEventListener("click", function () {
        datCanh(Number(el.getAttribute("data-canh")));
        khung.scrollIntoView({ behavior: chuyenDongIt() ? "auto" : "smooth", block: "nearest" });
      });
    });
    tong.textContent = Math.round(tongDai()) + "s";
    veNut(); vePd(); datCanh(0);
    return { dung: function () { tamDung(); dungAm(); } };
  }

  /* ---------- Tác giả và lý do ---------- */
  function dungGioiThieu() {
    var gt = document.getElementById("hd-gt");
    if (!gt) return;
    var cc = c();
    var h = '<div class="hd-tg">';
    h += '<div class="hd-tg-chinh"><p class="hd-mat-day">' + esc(cc.tgMatDay) + '</p><h2 id="hd-tg-tieu-de">' + esc(cc.tgTen) + "</h2>";
    h += '<p class="hd-tg-vai">' + esc(cc.tgVai) + "</p><p>" + esc(cc.tgMoTa) + "</p>";
    h += '<ul class="hd-so-lieu">' + cc.tgSo.map(function (x) {
      return '<li><strong>' + esc(x[0]) + "</strong><span>" + esc(x[1]) + "</span></li>";
    }).join("") + "</ul>";
    h += '<p class="hd-tg-link"><a href="https://www.trangphan.org/" target="_blank" rel="noopener">' + esc(cc.tgHoSo) + ": www.trangphan.org" +
      '<span class="cong-an"> ' + esc(cc.tabMoi) + "</span></a></p></div>";
    h += '<div class="hd-o hd-tg-moc"><h3>' + esc(cc.tgMocTieuDe) + "</h3><ol>" + cc.tgMoc.map(function (m) {
      return "<li><b>" + esc(m[0]) + "</b><span>" + esc(m[1]) + "</span></li>";
    }).join("") + "</ol></div>";
    h += "</div>";
    h += '<div class="hd-ly-do"><h2 id="hd-ld-tieu-de">' + esc(cc.ldTieuDe) + "</h2><p>" + esc(cc.ldMoTa) + "</p>";
    h += '<ol class="hd-ly-do-ds">' + cc.ldY.map(function (y, k) {
      return '<li><span class="hd-buoc-so" aria-hidden="true">' + (k + 1) + "</span><div><h3>" + esc(y[0]) + "</h3><p>" + esc(y[1]) + "</p></div></li>";
    }).join("") + "</ol>";
    h += '<p class="hd-ly-do-cach"><img src="' + esc(anh("trau-pointing.png")) + '" alt=""><span>' + esc(cc.ldCach) + "</span></p></div>";
    gt.innerHTML = h;
  }

  /* ---------- Kho gốc: đọc CSV ---------- */
  function docCsv(s) {
    var hang = [], dong = [], o = "", ngoac = false;
    for (var i = 0; i < s.length; i++) {
      var k = s[i];
      if (ngoac) {
        if (k === '"') { if (s[i + 1] === '"') { o += '"'; i++; } else ngoac = false; }
        else o += k;
      } else if (k === '"') ngoac = true;
      else if (k === ",") { dong.push(o); o = ""; }
      else if (k === "\n") { dong.push(o); hang.push(dong); dong = []; o = ""; }
      else if (k !== "\r") o += k;
    }
    if (o || dong.length) { dong.push(o); hang.push(dong); }
    var dau = hang.shift() || [];
    return hang.filter(function (d) { return d.length > 5; }).map(function (d) {
      var r = {};
      dau.forEach(function (ten, j) { r[ten] = d[j] || ""; });
      return r;
    });
  }
  function haiSo(x) {
    var m = String(x || "").match(/\d+/g) || [];
    var a = Number(m[0] || 0), b = Number(m[1] || m[0] || 0);
    return [a, b];
  }
  function tachDs(x) { return String(x || "").split(/[;|]/).map(function (t) { return t.trim(); }).filter(Boolean); }
  function tuHangGoc(r) {
    var bac = [], dt = [], kn = [];
    tachDs(r.trinh_do).forEach(function (t) { (CAP_ESL[t] || []).forEach(function (b) { if (bac.indexOf(b) < 0) bac.push(b); }); });
    if (!bac.length) bac = [1, 2];
    tachDs(r.khoi_lop).forEach(function (t) {
      var m = t === "adult" ? "nguoi-lon" : t === "9-12" ? "9-14" : "5-8";
      if (dt.indexOf(m) < 0) dt.push(m);
    });
    tachDs(r.ky_nang).forEach(function (t) { var m = KN_ESL[t]; if (m && kn.indexOf(m) < 0) kn.push(m); });
    var buoc = String(r.cac_buoc_VI || "").split("\n").map(function (d) {
      var p = d.split("::");
      return [p[0].trim(), p.slice(1).join("::").trim()];
    }).filter(function (b) { return b[0] || b[1]; });
    var ten = (r.ten_VI || r.ten_EN || "").trim();
    return {
      goc: true, ma: r.id, slug: "goc-" + r.slug, slug_goc: r.slug,
      ten: ten, ten_en: (r.ten_EN || ten).trim(), ky_nang: kn, bac: bac.sort(), doi_tuong: dt.length ? dt : ["5-8"],
      thoi_luong: haiSo(r.thoi_luong), si_so: haiSo(r.si_so), thiet_bi: /^(yes|y|co|có|true|1)$/i.test(String(r.thiet_bi).trim()),
      chuan_bi: r.chuan_bi_VI || "", canh: CANH_ESL[r.kieu_video] || "di-lai",
      minh_hoa: { bang: ten, phu: buoc[0] ? "1 · " + buoc[0][0] : "" },
      gia_tri: r.the_why_VI || "", cac_buoc: buoc, pro_tip: r.pro_tip_VI || ""
    };
  }
  function taiKhoGoc() {
    if (!window.fetch) { khoGoc = "loi"; locLai(); return; }
    fetch(KHO_GOC_CSV, { mode: "cors" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (t) {
      docCsv(t).forEach(function (r) {
        if (!r.slug || GOC_DA_CHUYEN[r.slug] || !r.ten_VI && !r.ten_EN) return;
        DS.push(tuHangGoc(r));
      });
      khoGoc = "xong";
      locLai();
      if (/^#goc-/.test(location.hash) && document.body.getAttribute("data-hd-xem") !== "chi-tiet") diTheoDiaChi();
    }).catch(function () { khoGoc = "loi"; locLai(); });
  }

  /* ---------- Trang chi tiết: hoạt động kho gốc ---------- */
  function dungChiTietGoc(hd) {
    var cc = c(), i = DS.indexOf(hd);
    var h = '<a class="hd-ve" href="#thu-vien"><span aria-hidden="true">←</span> ' + esc(cc.ve) + "</a>";
    h += '<div class="hd-ct-dau"><div>';
    h += '<p class="hd-ct-ma">' + esc(hd.ma + " · " + cc.ctGoc + " · " + chuCap(hd.bac)) + "</p>";
    h += '<h1 id="hd-ct-tieu-de" tabindex="-1">' + esc(tenChinh(hd)) + '</h1><p class="hd-ct-phu">' + esc(tenPhu(hd)) + "</p>";
    h += '<ul class="hd-nhan-hang">' + nhanKyNang(hd) + "</ul>";
    h += '<dl class="hd-thong-so">';
    h += "<div><dt>" + esc(cc.tsTrinhDo) + "</dt><dd>" + esc(chuCap(hd.bac)) + "</dd></div>";
    h += "<div><dt>" + esc(cc.tsThoiLuong) + "</dt><dd>" + esc(khoang(hd.thoi_luong, cc.phut)) + "</dd></div>";
    h += "<div><dt>" + esc(cc.tsSiSo) + "</dt><dd>" + esc(khoang(hd.si_so, cc.hocVien)) + "</dd></div>";
    h += "<div><dt>" + esc(cc.tsDoiTuong) + "</dt><dd>" + esc(chuDoiTuong(hd.doi_tuong)) + "</dd></div>";
    h += '<div class="hd-rong"><dt>' + esc(cc.tsChuanBi) + "</dt><dd>" + esc(hd.chuan_bi) + " · " + esc(hd.thiet_bi ? cc.tbCo : cc.tbKhong) + "</dd></div>";
    h += "</dl>";
    h += '<p class="hd-goc-ghi">' + esc(cc.gocGhi) + ' <a href="' + esc(TRANG_GOC + "#game-" + encodeURIComponent(hd.slug_goc)) + '" target="_blank" rel="noopener">' +
      esc(cc.gocXem) + '<span class="cong-an"> ' + esc(cc.tabMoi) + "</span></a></p>";
    h += '</div><figure class="hd-ct-minh-hoa"><div class="hd-khung-anh">' + veCanh(hd) + "</div><figcaption>" + esc(cc.minhHoa + hd.ten) + "</figcaption></figure></div>";

    var muc = [["gia-tri", cc.mGiaTri], ["buoc", cc.gocBuoc], ["pro-tip", cc.mMeo]];
    h += '<div class="hd-ct-than"><nav class="hd-muc-luc" aria-labelledby="hd-ml-tieu-de"><h2 id="hd-ml-tieu-de">' + esc(cc.mucLuc) + "</h2><ul>" +
      muc.map(function (m) { return '<li><button type="button" data-den="hd-m-' + m[0] + '">' + esc(m[1]) + "</button></li>"; }).join("") + "</ul></nav><div>";
    h += '<section class="hd-muc" id="hd-m-gia-tri" aria-labelledby="hd-m-gia-tri-t"><h2 id="hd-m-gia-tri-t">' + esc(cc.mGiaTri) + " <small>" + esc(cc.giaTriPhu) + "</small></h2>";
    h += '<p class="hd-gia-tri">' + esc(hd.gia_tri) + "</p></section>";
    h += '<section class="hd-muc" id="hd-m-buoc" aria-labelledby="hd-m-buoc-t"><h2 id="hd-m-buoc-t">' + esc(cc.gocBuoc) + "</h2>";
    h += '<ol class="hd-buoc hd-buoc-tinh">' + hd.cac_buoc.map(function (b, k) {
      return '<li><span class="hd-buoc-so" aria-hidden="true">' + (k + 1) + "</span><div><h3>" + esc(b[0]) + "</h3><p>" + esc(b[1]) + "</p></div></li>";
    }).join("") + "</ol></section>";
    if (hd.pro_tip) {
      h += '<section class="hd-muc" id="hd-m-pro-tip" aria-labelledby="hd-m-pro-tip-t"><h2 id="hd-m-pro-tip-t" class="cong-an">' + esc(cc.mMeo) + "</h2>";
      h += '<div class="hd-o hd-meo"><img src="' + esc(anh("trau-thinking.png")) + '" width="333" height="340" alt=""><div><p class="hd-meo-nhan">' + esc(cc.meoNhan) + "</p><p>" + esc(hd.pro_tip) +
        '</p><p class="hd-meo-ai">' + esc(cc.meoAi) + "</p></div></div></section>";
    }
    h += '<nav class="hd-chuyen" aria-label="' + esc(cc.truoc.replace("← ", "") + " / " + cc.sau.replace(" →", "")) + '">';
    h += i > 0 ? '<a class="ttv-nut-phu" href="#' + esc(DS[i - 1].slug) + '">' + esc(cc.truoc) + "</a>" : "<span></span>";
    h += i < DS.length - 1 ? '<a class="ttv-nut-phu" href="#' + esc(DS[i + 1].slug) + '">' + esc(cc.sau) + "</a>" : "";
    h += "</nav></div></div>";
    ct.innerHTML = h;
    Array.prototype.forEach.call(ct.querySelectorAll(".hd-muc-luc button"), function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById(b.getAttribute("data-den"));
        if (el) el.scrollIntoView({ behavior: chuyenDongIt() ? "auto" : "smooth", block: "start" });
      });
    });
    theoDoiMuc();
  }

  /* ---------- Điều hướng theo địa chỉ ---------- */
  var slugTruoc = "";
  function diTheoDiaChi() {
    var h = "";
    try { h = decodeURIComponent(location.hash.replace(/^#/, "")); } catch (e) {}
    var hd = timHd(h);
    if (videoDangMo) { videoDangMo.dung(); videoDangMo = null; }
    if (hd) {
      document.body.setAttribute("data-hd-xem", "chi-tiet");
      phanCT.hidden = false;
      dungChiTiet(hd);
      document.title = hd.ten + " · " + c().tvTieuDe + " · Trường Tiếng Việt Của Em";
      window.scrollTo(0, 0);
      var t = document.getElementById("hd-ct-tieu-de");
      if (t) try { t.focus({ preventScroll: true }); } catch (e) {}
      slugTruoc = hd.slug;
    } else {
      var tuChiTiet = document.body.getAttribute("data-hd-xem") === "chi-tiet";
      document.body.removeAttribute("data-hd-xem");
      phanCT.hidden = true;
      ct.innerHTML = "";
      if (window.CONG && window.CONG.capNhat) window.CONG.capNhat(); // trả lại tiêu đề trang
      if (tuChiTiet && slugTruoc) {
        var the = document.getElementById("the-" + slugTruoc);
        if (the) { the.scrollIntoView({ block: "center" }); try { the.focus({ preventScroll: true }); } catch (e) {} }
      } else if (h === "thu-vien") {
        phanTV.scrollIntoView({ block: "start" });
      }
    }
  }

  function khoiDong() {
    if (!tv || !ct) return;
    dungGioiThieu();
    dungThuVien();
    diTheoDiaChi();
    taiKhoGoc();
    window.addEventListener("hashchange", diTheoDiaChi);
    if (window.CONG && typeof window.CONG.khiDoiChu === "function") {
      window.CONG.khiDoiChu(function () {
        dungGioiThieu();
        dungThuVien();
        if (document.body.getAttribute("data-hd-xem") === "chi-tiet") {
          var hd = timHd(slugTruoc);
          if (videoDangMo) { videoDangMo.dung(); videoDangMo = null; }
          if (hd) { dungChiTiet(hd); document.title = hd.ten + " · " + c().tvTieuDe + " · Trường Tiếng Việt Của Em"; }
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong);
  else khoiDong();
})();
