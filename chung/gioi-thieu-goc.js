/*!
 * Giới thiệu từng góc học (cổng vietclass.cvcec.org): cách học (infographic) và tổng quan nội dung.
 * Số liệu lấy từ mã nguồn của từng góc (README, mục lục) ngày 15-11-2026. Sửa ở đây khi góc học thay đổi.
 * thu: bài học thử cho khách chưa đăng nhập.
 * congKhai: true thì ai cũng xem được trong cổng, không cần đăng nhập: cổng mở thẳng trang và trả lời góc học là hợp lệ.
 * vaoThang: true thì bấm vào góc mở thẳng trang của góc (khách: chế độ học thử), nút "Hướng dẫn" vẫn xem lại được giới thiệu.
 *   url   – trang mở trong khung khi bấm "Học thử";
 *   duong – các đường dẫn khách được mở trong chế độ học thử (cổng gửi cho góc học qua postMessage);
 *   ten   – tên bài học thử.
 *   Góc chưa có "thu" thì khách chỉ xem giới thiệu và được mời đăng nhập.
 */
window.CONG_GT = {
  baihoc: {
    gioiThieu: { vi: "Tiếng Việt cơ bản: lộ trình từ bảng chữ cái, âm, vần tới tập đọc. Mỗi bài là một chuỗi trò chơi cùng Trâu Con.", en: "Basic Vietnamese: a step-by-step path from the alphabet, sounds and rhymes to reading. Each lesson is a series of games with Trâu Con." },
    buoc: [
      { e: "👂", vi: "Nghe Trâu Con dẫn bài và đọc mẫu", en: "Listen as Trâu Con introduces the lesson and reads aloud" },
      { e: "🎮", vi: "Chơi lần lượt các trò chơi của bài", en: "Play the lesson's games one by one" },
      { e: "⭐", vi: "Mỗi trò được 1–3 sao: càng ít lỗi, càng nhiều sao", en: "Earn 1–3 stars per game: fewer mistakes, more stars" },
      { e: "🔁", vi: "Sau mỗi chặng có bài ôn tập", en: "Review lessons after each stage" },
      { e: "📝", vi: "In phiếu bài tập về nhà để luyện thêm", en: "Print the homework sheet for extra practice" }
    ],
    tongQuan: [
      { so: "80", vi: "bài học", en: "lessons" },
      { so: "12", vi: "bài ôn tập", en: "review lessons" },
      { so: "7–11", vi: "trò chơi mỗi bài", en: "games per lesson" }
    ],
    phan: [
      { vi: "Bài 1–2: bảng chữ cái, phụ âm ghép", en: "Lessons 1–2: the alphabet, consonant clusters" },
      { vi: "Bài 3–70: âm và vần", en: "Lessons 3–70: sounds and rhymes" },
      { vi: "Bài 71–80: tập đọc", en: "Lessons 71–80: reading" }
    ],
    vaoThang: true, // mở thẳng danh sách Bài 1–80; khách học thử Bài 1, bài khác ghi "Đăng nhập để học"
    thu: { url: "https://baihoc.cvcec.org/?phan=tieng-viet", duong: ["/", "/bai-1/"], ten: { vi: "Bài 1: Bảng chữ cái, nguyên âm và phụ âm", en: "Lesson 1: The alphabet, vowels and consonants" } }
  },
  vanhoa: {
    gioiThieu: { vi: "Văn hoá truyền thống: lễ Tết, phong tục và đời sống Việt qua bài đọc, từ mới và trò chơi.", en: "Traditional culture: Vietnamese festivals, customs and daily life through readings, new words and games." },
    buoc: [
      { e: "📜", vi: "Đọc thơ mở đầu cùng Trâu Con", en: "Read the opening poem with Trâu Con" },
      { e: "🔤", vi: "Học từ mới, từ khó", en: "Learn new and hard words" },
      { e: "📖", vi: "Đọc từng đoạn và trả lời câu hỏi", en: "Read each passage and answer questions" },
      { e: "🎮", vi: "Chơi trò ôn từ, xếp câu, điền từ", en: "Play word, sentence and fill-in games" },
      { e: "⭐", vi: "Mỗi trò được 1–3 sao", en: "Earn 1–3 stars per game" }
    ],
    tongQuan: [
      { so: "64", vi: "bài học (Bài 81–145)", en: "lessons (Lessons 81–145)" },
      { so: "10", vi: "trò chơi mỗi bài", en: "games per lesson" }
    ],
    phan: [
      { vi: "Lễ Tết: Giỗ Tổ Hùng Vương, Tết Đoan Ngọ, Tết Trung thu, Tết Nguyên đán…", en: "Festivals: Hùng Kings' Day, Đoan Ngọ, Mid-Autumn, Lunar New Year…" },
      { vi: "Gia đình, thầy cô và những ngày tri ân", en: "Family, teachers and days of gratitude" },
      { vi: "Ẩm thực, áo dài, văn hoá dân gian, ca dao, tục ngữ", en: "Food, áo dài, folk culture, folk verses and proverbs" },
      { vi: "Đời sống: nghề nghiệp, giao thông, sức khoẻ, thiên nhiên", en: "Daily life: jobs, transport, health, nature" }
    ],
    vaoThang: true, // mở thẳng danh sách Bài 81–145; khách học thử Bài 81
    thu: { url: "https://baihoc.cvcec.org/?phan=van-hoa", duong: ["/", "/bai-81/"], ten: { vi: "Bài 81: Ngày Nhà giáo Việt Nam – Tri ân cha mẹ", en: "Lesson 81: Vietnamese Teachers' Day – Thanking our parents" } }
  },
  vuihoc: {
    gioiThieu: { vi: "Bản tương tác của bộ sách Vui học tiếng Việt (Quyển 1, 2). Cùng Nam, Mai và các bạn, bé nghe hiểu, nói được và nhận ra mặt chữ qua bốn chủ đề gần gũi: Gia đình, Thiên nhiên, Trường lớp, Cộng đồng.", en: "The interactive edition of the Vui học tiếng Việt books (Books 1 and 2). With Nam, Mai and friends, children learn to understand, speak and recognise letters through four familiar themes: Family, Nature, School and Community." },
    buoc: [
      { e: "👀", vi: "Nhìn hình, nghe và nhắc lại", en: "Look at the picture, listen and repeat" },
      { e: "🎭", vi: "Đóng vai, hỏi – đáp cùng Trâu Con", en: "Role-play questions and answers with Trâu Con" },
      { e: "🎵", vi: "Học hát theo bài", en: "Learn the lesson's song" },
      { e: "🖍️", vi: "Nghe tên chữ, tìm và tô màu chữ vừa học", en: "Hear the letter names, find and colour the new letters" },
      { e: "🔓", vi: "Đủ sao bài trước thì mở bài tiếp theo", en: "Collect enough stars to unlock the next lesson" }
    ],
    tongQuan: [
      { so: "2", vi: "quyển", en: "books" },
      { so: "40", vi: "bài (20 bài mỗi quyển)", en: "lessons (20 per book)" },
      { so: "4", vi: "chủ đề: Gia đình, Thiên nhiên, Trường lớp, Cộng đồng", en: "themes: Family, Nature, School, Community" }
    ],
    phan: [
      { vi: "Quyển 1: nghe – nói, làm quen mặt chữ", en: "Book 1: listening and speaking, first letters" },
      { vi: "Quyển 2: luyện nói, bắt đầu đọc – viết", en: "Book 2: speaking practice, starting to read and write" }
    ],
    vaoThang: true, // trang chủ Vui học đã có Tổng quan, Nhân vật, Hướng dẫn: mở thẳng, không qua màn giới thiệu
    thu: { url: "https://vuihoctiengviet.cvcec.org/", duong: ["/", "/quyen-1/bai-01/"], ten: { vi: "Quyển 1 · Bài 1: Đây là ai?", en: "Book 1 · Lesson 1: Đây là ai? (Who is this?)" } }
  },
  vietnam: {
    gioiThieu: { vi: "Cùng Trâu Con đi dọc dải đất chữ S qua 31 trạm, từ Cột cờ Lũng Cú tới Đất Mũi Cà Mau, ghé cả quần đảo Hoàng Sa và Trường Sa.", en: "Travel the S-shaped land with Trâu Con through 31 stops, from the Lũng Cú flag tower to Cà Mau Cape, including the Hoàng Sa and Trường Sa islands." },
    buoc: [
      { e: "🎬", vi: "Xem phim giới thiệu địa danh", en: "Watch a film about the place" },
      { e: "🔑", vi: "Ghi nhớ 3–4 ý chính", en: "Remember 3–4 key ideas" },
      { e: "🃏", vi: "Lật thẻ từ, có câu ví dụ", en: "Flip word cards with example sentences" },
      { e: "🎮", vi: "Chơi trò chơi của trạm", en: "Play the stop's game" },
      { e: "🍜", vi: "Ăn gì, có gì: món ăn, phong tục", en: "Food and customs of the place" },
      { e: "❓", vi: "Đố vui: đúng ít nhất 2/3 câu", en: "Quiz: get at least 2 of 3 right" },
      { e: "⭐", vi: "Nhận một ngôi sao vàng", en: "Earn a gold star" }
    ],
    tongQuan: [
      { so: "31", vi: "trạm khắp Việt Nam", en: "stops across Vietnam" },
      { so: "7", vi: "bước mỗi trạm", en: "steps per stop" },
      { so: "31", vi: "ngôi sao vàng để sưu tầm", en: "gold stars to collect" }
    ],
    phan: [
      { vi: "Có hộ chiếu, huy hiệu theo vùng miền", en: "With a passport and regional badges" },
      { vi: "Nút EN giải thích ngắn bằng tiếng Anh", en: "EN button for short English explanations" }
    ],
    vaoThang: true, // trang Khám phá Việt Nam có bản đồ, Tổng quan và Hướng dẫn: mở thẳng để khách thấy ngay bản đồ
    thu: { url: "https://vietnam.cvcec.org/", duong: ["/"], baiThu: "lung-cu", ten: { vi: "Trạm 1: Cột cờ Lũng Cú", en: "Stop 1: Lũng Cú flag tower" } }
  },
  venhaem: {
    gioiThieu: { vi: "Về Nhà Em: gặp nhau ở buổi cà phê tại Canada, học nói tiếng Việt qua 8 bài nấu món Việt, rồi 5 người học giỏi nhất được tài trợ về Việt Nam (ngày đi đang được thống nhất với các đối tác).", en: "Về Nhà Em: meet us at a coffee talk in Canada, learn to speak Vietnamese through 8 cooking lessons, and the five top learners win a sponsored trip to Vietnam (dates are being finalised with our partners)." },
    buoc: [
      { e: "👂", vi: "Nghe giới thiệu món ăn", en: "Listen to the dish's introduction" },
      { e: "🔤", vi: "Học từ của món", en: "Learn the dish's words" },
      { e: "🍳", vi: "Nấu theo từng bước", en: "Cook step by step" },
      { e: "🗣️", vi: "Nhớ các bước rồi nói lại", en: "Remember the steps, then say them" },
      { e: "🎲", vi: "Chơi trò ôn từ", en: "Play word games" }
    ],
    tongQuan: [
      { so: "8", vi: "món ăn Việt", en: "Vietnamese dishes" }
    ],
    phan: [
      { vi: "Nem rán · Bún mọc · Phở gà · Cơm gà Hội An", en: "Nem rán · Bún mọc · Phở gà · Cơm gà Hội An" },
      { vi: "Phở cuốn · Bò lá lốt · Mâm cơm chay · Bánh xèo chay", en: "Phở cuốn · Bò lá lốt · Mâm cơm chay · Bánh xèo chay" }
    ],
    vaoThang: true, // trang Về Nhà Em đã có "Bắt đầu ở đây": chương trình + hướng dẫn học
    thu: { url: "https://venhaem.cvcec.org/", duong: ["/", "/vao-bep/"], baiThu: "nem", ten: { vi: "Món 1: Nem rán", en: "Dish 1: Nem rán (crispy fried spring rolls)" } }
  },
  khobau: {
    gioiThieu: { vi: "Kho báu lời ông bà: thành ngữ, tục ngữ, ca dao qua trò chơi. Mỗi câu có nghĩa đen, nghĩa bóng, từ khó và ví dụ.", en: "A treasure of ancestors' sayings: idioms, proverbs and folk verses through games. Each saying has its literal and figurative meaning, hard words and examples." },
    buoc: [
      { e: "📖", vi: "Đọc câu, hiểu nghĩa đen và nghĩa bóng", en: "Read the saying, learn its literal and figurative meaning" },
      { e: "🔤", vi: "Xem từ khó, ví dụ, gợi ý tiếng Anh", en: "See hard words, examples and English hints" },
      { e: "✏️", vi: "4 bài luyện: Điền từ, Xếp câu, Hiểu nghĩa, Chọn tranh", en: "4 exercises: fill in, order the words, meaning, choose the picture" },
      { e: "🏆", vi: "Sưu tầm câu vào kho báu, nhận sao", en: "Collect sayings into your treasure and earn stars" },
      { e: "🎲", vi: "Chơi 7 trò chơi chung", en: "Play 7 shared games" }
    ],
    tongQuan: [
      { so: "60", vi: "câu: 20 thành ngữ, 20 tục ngữ, 20 ca dao", en: "sayings: 20 idioms, 20 proverbs, 20 folk verses" },
      { so: "4", vi: "bài luyện mỗi câu", en: "exercises per saying" },
      { so: "7", vi: "trò chơi chung", en: "shared games" }
    ],
    phan: []
  },
  cotich: {
    gioiThieu: { vi: "Trâu Con kể chuyện: 30 truyện cổ tích Việt Nam, mỗi ngày một truyện, đọc trong sách lật và chơi trò ôn từ.", en: "Trâu Con tells stories: 30 Vietnamese fairy tales, one a day, read in a flip book with word games." },
    buoc: [
      { e: "🧑‍🤝‍🧑", vi: "Gặp các nhân vật", en: "Meet the characters" },
      { e: "📖", vi: "Đọc truyện trong sách lật; chạm từ tô vàng để xem nghĩa", en: "Read the flip book; tap highlighted words for their meaning" },
      { e: "💌", vi: "Thông điệp và câu tục ngữ, ca dao", en: "The message, with a related saying" },
      { e: "🖼️", vi: "Xếp tranh và kể lại truyện", en: "Order the pictures and retell the story" },
      { e: "🔤", vi: "Đố từ, điền từ", en: "Word quiz and fill in the blanks" },
      { e: "💭", vi: "Tình huống và suy ngẫm: nếu là em, em sẽ làm gì?", en: "Situations and reflection: what would you do?" }
    ],
    tongQuan: [
      { so: "30", vi: "truyện cổ tích", en: "fairy tales" },
      { so: "8", vi: "phần mỗi truyện", en: "parts per story" }
    ],
    phan: [
      { vi: "Nút EN giải thích ngắn bằng tiếng Anh ở mọi phần", en: "EN button with short English explanations in every part" }
    ]
  },
  cuocsong: {
    gioiThieu: { vi: "Nâng cao, dành cho các bạn đã đọc thông, viết được câu: thơ “Lên Sáu”, “Lên Tám” của Tản Đà. Nghe cô Hà đọc thơ và giảng, hiểu “Thơ nói gì?”, làm “Em làm được” rồi viết theo mức Dễ – Vừa – Khó. Mới bắt đầu thì học “Thơ lễ nghĩa” trong Bài 1–145 trước nhé.", en: "Advanced, for children who can read well and write sentences: Tản Đà's poems “Lên Sáu” and “Lên Tám”. Listen to cô Hà read and explain the verses, then write at an Easy, Medium or Hard level. Beginners start with the short poem game in Lessons 1–145." },
    buoc: [
      { e: "📜", vi: "Nghe cô Hà đọc thơ và đọc theo", en: "Listen to cô Hà read the poem and read along" },
      { e: "🎬", vi: "Xem Trâu Con kể ý nghĩa khổ thơ", en: "Watch Trâu Con explain what the verses mean" },
      { e: "👂", vi: "Nghe cô Hà giảng, chữ sáng theo giọng cô", en: "Listen to cô Hà's lesson as the words light up" },
      { e: "🖼️", vi: "Trả lời câu hỏi có tranh, nhận sao", en: "Answer picture questions and earn stars" },
      { e: "🙇", vi: "Em làm được: chọn việc làm ngoan", en: "Em làm được: choose the good thing to do" },
      { e: "✏️", vi: "Viết theo mức: Dễ, Vừa, Khó", en: "Write at your level: Easy, Medium, Hard" }
    ],
    tongQuan: [
      { so: "18", vi: "bài “Lên Sáu” (36 khổ)", en: "“Lên Sáu” lessons (36 verses)" },
      { so: "32", vi: "bài “Lên Tám” (64 khổ), đang thêm", en: "“Lên Tám” lessons (64 verses), more coming" },
      { so: "2", vi: "khổ thơ mỗi bài", en: "verses per lesson" }
    ],
    phan: [
      { vi: "Nút EN giải thích bằng tiếng Anh ở mọi phần", en: "EN button with English explanations in every part" }
    ],
    // Góc một trang: mọi bài cùng /kho.html#…, nên học thử kiểm tra bằng mã bài (TTV.choPhepBai)
    thu: { url: "https://cuocsong.cvcec.org/kho.html#lensau-1", duong: ["/", "/kho.html"], baiThu: "lensau-1", ten: { vi: "“Lên Sáu” – Bài 1: Học chữ nước ta", en: "“Lên Sáu” – Lesson 1: Learning our own language" } }
  },
  nguphap: {
    gioiThieu: { vi: "Nâng cao, dành cho các bạn đã đọc được câu ngắn: 37 bài ngữ pháp từ tiếng, từ, cụm từ đến câu và hội thoại. Mỗi bài 4 bước: Khởi động, Khám phá, Luyện tập, Vận dụng. Mới bắt đầu thì học Tiếng Việt cơ bản trước nhé.", en: "Advanced, for children who can read short sentences: 37 grammar lessons from syllables and words to phrases, sentences and conversation. Each lesson has 4 steps: Warm-up, Discover, Practise, Apply. Beginners start with Basic Vietnamese." },
    buoc: [
      { e: "🌱", vi: "Khởi động: một câu hỏi vui và bức tranh", en: "Warm-up: a fun question and a picture" },
      { e: "🔍", vi: "Khám phá 4 thẻ ví dụ", en: "Discover 4 example cards" },
      { e: "✏️", vi: "Luyện tập 3 câu, tự đối chiếu gợi ý", en: "Practise 3 questions and check the hints" },
      { e: "🗣️", vi: "Vận dụng: nói, viết về cuộc sống của em", en: "Apply: speak or write about your own life" },
      { e: "⭐", vi: "Mỗi bước 1 sao, đủ 4 sao là xong bài", en: "1 star per step, 4 stars to finish a lesson" }
    ],
    tongQuan: [
      { so: "37", vi: "bài học", en: "lessons" },
      { so: "3", vi: "phần: Tập 1, Tập 2, Hiểu ý trong hội thoại", en: "parts: Part 1, Part 2, Understanding conversation" },
      { so: "8", vi: "chủ đề", en: "topics" }
    ],
    phan: [
      { vi: "Tập 1 (Bài 1–16): từ và từ loại", en: "Part 1 (Lessons 1–16): words and word classes" },
      { vi: "Tập 2 (Bài 17–34): cụm từ và câu", en: "Part 2 (Lessons 17–34): phrases and sentences" },
      { vi: "Bài 35–37: hiểu ý trong hội thoại", en: "Lessons 35–37: understanding meaning in conversation" }
    ],
    vaoThang: true, // trang chủ Ngữ pháp đã có Mục tiêu, Học xong, Tổng quan, Hướng dẫn: mở thẳng
    // Góc một trang: mọi bài cùng /bai.html#bai-N, nên học thử kiểm tra bằng mã bài (TTV.choPhepBai)
    thu: { url: "https://nguphap.cvcec.org/bai.html#bai-1", duong: ["/", "/bai.html"], baiThu: "bai-1", ten: { vi: "Bài 1: Ngữ pháp quanh em", en: "Lesson 1: Grammar all around us" } }
  },
  luyennoi: {
    gioiThieu: { vi: "Luyện nói – Luyện thanh cùng Trâu Con: học bảng âm tiếng Việt (IPA) và cách ghép âm vần, luyện 6 thanh điệu, luyện từ, luyện câu và nói chuyện với Trâu Con theo chủ đề. Máy nghe và chấm điểm từng chữ: đúng tô xanh, sai dấu tô cam. Có 4 mức từ bé tới lớn.", en: "Speaking and tones with Trâu Con: learn the Vietnamese sound chart (IPA) and how to blend sounds into syllables, practise the 6 tones, words and sentences, and talk with Trâu Con by topic. The computer listens and scores every word: green is correct, orange is a wrong tone. 4 levels from little ones to teens." },
    buoc: [
      { e: "🔈", vi: "Mở Bảng âm: nghe từng âm, xem cách ghép và đánh vần", en: "Open the Sound chart: hear each sound, see how to blend and spell" },
      { e: "🎵", vi: "Luyện thanh: đo giọng rồi đọc 6 thanh, so đường giọng với đường mẫu", en: "Tones: measure your voice, read the 6 tones and compare with the model line" },
      { e: "🌱", vi: "Chọn mức: Mầm, Chồi, Lá hoặc Cây", en: "Choose a level: Sprout, Bud, Leaf or Tree" },
      { e: "📚", vi: "Chọn chủ đề: chào hỏi, gia đình, Tết…", en: "Choose a topic: greetings, family, Tết…" },
      { e: "👂", vi: "Nghe Trâu Con đọc mẫu", en: "Listen to Trâu Con read the model" },
      { e: "🎤", vi: "Bấm Đọc và đọc to, máy chấm điểm", en: "Press Read and say it out loud; the computer scores it" },
      { e: "🎵", vi: "Sai dấu thì sang Luyện thanh tiếng đó", en: "Wrong tone? Practise that syllable's tone" },
      { e: "💬", vi: "Nói chuyện cùng Trâu Con theo lượt", en: "Take turns talking with Trâu Con" }
    ],
    mucTieu: [
      { vi: "Nghe và nhận ra các âm của tiếng Việt: âm đầu, nguyên âm, vần, âm cuối", en: "Hear and recognise Vietnamese sounds: initials, vowels, rhymes and finals" },
      { vi: "Phân biệt và đọc đúng 6 thanh: ngang, huyền, ngã, hỏi, sắc, nặng", en: "Tell apart and say the 6 tones correctly: ngang, huyền, ngã, hỏi, sắc, nặng" },
      { vi: "Biết ghép âm đầu, vần và thanh thành tiếng, đánh vần theo cách của lớp tiếng Việt", en: "Blend initial, rhyme and tone into a syllable and spell it the way Vietnamese class does" },
      { vi: "Mạnh dạn nói từ, câu ngắn và trò chuyện theo chủ đề gần gũi", en: "Speak words, short sentences and simple conversations on everyday topics with confidence" }
    ],
    hocXong: [
      { vi: "Đọc được một tiếng với đủ 6 thanh và tự nghe ra mình đọc đúng hay chưa", en: "Read a syllable in all 6 tones and hear for yourself whether it is right" },
      { vi: "Tự đánh vần một tiếng mới, ví dụ: bờ – a – ba – huyền – bà", en: "Spell out a new syllable on your own, e.g. bờ – a – ba – huyền – bà" },
      { vi: "Đọc bảng âm tiếng Việt theo ký hiệu IPA, biết chỗ giọng Hà Nội và giọng Sài Gòn khác nhau", en: "Read the Vietnamese sound chart in IPA and know where Hà Nội and Sài Gòn accents differ" },
      { vi: "Tự tin chào hỏi, giới thiệu bản thân và nói chuyện ngắn bằng tiếng Việt", en: "Greet people, introduce yourself and hold a short conversation in Vietnamese with confidence" }
    ],
    tongQuan: [
      { so: "4", vi: "mức, từ dưới 6 tuổi tới 13 tuổi trở lên", en: "levels, from under 6 to 13 and older" },
      { so: "24", vi: "chủ đề", en: "topics" },
      { so: "6", vi: "thanh điệu có đường mẫu để so", en: "tones with model lines to compare" }
    ],
    phan: [
      { vi: "Bảng âm (IPA): âm đầu, nguyên âm, vần, âm cuối, thanh điệu, có loa đọc mẫu và cách ghép âm vần", en: "Sound chart (IPA): initials, vowels, rhymes, finals and tones, with model audio and syllable blending" },
      { vi: "Luyện thanh: so đường giọng với đường mẫu", en: "Tones: compare your voice line with the model" },
      { vi: "Luyện từ, Luyện câu: mỗi chủ đề 8 từ, 5 câu", en: "Words and sentences: 8 words and 5 sentences per topic" },
      { vi: "Hội thoại cùng Trâu Con: 4–8 lượt mỗi đoạn", en: "Talk with Trâu Con: 4–8 turns per conversation" },
      { vi: "Chấm câu cần Chrome, Edge hoặc Safari; giọng đọc được gửi tới dịch vụ nhận dạng của Google hoặc Apple, CVCEC không lưu", en: "Scoring needs Chrome, Edge or Safari; your voice goes to Google's or Apple's recognition service, and CVCEC keeps nothing" }
    ],
    // Không mở thẳng: lần đầu vào góc, bé xem màn giới thiệu (cách học, mục tiêu, học xong em sẽ…); nút "Hướng dẫn" xem lại.
    // Góc một trang: khách học thử được dùng cả trang Luyện nói
    thu: { url: "https://vietclass.cvcec.org/luyen-noi/#luyen-tu", duong: ["/luyen-noi/"], ten: { vi: "Luyện nói: Luyện từ", en: "Speaking: Words" } }
  },
  trienlam: {
    gioiThieu: { vi: "Triển lãm Em học tiếng Việt: trang vở và bài đọc của các bạn nhỏ trong lớp học của trường.", en: "The Em học tiếng Việt exhibition: notebook pages and readings by young learners in the school's classes." },
    buoc: [
      { e: "📒", vi: "Xem trang vở của các bạn", en: "Look at the learners' notebook pages" },
      { e: "📻", vi: "Nghe bài đọc trên máy cát-xét của lớp", en: "Listen to readings on the class cassette player" },
      { e: "💬", vi: "Học theo cách các bạn viết và đọc", en: "Learn from how they write and read" }
    ],
    tongQuan: [],
    phan: [
      { vi: "Tài liệu chỉ để xem, không tải về", en: "Materials are for viewing only, not for download" },
      { vi: "Ai cũng xem được, không cần đăng nhập", en: "Open to everyone, no sign-in needed" }
    ],
    congKhai: true // xem công khai trong cổng, không cần đăng nhập (17-11-2026)
  }
};
