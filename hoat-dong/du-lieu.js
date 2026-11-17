/*
 * Dữ liệu "Gợi ý hoạt động học cho lớp tiếng Việt như ngôn ngữ thứ hai – mô hình lớp học trực tiếp".
 * Mỗi hoạt động là một mục trong HOAT_DONG. Thêm hoạt động mới: chép một mục, đổi slug (không dấu, gạch nối).
 *
 * ky_nang : "nghe-noi" | "doc" | "viet" | "tu-vung" | "tich-hop"
 * bac     : các bậc theo Khung năng lực tiếng Việt dùng cho người nước ngoài (TT 17/2015/TT-BGDĐT), 1–6
 * doi_tuong: "5-8" (trẻ 5–8 tuổi) | "9-14" (trẻ 9–14 tuổi) | "nguoi-lon"
 * thoi_luong, si_so: [nhỏ nhất, lớn nhất]
 * canh    : kiểu cảnh minh hoạ 2D: "di-lai" | "tiep-suc" | "ghe-nong" | "san-lop" | "bowling" | "ban" | "doi-bang" | "cho"
 * minh_hoa: chữ trên bảng (bang, phu), thẻ (the), lời thoại (loi), chữ dán tường (tuong), bảng điểm (diem), đồng hồ (dong_ho)
 * khung   : đối chiếu Khung 6 bậc (diễn giải, không trích nguyên văn)
 * dung_kem: góc học của trường dùng kèm (id trong TTV_DANH_SACH) và gợi ý
 * cac_buoc: [tiêu đề, nội dung] – cũng là lời của video 2D (mỗi bước một cảnh)
 * Âm thanh video (khi có): am-thanh/<slug>-<số bước>.mp3, giọng chuẩn của trường.
 */
var HOAT_DONG = [
  {
    ma: "HD01",
    slug: "tim-nguoi",
    ten: "Tìm người…",
    ten_en: "Find Someone Who",
    ky_nang: ["nghe-noi", "tu-vung"],
    bac: [1, 2],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [15, 20],
    si_so: [6, 30],
    thiet_bi: false,
    chuan_bi: "Mỗi học viên một bảng 3×3 (in sẵn hoặc chép vào vở). Mỗi ô một gợi ý có tranh: có em trai, biết bơi, thích ăn phở…",
    canh: "di-lai",
    minh_hoa: {
      bang: "Tìm người…",
      phu: "Hỏi một câu · ghi một tên · đổi bạn",
      loi: ["Bạn có em trai không?", "Có, mình có em trai.", "Bạn biết bơi không?", "Không, mình không biết."]
    },
    khung: [
      { kn: "Nói (hội thoại)", bac: "Bậc 1", mo_ta: "Hỏi và trả lời câu hỏi đơn giản về bản thân, gia đình, sở thích khi người đối thoại nói chậm, rõ." },
      { kn: "Nghe", bac: "Bậc 1", mo_ta: "Hiểu câu trả lời ngắn về thông tin cá nhân quen thuộc." },
      { kn: "Nói (hội thoại)", bac: "Bậc 2", mo_ta: "Duy trì trao đổi ngắn bằng cách hỏi thêm một câu (ai, ở đâu, khi nào, mấy)." }
    ],
    dung_kem: [
      { goc: "luyennoi", ghi: "Luyện thanh cho các từ trong bảng trước khi đi hỏi." },
      { goc: "baihoc", ghi: "Ôn từ vựng gia đình, sở thích của bài đang học." }
    ],
    gia_tri: "Trong vài phút, mỗi học viên hỏi và trả lời với rất nhiều bạn, nên thời gian nói tăng lên nhiều lần mà giáo viên không phải đứng giữa điều phối. Câu hỏi có/không của tiếng Việt có khung rất rõ (có … không?), người mới học nắm được ngay và luyện luôn cách trả lời ngắn. Hoạt động còn giúp lớp ghép tuổi, ghép trình độ quen nhau rất nhanh.",
    cac_buoc: [
      ["Chuẩn bị bảng", "Phát cho mỗi học viên một bảng 3×3. Mỗi ô là một gợi ý có tranh, ví dụ \"có em trai\" hoặc \"biết bơi\"."],
      ["Làm mẫu câu hỏi", "Giáo viên cùng cả lớp biến gợi ý thành câu hỏi theo khung có … không: \"Bạn có em trai không?\" Cả lớp đọc đồng thanh, chú ý thanh điệu."],
      ["Đi lại và hỏi", "Học viên đi quanh lớp, mỗi bạn chỉ hỏi một câu. Bạn trả lời \"Có, mình có em trai.\" thì ghi tên bạn ấy vào ô."],
      ["Hỏi thêm một câu", "Với mỗi câu trả lời \"Có\", hỏi thêm một câu như \"Em trai bạn mấy tuổi?\" và ghi ngắn câu trả lời."],
      ["Báo cáo", "Học viên về chỗ và chia sẻ: \"Bạn ấy có em trai. Em trai bạn ấy năm tuổi.\" Cả lớp xem ai hoàn thành bảng."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta học cách hỏi và trả lời câu hỏi có/không theo khung \"có … không?\".",
        "Chúng ta học cách hỏi thêm một câu để nói chuyện được lâu hơn."
      ],
      tieu_chi: [
        "Em đặt được câu hỏi đúng khung: Bạn có … không?",
        "Em trả lời được câu ngắn: Có, mình… / Không, mình không…",
        "Em hỏi thêm được một câu với ai, ở đâu, khi nào, mấy."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Giáo viên nói ba câu về mình, có một câu sai. Học viên hỏi lại bằng \"Cô có … không?\" để tìm câu sai.",
        "Ghi lên bảng hai mẫu trả lời: Có, … / Không, … không …"
      ] },
      chinh: { phut: "10–15", viec: [
        "(2 phút) Phát bảng. Làm mẫu một ô với một học viên tự tin.",
        "(8–10 phút) Đi lại hỏi. Luật: hỏi một câu rồi đổi bạn. Bật nhạc nhỏ; nhạc tắt thì cả lớp đứng yên lắng nghe.",
        "Giáo viên đi vòng quanh, ghi lỗi hay gặp (sai thanh, quên \"không\" cuối câu) vào giấy nhớ, không ngắt lời học viên."
      ] },
      cung_co: { phut: "5", viec: [
        "(4 phút) Từng cặp chia sẻ hai điều tìm được bằng câu đầy đủ, dùng \"bạn ấy\".",
        "Đưa hai lỗi hay gặp lên bảng và cùng sửa."
      ] },
      phan_hoa: {
        moi: "Bảng có tranh và câu hỏi viết sẵn; thẻ khung câu \"Bạn có ___ không?\"; cho phép đi cùng một bạn.",
        kha: "Tự viết gợi ý vào ô trống; hỏi thêm bằng \"Tại sao…?\", \"Từ bao giờ…?\"; báo cáo bằng hai câu nối với \"và\", \"nhưng\"."
      },
      danh_gia: {
        vi: "Giáo viên dùng bảng kiểm quan sát khi học viên đi lại (khung câu hỏi, thanh điệu).",
        la: "Học viên tự đánh dấu tiêu chí thành công và viết một câu hỏi mình thấy khó.",
        kq: "(Tuỳ chọn) Phiếu ra lớp: viết 3 câu hỏi và 3 câu trả lời ngắn."
      },
      tai_lieu: ["Bảng 3×3 để in (bản có tranh và bản chữ)", "Thẻ khung câu", "Bảng kiểm quan sát"]
    },
    pro_tip: "Viết sẵn các từ để hỏi thêm (ai, ở đâu, khi nào, mấy) ở góc bảng trước khi bắt đầu. Học viên xong sớm sẽ hỏi sâu hơn thay vì chỉ thi nhau điền kín bảng."
  },

  {
    ma: "HD02",
    slug: "chinh-ta-tiep-suc",
    ten: "Chính tả tiếp sức",
    ten_en: "Running Dictation",
    ky_nang: ["nghe-noi", "doc", "viet"],
    bac: [1, 2, 3],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [20, 30],
    si_so: [8, 30],
    thiet_bi: false,
    chuan_bi: "Một đoạn văn ngắn 5–8 câu, in chữ to, đánh số từng câu; mỗi nhóm một bản dán trên tường. Mỗi nhóm có giấy và bút.",
    canh: "tiep-suc",
    minh_hoa: {
      bang: "Chính tả tiếp sức",
      phu: "Người chạy đọc · Người viết viết · đổi vai sau 2 câu",
      tuong: "CHỢ TẾT",
      the: ["Người chạy ≠ Người viết"],
      loi: ["…đi chợ Tết với bà.", "Chữ \"chợ\" có dấu gì?"]
    },
    khung: [
      { kn: "Nghe", bac: "Bậc 1–2", mo_ta: "Nghe và chép lại cụm từ, câu ngắn quen thuộc khi được nhắc lại." },
      { kn: "Viết", bac: "Bậc 1–2", mo_ta: "Viết đúng chính tả câu ngắn; đặt đúng dấu thanh và dấu câu." },
      { kn: "Đọc", bac: "Bậc 2", mo_ta: "Đọc hiểu ý chính của đoạn văn ngắn về chủ đề quen thuộc." },
      { kn: "Nói (hội thoại)", bac: "Bậc 2", mo_ta: "Hỏi lại để làm rõ khi chưa nghe rõ." }
    ],
    dung_kem: [
      { goc: "baihoc", ghi: "Chọn đoạn tập đọc vừa học làm đoạn văn dán tường." },
      { goc: "vanhoa", ghi: "Với lớp khá, dùng một đoạn bài đọc về lễ Tết, phong tục." }
    ],
    gia_tri: "Đọc, ghi nhớ, nói, nghe và viết diễn ra trong cùng một nhiệm vụ, kỹ năng này dựa vào kỹ năng kia. Với tiếng Việt, hoạt động rèn rất tốt tai nghe thanh điệu: người viết phải nghe ra \"chợ\" hay \"chở\" và hỏi lại khi chưa chắc. Vận động và mục tiêu chung giữ cả lớp hào hứng mà vẫn học chính tả nghiêm túc.",
    cac_buoc: [
      ["Dán đoạn văn", "Dán mỗi nhóm một bản đoạn văn trên tường, xa bàn học. Nhóm 3–4 bạn ngồi cùng nhau với một tờ giấy."],
      ["Phân vai", "Một bạn là Người chạy, một bạn là Người viết. Luật: Người chạy không được viết, Người viết không được đứng dậy. Đổi vai sau mỗi hai câu."],
      ["Chạy, đọc, nhớ", "Người chạy đến tường, đọc và nhớ một cụm, rồi về đọc lại cho Người viết. Đọc rõ từng tiếng, đủ thanh."],
      ["Hỏi và kiểm tra dấu", "Người viết hỏi lại: \"Chữ chợ có dấu gì?\", \"Viết tr hay ch?\" Cả nhóm cùng kiểm tra dấu thanh và dấu câu."],
      ["So sánh và kể lại", "Các nhóm so bài với bản gốc, đếm lỗi theo số câu, rồi nói ý chính của đoạn văn trong một câu."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta luyện nghe và viết đúng chính tả câu ngắn, đủ dấu thanh.",
        "Chúng ta luyện hỏi lại khi chưa nghe rõ."
      ],
      tieu_chi: [
        "Em đọc to rõ từng tiếng, đủ thanh cho bạn viết.",
        "Em viết đúng dấu thanh và dấu câu.",
        "Em biết hỏi lại: \"Bạn đọc lại được không?\", \"Chữ này có dấu gì?\""
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Đọc nhanh 6 tiếng chỉ khác dấu (cho, chó, chợ…); học viên giơ tay vẽ đường thanh.",
        "Dạy hai câu hỏi lại và viết lên bảng."
      ] },
      chinh: { phut: "15–20", viec: [
        "(2 phút) Chia nhóm, phân vai, nhắc luật an toàn khi đi lại.",
        "(10–15 phút) Thi tiếp sức. Đổi vai sau mỗi hai câu để ai cũng được chạy và viết.",
        "Giáo viên đứng gần tường, nhắc người chạy đọc đủ thanh, không đọc lướt."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Các nhóm so bài với bản gốc, gạch chân lỗi dấu.",
        "Cả lớp xem các lỗi hay gặp nhất và đọc lại đoạn văn đồng thanh."
      ] },
      phan_hoa: {
        moi: "Đoạn văn 3–4 câu ngắn, có tranh; được xem lại bảng chữ cái có dấu.",
        kha: "Đoạn văn dài hơn, có câu ghép; sau khi chép xong, tóm tắt ý chính trong hai câu."
      },
      danh_gia: {
        vi: "Giáo viên ghi lại lỗi chính tả phổ biến để dạy lại ở buổi sau.",
        la: "Nhóm tự chấm bài theo bản gốc và chọn một lỗi cần nhớ.",
        kq: "(Tuỳ chọn) Chính tả nhanh 2 câu của đoạn văn vào cuối buổi."
      },
      tai_lieu: ["Đoạn văn in chữ to (mỗi nhóm một bản)", "Giấy, bút cho từng nhóm", "Bảng sáu thanh để nhắc"]
    },
    pro_tip: "Chọn đoạn văn có vài cặp dễ nhầm (ch/tr, s/x, dấu hỏi/dấu ngã) và đánh số từng câu. Khi so bài, nhóm nói \"nhóm mình sai dấu ở câu 3\" thay vì tranh cãi xem thiếu chỗ nào."
  },

  {
    ma: "HD03",
    slug: "ghe-nong",
    ten: "Ghế nóng",
    ten_en: "Hot Seat",
    ky_nang: ["tu-vung", "nghe-noi"],
    bac: [2, 3, 4],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [15, 20],
    si_so: [6, 30],
    thiet_bi: false,
    chuan_bi: "10–15 từ của bài đang học, viết trên thẻ hoặc chuẩn bị để viết lên bảng. Một chiếc ghế quay lưng về phía bảng.",
    canh: "ghe-nong",
    minh_hoa: {
      bang: "CÁI Ô",
      phu: "không đánh vần · không dịch",
      diem: "Đội A 3 · Đội B 2",
      dong_ho: "0:45",
      loi: ["Trời mưa thì cần cái này!", "Nó giúp mình không bị ướt.", "À… áo mưa?"]
    },
    khung: [
      { kn: "Nói (độc thoại)", bac: "Bậc 2–3", mo_ta: "Miêu tả đồ vật, con vật, việc làm quen thuộc bằng câu đơn giản; dùng cách nói vòng khi không nhớ từ." },
      { kn: "Nghe", bac: "Bậc 2", mo_ta: "Hiểu lời miêu tả ngắn để nhận ra sự vật được nói tới." },
      { kn: "Từ vựng", bac: "Bậc 3", mo_ta: "Dùng từ cùng nghĩa, trái nghĩa và từ đi kèm để giải thích nghĩa." }
    ],
    dung_kem: [
      { goc: "nguphap", ghi: "Ôn khung câu \"… là cái dùng để…\", \"… là con vật…\"." },
      { goc: "khobau", ghi: "Lớp khá: giải thích một thành ngữ cho bạn đoán." }
    ],
    gia_tri: "Học viên không được nói từ cần đoán, nên phải miêu tả, định nghĩa và đưa ví dụ. Đây chính là kỹ năng nói vòng mà người học tiếng Việt cần mỗi khi quên từ: \"cái dùng để…\", \"con vật có…\". Người đoán luyện nghe lấy ý, còn cả đội ôn lại những từ đi kèm.",
    cac_buoc: [
      ["Đặt ghế", "Đặt một chiếc ghế quay lưng về phía bảng. Chia lớp thành các đội; mỗi đội cử một bạn ngồi ghế nóng."],
      ["Giải thích luật", "Giáo viên viết một từ lên bảng. Đồng đội giải thích nhưng không được nói từ đó, không đánh vần, không dịch sang tiếng Anh."],
      ["Miêu tả và đoán", "Đồng đội dùng khung câu: \"Đây là cái dùng để…\", \"Nó màu…\". Bạn ngồi ghế nóng lắng nghe và đoán từ."],
      ["Đổi người", "Đoán đúng hoặc hết 60 giây thì đổi bạn khác lên ghế. Mỗi từ đoán đúng được một điểm."],
      ["Ôn lại từ", "Cả lớp ôn từng từ: gợi ý nào hay nhất? Học viên ghi gợi ý đó bên cạnh từ trong vở."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta học cách miêu tả một từ bằng những từ mình đã biết.",
        "Chúng ta ôn từ vựng của bài theo cách vui và nhanh."
      ],
      tieu_chi: [
        "Em miêu tả được một từ mà không nói ra từ đó.",
        "Em dùng được ít nhất hai khung câu miêu tả.",
        "Em đoán từ dựa vào gợi ý của bạn."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Giáo viên miêu tả một đồ vật trong lớp; cả lớp đoán.",
        "Viết lên bảng 4 khung câu miêu tả: Đây là cái dùng để… / Nó màu… / Mình thấy nó ở… / Nó ngược với…"
      ] },
      chinh: { phut: "10–12", viec: [
        "(1 phút) Chia đội, mỗi đội cử người ngồi ghế đầu tiên.",
        "(8–10 phút) Chơi theo lượt, mỗi lượt 60 giây. Đổi người ngồi ghế sau mỗi từ.",
        "Giáo viên ghi lại các gợi ý hay để dùng ở phần củng cố."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Cả lớp chọn gợi ý hay nhất cho từng từ.",
        "Học viên chép 3 từ khó cùng gợi ý vào vở."
      ] },
      phan_hoa: {
        moi: "Từ có tranh; được dùng cử chỉ kèm lời; dùng khung câu có sẵn trên bảng.",
        kha: "Từ trừu tượng hơn (vui vẻ, chăm chỉ); cấm thêm một \"từ cấm\" liên quan."
      },
      danh_gia: {
        vi: "Giáo viên quan sát ai dùng được khung câu, ai còn chỉ dùng cử chỉ.",
        la: "Học viên tự chọn khung câu mình dùng tốt nhất và một khung muốn luyện thêm.",
        kq: "(Tuỳ chọn) Viết định nghĩa ngắn cho 3 từ của bài."
      },
      tai_lieu: ["Thẻ từ của bài", "Bảng khung câu miêu tả", "Đồng hồ đếm 60 giây"]
    },
    pro_tip: "Hãy để bạn nhút nhát nhất làm người đoán đầu tiên, không phải người gợi ý. Ngồi ghế nóng chủ yếu là lắng nghe, và cả đội đang cố giúp bạn, nên đây là cơ hội lấy tự tin chứ không phải bị soi xét."
  },

  {
    ma: "HD04",
    slug: "tho-san-chu-cai",
    ten: "Thợ săn chữ cái",
    ten_en: "Letter Hunters",
    ky_nang: ["doc", "tu-vung"],
    bac: [1],
    doi_tuong: ["5-8"],
    thoi_luong: [15, 20],
    si_so: [4, 20],
    thiet_bi: false,
    chuan_bi: "12–15 thẻ chữ cái tiếng Việt, có cả ă, â, đ, ê, ô, ơ, ư, giấu quanh lớp. Mỗi đội một \"phiếu thợ săn\" ghi 5 chữ cần tìm.",
    canh: "san-lop",
    minh_hoa: {
      bang: "Thợ săn chữ cái",
      phu: "Xem phiếu thợ săn",
      the: ["Đ", "Ă", "Ô", "B", "Ư"],
      loi: ["Mình tìm thấy rồi!", "Đờ – đu đủ!"]
    },
    khung: [
      { kn: "Đọc", bac: "Bậc 1", mo_ta: "Nhận biết chữ cái, âm và tiếng rất quen thuộc." },
      { kn: "Nói (độc thoại)", bac: "Bậc 1", mo_ta: "Đọc to âm và nói một từ quen thuộc bắt đầu bằng âm đó." }
    ],
    dung_kem: [
      { goc: "baihoc", ghi: "Dùng ngay sau Bài 1 (bảng chữ cái, nguyên âm, phụ âm)." },
      { goc: "vuihoc", ghi: "Lấy từ minh hoạ cho mỗi chữ từ sách Vui học tiếng Việt." }
    ],
    gia_tri: "Cuộc săn cho trẻ lý do để nhìn thật kỹ hình dạng chữ, nhất là những chữ chỉ khác nhau một cái mũ, một cái râu: a – ă – â, o – ô – ơ, u – ư, d – đ. Đọc âm và nói một từ cho mỗi chữ tìm được giúp nối hình chữ, âm và nghĩa. Làm theo đội giúp trẻ nhút nhát tham gia an toàn.",
    cac_buoc: [
      ["Giấu chữ cái", "Trước giờ học, giấu thẻ chữ ở chỗ an toàn: dưới ghế, sau cửa, kẹp trong sách."],
      ["Giới thiệu phiếu", "Mỗi đội 3–4 bạn nhận phiếu có 5 chữ cần tìm. Giáo viên làm mẫu: \"Cô đi tìm chữ ô.\""],
      ["Đi săn", "Mỗi lượt, một thợ săn của đội đi tìm một chữ rồi mang về bàn."],
      ["Đọc âm", "Tại bàn, thợ săn giơ thẻ, cả đội đọc âm (a, bờ, cờ, đờ…) và nói một từ: \"Đờ – đu đủ!\""],
      ["Khoe kết quả", "Các đội dán chữ lên phiếu và đọc cho cả lớp nghe."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta nhận ra các chữ cái tiếng Việt, cả những chữ có mũ, có râu.",
        "Chúng ta đọc âm và nói được một từ cho mỗi chữ."
      ],
      tieu_chi: [
        "Em tìm đúng chữ ghi trên phiếu.",
        "Em đọc đúng âm của chữ.",
        "Em nói được một từ có âm đó."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Hát hoặc đọc nhịp bảng chữ cái theo âm.",
        "Giơ từng cặp dễ nhầm (o – ô – ơ); cả lớp chỉ vào cái mũ, cái râu."
      ] },
      chinh: { phut: "10", viec: [
        "(2 phút) Phát phiếu, làm mẫu một lượt đi săn.",
        "(6–8 phút) Các đội săn chữ theo lượt; mỗi lượt chỉ mang về một thẻ.",
        "Giáo viên đi theo các đội, nhắc đọc âm chứ không đọc tên chữ."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Mỗi đội đọc 5 chữ của mình và một từ cho mỗi chữ.",
        "Cả lớp chọn một từ hay nhất cho mỗi chữ để dán lên tường lớp."
      ] },
      phan_hoa: {
        moi: "Phiếu có 3 chữ, mỗi chữ kèm tranh gợi ý; được đi săn cùng bạn.",
        kha: "Phiếu ghi tiếng thay vì chữ (bà, cá); thợ săn phải tìm đủ các chữ ghép thành tiếng."
      },
      danh_gia: {
        vi: "Giáo viên ghi lại những chữ trẻ còn nhầm.",
        la: "Trẻ tô màu ngôi sao cạnh chữ mình đã đọc đúng.",
        kq: "(Tuỳ chọn) Chỉ và đọc 5 chữ bất kỳ trên bảng chữ cái."
      },
      tai_lieu: ["Thẻ chữ cái tiếng Việt", "Phiếu thợ săn (mỗi đội một phiếu)", "Băng dính giấy"]
    },
    pro_tip: "Cho các chữ dễ nhầm vào cùng một phiếu (o – ô – ơ). Thợ săn phải nhìn kỹ từng cái mũ, cái râu, và cả đội sẽ tự sửa cho nhau. Giấu vài chữ ngang tầm mắt trẻ và vài chữ cao hơn một chút để bạn nào cũng có cơ hội."
  },

  {
    ma: "HD05",
    slug: "bowling-van",
    ten: "Bowling vần",
    ten_en: "Rhyme Bowling",
    ky_nang: ["doc", "nghe-noi"],
    bac: [1],
    doi_tuong: ["5-8", "9-14"],
    thoi_luong: [15, 20],
    si_so: [6, 24],
    thiet_bi: false,
    chuan_bi: "6–10 chai nhựa làm ki, mỗi chai dán một tiếng có vần đang học (bàn, lan, xinh, tính, ông, sông…); một quả bóng mềm; bảng nhóm vần trên bảng lớp.",
    canh: "bowling",
    minh_hoa: {
      bang: "Bowling vần",
      phu: "Làm mẫu một lượt",
      the: ["bàn", "lan", "xinh", "tính", "ông", "sông"],
      loi: ["Mình làm đổ \"bàn\"!", "Vần an!"]
    },
    khung: [
      { kn: "Đọc", bac: "Bậc 1", mo_ta: "Đọc đúng các tiếng có vần quen thuộc; nhận ra các tiếng cùng vần." },
      { kn: "Nghe", bac: "Bậc 1", mo_ta: "Phân biệt các vần gần nhau khi nghe (an – ang, in – inh)." }
    ],
    dung_kem: [
      { goc: "baihoc", ghi: "Dùng sau các bài vần; lấy tiếng trong bài làm chữ dán lên ki." },
      { goc: "luyennoi", ghi: "Phần Bảng âm (bảng vần) để nghe lại vần chuẩn." }
    ],
    gia_tri: "Mỗi lượt lăn bóng cho trẻ một lý do để đọc ngay. Xếp các tiếng vừa đọc vào đúng nhóm vần giúp trẻ thấy quy luật của tiếng Việt: âm đầu + vần + thanh. Đây là cầu nối từ đánh vần sang đọc trơn.",
    cac_buoc: [
      ["Dựng đường lăn", "Dựng các ki thành hình tam giác cuối một khoảng trống. Kẻ bảng nhóm vần lên bảng: an, inh, ông."],
      ["Làm mẫu một lượt", "Giáo viên lăn bóng, nhặt một ki đổ và đọc: \"Bàn – vần an!\""],
      ["Lăn và đọc", "Các đội lần lượt chơi. Người lăn đọc mọi ki mình làm đổ; cả đội giúp khi cần."],
      ["Xếp vào nhóm vần", "Đội dán mỗi tiếng dưới đúng nhóm vần trên bảng."],
      ["Đọc bảng", "Cả lớp đọc to từng nhóm vần và thêm một tiếng mới cho mỗi nhóm, có thể đổi thanh: ban, bán, bàn, bạn."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta đọc các tiếng có vần đã học.",
        "Chúng ta xếp các tiếng cùng vần vào một nhóm."
      ],
      tieu_chi: [
        "Em đọc đúng tiếng trên ki mình làm đổ.",
        "Em nói được tiếng đó có vần gì.",
        "Em tìm thêm được một tiếng cùng vần."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Vỗ tay đánh vần: bờ – an – ban – huyền – bàn.",
        "Giới thiệu ba nhóm vần trên bảng."
      ] },
      chinh: { phut: "10", viec: [
        "(1 phút) Làm mẫu một lượt lăn và đọc.",
        "(8 phút) Các đội lăn theo lượt; đọc xong mới được dựng lại ki.",
        "Giáo viên đứng cạnh bảng nhóm vần, khen những bạn đọc đúng thanh."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Đọc đồng thanh từng nhóm vần.",
        "Mỗi đội thêm một tiếng mới vào một nhóm vần."
      ] },
      phan_hoa: {
        moi: "Ki dán tiếng có tranh; chỉ hai nhóm vần.",
        kha: "Ki dán từ hai tiếng (bàn tay, sông Hồng); đọc xong đặt một câu ngắn."
      },
      danh_gia: {
        vi: "Giáo viên đánh dấu vần nào trẻ còn đọc nhầm.",
        la: "Mỗi đội tự kiểm tra bảng nhóm vần của mình.",
        kq: "(Tuỳ chọn) Phiếu nối tiếng với nhóm vần."
      },
      tai_lieu: ["6–10 chai nhựa có dán tiếng", "Bóng mềm", "Bảng nhóm vần"]
    },
    pro_tip: "Cho một ít nước hoặc cát vào chai. Ki đổ quá dễ thì trò chơi thành may rủi; ki phải lăn khéo mới đổ thì trọng tâm quay về việc đọc."
  },

  {
    ma: "HD06",
    slug: "bat-cap-dau-thanh",
    ten: "Bắt cặp dấu thanh",
    ten_en: "Tone Snap",
    ky_nang: ["doc", "nghe-noi", "tu-vung"],
    bac: [1, 2],
    doi_tuong: ["5-8", "9-14", "nguoi-lon"],
    thoi_luong: [15, 20],
    si_so: [4, 24],
    thiet_bi: false,
    chuan_bi: "Bộ thẻ tiếng chỉ khác dấu thanh (ma, má, mà, mạ; ba, bà, bá…), mỗi thẻ có tranh hoặc nghĩa; bảng sáu thanh trên bảng lớp.",
    canh: "ban",
    minh_hoa: {
      bang: "Bắt cặp dấu thanh",
      phu: "Làm mẫu: Bắt!",
      the: ["ma", "má", "mà", "mạ", "ba"],
      loi: ["Ma và má – bắt!", "Má là mẹ!"]
    },
    khung: [
      { kn: "Nghe", bac: "Bậc 1", mo_ta: "Phân biệt các thanh điệu khi nghe tiếng quen thuộc." },
      { kn: "Đọc", bac: "Bậc 1", mo_ta: "Đọc đúng tiếng có dấu thanh." },
      { kn: "Nói (độc thoại)", bac: "Bậc 1–2", mo_ta: "Phát âm rõ sáu thanh trong từ quen thuộc và nói nghĩa của từ." }
    ],
    dung_kem: [
      { goc: "luyennoi", ghi: "Luyện sáu thanh và xem đường cao độ của mình trước khi chơi." },
      { goc: "baihoc", ghi: "Dùng sau các bài học dấu thanh." }
    ],
    gia_tri: "Với người học tiếng Việt, thanh điệu là chỗ khó nhất: đổi một dấu là đổi nghĩa (ma, má, mà). Trò chơi buộc người học nhìn dấu, đọc đúng thanh và nói được nghĩa, nên thanh điệu gắn với nghĩa chứ không chỉ là ký hiệu trên chữ.",
    cac_buoc: [
      ["Nghe và nhận ra", "Giáo viên đọc ba tiếng: ma – má – mà. Học viên dùng tay vẽ đường thanh trong không khí: ngang, đi lên, đi xuống."],
      ["Làm mẫu", "Lật hai thẻ. Hai tiếng giống nhau, chỉ khác dấu thanh thì đập tay nói \"Bắt!\", rồi đọc cả hai tiếng và nói nghĩa."],
      ["Chơi theo nhóm", "Nhóm 3–4 bạn lần lượt lật thẻ. Chỉ được giữ cặp khi đọc đúng thanh và nói được nghĩa của cả hai tiếng."],
      ["Thử thách đặt câu", "Mỗi bạn đặt một câu có cả hai tiếng của một cặp, ví dụ \"Ba và bà đi chợ.\""],
      ["Chia sẻ", "Các nhóm đọc câu vui nhất; cả lớp nghe và vẽ đường thanh bằng tay cho các tiếng."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta nghe và đọc đúng các tiếng chỉ khác dấu thanh.",
        "Chúng ta hiểu rằng đổi dấu thanh là đổi nghĩa."
      ],
      tieu_chi: [
        "Em đọc đúng thanh của tiếng trên thẻ.",
        "Em nói được nghĩa của hai tiếng trong một cặp.",
        "Em đặt được một câu có cả hai tiếng."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Giáo viên đọc sáu thanh với \"ma\"; cả lớp vẽ đường thanh bằng tay.",
        "Chỉ vào bảng sáu thanh và đọc đồng thanh."
      ] },
      chinh: { phut: "10", viec: [
        "(2 phút) Làm mẫu một lượt bắt cặp.",
        "(8 phút) Chơi theo nhóm; nhóm trưởng giữ thẻ nghĩa để kiểm tra.",
        "Giáo viên đi vòng quanh, nghe và sửa thanh hỏi, thanh ngã, thanh nặng."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Mỗi nhóm đọc một câu có cặp tiếng của mình.",
        "Cả lớp nhắc lại: đổi dấu là đổi nghĩa."
      ] },
      phan_hoa: {
        moi: "Chỉ dùng ba thanh (ngang, sắc, huyền); mỗi thẻ có tranh lớn.",
        kha: "Thêm thanh hỏi, ngã; dùng từ hai tiếng (cá mè, cà phê); tự làm thêm cặp thẻ mới."
      },
      danh_gia: {
        vi: "Giáo viên ghi lại thanh nào học viên còn đọc nhầm.",
        la: "Học viên tự chọn thanh khó nhất của mình và luyện thêm trên góc Luyện nói.",
        kq: "(Tuỳ chọn) Nghe giáo viên đọc và khoanh đúng tiếng trong phiếu."
      },
      tai_lieu: ["Bộ thẻ tiếng có tranh", "Bảng sáu thanh", "Phiếu nghe – khoanh"]
    },
    pro_tip: "Cho học viên vẽ tranh vui cho mỗi cặp, như \"bà cho ba ba ăn\". Tranh càng buồn cười thì dấu thanh càng dễ nhớ."
  },

  {
    ma: "HD07",
    slug: "di-cho",
    ten: "Đi chợ",
    ten_en: "Going to the Market",
    ky_nang: ["nghe-noi", "tu-vung"],
    bac: [1, 2],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [20, 30],
    si_so: [8, 30],
    thiet_bi: false,
    chuan_bi: "Đồ thật hoặc tranh có gắn giá (cam, chuối, xoài, bánh mì…); tiền giấy đồ chơi; danh sách đi chợ cho người mua; khung hội thoại trên bảng.",
    canh: "cho",
    minh_hoa: {
      bang: "Đi chợ",
      phu: "Làm mẫu hội thoại",
      the: ["2 đô", "5 đô"],
      loi: ["Xoài này bao nhiêu tiền ạ?", "Hai đô một quả cháu ạ."]
    },
    khung: [
      { kn: "Nói (hội thoại)", bac: "Bậc 1–2", mo_ta: "Thực hiện giao dịch đơn giản: hỏi giá, nói số lượng, mua bán đồ quen thuộc." },
      { kn: "Nghe", bac: "Bậc 1", mo_ta: "Hiểu số, giá tiền và số lượng trong tình huống mua bán." },
      { kn: "Từ vựng", bac: "Bậc 2", mo_ta: "Dùng loại từ với số đếm (hai quả xoài, một ổ bánh mì) và từ xưng hô phù hợp." }
    ],
    dung_kem: [
      { goc: "venhaem", ghi: "Giới thiệu món ăn, trái cây trước khi mở chợ." },
      { goc: "nguphap", ghi: "Ôn số đếm và loại từ." }
    ],
    gia_tri: "Đi chợ là một trong những tình huống thật đầu tiên người học gặp khi về Việt Nam hay ghé chợ Việt ở Canada. Đóng vai với giá và tiền giấy giúp luyện số đếm, câu hỏi \"bao nhiêu\" và cách nói lễ phép (ạ, dạ, cảm ơn cô) trong một tình huống có ý nghĩa.",
    cac_buoc: [
      ["Mở sạp hàng", "Một nửa lớp làm người bán có hàng gắn giá; nửa còn lại là người mua có danh sách và tiền giấy."],
      ["Làm mẫu hội thoại", "Giáo viên làm mẫu: \"Cô ơi, xoài này bao nhiêu tiền ạ?\" – \"Hai đô một quả.\" – \"Cho cháu hai quả ạ.\""],
      ["Đi chợ", "Người mua đi các sạp, mua đủ đồ trong danh sách mà không tiêu quá số tiền mình có."],
      ["Đổi vai", "Người mua thành người bán và nhận danh sách mới."],
      ["Kể lại", "Người mua kể đã mua gì, hết bao nhiêu: \"Cháu mua hai quả xoài, hết bốn đô.\""]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta học cách hỏi giá và mua đồ ở chợ.",
        "Chúng ta học cách nói lễ phép với người lớn."
      ],
      tieu_chi: [
        "Em hỏi được giá: \"… bao nhiêu tiền ạ?\"",
        "Em nói được số lượng với loại từ: hai quả, một ổ.",
        "Em dùng \"ạ\", \"dạ\", \"cảm ơn cô\" khi mua bán."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Ôn số từ 1 đến 20 bằng trò đếm tiếp sức.",
        "Giới thiệu khung hội thoại trên bảng."
      ] },
      chinh: { phut: "15–20", viec: [
        "(2 phút) Làm mẫu hội thoại với một học viên.",
        "(10–12 phút) Đi chợ hai lượt, đổi vai giữa hai lượt.",
        "Giáo viên đóng vai người mua \"khó tính\" ở vài sạp để học viên luyện thêm."
      ] },
      cung_co: { phut: "5", viec: [
        "(4 phút) Vài học viên kể lại đã mua gì, hết bao nhiêu.",
        "Cả lớp sửa lỗi loại từ và số đếm hay gặp."
      ] },
      phan_hoa: {
        moi: "Danh sách có tranh; giá là số tròn; thẻ khung câu cầm tay.",
        kha: "Chọn xưng hô theo tuổi người bán (bác, cô, chị, em); thêm mặc cả: \"Cô bớt cho cháu được không ạ?\""
      },
      danh_gia: {
        vi: "Giáo viên ghi nhận ai dùng được câu hỏi giá và từ lễ phép.",
        la: "Học viên tự kiểm tra danh sách và số tiền còn lại.",
        kq: "(Tuỳ chọn) Viết lại đoạn hội thoại mua một món đồ."
      },
      tai_lieu: ["Tranh hoặc đồ thật gắn giá", "Tiền giấy đồ chơi", "Danh sách đi chợ"]
    },
    pro_tip: "Đưa người mua ít tiền hơn cần một chút. Học viên sẽ phải chọn, hỏi lại giá và nói \"Đắt quá! Cô bớt cho cháu được không ạ?\" Đó là tiếng Việt thật, không phải kịch bản."
  },

  {
    ma: "HD08",
    slug: "do-vui-loai-tu",
    ten: "Đố vui loại từ",
    ten_en: "Classifier Quiz",
    ky_nang: ["tu-vung", "nghe-noi"],
    bac: [2, 3],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [20, 25],
    si_so: [6, 30],
    thiet_bi: false,
    chuan_bi: "Thẻ tranh hoặc thẻ từ (mèo, bàn, cam, sách, xe đạp…); bảng con hoặc giấy cho mỗi đội; bảng điểm.",
    canh: "doi-bang",
    minh_hoa: {
      bang: "Đố vui loại từ",
      phu: "Chia đội",
      the: ["con", "cái", "quả", "quyển", "chiếc"],
      loi: ["Mèo đi với \"con\" hay \"cái\"?", "\"Con\"! Vì mèo là con vật."]
    },
    khung: [
      { kn: "Từ vựng – Ngữ pháp", bac: "Bậc 2", mo_ta: "Dùng đúng loại từ thường gặp với danh từ quen thuộc." },
      { kn: "Nói (độc thoại)", bac: "Bậc 2–3", mo_ta: "Giải thích ngắn lý do lựa chọn của mình." },
      { kn: "Viết", bac: "Bậc 1–2", mo_ta: "Viết cụm danh từ có số đếm: hai con mèo, ba quả cam." }
    ],
    dung_kem: [
      { goc: "nguphap", ghi: "Phần từ và cụm từ: ôn danh từ, loại từ." }
    ],
    gia_tri: "Loại từ (con, cái, quả, quyển, chiếc…) không có trong tiếng Anh nên người học hay bỏ quên hoặc dùng một từ cho mọi thứ. Khi các đội phải giải thích vì sao mình chọn, ngữ pháp trở thành bài toán cần suy luận, và mẹo do chính học viên nói ra sẽ nhớ lâu hơn.",
    cac_buoc: [
      ["Dạy một mẹo", "Giới thiệu mẹo: \"con\" đi với con vật, \"quả\" đi với vật tròn, \"cái\" đi với đồ vật. Nhắc vài ngoại lệ hay gặp: con dao, con đường."],
      ["Chia đội", "Đội 3–4 bạn với một bảng con; mỗi lượt một bạn viết."],
      ["Các vòng đố", "Giáo viên giơ tranh hoặc đọc từ; các đội bàn nhau, viết cụm có số đếm như \"hai con mèo\" rồi giơ bảng."],
      ["Giải thích để ghi điểm", "Đội được 1 điểm cho đáp án đúng và thêm 1 điểm nếu nói được lý do."],
      ["Bảng mẹo của lớp", "Cả lớp ghi các mẹo vào bảng \"Mẹo loại từ\" và dán trên tường lớp."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta dùng đúng loại từ con, cái, quả, quyển, chiếc.",
        "Chúng ta giải thích được vì sao chọn loại từ đó."
      ],
      tieu_chi: [
        "Em viết đúng cụm có số đếm và loại từ.",
        "Em nói được lý do bằng một câu: \"Vì … là …\"",
        "Em nhớ được ít nhất một ngoại lệ."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Giáo viên đếm đồ trong lớp: một cái bàn, hai quyển sách… Học viên nhận ra từ đứng trước danh từ.",
        "Giới thiệu mẹo đầu tiên."
      ] },
      chinh: { phut: "12–15", viec: [
        "(1 phút) Chia đội, phát bảng con.",
        "(10–12 phút) 8–10 vòng đố; mỗi vòng 30 giây bàn nhau.",
        "Giáo viên ghi các lý do hay của học viên lên bảng."
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Cả lớp hoàn thành bảng \"Mẹo loại từ\".",
        "Mỗi học viên viết hai cụm danh từ có loại từ vào vở."
      ] },
      phan_hoa: {
        moi: "Chỉ ba loại từ (con, cái, quả); có tranh cho mọi từ.",
        kha: "Thêm chiếc, tờ, bông, ngôi; tự tìm thêm ngoại lệ và giải thích."
      },
      danh_gia: {
        vi: "Giáo viên xem bảng con các đội để biết loại từ nào còn nhầm.",
        la: "Đội tự kiểm tra đáp án theo bảng mẹo.",
        kq: "(Tuỳ chọn) Phiếu điền loại từ cho 10 danh từ."
      },
      tai_lieu: ["Thẻ tranh, thẻ từ", "Bảng con và bút", "Bảng điểm"]
    },
    pro_tip: "Chỉ cho điểm thứ hai khi đội giải thích được lý do. Đội đoán đúng mà không giải thích được sẽ hiểu rằng nắm được mẹo quan trọng hơn may mắn."
  },

  {
    ma: "HD09",
    slug: "sap-xep-cau",
    ten: "Sắp xếp câu",
    ten_en: "Sentence Scramble",
    ky_nang: ["doc", "tu-vung"],
    bac: [1, 2],
    doi_tuong: ["5-8", "9-14", "nguoi-lon"],
    thoi_luong: [15, 20],
    si_so: [4, 30],
    thiet_bi: false,
    chuan_bi: "Phong bì đựng câu cắt rời (mỗi thẻ một tiếng hoặc một từ) lấy từ truyện vừa học; tranh cho mỗi câu.",
    canh: "ban",
    minh_hoa: {
      bang: "Sắp xếp câu",
      phu: "Làm mẫu",
      the: ["Con", "mèo", "đen", "nằm", "ngủ"],
      loi: ["Con mèo đen nằm ngủ.", "Viết hoa chữ đầu câu!"]
    },
    khung: [
      { kn: "Đọc", bac: "Bậc 1", mo_ta: "Đọc hiểu câu ngắn và nối câu với tranh." },
      { kn: "Viết", bac: "Bậc 1", mo_ta: "Chép lại câu đúng trật tự, viết hoa đầu câu và đặt dấu chấm." },
      { kn: "Ngữ pháp", bac: "Bậc 1–2", mo_ta: "Nhận ra trật tự Ai – làm gì; từ chỉ đặc điểm đứng sau danh từ (con mèo đen)." }
    ],
    dung_kem: [
      { goc: "cotich", ghi: "Lấy câu từ một truyện cổ tích cả lớp vừa đọc." },
      { goc: "nguphap", ghi: "Phần câu: ôn trật tự từ trong câu." }
    ],
    gia_tri: "Tiếng Việt có trật tự từ chặt chẽ, và có chỗ ngược với tiếng Anh: \"con mèo đen\" chứ không phải \"đen con mèo\". Sắp xếp lại câu khiến học viên nghĩ về trật tự từ và nghĩa cùng lúc. Kiểm tra bằng tranh tạo thói quen tự hỏi \"Câu này có đúng ý không?\" khi đọc.",
    cac_buoc: [
      ["Đọc truyện", "Đọc lại một truyện hoặc đoạn văn cả lớp đã học."],
      ["Làm mẫu", "Sắp xếp một câu trên bảng; chỉ vào chữ viết hoa đầu câu và dấu chấm cuối câu."],
      ["Thi sắp xếp", "Các nhóm mở phong bì và ghép các thẻ thành câu."],
      ["Ghép với tranh", "Các nhóm đặt câu cạnh tranh đúng và đọc to."],
      ["Viết lại", "Học viên chép hai câu vào vở, chú ý dấu thanh."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta sắp xếp từ thành câu đúng trật tự.",
        "Chúng ta đọc câu và kiểm tra nghĩa bằng tranh."
      ],
      tieu_chi: [
        "Em ghép được câu đúng trật tự.",
        "Em viết hoa chữ đầu câu và đặt dấu chấm.",
        "Em đọc to câu và chỉ đúng tranh."
      ],
      khoi_dong: { phut: "3–5", viec: [
        "(3 phút) Đọc lại truyện; giáo viên hỏi nhanh về nhân vật.",
        "Đưa một câu bị đảo trật tự lên bảng; cả lớp tìm chỗ sai."
      ] },
      chinh: { phut: "10", viec: [
        "(1 phút) Làm mẫu một câu.",
        "(8 phút) Các nhóm sắp xếp 4–5 câu trong phong bì.",
        "Giáo viên hỏi các nhóm: \"Từ nào chỉ màu? Nó đứng ở đâu?\""
      ] },
      cung_co: { phut: "5", viec: [
        "(3 phút) Các nhóm đọc câu theo thứ tự truyện.",
        "Học viên chép hai câu vào vở."
      ] },
      phan_hoa: {
        moi: "Câu 3–4 từ; thẻ đầu câu tô màu khác.",
        kha: "Câu dài có trạng ngữ (Sáng nay, …); tự viết câu mới cho bạn sắp xếp."
      },
      danh_gia: {
        vi: "Giáo viên xem nhóm nào còn đặt sai vị trí từ chỉ đặc điểm.",
        la: "Nhóm đối chiếu với tranh để tự kiểm tra.",
        kq: "(Tuỳ chọn) Phiếu sắp xếp 3 câu."
      },
      tai_lieu: ["Phong bì câu cắt rời", "Tranh minh hoạ cho từng câu", "Vở tập viết"]
    },
    pro_tip: "Thêm vào mỗi phong bì một từ không thuộc câu. Tìm ra \"từ gián điệp\" buộc học viên đọc kỹ từng thẻ."
  },

  {
    ma: "HD10",
    slug: "co-bao",
    ten: "Cô bảo",
    ten_en: "Simon Says",
    ky_nang: ["nghe-noi", "tu-vung"],
    bac: [1],
    doi_tuong: ["5-8"],
    thoi_luong: [5, 10],
    si_so: [4, 30],
    thiet_bi: false,
    chuan_bi: "Không cần đồ dùng.",
    canh: "san-lop",
    minh_hoa: {
      bang: "Cô bảo",
      phu: "Chỉ làm khi nghe \"Cô bảo\"",
      the: ["sờ mũi", "nhảy", "vỗ tay", "ngồi"],
      loi: ["Cô bảo: sờ mũi!", "Nhảy lên! (cô không bảo)"]
    },
    khung: [
      { kn: "Nghe", bac: "Bậc 1", mo_ta: "Hiểu và làm theo chỉ dẫn rất ngắn khi người nói chậm, rõ." },
      { kn: "Từ vựng", bac: "Bậc 1", mo_ta: "Bộ phận cơ thể và động từ chỉ hành động quen thuộc." }
    ],
    dung_kem: [
      { goc: "baihoc", ghi: "Ôn từ về cơ thể, hành động của bài đang học." }
    ],
    gia_tri: "Trò chơi rèn nghe thật kỹ: học viên chỉ làm khi nghe \"Cô bảo\". Đây là hoạt động phản hồi bằng vận động toàn thân quen thuộc cho bộ phận cơ thể và động từ, giúp trẻ hiểu tiếng Việt trước khi phải nói nhiều.",
    cac_buoc: [
      ["Khởi động", "Ôn bộ phận cơ thể bằng cách vừa chạm vừa gọi tên: đầu, vai, đầu gối, ngón chân."],
      ["Giải thích luật", "Chỉ làm theo khi nghe \"Cô bảo\". Lệnh không có \"Cô bảo\" thì đứng yên."],
      ["Chơi", "Ra lệnh nhanh dần: \"Cô bảo: sờ mũi!\", \"Cô bảo: vỗ tay hai cái!\", \"Ngồi xuống!\" Bạn nào làm khi không có \"Cô bảo\" thì ngồi nghỉ một vòng."],
      ["Học viên làm Trâu Con", "Mời một bạn lên làm Trâu Con và ra lệnh: \"Trâu Con bảo: giơ tay!\""],
      ["Thả lỏng", "Lệnh chậm dần: \"Cô bảo: ngồi xuống nhẹ nhàng.\", \"Cô bảo: hít thở thật sâu.\""]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta nghe và làm theo lệnh bằng tiếng Việt.",
        "Chúng ta ôn tên bộ phận cơ thể và từ chỉ hành động."
      ],
      tieu_chi: [
        "Em làm đúng khi nghe \"Cô bảo\".",
        "Em đứng yên khi lệnh không có \"Cô bảo\".",
        "Em nói được một lệnh cho các bạn."
      ],
      khoi_dong: { phut: "2", viec: [
        "(2 phút) Chạm và gọi tên bộ phận cơ thể theo nhịp."
      ] },
      chinh: { phut: "5", viec: [
        "(1 phút) Giải thích luật, chơi thử hai lệnh.",
        "(4 phút) Chơi nhanh dần; mời hai bạn lên làm Trâu Con."
      ] },
      cung_co: { phut: "2", viec: [
        "(2 phút) Lệnh chậm để thả lỏng; cả lớp nhắc lại ba từ mới."
      ] },
      phan_hoa: {
        moi: "Giáo viên làm động tác kèm lệnh ở vòng đầu.",
        kha: "Lệnh hai bước: \"Cô bảo: sờ mũi rồi vỗ tay!\"; bạn làm Trâu Con tự nghĩ lệnh."
      },
      danh_gia: {
        vi: "Giáo viên để ý bạn nào còn nhìn bạn khác mới làm theo.",
        la: "Trẻ tự giơ ngón cái: em nghe được bao nhiêu lệnh?",
        kq: "(Tuỳ chọn) Chỉ vào tranh bộ phận cơ thể khi giáo viên gọi tên."
      },
      tai_lieu: ["Không cần đồ dùng", "Tranh bộ phận cơ thể (tuỳ chọn)"]
    },
    pro_tip: "Đừng để bạn bị loại ngồi ngoài lâu. Cho vào chơi lại sau một vòng để những bạn nghe còn yếu được luyện tiếp. Ở Việt Nam trò này thường gọi là \"Thầy bảo\"; lớp có thể đổi thành \"Cô bảo\" hoặc \"Trâu Con bảo\"."
  },

  {
    ma: "HD11",
    slug: "chuoi-cau-chuyen",
    ten: "Chuỗi câu chuyện",
    ten_en: "Story Chain",
    ky_nang: ["nghe-noi", "viet"],
    bac: [2, 3],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [15, 20],
    si_so: [4, 30],
    thiet_bi: false,
    chuan_bi: "Một câu mở đầu; thẻ từ nối (Ngày xưa, Rồi, Bỗng nhiên, Nhưng, Cuối cùng); giấy để viết câu chuyện.",
    canh: "ban",
    minh_hoa: {
      bang: "Chuỗi câu chuyện",
      phu: "Từ nối",
      the: ["Ngày xưa", "Rồi", "Bỗng nhiên", "Cuối cùng"],
      loi: ["Ngày xưa, có một chú trâu nhỏ…", "…bị gió thổi bay nón lá!"]
    },
    khung: [
      { kn: "Nói (độc thoại)", bac: "Bậc 2–3", mo_ta: "Kể một chuỗi sự việc đơn giản theo trình tự, dùng từ nối." },
      { kn: "Nghe", bac: "Bậc 2", mo_ta: "Theo dõi mạch câu chuyện để nói tiếp câu cho hợp." },
      { kn: "Viết", bac: "Bậc 2", mo_ta: "Viết đoạn ngắn kể chuyện, có mở đầu và kết thúc." }
    ],
    dung_kem: [
      { goc: "cotich", ghi: "Đọc một truyện cổ tích trước để học viên quen lối kể \"Ngày xưa…\"." }
    ],
    gia_tri: "Mỗi bạn thêm một câu, nên ai cũng phải lắng nghe để câu chuyện đi tiếp. Từ nối như \"rồi\", \"bỗng nhiên\", \"cuối cùng\" trở thành công cụ để kể chuyện mạch lạc, và câu chuyện thường rất buồn cười. Lối mở đầu \"Ngày xưa…\" còn đưa học viên đến gần truyện cổ tích Việt Nam.",
    cac_buoc: [
      ["Câu mở đầu", "Đọc câu mở đầu: \"Ngày xưa, có một chú trâu nhỏ đội nón lá đi học.\""],
      ["Từ nối", "Giới thiệu các thẻ từ nối; làm mẫu một câu với \"Bỗng nhiên…\"."],
      ["Nối chuỗi", "Các nhóm lần lượt thêm một câu, mỗi câu dùng một thẻ từ nối."],
      ["Viết lại", "Các nhóm viết lại cả câu chuyện và đặt tên cho truyện."],
      ["Đọc to", "Các nhóm đọc truyện của mình; cả lớp bình chọn truyện vui nhất."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta kể chuyện theo trình tự bằng từ nối.",
        "Chúng ta viết lại câu chuyện của nhóm."
      ],
      tieu_chi: [
        "Em nói được một câu nối tiếp hợp với câu trước.",
        "Em dùng đúng ít nhất hai từ nối.",
        "Nhóm em viết được câu chuyện có mở đầu và kết thúc."
      ],
      khoi_dong: { phut: "3", viec: [
        "(3 phút) Giáo viên kể một truyện rất ngắn có 4 từ nối; học viên giơ tay khi nghe thấy từ nối."
      ] },
      chinh: { phut: "10", viec: [
        "(1 phút) Làm mẫu một vòng với cả lớp.",
        "(6 phút) Các nhóm nối chuỗi miệng, mỗi bạn hai lượt.",
        "(3 phút) Các nhóm viết lại truyện."
      ] },
      cung_co: { phut: "5", viec: [
        "(4 phút) Các nhóm đọc truyện; cả lớp bình chọn.",
        "Giáo viên khen các từ nối dùng hay."
      ] },
      phan_hoa: {
        moi: "Thẻ từ nối có tranh; được nói câu ngắn hoặc dùng khung \"Rồi chú trâu…\".",
        kha: "Thêm từ nối \"Tuy… nhưng…\", \"Vì thế\"; kết truyện bằng một bài học."
      },
      danh_gia: {
        vi: "Giáo viên nghe các nhóm và ghi lại từ nối còn dùng sai.",
        la: "Nhóm tự đánh dấu các từ nối đã dùng trong bài viết.",
        kq: "(Tuỳ chọn) Mỗi bạn viết một đoạn 4 câu có 3 từ nối."
      },
      tai_lieu: ["Thẻ từ nối", "Giấy viết cho từng nhóm", "Câu mở đầu in sẵn"]
    },
    pro_tip: "Gấp giấy để mỗi người chỉ thấy câu ngay trước mình. Lúc mở tờ giấy ra, những bất ngờ khiến cả lớp nhớ rất lâu."
  },

  {
    ma: "HD12",
    slug: "cuon-goi-cuon",
    ten: "Cùng cuốn gỏi cuốn",
    ten_en: "Fresh Spring Rolls",
    ky_nang: ["tich-hop", "nghe-noi", "viet"],
    bac: [2, 3],
    doi_tuong: ["9-14", "nguoi-lon"],
    thoi_luong: [40, 45],
    si_so: [6, 20],
    thiet_bi: false,
    chuan_bi: "Bánh tráng, bún, rau thơm, xà lách, tôm luộc hoặc đậu phụ, bát nước ấm, đĩa, găng tay. Hỏi trước về dị ứng (hải sản, đậu phộng).",
    canh: "ban",
    minh_hoa: {
      bang: "Cùng cuốn gỏi cuốn",
      phu: "Từ khoá",
      the: ["nhúng", "đặt", "gấp", "cuốn"],
      loi: ["Nhúng bánh tráng vào nước.", "Đừng nhúng lâu quá nhé!"]
    },
    khung: [
      { kn: "Nghe", bac: "Bậc 2", mo_ta: "Làm theo hướng dẫn nhiều bước trong tình huống quen thuộc." },
      { kn: "Nói (độc thoại)", bac: "Bậc 2–3", mo_ta: "Hướng dẫn người khác làm một việc theo thứ tự (trước tiên, sau đó, cuối cùng)." },
      { kn: "Viết", bac: "Bậc 2", mo_ta: "Viết công thức món ăn ngắn theo các bước." }
    ],
    dung_kem: [
      { goc: "venhaem", ghi: "Xem bài Vào Bếp Nhà Em trước buổi học để làm quen từ vựng." }
    ],
    gia_tri: "Vào bếp làm món Việt là cách học tiếng gắn liền với văn hoá: những động từ như nhúng, đặt, gấp, cuốn có ngay việc làm thật đi kèm. Học viên gốc Việt có dịp làm \"chuyên gia\" kể về món ăn của gia đình, còn học viên người nước ngoài học tiếng qua một trải nghiệm đáng nhớ.",
    cac_buoc: [
      ["Nói về món ăn", "Cho xem đĩa gỏi cuốn; học viên kể đã ăn ở đâu, nhân có những gì."],
      ["Từ khoá", "Dạy động từ và từ chỉ cách làm: nhúng, đặt, gấp, cuốn, nhẹ tay, thật chặt."],
      ["Làm và hướng dẫn", "Một bạn hướng dẫn từng bước bằng tiếng Việt, cả nhóm làm theo: \"Trước tiên, nhúng bánh tráng vào nước.\""],
      ["Viết công thức", "Các nhóm viết công thức gửi một người bạn, dùng trước tiên, sau đó, cuối cùng."],
      ["Thưởng thức và trình bày", "Các nhóm thưởng thức món ăn và đọc công thức của mình trước lớp."]
    ],
    giao_an: {
      muc_tieu: [
        "Chúng ta dùng động từ chỉ hoạt động nấu ăn.",
        "Chúng ta hướng dẫn và viết các bước làm một món ăn."
      ],
      tieu_chi: [
        "Em dùng đúng các từ nhúng, đặt, gấp, cuốn.",
        "Em nói các bước theo thứ tự với trước tiên, sau đó, cuối cùng.",
        "Nhóm em viết được công thức 4–5 bước."
      ],
      khoi_dong: { phut: "5", viec: [
        "(3 phút) Đoán nguyên liệu qua tranh; học viên kể món ăn Việt mình thích.",
        "Nhắc an toàn vệ sinh và dị ứng."
      ] },
      chinh: { phut: "25–30", viec: [
        "(5 phút) Dạy từ khoá bằng động tác; giáo viên làm mẫu một cuốn.",
        "(15 phút) Các nhóm cuốn gỏi cuốn, thay nhau làm người hướng dẫn.",
        "(8 phút) Các nhóm viết công thức."
      ] },
      cung_co: { phut: "5–10", viec: [
        "(5 phút) Thưởng thức và đọc công thức.",
        "Cả lớp ôn lại từ khoá bằng trò làm động tác – đoán từ."
      ] },
      phan_hoa: {
        moi: "Thẻ từ khoá có tranh; khung câu \"Trước tiên, …\"; chỉ cần nói từng bước ngắn.",
        kha: "Hướng dẫn mà không làm mẫu bằng tay; viết thêm nước chấm và lời khuyên cho người mới làm."
      },
      danh_gia: {
        vi: "Giáo viên nghe các nhóm và ghi nhận ai dùng được từ chỉ thứ tự.",
        la: "Nhóm tự kiểm tra công thức: có đủ bước, đúng thứ tự chưa?",
        kq: "(Tuỳ chọn) Mỗi bạn viết lại công thức ở nhà và làm cùng gia đình."
      },
      tai_lieu: ["Nguyên liệu và dụng cụ (theo nhóm)", "Thẻ từ khoá", "Phiếu viết công thức"]
    },
    pro_tip: "Mời một phụ huynh hoặc học viên gốc Việt dẫn phần làm mẫu. Sự am hiểu của họ trở thành trung tâm của buổi học, và cả lớp được nghe tiếng Việt tự nhiên."
  }
];
