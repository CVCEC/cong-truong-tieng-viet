# Cổng Trường Tiếng Việt Của Em

Cổng chính https://vietclass.cvcec.org (GitHub Pages). Nội quy chung: xem `CLAUDE.md`.

- `index.html`: trang chủ (banner, tổng quan, các ô dẫn sang trang) và chế độ đang học (khung iframe cho 9 góc học, địa chỉ `#id`, ví dụ `#khobau`). Địa chỉ cũ `#goc-hoc`, `#tin-tuc`, `#gioi-thieu`, `#ho-tro`, `#trienlam` tự chuyển sang trang mới.
- `lo-trinh/` – Lộ trình theo khung năng lực (từ 15 tuổi): các bậc và câu "Mình làm được…" từ `TTV_LO_TRINH` (mau-chung), bài của Vui học và Về Nhà Em (góc có `nhom: "lo-trinh"`).
- `hoc-tap/` – Học tập (Làng học tập Trâu Con, 9 góc học; baihoc.cvcec.org chia thành "Tiếng Việt cơ bản" (Bài 1–80, `#baihoc`) và "Văn hoá truyền thống" (Bài 81–145, `#vanhoa`)); `tin-tuc/` – Tin tức (báo chí, video); `gioi-thieu/` – Giới thiệu (sứ mệnh, ảnh lớp học, về dự án, bản quyền, lời cảm ơn); `trien-lam/` – Triển lãm (tab riêng cạnh Giới thiệu: khung xem trienlam.cvcec.org, công khai, không cần đăng nhập; góc `trienlam` vẫn ở TTV_DANH_SACH để lấy màu/ảnh nhưng không nằm trong Học tập – xem `GOC_TACH_RIENG` trong `chung/cong.js`); `chung-tay/` – Chung tay (tài trợ, góp sức).
- `chung/gioi-thieu-goc.js`: nội dung màn giới thiệu từng góc học (cách học, tổng quan, bài học thử). Khách chưa đăng nhập chỉ học thử được bài 1 ở góc có khai `thu`; người đã đăng nhập thấy giới thiệu lần đầu, sau đó vào thẳng (nút "Hướng dẫn" để xem lại; nhớ bằng khoá `cvcec-da-xem-gioi-thieu`).
- `chung/canh.js`: các cảnh địa danh vẽ phẳng cho banner (Hội An, Hồ Gươm, Hạ Long, chợ nổi Cái Răng, cánh đồng lúa – làng quê; còn sẵn đình làng, Huế để dùng sau); trang gắn bằng `data-canh="..."`.
- `chung/cong.css`, `chung/cong.js`: phần dùng chung cho mọi trang của cổng – thanh trên (Học tập, Tin tức, Giới thiệu, Chung tay, Giáo viên), chân trang, nút VI/EN (khoá `ttv-ngon-ngu` của bộ mẫu), băng trượt, nút sao chép. Mỗi trang khai báo chữ riêng trong `window.CONG_CHU`.
- `hoat-dong/` – Gợi ý hoạt động học cho lớp tiếng Việt như ngôn ngữ thứ hai, mô hình lớp học trực tiếp (https://vietclass.cvcec.org/hoat-dong/), tab "Hoạt động" trên thanh trên, ngay sau "Học tập". Trang dành cho giáo viên, không thuộc `TTV_DANH_SACH`. Dữ liệu trong `hoat-dong/du-lieu.js` (`HOAT_DONG`; bản thí điểm 12 hoạt động, kế hoạch 90), đối chiếu Khung năng lực tiếng Việt dùng cho người nước ngoài 6 bậc (TT 17/2015/TT-BGDĐT). Địa chỉ một hoạt động: `/hoat-dong/#<slug>`. Mỗi hoạt động có video 2D (cảnh SVG + phụ đề); tệp giọng chuẩn đặt ở `hoat-dong/am-thanh/<slug>-<số bước>.mp3`, chưa có tệp thì video chạy không tiếng (không dùng giọng máy). Không tạo khoá localStorage.
- `giao-vien/index.html`: trang Đội ngũ giáo viên (https://vietclass.cvcec.org/giao-vien/). Danh sách thầy cô nằm trong `giao-vien/teachers.json` (trường tiếng Việt và tiếng Anh); thêm thầy cô mới chỉ cần thêm một mục và đặt ảnh chân dung (tỉ lệ 4:5) vào `assets/giao-vien/`.
- `dang-nhap/` – Đăng nhập, đăng ký (hỏi nhóm tuổi; dưới 13 tuổi nhờ cha mẹ đăng ký), thông tin tài khoản và đồng ý điều khoản, tạo hồ sơ học viên. `ho-so/` – sửa thông tin, bật/tắt bảng xếp hạng, tải dữ liệu, xoá hồ sơ, xoá tài khoản. Cả hai có `noindex`. (`thu-dang-nhap/` chỉ còn chuyển hướng sang `dang-nhap/`.)
- `dieu-khoan/`, `bao-mat/` – Điều khoản sử dụng và Chính sách bảo mật (VI/EN, phiên bản 2026-11-17: thêm báo cáo tổng hợp và nghiên cứu khi người học đồng ý). Đổi phiên bản thì sửa `PHIEN_BAN_DIEU_KHOAN` trong `js/tai-khoan.js`; người đã đăng nhập được đề nghị đồng ý lại.
- Đồng ý nghiên cứu (không bắt buộc): ô ở bước tạo hồ sơ (`dang-nhap/`) và công tắc ở `ho-so/`; lưu ở `users/{uid}/hoSo/chinh/dongY/nghienCuu`. Xuất dữ liệu ẩn danh: `docs/xuat-nghien-cuu/`. Xem `docs/de-xuat-du-lieu-nghien-cuu.md`.
- `goc-hoc-tap/` – Góc học tập của em (https://vietclass.cvcec.org/goc-hoc-tap/): chỉ chủ tài khoản xem. Số sao, bài đã xong, chuỗi ngày, thời gian học; "Đường làng của Trâu Con" (Bậc 0–4, số bài đã xong trên tổng số bài của mỗi bậc); câu "Mình làm được…" của chặng đang đi; số liệu theo góc học; số lượt chơi 6 tháng; bài gần đây. Bậc của từng bài lấy từ `TTV_LO_TRINH` (https://mau.cvcec.org/v1/ttv-lo-trinh.js). Chặng đang đi là bậc gặp nhiều nhất trong 10 bài xong gần nhất. Không có trang theo dõi cho giáo viên hay phụ huynh.
- Ghi kết quả học (từ 17-11-2026): góc học gọi `TTV.ghiKetQua({bai, hoatDong, soTroChoi, diem, diemToiDa, sao, thoiGianGiay})` (bộ mẫu chung) → tin nhắn `ttv-ket-qua` gửi lên cổng → `index.html` chỉ nhận từ đúng góc đang mở, khi người học đã đăng nhập (không ghi khi học thử) → `js/ghi-ket-qua.js` ghi một lượt (lichSu, bai, tongHop, thang, bảng xếp hạng nếu bật) đúng như `docs/firestore.rules`. Phần tính toán nằm ở `js/luot-choi.js` (không phụ thuộc Firebase, bộ thử rules dùng chung). Mất mạng: kết quả chờ trong khoá localStorage mới `cvcec-ket-qua-cho` (tối đa 200 mục) và gửi lại khi có mạng. Mã bài: chữ thường không dấu, gạch nối (ví dụ `bai-12`, `q1-b01`, `tn08`, `t05`).
- `luyen-noi/` – Luyện nói – Luyện thanh điệu (https://vietclass.cvcec.org/luyen-noi/): bé đo giọng, chọn hoặc tự ghép một tiếng, đọc 6 thanh và xem đường cao độ của mình chồng lên đường mẫu (giọng Hà Nội / Sài Gòn). Chạy hoàn toàn trên trình duyệt, không gửi âm thanh hay điểm đi đâu. `cao-do.js`: dò cao độ (YIN), đường mẫu theo số Chao (ghi nguồn trong tệp), chấm điểm; `ghep-tieng.js`: ghép âm đúng chính tả; `luyen-noi.js`: giao diện. Khoá localStorage mới: `luyen-noi-moc-giong`, `luyen-noi-giong`. Nút "Luyện nói" ở phần Lời mời học của trang chủ dẫn tới đây. Kiểm thử: `node --test tests/*.test.js`. Thẻ "Bảng âm (IPA)" (`bang-am.js`): bảng âm đầu, nguyên âm, âm cuối, thanh điệu, bảng vần và phần ghép âm vần, đánh vần; loa đọc mẫu dùng giọng Elio (studio.html tạo cả các câu của Bảng âm). Khung "Cách học, mục tiêu và học xong em sẽ…" ở đầu trang (`huong-dan.js`) lấy nội dung từ `chung/gioi-thieu-goc.js` (mục `luyennoi`, có thêm `mucTieu`, `hocXong`; màn giới thiệu của cổng cũng hiện hai mục này cho góc nào có khai). Bước 3 của thẻ Luyện thanh là "Đường đi học của Trâu Con" (`con-duong.js`): 6 thanh là 6 nhân vật dấu thanh (Trâu Con, anh Sắc, bà Huyền, chú Hỏi, chị Ngã, bác Nặng), con đường vẽ theo đường cao độ mẫu giọng phổ thông (Hà Nội), Trâu Con (ảnh chính thức running.png) chạy dọc đường khi bấm "Nghe mẫu", giọng của bé hiện thành dấu chân; không hiện điểm số mà thu 1–3 sao (khoá localStorage mới `luyen-noi-sao`). Ảnh nhân vật do hoạ sĩ vẽ sau này: đặt vào `luyen-noi/nhan-vat/` và ghi vào `ANH_NHAN_VAT` trong `con-duong.js`.
- `js/tai-khoan.js` – thư viện tài khoản dùng chung (module): nút Đăng nhập / con vật + biệt danh trên thanh trên, danh mục chọn, kiểm tra biệt danh, bảng xếp hạng, tải dữ liệu, xoá. `js/firebase-cvcec.js` – cấu hình Firebase. Ghi chép dự án Firebase ở `docs/firebase-cvcec.md`, Security Rules ở `docs/firestore.rules`.
- Bộ mẫu chung nạp từ `https://mau.cvcec.org/v1/` (màu, phông, logo, ảnh Trâu Con của các góc học, danh sách `TTV_DANH_SACH`).
- `assets/`: ảnh chuyển từ trang cũ `truongtiengvietcuaem.cvcec.org` (tên miền sắp ngừng dùng), tải ngày 15-11-2026.

## Ảnh trong assets/

Tên mới = tên cũ bỏ đoạn mã 8 ký tự sau dấu gạch cuối.

- `assets/trau/`: các tư thế Trâu Con
- `assets/lop-hoc/`: 11 ảnh lớp học. **Ảnh tạm**, đã cắt dải chữ tên miền cũ ở mép dưới (720×720 → 720×676, không kéo méo). Sẽ thay bằng ảnh gốc.
- `assets/bao/`: ảnh bìa và logo các báo, ảnh poster video
- `assets/doi-tac/`: logo đối tác ở chân trang
- `assets/giao-vien/`: ảnh chân dung thầy cô (tỉ lệ 4:5) và huy hiệu CVCEC. Ảnh của cô Trang, cô Hà, cô Bình, cô Diệu Anh đã thay bằng ảnh gốc do CVCEC gửi (cắt 4:5, 800×1000, giữ tên tệp); ảnh cô Mai và huy hiệu tải từ trang cũ /giao-vien.
- `assets/trang-tri/`: chim Lạc, hoa sen, biểu tượng trang (favicon), ảnh chia sẻ (og-image), logo chữ của trang cũ (lưu lại, chưa dùng)

| Tên cũ | Tên mới |
|---|---|
| running-DzGIy7tY.png | assets/trau/running.png |
| wave-BxRGaky7.png | assets/trau/wave.png |
| reading-d_u5L1vy.png | assets/trau/reading.png |
| flag-CklYNxEP.png | assets/trau/flag.png |
| eating-pho-CYP-ILtR.png | assets/trau/eating-pho.png |
| thumbs-up-BMlOBzOy.png | assets/trau/thumbs-up.png |
| thinking-BUZ-Z3mO.png | assets/trau/thinking.png |
| cheer-C3NXvQyd.png | assets/trau/cheer.png |
| pointing-Brxuq54M.png | assets/trau/pointing.png |
| buffalo-icon-B4hDHBNu.png | assets/trau/buffalo-icon.png |
| crying-DK5OdqOu.png | assets/trau/crying.png |
| flying-CEVF65oW.png | assets/trau/flying.png |
| hiking-BAgFtjyq.png | assets/trau/hiking.png |
| listening-yayYUr9n.png | assets/trau/listening.png |
| peeking-Br_JYILT.png | assets/trau/peeking.png |
| peeking-over-sT1T6heI.png | assets/trau/peeking-over.png |
| reading-sitting-kutNKEFz.png | assets/trau/reading-sitting.png |
| chim-lac-PwvOkbZ3.png | assets/trang-tri/chim-lac.png |
| hoa-sen-etVem1vO.png | assets/trang-tri/hoa-sen.png |
| logo-wordmark-B0AAq1bv.png | assets/trang-tri/logo-wordmark.png |
| pei-1-CR9Nidx0.webp | assets/lop-hoc/pei-1.webp |
| pei-2-BUI1RYUq.webp | assets/lop-hoc/pei-2.webp |
| pei-3-DWkGxJ38.webp | assets/lop-hoc/pei-3.webp |
| pei-4-eEk6MzUb.webp | assets/lop-hoc/pei-4.webp |
| toronto-1-CHMbqsMN.webp | assets/lop-hoc/toronto-1.webp |
| toronto-2-BsKTyhZi.webp | assets/lop-hoc/toronto-2.webp |
| toronto-3-wuTPw0nR.webp | assets/lop-hoc/toronto-3.webp |
| toronto-4-C9xBCKCR.webp | assets/lop-hoc/toronto-4.webp |
| toronto-5-Cno6Bbdt.webp | assets/lop-hoc/toronto-5.webp |
| toronto-6-D-yQxrDX.webp | assets/lop-hoc/toronto-6.webp |
| toronto-7-BG_Q3lWz.webp | assets/lop-hoc/toronto-7.webp |
| vna-ket-noi-coi-nguon-poster-UdUewXL7.webp | assets/bao/vna-ket-noi-coi-nguon-poster.webp |
| vietnam-media-logo-D1nqldHv.png | assets/bao/vietnam-media-logo.png |
| bao-tin-tuc-cover-B4YhkWd3.webp | assets/bao/bao-tin-tuc-cover.webp |
| bao-tin-tuc-logo-DBYV4JDn.png | assets/bao/bao-tin-tuc-logo.png |
| ket-noi-cong-dong-cover-cpw_9tcO.webp | assets/bao/ket-noi-cong-dong-cover.webp |
| scov-logo-B9q_oPfH.png | assets/bao/scov-logo.png |
| vietnamplus-cover-2twnn_5A.webp | assets/bao/vietnamplus-cover.webp |
| vietnamplus-logo-BP5YLI6H.png | assets/bao/vietnamplus-logo.png |
| dai-doan-ket-cover-DX6nHEgT.webp | assets/bao/dai-doan-ket-cover.webp |
| dai-doan-ket-logo-9D15hbgS.png | assets/bao/dai-doan-ket-logo.png |
| bao-anh-viet-nam-cover-6mJk1ruA.webp | assets/bao/bao-anh-viet-nam-cover.webp |
| bao-anh-viet-nam-logo-DwVe3VS_.svg | assets/bao/bao-anh-viet-nam-logo.svg |
| nhan-dan-en-cover-kOilPlaf.webp | assets/bao/nhan-dan-en-cover.webp |
| nhan-dan-logo-BXpYkHVX.svg | assets/bao/nhan-dan-logo.svg |
| vietnam-vn-ket-noi-cover-CLGAgY_X.webp | assets/bao/vietnam-vn-ket-noi-cover.webp |
| vietnam-vn-logo-6gUrcG_k.png | assets/bao/vietnam-vn-logo.png |
| vietnamplus-en-cover-Bu9rFJrq.webp | assets/bao/vietnamplus-en-cover.webp |
| viet-nam-news-cover-CRCTU-Zp.webp | assets/bao/viet-nam-news-cover.webp |
| viet-nam-news-logo-xXfqj1gI.png | assets/bao/viet-nam-news-logo.png |
| vietnam-vn-class-cover-akLWnfLw.webp | assets/bao/vietnam-vn-class-cover.webp |
| vietnamnet-cover-92UEP7ua.webp | assets/bao/vietnamnet-cover.webp |
| vietnamnet-logo-gCqmmYMh.png | assets/bao/vietnamnet-logo.png |
| qdnd-cover-CcD85bb5.webp | assets/bao/qdnd-cover.webp |
| qdnd-logo-DYTwwZwK.png | assets/bao/qdnd-logo.png |
| uy-ban-L4REoQmZ.png | assets/doi-tac/uy-ban.png |
| cvcec-CfPQzjV9.jpg | assets/doi-tac/cvcec.jpg |
| /favicon-16.png | assets/trang-tri/favicon-16.png |
| /favicon-32.png | assets/trang-tri/favicon-32.png |
| /apple-touch-icon.png | assets/trang-tri/apple-touch-icon.png |
| /og-image.png | assets/trang-tri/og-image.png |
| phan-thi-quynh-trang-CqUR6akJ.webp | assets/giao-vien/phan-thi-quynh-trang.webp |
| hoang-minh-ha-B1ZJMunn.webp | assets/giao-vien/hoang-minh-ha.webp |
| do-thi-phuong-mai-DvBHPowD.webp | assets/giao-vien/do-thi-phuong-mai.webp |
| nguyen-thi-thanh-binh-MEXRFnad.webp | assets/giao-vien/nguyen-thi-thanh-binh.webp |
| ngo-nguyen-ngoc-dieu-anh-BEstDerj.webp | assets/giao-vien/ngo-nguyen-ngoc-dieu-anh.webp |
| cvcec-emblem-COV_jnu3.webp | assets/giao-vien/cvcec-emblem.webp |
