var myRequest = new Request("/template.html");
document.write(`<link rel="stylesheet" href="/index.css" />`);

function updateNavShrink() {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;
  if (window.scrollY > 30) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
}

window.addEventListener("scroll", updateNavShrink);
document.addEventListener("fullscreenchange", updateNavShrink);

// 页面加载后，立即初始化导航栏状态
updateNavShrink();

fetch(myRequest, {
  method: "GET",
  headers: {
    "Content-Type": "text/html; charset=utf-8",
  },
  mode: "cors",
  cache: "default",
})
  .then((response) => response.text())
  .then((myHtml) => {
    var section = document.createElement("section");
    section.innerHTML = myHtml;
    section.classList.add("displayContainer");
    document.body.appendChild(section);

    // 5秒后隐藏 UI（导航栏 + 颜色选择器）
    let hideTimer = setTimeout(() => {
      const uiContainer = document.querySelector(".uiContainer");
      if (uiContainer) uiContainer.classList.add("fadeOut");
    }, 5000);

    // 点击页面重新显示/隐藏 UI
    document.body.addEventListener("click", () => {
      const uiContainer = document.querySelector(".uiContainer");
      if (uiContainer) uiContainer.classList.toggle("fadeOut");
    });

    // 阻止颜色选择器触发隐藏行为
    const colorPicker = document.querySelector(".color-picker-cyber");
    if (colorPicker) {
      colorPicker.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // 放大功能
    let zoomScale = 1;
    const zoomBtn = document.querySelector(".handleZoom");
    if (zoomBtn) {
      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        zoomScale += 0.1;
        if (zoomScale > 3) zoomScale = 1;
        document.body.style.transformOrigin = "top left";
        document.body.style.transform = `scale(${zoomScale})`;
      });
    }

    // 全屏功能
    function enterFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else {
        alert("你的浏览器不支持全屏API");
      }
    }

    const fullscreenBtn = document.querySelector(".fullscreenBtn");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        enterFullscreen();
      });
    }

    const exitFullscreenBtn = document.querySelector(".exitFullscreenBtn");
    if (exitFullscreenBtn) {
      exitFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {
            console.error("退出全屏失败:", err);
          });
        }
      });
    }

    // 动态背景渐变颜色
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");

    function updateBackground() {
      if (!color1Input || !color2Input) return;
      const c1 = color1Input.value;
      const c2 = color2Input.value;
      const gradient = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
      document.body.style.background = gradient;
    }

    if (color1Input && color2Input) {
      color1Input.addEventListener("input", updateBackground);
      color2Input.addEventListener("input", updateBackground);
      updateBackground();
    }
  })
  .catch((error) => console.error(error));

function updateTime() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("hour").textContent = hour;
  document.getElementById("minute").textContent = minute;
  document.getElementById("second").textContent = second;
}

document.getElementById("app").innerHTML = `
  <div id="clock">
    <div class="time-num" id="hour">--</div>
    <div class="sep">:</div>
    <div class="time-num" id="minute">--</div>
    <div class="sep">:</div>
    <div class="time-num" id="second">--</div>
  </div>
`;

updateTime();
setInterval(updateTime, 1000);
