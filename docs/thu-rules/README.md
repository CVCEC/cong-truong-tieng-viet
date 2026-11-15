# Thử Security Rules trên máy (trình giả lập)

Chạy được trên máy có Node 18+ và Java. Không đụng tới dự án Firebase thật.

```
cd docs/thu-rules
npm install
npm run thu
```

Bộ thử (`thu.test.mjs`) gồm 15 tình huống: chưa đăng nhập, tài khoản A đọc dữ liệu B, mỗi tài khoản một hồ sơ,
hồ sơ dưới 13 tuổi cần cha mẹ đồng ý, kiểm tra biệt danh, ghi lượt chơi hợp lệ, các kiểu gian lận sao/bài/thời gian,
bảng xếp hạng chỉ với hồ sơ cho phép, xoá toàn bộ dữ liệu, quyền quản trị viên chỉ xem.
