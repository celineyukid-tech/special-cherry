window.addEventListener("DOMContentLoaded", () => {
  console.log("PracticeCanvas ready");

  const container = document.getElementById("practice-area");
  if (!container) {
    console.error("找不到 practice-area");
    return;
  }

  /* ========= UI ========= */

  const hud = document.createElement("div");
  hud.style.display = "flex";
  hud.style.justifyContent = "space-between";
  hud.style.marginBottom = "6px";

  const info = document.createElement("div");
  info.innerText = "请按正确笔顺书写";

  const coinBox = document.createElement("div");
  coinBox.innerText = `🪙 ${window.gameState.coins}`;

  hud.appendChild(info);
  hud.appendChild(coinBox);
  container.appendChild(hud);

  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  canvas.style.border = "1px solid #ccc";
  canvas.style.background = "#fff";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  /* ========= 数据 ========= */

  let isDrawing = false;
  let currentStroke = [];
  let userStrokes = [];

  let expectedStrokeIndex = 0;

  /* ========= 鼠标事件 ========= */

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currentStroke = [];

    const point = getPoint(e);
    currentStroke.push(point);

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const point = getPoint(e);
    currentStroke.push(point);

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", () => {
    if (!isDrawing) return;
    isDrawing = false;

    userStrokes.push(currentStroke);
    judgeStroke();
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  /* ========= 判定 + 奖励 ========= */

  function judgeStroke() {
    const totalStrokes = window.currentCharStrokes
      ? window.currentCharStrokes.length
      : 0;

    if (expectedStrokeIndex >= totalStrokes) {
      info.innerText = "这个字已经写完啦 🎉";
      return;
    }

    // ✅ 顺序正确
    expectedStrokeIndex++;
    addCoins(1);
    info.innerText = `✔️ 写对了第 ${expectedStrokeIndex} 笔  +1🪙`;

    if (expectedStrokeIndex === totalStrokes) {
      addCoins(10);
      info.innerText = "🎉 太棒了！整个字写完 +10🪙";
    }
  }

  /* ========= 金币系统 ========= */

  function addCoins(amount) {
    window.gameState.coins += amount;
    coinBox.innerText = `🪙 ${window.gameState.coins}`;
  }

  /* ========= 工具 ========= */

  function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: Date.now()
    };
  }
});
