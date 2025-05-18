// main.js

// 引入模板和样式
var myRequest = new Request("/template.html");
document.write(`<link rel="stylesheet" href="/index.css" />`);

// 状态变量
let lastScrollY = window.scrollY;
let hideNavTimer = null;

// 滚动方向检测 + shrink 效果
function onScroll() {
  const nav = document.querySelector('.navContainer');
  if (!nav) return;

  const currentY = window.scrollY;

  // 往下滚动且超过 100px 隐藏，往上滚动则显示
  if (currentY > lastScrollY && currentY > 100) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }

  // 超过 30px 缩小高度
  if (currentY > 30) {
    nav.classList.add('shrink');
  } else {
    nav.classList.remove('shrink');
  }

  lastScrollY = currentY;
  resetHideTimer();
}

// 重置 5 秒后自动隐藏定时器
function resetHideTimer() {
  const nav = document.querySelector('.navContainer');
  if (!nav) return;
  if (hideNavTimer) clearTimeout(hideNavTimer);
  hideNavTimer = setTimeout(() => {
    nav.classList.add('hidden');
  }, 5000);
}

// 初始化导航相关交互
function initNavControls() {
  const nav = document.querySelector('.navContainer');
  if (!nav) return;

  // 1. 滚动时触发
  window.addEventListener('scroll', onScroll);

  // 2. 点击页面任意处：切换显/隐
  document.body.addEventListener('click', () => {
    nav.classList.toggle('hidden');
    resetHideTimer();
  });

  // 3. 点击导航本身：也切换
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('hidden');
    resetHideTimer();
  });

  // 4. 首次加载时设定初始状态，并启动定时
  onScroll();
  resetHideTimer();
}

// 实时更新时钟
function updateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("hour").textContent   = pad(now.getHours());
  document.getElementById("minute").textContent = pad(now.getMinutes());
  document.getElementById("second").textContent = pad(now.getSeconds());
}

// 主流程：加载模板并初始化所有功能
fetch(myRequest, {
  method: "GET",
  headers: { "Content-Type": "text/html; charset=utf-8" },
  mode: "cors",
})
  .then((res) => res.text())
  .then((html) => {
    // 插入页面模板
    const section = document.createElement("section");
    section.classList.add("displayContainer");
    section.innerHTML = html;
    document.body.appendChild(section);

    // —— 原有功能：5 秒后隐藏 UI（导航栏 + 颜色选择器） ——
    let uiHideTimer = setTimeout(() => {
      const uiContainer = document.querySelector(".uiContainer");
      if (uiContainer) uiContainer.classList.add("fadeOut");
    }, 5000);
    document.body.addEventListener("click", () => {
      const uiContainer = document.querySelector(".uiContainer");
      if (uiContainer) uiContainer.classList.toggle("fadeOut");
    });
    const colorPicker = document.querySelector(".color-picker-cyber");
    if (colorPicker) {
      colorPicker.addEventListener("click", (e) => e.stopPropagation());
    }

    // —— 放大功能 ——
    let zoomScale = 1;
    const zoomBtn = document.querySelector(".handleZoom");
    if (zoomBtn) {
      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        zoomScale = zoomScale < 3 ? zoomScale + 0.1 : 1;
        document.body.style.transformOrigin = "top left";
        document.body.style.transform = `scale(${zoomScale})`;
      });
    }

    // —— 全屏功能 ——
    function enterFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen)        el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen)     el.msRequestFullscreen();
      else alert("你的浏览器不支持全屏API");
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
          document.exitFullscreen().catch((err) => console.error("退出全屏失败:", err));
        }
      });
    }

    // —— 背景渐变颜色功能 ——
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");
    function updateBackground() {
      if (!color1Input || !color2Input) return;
      const gradient = `linear-gradient(135deg, ${color1Input.value} 0%, ${color2Input.value} 100%)`;
      document.body.style.background = gradient;
    }
    if (color1Input && color2Input) {
      color1Input.addEventListener("input", updateBackground);
      color2Input.addEventListener("input", updateBackground);
      updateBackground();
    }

    // —— 初始化导航隐藏/显示逻辑 ——
    initNavControls();
  })
  .catch((err) => console.error(err));

// 时钟容器
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
