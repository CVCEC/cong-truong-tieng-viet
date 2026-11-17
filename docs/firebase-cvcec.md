# Firebase – hệ thống tài khoản Trường Tiếng Việt Của Em

> Tài liệu này KHÔNG chứa mật khẩu hay khoá riêng. Không bao giờ đưa khoá service account vào kho này.
> `firebaseConfig` trong `js/firebase-cvcec.js` là thông tin công khai của ứng dụng web, được phép để trong mã nguồn.

Cập nhật lần cuối: 14-11-2026

## Thông tin dự án

| Mục | Giá trị |
|---|---|
| Tên dự án / Project ID | `truong-tieng-viet-cvcec` |
| Số dự án (Project number) | 1059005743126 |
| Tổ chức Google Cloud | cvcec.org |
| Gói đang dùng | **Spark (miễn phí)**: chưa gắn thẻ thanh toán. Không nâng lên Blaze. |
| Google Analytics | **Tắt**, vì người học là trẻ em |
| Ứng dụng web | "Cong chinh vietclass", App ID `1:1059005743126:web:f7883d1783b19cccb37537`. Không dùng Firebase Hosting; trang chạy trên GitHub Pages |
| Cơ sở dữ liệu | Cloud Firestore, Standard edition, `(default)` |
| Vùng máy chủ | **northamerica-northeast2 (Toronto)**. Không đổi được. |
| Firebase JS SDK | 12.19.0 (modular, tải từ gstatic). Đổi phiên bản ở `js/firebase-cvcec.js`, `js/tai-khoan.js`, `dang-nhap/index.html` và `ho-so/index.html` |

## Những gì đã bật

- **Authentication → Sign-in method**
  - Google: bật. Email hỗ trợ là trang.ptq@cvcec.org. Tên công khai hiện trên màn hình chọn tài khoản là "Trường Tiếng Việt Của Em".
  - Email/Password: bật. "Email link (passwordless sign-in)": **tắt**.
  - Liên kết tài khoản: một tài khoản cho mỗi email (mặc định).
- **Authentication → Settings → Authorized domains**: `localhost`, `truong-tieng-viet-cvcec.firebaseapp.com`, `truong-tieng-viet-cvcec.web.app` (các tên miền mặc định) và `vietclass.cvcec.org`.
- **Authentication → Templates (mẫu email)**: **chưa sửa được**. Firebase báo "hiện không thể cập nhật mẫu email cho dự án này". Đây là giới hạn với dự án mới tạo.
  - Hiện tại trang gửi email bằng mẫu tiếng Việt có sẵn (`auth.languageCode = "vi"`). Lời ký cuối thư là "Đội ngũ Trường Tiếng Việt Của Em".
  - Người gửi tạm thời là `noreply@truong-tieng-viet-cvcec.firebaseapp.com`.
  - **Việc cần làm:** khoảng một tuần sau, thử lại ở Authentication → Templates. Đặt tên người gửi là "Trường Tiếng Việt Của Em" và tiêu đề song ngữ cho email xác nhận và email đặt lại mật khẩu. Nội dung thư xác nhận do Firebase khoá, không sửa được.
- **Firestore → Rules – VIỆC CẦN LÀM NGAY (17-11-2026):** xuất bản **bản 3** trong `docs/firestore.rules` (thêm `hoSo/chinh/dongY/nghienCuu` cho ô đồng ý nghiên cứu). Cách làm: mở Firestore Database → Rules, dán toàn bộ nội dung tệp, bấm Publish. Đã chạy thử 18 tình huống trên trình giả lập (`docs/thu-rules/`). Trước khi xuất bản, ô đồng ý nghiên cứu sẽ báo "chưa lưu được"; các phần khác không bị ảnh hưởng.
- **Firestore → Rules**: bản mới (bản 2: tài khoản, hồ sơ học viên, tiến độ học, bảng xếp hạng) lưu ở [`docs/firestore.rules`](firestore.rules). **Đã xuất bản** (15-11-2026). Đã chạy thử 15 tình huống trên trình giả lập (xem [`docs/thu-rules/`](thu-rules/)) và 14 tình huống trên dự án thật bằng một tài khoản thử tạm thời, đã xoá sạch sau khi thử.
- Bản 1 (xuất bản 14-11-2026) dưới đây được thay bằng bản 2:
  - Mặc định chặn tất cả.
  - `users/{uid}`: chỉ chính chủ đọc và ghi. Hồ sơ chỉ có 3 trường `hoTen`, `email`, `ngayTao`. `email` phải trùng email đăng nhập; `ngayTao` do máy chủ ghi. Về sau người dùng chỉ được sửa `hoTen`.
  - `admins/{uid}`: người dùng chỉ đọc được mục của chính mình; không ai ghi được từ trang web. Quản trị viên được thêm bằng tay trong console.
  - Đã thử bằng Rules Playground trước khi xuất bản: chưa đăng nhập thì không đọc được; A không đọc được hồ sơ B; không ai tự ghi được vào `admins`.

## Ai là Owner

Dự án có 2 Owner, để tổ chức không phụ thuộc vào một người:

| Email | Vai trò | Người phụ trách |
|---|---|---|
| trang.ptq@cvcec.org | Owner | Phan Thị Quỳnh Trang |
| contact@cvcec.org | Owner | Nguyễn Thế Tùng (Hội đồng quản trị CVCEC) |

Xem và sửa ở **Project settings → Users and permissions**.

## Thêm quản trị viên (admins/{uid})

1. Đăng nhập một lần ở https://vietclass.cvcec.org/dang-nhap/.
2. Trong console, mở **Authentication → Users**, chép cột **User UID** của tài khoản đó.
3. Mở **Firestore Database → Data → Start collection**. Đặt Collection ID là `admins`, Document ID là UID vừa chép. Thêm trường `ten` (string), ví dụ "Phan Thị Quỳnh Trang", rồi bấm **Save**.

## Xem hạn mức sử dụng (Usage)

Gói Spark có hạn mức miễn phí mỗi ngày. Khi vượt hạn mức, dịch vụ tạm dừng tới ngày hôm sau; không bị tính tiền.

- **Firestore:** Firestore Database → tab **Usage** (số lượt đọc, ghi, xoá trong ngày).
- **Đăng nhập:** Authentication → tab **Usage**.
- **Toàn dự án:** biểu tượng bánh răng → **Usage and billing**. Ở đây xem được gói đang dùng là Spark và kiểm tra rằng chưa gắn thẻ thanh toán.

## Trang trong kho này

- `js/firebase-cvcec.js`: cấu hình Firebase dùng chung cho cổng (app, auth, db).
- `dang-nhap/index.html`, `ho-so/index.html`: đăng nhập, đăng ký, hồ sơ (có `noindex`). `thu-dang-nhap/` chỉ còn chuyển hướng sang `dang-nhap/`.
- `js/tai-khoan.js`: thư viện tài khoản dùng chung cho mọi trang của cổng.
- `docs/firestore.rules`: bản sao Security Rules đang xuất bản. Sửa rules thì sửa trong console, thử bằng Rules Playground, xuất bản, rồi chép lại vào tệp này.
