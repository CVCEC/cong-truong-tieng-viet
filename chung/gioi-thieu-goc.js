/*!
 * Giới thiệu từng góc học (cổng vietclass.cvcec.org): cách học (infographic) và tổng quan nội dung.
 * Số liệu lấy từ mã nguồn của từng góc (README, mục lục) ngày 15-11-2026. Sửa ở đây khi góc học thay đổi.
 * thu: bài học thử cho khách chưa đăng nhập.
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
    thu: { url: "https://baihoc.cvcec.org/bai-1/", duong: ["/", "/bai-1/"], ten: { vi: "Bài 1: Bảng chữ cái, nguyên âm và phụ âm", en: "Lesson 1: The alphabet, vowels and consonants" } }
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
    thu: { url: "https://baihoc.cvcec.org/bai-81/", duong: ["/", "/bai-81/"], ten: { vi: "Bài 81: Ngày Nhà giáo Việt Nam – Tri ân cha mẹ", en: "Lesson 81: Vietnamese Teachers' Day – Thanking our parents" } }
  },
  vuihoc: {
    gioiThieu: { vi: "Bản tương tác của bộ sách Vui học tiếng Việt (Quyển 1, 2): nghe, nói theo, đóng vai, học hát và tô chữ.", en: "The interactive edition of the Vui học tiếng Việt books (Books 1 and 2): listen, repeat, role-play, sing and colour letters." },
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
    thu: { url: "https://vuihoctiengviet.cvcec.org/quyen-1/bai-01/", duong: ["/", "/quyen-1/bai-01/"], ten: { vi: "Quyển 1 · Bài 1: Đây là ai?", en: "Book 1 · Lesson 1: Đây là ai? (Who is this?)" } }
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
    ]
  },
  venhaem: {
    gioiThieu: { vi: "Vào Bếp Nhà Em: 8 bài học nấu món Việt cùng gia đình. Nghe, học từ, nấu theo các bước rồi chơi.", en: "Vào Bếp Nhà Em (Into My Family's Kitchen): 8 lessons cooking Vietnamese dishes with family. Listen, learn words, cook step by step, then play." },
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
    ]
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
  trienlam: {
    gioiThieu: { vi: "Triển lãm Em học tiếng Việt: trang vở và bài đọc của các bạn nhỏ trong lớp học của trường.", en: "The Em học tiếng Việt exhibition: notebook pages and readings by young learners in the school's classes." },
    buoc: [
      { e: "📒", vi: "Xem trang vở của các bạn", en: "Look at the learners' notebook pages" },
      { e: "📻", vi: "Nghe bài đọc trên máy cát-xét của lớp", en: "Listen to readings on the class cassette player" },
      { e: "💬", vi: "Học theo cách các bạn viết và đọc", en: "Learn from how they write and read" }
    ],
    tongQuan: [],
    phan: [
      { vi: "Tài liệu chỉ để xem, không tải về", en: "Materials are for viewing only, not for download" }
    ]
  }
};
