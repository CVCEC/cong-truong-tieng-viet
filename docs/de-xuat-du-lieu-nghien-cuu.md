# Đề xuất: dùng dữ liệu học tập cho báo cáo và nghiên cứu khoa học

> **ĐÃ ÁP DỤNG ngày 17-11-2026** (CVCEC đồng ý). Chính sách bảo mật và Điều khoản lên bản `2026-11-17`; trang Hồ sơ và bước tạo hồ sơ có ô đồng ý; rules bản 3 nằm trong `docs/firestore.rules` (**cần xuất bản trong console**, xem `firebase-cvcec.md`); công cụ xuất: `docs/xuat-nghien-cuu/`.
> Nên có ý kiến pháp lý khi có điều kiện, và mỗi nghiên cứu cụ thể vẫn cần hội đồng đạo đức phê duyệt.

## 1. Hiện trạng

- Mỗi lượt chơi đã được lưu vào tài khoản của người học: `users/{uid}/hoSo/chinh/lichSu`, `bai`, `tongHop`, `thang` (xem `firestore.rules`).
- Chính sách bảo mật bản 2026-11 cho phép dùng dữ liệu để: lưu tiến độ, hiện Góc học tập và báo cáo học tập, bảng xếp hạng (nếu bật), liên hệ về tài khoản. Quản trị viên CVCEC được xem để hỗ trợ và vận hành.
- **Chưa có** mục đích "nghiên cứu khoa học". Nếu sau này dùng dữ liệu cho nghiên cứu mà lúc thu chưa báo và chưa xin phép, việc đó dễ trái nguyên tắc "dùng đúng mục đích đã báo" trong luật về thông tin cá nhân của Canada.

## 2. Báo cáo của CVCEC (đã được phép)

CVCEC dùng được ngay **số liệu tổng hợp** cho báo cáo (ví dụ báo cáo nhà tài trợ): số người học, số lượt chơi, số bài xong theo góc học, theo bậc, theo nhóm tuổi, theo nước. Nguyên tắc khi làm báo cáo:

- Chỉ công bố số tổng hợp. Không công bố nhóm nào dưới 10 người, để không đoán ra được từng người.
- Không đưa tên, email, tên gọi, biệt danh vào báo cáo.

## 3. Nghiên cứu khoa học (cần thêm đồng ý riêng)

### Đề xuất cách làm

1. **Một ô đồng ý riêng, không bắt buộc**, ở bước tạo hồ sơ và ở trang Hồ sơ: "Đồng ý cho CVCEC dùng dữ liệu học tập đã ẩn danh cho nghiên cứu về việc học tiếng Việt." Mặc định **không** chọn. Không đồng ý thì vẫn học bình thường.
2. Hồ sơ dưới 13 tuổi: cha mẹ hoặc người giám hộ đánh dấu, giống bước đồng ý hiện có.
3. **Rút lại bất cứ lúc nào** ở trang Hồ sơ. Từ lúc rút, dữ liệu không được đưa vào các bộ dữ liệu nghiên cứu mới.
4. Bộ dữ liệu nghiên cứu được xuất **đã ẩn danh**:
   - bỏ họ tên, email, tên gọi, biệt danh, mã tài khoản;
   - thay mã tài khoản bằng một mã ngẫu nhiên mới cho mỗi lần xuất;
   - chỉ giữ nhóm tuổi, đối tượng học, nước, và các dòng lịch sử học (góc, bài, trò, điểm, sao, thời gian, ngày).
5. Mỗi nghiên cứu cụ thể cần được **hội đồng đạo đức nghiên cứu** phê duyệt (thường qua trường đại học hợp tác) trước khi nhận dữ liệu.

### Thay đổi kỹ thuật cần làm khi được duyệt

- `firestore.rules` (đã làm): tài liệu riêng `users/{uid}/hoSo/chinh/dongY/nghienCuu` = `{ dongY, luc (máy chủ), phienBan }`, chủ hồ sơ bật/tắt, quản trị viên chỉ đọc. Không đổi cấu trúc hồ sơ, nên khi rules chưa xuất bản thì chỉ ô đồng ý báo "chưa lưu được", mọi việc khác vẫn chạy.
- `dang-nhap/`, `ho-so/`: thêm ô đồng ý và nút rút lại.
- Chính sách bảo mật (đã làm): bản 2026-11-17. Cổng sẽ đề nghị mọi người đọc và đồng ý lại khi đăng nhập (đã có sẵn cơ chế `phienBanDieuKhoan`).
- Công cụ xuất dữ liệu ẩn danh (đã làm): `docs/xuat-nghien-cuu/xuat.mjs`, chạy trên máy quản trị bằng khoá service account (không đưa khoá vào kho). Nước có dưới 10 người được gộp thành "khac"; mã người học đổi mỗi lần xuất. Thử trên trình giả lập: `npm run thu`.

### Đoạn đề xuất thêm vào Chính sách bảo mật (mục 3)

**VI:** "Nghiên cứu (chỉ khi bạn đồng ý): nếu bạn (hoặc cha mẹ, với người dưới 13 tuổi) đánh dấu đồng ý, CVCEC có thể dùng dữ liệu học tập **đã ẩn danh** (không có tên, email, tên gọi, biệt danh) cho nghiên cứu về việc học tiếng Việt. Mỗi nghiên cứu phải được hội đồng đạo đức nghiên cứu phê duyệt. Bạn rút lại đồng ý bất cứ lúc nào trong trang Hồ sơ; không đồng ý thì vẫn học bình thường."

**EN:** "Research (only with your consent): if you (or a parent, for learners under 13) tick the consent box, CVCEC may use **de-identified** learning data (no name, email, display name or nickname) for research on learning Vietnamese. Each study must be approved by a research ethics board. You can withdraw consent at any time on the Profile page; learning works the same either way."

## 4. Cần CVCEC quyết

1. Có làm nghiên cứu không, và với đơn vị nào (để biết hội đồng đạo đức nào duyệt)?
2. Nhờ ai xem lại về pháp lý? Người học ở nhiều nước, và luật bảo vệ dữ liệu trẻ em mỗi nơi một khác.
3. Thời điểm tăng phiên bản Chính sách (mọi người sẽ được đề nghị đồng ý lại).
