# 🚀 Hướng Dẫn Đưa Dự Án Lên GitHub

## Bước 1: Chuẩn bị Git và GitHub

1. **Cài đặt Git** (nếu chưa có):
   - Tải về từ: https://git-scm.com/
   - Cài đặt với các tùy chọn mặc định

2. **Tạo tài khoản GitHub** (nếu chưa có):
   - Truy cập: https://github.com/
   - Đăng ký tài khoản miễn phí

## Bước 2: Tạo Repository Trên GitHub

1. Đăng nhập vào GitHub
2. Nhấn nút **"New"** hoặc **"+"** ở góc trên bên phải
3. Chọn **"New repository"**
4. Điền thông tin:
   - **Repository name**: `game-hai-banh-trung-thu`
   - **Description**: `🥮 Game Hái Bánh Trung Thu - Trò chơi web vui nhộn cho mùa Trung Thu`
   - Chọn **Public** (để mọi người có thể xem)
   - ✅ Tích **"Add a README file"** (sẽ ghi đè bằng README.md của chúng ta)
5. Nhấn **"Create repository"**

## Bước 3: Upload Code Lên GitHub

### Cách 1: Sử dụng Git Command Line

Mở Command Prompt hoặc Git Bash tại thư mục dự án và chạy:

```bash
# Khởi tạo Git repository
git init

# Thêm tất cả files
git add .

# Commit đầu tiên
git commit -m "🎮 Initial commit: Game Hái Bánh Trung Thu"

# Kết nối với GitHub repository (thay YOUR_USERNAME bằng tên GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/game-hai-banh-trung-thu.git

# Đẩy code lên GitHub
git branch -M main
git push -u origin main
```

### Cách 2: Sử dụng GitHub Desktop

1. Tải và cài đặt GitHub Desktop
2. Đăng nhập vào tài khoản GitHub
3. Chọn "Add an Existing Repository from your Hard Drive"
4. Chọn thư mục dự án
5. Commit và Push lên GitHub

### Cách 3: Upload Trực Tiếp Trên Web

1. Vào repository vừa tạo trên GitHub
2. Nhấn **"uploading an existing file"**
3. Kéo thả tất cả files vào
4. Viết commit message: "🎮 Upload Game Hái Bánh Trung Thu"
5. Nhấn **"Commit changes"**

## Bước 4: Kích Hoạt GitHub Pages

1. Vào **Settings** của repository
2. Cuộn xuống phần **"Pages"**
3. Trong **Source**, chọn **"Deploy from a branch"**
4. Chọn branch **"main"** và folder **"/ (root)"**
5. Nhấn **"Save"**

Sau vài phút, game sẽ có thể truy cập tại:
`https://YOUR_USERNAME.github.io/game-hai-banh-trung-thu/`

## Bước 5: Cập Nhật Sau Này

Khi muốn cập nhật code:

```bash
git add .
git commit -m "🔧 Cập nhật tính năng mới"
git push origin main
```

## 🎯 Lưu Ý Quan Trọng

- Thay `YOUR_USERNAME` bằng tên GitHub thực tế của bạn
- Repository name có thể thay đổi theo ý muốn
- GitHub Pages có thể mất 5-10 phút để cập nhật
- File `index.html` sẽ là trang chính của game

## 🎮 Demo

Sau khi hoàn thành, bạn có thể chia sẻ link game với bạn bè:
`https://YOUR_USERNAME.github.io/game-hai-banh-trung-thu/`

Chúc bạn thành công! 🚀