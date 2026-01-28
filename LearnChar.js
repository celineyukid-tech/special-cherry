window.addEventListener("DOMContentLoaded", () => {
  console.log("M1_LearnChar ready");

  const demoArea = document.getElementById("demo-area");
  if (!demoArea) {
    console.error("找不到 demo-area");
    return;
  }

  /* ========= UI ========= */

  const replayBtn = document.createElement("button");
  replayBtn.innerText = "重新播放笔顺";
  replayBtn.style.marginBottom = "10px";
  demoArea.appendChild(replayBtn);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "300");
  svg.setAttribute("height", "300");
  svg.setAttribute("viewBox", "0 0 1024 1024");
  svg.style.border = "1px solid #ccc";

  demoArea.appendChild(svg);

  /* ========= 数据 ========= */

  let currentStrokes = [];
  let drawnPaths = []; // 已画的 path

  fetch("./vendor/make-me-a-hanzi/graphics.txt")
    .then(res => res.text())
    .then(text => {
      const lines = text.split("\n").filter(l => l.trim());
      const charData = JSON.parse(lines[0]);
      console.log("当前字：", charData.character);


      window.currentCharStrokes = charData.strokes;

      currentStrokes = charData.strokes;
      playStrokes();
    });

  replayBtn.addEventListener("click", () => {
    playStrokes();
  });

  /* ========= 核心逻辑 ========= */

  function playStrokes() {
    svg.innerHTML = "";
    drawnPaths = [];

    currentStrokes.forEach((strokePath, index) => {
      setTimeout(() => {
        // 把上一个高亮的笔画变成灰色
        if (drawnPaths.length > 0) {
          const lastPath = drawnPaths[drawnPaths.length - 1];
          lastPath.setAttribute("stroke", "#bbb");
        }

        // 当前笔画（高亮）
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", strokePath);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "red");
        path.setAttribute("stroke-width", "80");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        svg.appendChild(path);
        drawnPaths.push(path);
      }, index * 600);
    });
  }
});
