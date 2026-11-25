# Nguồn gốc của trang Luyện nói

Ghi chép này cho biết từng phần của trang `luyen-noi/` lấy từ đâu, để khi cần có thể chứng minh trang được làm độc lập.

## Cách làm
- Toàn bộ mã (`cao-do.js`, `ghep-tieng.js`, `luyen-noi.js`, `luyen-noi.css`, `index.html`) và chữ trên trang do CVCEC viết mới vào tháng 11/2026.
- Khi làm trang này, không mở, không tải và không sao chép mã nguồn, hình ảnh, chữ, đường mẫu hay dữ liệu của bất kỳ trang hay phần mềm luyện phát âm nào khác.
- Ý tưởng so đường cao độ với đường mẫu thanh điệu là cách làm phổ biến trong ngữ âm học và dạy ngôn ngữ có thanh điệu, có trong nhiều tài liệu và phần mềm nghiên cứu ngữ âm.
- Ảnh Trâu Con là ảnh chính thức của trường (`/assets/trau/`). Màu và phông lấy từ bộ mẫu chung Làng Trâu Con (mau.cvcec.org).

## Từng phần lấy từ đâu

| Phần | Nguồn |
|---|---|
| Số Chao giọng Hà Nội (ngang 33, huyền 32, ngã 3ˀ5, hỏi 312, sắc 24, nặng 21ˀ; tiếng tắc sắc 45, nặng 21) | Kirby, J. P. (2011). Vietnamese (Hanoi Vietnamese). *Journal of the International Phonetic Association*, 41(3), 381–392. |
| Số Chao giọng Sài Gòn (ngang 33, huyền 21, hỏi = ngã 214, sắc 45, nặng 212; tiếng tắc sắc 45, nặng 21) | Vũ Thanh Phương (1982). Phonetic properties of Vietnamese tones across dialects. *Papers in South-East Asian Linguistics No. 8: Tonation*, Pacific Linguistics A-62. Brunelle, M. (2009). Northern and Southern Vietnamese tone coarticulation: A comparative case study. *Journal of Southeast Asian Linguistics*, 1. |
| Thang 5 bậc, ký hiệu thanh điệu (˥ ˦ ˧ ˨ ˩) | Chao, Y. R. (1930). A system of tone letters. *Le Maître Phonétique*, 30, 24–27. International Phonetic Association (1999). *Handbook of the IPA*. |
| Thuật toán dò cao độ | de Cheveigné, A. & Kawahara, H. (2002). YIN, a fundamental frequency estimator for speech and music. *JASA*, 111(4), 1917–1930. Viết lại từ mô tả trong bài báo. |
| So đường có co giãn thời gian | Sakoe, H. & Chiba, S. (1978). Dynamic programming algorithm optimization for spoken word recognition. *IEEE Trans. ASSP*, 26(1), 43–49. Viết lại từ mô tả trong bài báo. |
| Quy tắc chính tả, vị trí dấu thanh | Bộ GD&ĐT (2018), Quyết định 1989/QĐ-BGDĐT – Quy định về chính tả tiếng Việt và thuật ngữ tiếng Việt trong sách giáo khoa giáo dục phổ thông; quy tắc c/k/q, g/gh, ng/ngh trong sách Tiếng Việt lớp 1. |
| Cách đổi số Chao ra semitone (1 bậc = 2,5 semitone), cách chấm điểm và ngưỡng ba mức | CVCEC tự đặt, chỉ để tham khảo. |
| Tiếng gợi ý (ta, ma, ba, mẹ…) | Bài học của trường (baihoc.cvcec.org). |
| Từ, câu và hội thoại trong `noi-dung.txt` | CVCEC tự viết (tháng 11/2026), người quản lý duyệt và sửa thêm. |
| Nhận dạng giọng nói ở thẻ Luyện từ, Luyện câu, Hội thoại | Web Speech API có sẵn trong trình duyệt (W3C Community Group, *Web Speech API*). Trình duyệt gửi giọng đọc tới dịch vụ nhận dạng của Google hoặc Apple; trang không ghi lại âm thanh. |
| Cách so câu (khoảng cách sửa theo từng tiếng, tách dấu thanh) | Levenshtein, V. I. (1966). Binary codes capable of correcting deletions, insertions, and reversals. *Soviet Physics Doklady*, 10(8), 707–710. Viết lại từ mô tả. Cách tính điểm và ngưỡng ba mức do CVCEC tự đặt, chỉ để tham khảo. |
| Giọng mẫu Trâu Con | Giọng AI "Kore" (Google Gemini, miền Bắc) do robot giọng đọc AI của trường tạo (`tools/giong_ai.py`, xem `giong-ai/README.md`), cùng giọng với các góc học khác. Trước 25-11-2026 trang dùng giọng "Elio" tạo qua `studio.html` (nay đã ngừng). |
| Thư viện của `studio.html` (đã ngừng dùng) | JSZip 3.10.1 (MIT), lamejs 1.2.1 (LGPL-3.0) – xem `vendor/THIRD-PARTY.txt`. |
| Bảng âm (IPA): âm đầu, nguyên âm, nguyên âm đôi, âm đệm, âm cuối, khác biệt giọng Hà Nội – Sài Gòn (`bang-am.js`) | Kirby (2011); Thompson, L. C. (1965). *A Vietnamese Grammar*. University of Washington Press; Đoàn Thiện Thuật (1977). *Ngữ âm tiếng Việt*. NXB Đại học và Trung học chuyên nghiệp. Ghi theo âm vị, giọng Hà Nội làm chuẩn. |
| Cách đọc âm (bờ, cờ, dờ…) và các bước đánh vần (bờ – a – ba – huyền – bà) | Cách dạy của lớp tiếng Việt (sách Tiếng Việt lớp 1). |
| Giọng đọc mẫu của Bảng âm | Giọng Trâu Con (giọng AI Kore) do robot giọng đọc AI của trường tạo; không dùng giọng máy của thiết bị. |
| "Đường đi học của Trâu Con" (con đường, nhân vật dấu thanh, dấu chân, sao) – `con-duong.js` | CVCEC tự nghĩ và tự vẽ (SVG). Con đường vẽ theo đường cao độ mẫu giọng phổ thông Hà Nội (Kirby 2011). Trâu Con dùng ảnh chính thức của trường, chỉ di chuyển, không vẽ lại. |
