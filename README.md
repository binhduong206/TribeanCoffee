# ☕ TriBeanCoffee App

Ứng dụng đặt nước và quản lý dịch vụ dành cho quán cà phê **TriBeanCoffee**. Được xây dựng trên nền tảng React Native, ứng dụng mang đến trải nghiệm đặt hàng mượt mà, nhanh chóng và hiện đại cho người dùng.

---

## 👥 Nhóm Sinh viên thực hiện
*   **Bàn Bình Dương** - 23810320382
*   **Hoàng Thị Hương Lan** - 23810310228
*   **Nguyễn Ngọc Vinh** - 23810310427

---

## 📱 Giới thiệu Ứng dụng
TriBeanCoffee App là giải pháp di động toàn diện cho khách hàng của quán, bao gồm các tính năng chính:
*   **Khám phá Menu**: Duyệt danh mục đồ uống phong phú (Cà phê, Trà, Bánh ngọt) với hình ảnh sinh động.
*   **Tùy chỉnh Sản phẩm**: Lựa chọn Size, mức đường, mức đá theo sở thích cá nhân.
*   **Quản lý Giỏ hàng**: Thêm, sửa, xóa món ăn và tính toán tổng chi phí thời gian thực.
*   **Hệ thống Thành viên**: Đăng ký, đăng nhập và lưu trữ thông tin cá nhân bảo mật.
*   **Theo dõi Đơn hàng**: Quản lý lịch sử mua hàng và trạng thái đơn hàng từ lúc đặt đến khi nhận.
*   **Đánh giá & Phản hồi**: Gửi nhận xét và số sao cho từng món nước đã trải nghiệm.

---

## 🛠 Công nghệ Sử dụng (Tech Stack)
*   **Core**: React Native (Expo SDK)
*   **Navigation**: Expo Router (File-based Routing)
*   **Ngôn ngữ**: TypeScript
*   **Styling**: NativeWind (Tailwind CSS cho Mobile)
*   **Storage**: Expo SecureStore (Lưu trữ Token bảo mật)
*   **State Management**: Context API

---

## 📂 Cấu trúc Thư mục (Folder Structure)

```text
TriBeanApp/
├── app/                # 🌐 Luồng điều hướng (Routes) chính của Expo Router
│   ├── (auth)/         # Nhóm màn hình xác thực (Login, Register)
│   ├── (tabs)/         # Nhóm màn hình chính có Bottom Tab Bar (Home, Menu, Cart, Profile)
│   ├── product/        # Màn hình chi tiết sản phẩm (Dynamic route [id])
│   ├── order/          # Màn hình chi tiết đơn hàng
│   └── _layout.tsx     # Root layout, nơi cấu hình AuthProvider và CartProvider
├── assets/             # 🎨 Hình ảnh, Icons và Fonts của ứng dụng
├── components/         # 🧱 Các thành phần giao diện dùng chung (Button, Card, Input...)
├── constants/          # 📍 Lưu trữ hằng số, màu sắc, dữ liệu tĩnh
├── context/            # 🧠 Quản lý trạng thái toàn cục (AuthContext, CartContext)
├── hooks/              # 🎣 Các Custom Hooks hỗ trợ xử lý logic
├── services/           # 📡 Giao tiếp API, cấu hình Axios/Fetch, xử lý Host IP
├── types/              # 📝 Định nghĩa kiểu dữ liệu (Interface/Type) cho TypeScript
└── utils/              # 🛠 Các hàm tiện ích (Format tiền, lưu trữ bộ nhớ tạm)
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy
1.  **Clone dự án**:
    ```bash
    git clone [url-cua-ban]
    ```
2.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```
3.  **Cấu hình môi trường**:
    Tạo file `.env` ở thư mục gốc và cấu hình:
    ```env
    EXPO_PUBLIC_API_URL=http://your-server-ip:5262
    ```
4.  **Chạy ứng dụng**:
    ```bash
    npx expo start
    ```
    *Dùng điện thoại cài sẵn **Expo Go** để quét mã QR và trải nghiệm.*
