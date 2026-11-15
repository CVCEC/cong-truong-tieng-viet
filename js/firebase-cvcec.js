/*!
 * Cấu hình Firebase dùng chung cho cổng Trường Tiếng Việt Của Em (vietclass.cvcec.org)
 * Dự án Firebase: truong-tieng-viet-cvcec (gói Spark, Firestore ở Toronto – northamerica-northeast2)
 *
 * firebaseConfig dưới đây là thông tin CÔNG KHAI của ứng dụng web, được phép để trong mã nguồn.
 * Dữ liệu được bảo vệ bằng Security Rules của Firestore (xem docs/firestore.rules).
 * TUYỆT ĐỐI KHÔNG đưa khoá riêng (service account), mật khẩu hay khoá bí mật nào vào kho này.
 *
 * Firebase JS SDK bản modular, tải từ gstatic, ghim phiên bản:
 */
export const FIREBASE_SDK = "12.19.0";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBFmp5vUa5ByFvQjivGCSSFmi0iTY9jf0E",
  authDomain: "truong-tieng-viet-cvcec.firebaseapp.com",
  projectId: "truong-tieng-viet-cvcec",
  storageBucket: "truong-tieng-viet-cvcec.firebasestorage.app",
  messagingSenderId: "1059005743126",
  appId: "1:1059005743126:web:f7883d1783b19cccb37537"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* Email xác nhận / đặt lại mật khẩu gửi bằng tiếng Việt (mẫu có sẵn của Firebase). */
auth.languageCode = "vi";
