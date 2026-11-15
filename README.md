# Cổng Trường Tiếng Việt Của Em

Cổng chính https://vietclass.cvcec.org (GitHub Pages). Nội quy chung: xem `CLAUDE.md`.

- `index.html`: màn chào (trang chủ) và chế độ đang học (khung iframe cho 7 góc học, địa chỉ `#id`, ví dụ `#khobau`).
- `giao-vien/index.html`: trang Đội ngũ giáo viên (https://vietclass.cvcec.org/giao-vien/). Danh sách thầy cô nằm trong `giao-vien/teachers.json` (trường tiếng Việt và tiếng Anh); thêm thầy cô mới chỉ cần thêm một mục và đặt ảnh chân dung (tỉ lệ 4:5) vào `assets/giao-vien/`.
- Bộ mẫu chung nạp từ `https://mau.cvcec.org/v1/` (màu, phông, logo, ảnh Trâu Con của các góc học, danh sách `TTV_DANH_SACH`).
- `assets/`: ảnh chuyển từ trang cũ `truongtiengvietcuaem.cvcec.org` (tên miền sắp ngừng dùng), tải ngày 15-11-2026.

## Ảnh trong assets/

Tên mới = tên cũ bỏ đoạn mã 8 ký tự sau dấu gạch cuối.

- `assets/trau/`: các tư thế Trâu Con
- `assets/lop-hoc/`: 11 ảnh lớp học. **Ảnh tạm**, đã cắt dải chữ tên miền cũ ở mép dưới (720×720 → 720×676, không kéo méo). Sẽ thay bằng ảnh gốc.
- `assets/bao/`: ảnh bìa và logo các báo, ảnh poster video
- `assets/doi-tac/`: logo đối tác ở chân trang
- `assets/giao-vien/`: ảnh chân dung thầy cô và huy hiệu CVCEC (tải từ trang cũ /giao-vien)
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
