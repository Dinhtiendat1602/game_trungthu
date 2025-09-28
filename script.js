// Tạo sao lấp lánh
function createStars() {
  const stars = document.getElementById("stars");
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3 + "px";
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 5 + "s";
    stars.appendChild(star);
  }
}

// Khởi tạo biến game
let score = 0;
let cakesCollected = 0;
let bombsAvoided = 0;
let girlfriendsFound = 0;
let timeLeft = 60;
let gameInterval;
let itemInterval;
let isGameRunning = false;
let gameOver = false;
let hasGirlfriend = false;

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const cakesDisplay = document.getElementById("cakesCollected");
const bombsDisplay = document.getElementById("bombsAvoided");
const girlfriendsDisplay = document.getElementById("girlfriendsFound");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const messageOverlay = document.getElementById("messageOverlay");
const finalScore = document.getElementById("finalScore");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const loveStatus = document.getElementById("loveStatus");

// Di chuyển player theo chuột
gameArea.addEventListener("mousemove", (e) => {
  if (!isGameRunning || gameOver) return;

  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left - player.offsetWidth / 2;
  const maxX = gameArea.offsetWidth - player.offsetWidth;

  player.style.left = Math.max(0, Math.min(x, maxX)) + "px";
});

// Tạo vật phẩm rơi (bánh, bom hoặc người yêu)
function createItem() {
  if (!isGameRunning || gameOver) return;

  const random = Math.random();
  let itemType;

  if (random < 0.09) {
    // 5% cơ hội là người yêu (hiếm)
    itemType = "girlfriend";
  } else if (random < 0.35) {
    // 30% cơ hội là bom
    itemType = "bomb";
  } else {
    // 65% cơ hội là bánh
    itemType = "cake";
  }

  const item = document.createElement("div");
  item.className = itemType;

  const maxX = gameArea.offsetWidth - 50;
  item.style.left = Math.random() * maxX + "px";
  item.style.top = "-50px";

  gameArea.appendChild(item);

  // Animation rơi (người yêu rơi chậm hơn)
  let fallSpeed =
    itemType === "girlfriend"
      ? 1 + Math.random() * 2 // Người yêu rơi chậm
      : 2 + Math.random() * 5; // Bánh và bom rơi nhanh hơn

  const fallInterval = setInterval(() => {
    if (!isGameRunning || gameOver) {
      clearInterval(fallInterval);
      item.remove();
      return;
    }

    const currentTop = parseFloat(item.style.top);
    item.style.top = currentTop + fallSpeed + "px";

    // Kiểm tra va chạm
    if (checkCollision(player, item)) {
      if (itemType === "bomb") {
        hitBomb(item);
        clearInterval(fallInterval);
      } else if (itemType === "cake") {
        collectCake(item);
        clearInterval(fallInterval);
      } else if (itemType === "girlfriend") {
        findGirlfriend(item);
        clearInterval(fallInterval);
      }
    }

    // Xóa vật phẩm nếu ra khỏi màn hình
    if (currentTop > gameArea.offsetHeight) {
      clearInterval(fallInterval);
      item.remove();
      // Nếu là bom và tránh được thì tính điểm
      if (itemType === "bomb") {
        bombsAvoided++;
        bombsDisplay.textContent = bombsAvoided;
      }
    }
  }, 20);
}

// Kiểm tra va chạm
function checkCollision(player, item) {
  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  return !(
    playerRect.right < itemRect.left ||
    playerRect.left > itemRect.right ||
    playerRect.bottom < itemRect.top ||
    playerRect.top > itemRect.bottom
  );
}

// Thu thập bánh
function collectCake(cake) {
  cake.remove();
  score += 10;
  cakesCollected++;
  scoreDisplay.textContent = score;
  cakesDisplay.textContent = cakesCollected;

  showFloatingText("+10", "#ffd700", player.style.left);
}

// Tìm thấy người yêu
function findGirlfriend(girlfriend) {
  girlfriend.remove();
  score += 50;
  girlfriendsFound++;
  hasGirlfriend = true;

  scoreDisplay.textContent = score;
  girlfriendsDisplay.textContent = girlfriendsFound;

  // Hiệu ứng tình yêu
  const loveEffect = document.createElement("div");
  loveEffect.className = "love-effect";
  loveEffect.style.left = player.style.left;
  loveEffect.style.top = player.style.top;
  gameArea.appendChild(loveEffect);

  // Thông báo đặc biệt
  showLoveMessage("💖 TRUNG THU NÀY CÓ NGƯỜI YÊU RỒI! 💖");
  showFloatingText("+50", "#ff69b4", player.style.left);

  setTimeout(() => {
    loveEffect.remove();
  }, 1000);
}

// Hiển thị thông báo tình yêu
function showLoveMessage(text) {
  const loveMsg = document.createElement("div");
  loveMsg.className = "mini-message";
  loveMsg.textContent = text;
  loveMsg.style.left = player.style.left;
  loveMsg.style.top = parseInt(player.style.top) - 50 + "px";
  loveMsg.style.animation = "floatUp 3s ease-out forwards";

  gameArea.appendChild(loveMsg);
  setTimeout(() => loveMsg.remove(), 5000);
}

// Trúng bom
function hitBomb(bomb) {
  gameOver = true;

  // Hiệu ứng nổ
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = bomb.style.left;
  explosion.style.top = bomb.style.top;
  gameArea.appendChild(explosion);

  bomb.remove();

  // Dừng game sau 0.5 giây
  setTimeout(() => {
    endGame(true);
  }, 500);
}

// Hiển thị văn bản nổi
function showFloatingText(text, color, left) {
  const points = document.createElement("div");
  points.textContent = text;
  points.style.position = "absolute";
  points.style.color = color;
  points.style.fontSize = "20px";
  points.style.fontWeight = "bold";
  points.style.left = left;
  points.style.top = parseInt(player.style.top) - 30 + "px";
  points.style.animation = "floatUp 1s ease-out forwards";
  points.style.zIndex = "5";

  gameArea.appendChild(points);
  setTimeout(() => points.remove(), 1000);
}

// Bắt đầu game
startBtn.addEventListener("click", startGame);

function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  gameOver = false;
  hasGirlfriend = false;
  score = 0;
  cakesCollected = 0;
  bombsAvoided = 0;
  girlfriendsFound = 0;
  timeLeft = 60;

  scoreDisplay.textContent = score;
  cakesDisplay.textContent = cakesCollected;
  bombsDisplay.textContent = bombsAvoided;
  girlfriendsDisplay.textContent = girlfriendsFound;
  timerDisplay.textContent = timeLeft;

  // Tạo vật phẩm mỗi 0.8 giây
  itemInterval = setInterval(createItem, 800);

  // Đếm ngược thời gian
  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

// Kết thúc game
endBtn.addEventListener("click", () => endGame(false));

function endGame(isBombGameOver) {
  isGameRunning = false;
  gameOver = true;
  clearInterval(gameInterval);
  clearInterval(itemInterval);

  // Hiển thị thông điệp phù hợp
  if (isBombGameOver) {
    messageTitle.innerHTML = '💥 <span class="game-over">Game Over!</span> 💥';
    messageText.textContent = "Ôi không! Bạn đã trúng bom!";
  } else {
    messageTitle.innerHTML = "🎉 Chúc Mừng Trung Thu! 🥮";
    messageText.textContent = "Thành tích của bạn thật tuyệt vời!";
  }

  // Thông báo tình trạng tình yêu
  if (hasGirlfriend) {
    loveStatus.innerHTML =
      '💖 <span class="love-message">Trung thu này có người yêu rồi! Yay!</span> 💖';
  } else {
    loveStatus.innerHTML = "💔 Trung thu này vẫn còn đơn phương...";
  }

  finalScore.textContent = score + " điểm";
  messageOverlay.style.display = "flex";

  // Xóa tất cả vật phẩm còn lại
  document
    .querySelectorAll(".cake, .bomb, .girlfriend")
    .forEach((item) => item.remove());
}

// Thêm CSS cho hiệu ứng
const style = document.createElement("style");
style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
        `;
document.head.appendChild(style);

// Khởi tạo game
createStars();

// Đặt vị trí player ban đầu
player.style.left = gameArea.offsetWidth / 2 - player.offsetWidth / 2 + "px";
// di chuyển chs trên smartphone
