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

// Tạo vật phẩm rơi
function createItem() {
  if (!isGameRunning || gameOver) return;

  const random = Math.random();
  let itemType;

  if (random < 0.09) {
    itemType = "girlfriend";
  } else if (random < 0.35) {
    itemType = "bomb";
  } else {
    itemType = "cake";
  }

  const item = document.createElement("div");
  item.className = itemType;

  const maxX = gameArea.offsetWidth - 50;
  item.style.left = Math.random() * maxX + "px";
  item.style.top = "-50px";

  gameArea.appendChild(item);

  let fallSpeed = itemType === "girlfriend" ? 1 + Math.random() * 2 : 2 + Math.random() * 5;

  const fallInterval = setInterval(() => {
    if (!isGameRunning || gameOver) {
      clearInterval(fallInterval);
      item.remove();
      return;
    }

    const currentTop = parseFloat(item.style.top);
    item.style.top = currentTop + fallSpeed + "px";

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

    if (currentTop > gameArea.offsetHeight) {
      clearInterval(fallInterval);
      item.remove();
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

  const loveEffect = document.createElement("div");
  loveEffect.className = "love-effect";
  loveEffect.style.left = player.style.left;
  loveEffect.style.top = player.style.top;
  gameArea.appendChild(loveEffect);

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
  setTimeout(() => loveMsg.remove(), 3000);
}

// Hiển thị text bay lên
function showFloatingText(text, color, x) {
  const floatingText = document.createElement("div");
  floatingText.textContent = text;
  floatingText.style.position = "absolute";
  floatingText.style.left = x;
  floatingText.style.bottom = "120px";
  floatingText.style.color = color;
  floatingText.style.fontSize = "24px";
  floatingText.style.fontWeight = "bold";
  floatingText.style.pointerEvents = "none";
  floatingText.style.animation = "floatUp 2s ease-out forwards";
  floatingText.style.zIndex = "10";

  gameArea.appendChild(floatingText);
  setTimeout(() => floatingText.remove(), 2000);
}

// Chạm bom
function hitBomb(bomb) {
  bomb.remove();
  gameOver = true;

  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = player.style.left;
  explosion.style.top = player.style.top;
  gameArea.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 500);

  endGame(true);
}

// Bắt đầu game
function startGame() {
  if (isGameRunning) return;

  score = 0;
  cakesCollected = 0;
  bombsAvoided = 0;
  girlfriendsFound = 0;
  timeLeft = 60;
  gameOver = false;
  hasGirlfriend = false;
  isGameRunning = true;

  scoreDisplay.textContent = score;
  cakesDisplay.textContent = cakesCollected;
  bombsDisplay.textContent = bombsAvoided;
  girlfriendsDisplay.textContent = girlfriendsFound;
  timerDisplay.textContent = timeLeft;

  player.style.left = gameArea.offsetWidth / 2 - player.offsetWidth / 2 + "px";

  const oldItems = gameArea.querySelectorAll(".cake, .bomb, .girlfriend, .explosion, .love-effect, .mini-message");
  oldItems.forEach(item => item.remove());

  itemInterval = setInterval(createItem, 800);

  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);

  startBtn.textContent = "Đang Chơi...";
  startBtn.disabled = true;
}

// Kết thúc game
function endGame(bombed = false) {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(itemInterval);

  finalScore.textContent = score + " điểm";

  if (bombed) {
    messageTitle.textContent = "💥 GAME OVER! 💥";
    messageTitle.className = "game-over";
    messageText.textContent = "Bạn đã chạm phải bom! Hãy cẩn thận hơn nhé!";
  } else {
    messageTitle.textContent = "🎉 Chúc Mừng Trung Thu! 🥮";
    messageTitle.className = "";
    
    if (score >= 300) {
      messageText.textContent = "Xuất sắc! Bạn là cao thủ hái bánh!";
    } else if (score >= 200) {
      messageText.textContent = "Tuyệt vời! Thành tích rất ấn tượng!";
    } else if (score >= 100) {
      messageText.textContent = "Khá tốt! Bạn đã có một trung thu vui vẻ!";
    } else {
      messageText.textContent = "Không sao, lần sau sẽ tốt hơn!";
    }
  }

  if (hasGirlfriend) {
    loveStatus.textContent = "💖 Trung thu này có người yêu rồi! Hạnh phúc quá!";
    loveStatus.className = "love-message";
  } else {
    loveStatus.textContent = "💔 Trung thu này vẫn còn đơn phương...";
    loveStatus.className = "";
  }

  messageOverlay.style.display = "flex";

  startBtn.textContent = "Bắt Đầu Game";
  startBtn.disabled = false;
}

// Event listeners
startBtn.addEventListener("click", startGame);
endBtn.addEventListener("click", () => {
  if (isGameRunning) {
    endGame(false);
  }
});

// Thêm CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px);
    }
  }
`;
document.head.appendChild(style);

// Khởi tạo game
createStars();
player.style.left = gameArea.offsetWidth / 2 - player.offsetWidth / 2 + "px";