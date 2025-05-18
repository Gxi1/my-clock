// 动态加载模板
var myRequest = new Request("/template.html");
document.write(`<link rel="stylesheet" href="/index.css" />`);

fetch(myRequest, {
  method: "GET",
  headers: {
    "Content-Type": "text/html; charset=utf-8",
  },
  mode: "cors",
  cache: "default",
})
  .then(function (response) {
    return response.text();
  })
  .then(function (myJson) {
    var section = document.createElement("section");
    section.innerHTML = myJson;
    section.classList.add("displayContainer");
    document.body.appendChild(section);

    // 🔁 通用函数：5 秒后隐藏 UI
    function hideUIAfterDelay(delay = 5000) {
      setTimeout(() => {
        const uiContainer = document.querySelector(".uiContainer");
        if (uiContainer) {
          uiContainer.classList.add("fadeOut");
        }
      }, delay);
    }

    // ✅ 页面加载后隐藏 UI
    hideUIAfterDelay();

    // ✅ 页面加载后 5 秒自动进入全屏
    setTimeout(() => {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    }, 5000);

    // 点击页面切换 UI 显示/隐藏
    document.body.addEventListener("click", () => {
      const uiContainer = document.querySelector(".uiContainer");
      if (uiContainer) {
        uiContainer.classList.toggle("fadeOut");
      }
    });

    // 阻止颜色选择器触发隐藏
    const colorPicker = document.querySelector(".color-picker-cyber");
    if (colorPicker) {
      colorPicker.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // 🔍 放大功能
    let zoomScale = 1;
    const zoomBtn = document.querySelector(".handleZoom");
    if (zoomBtn) {
      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.body.style.transform = `scale(${zoomScale})`;
        document.body.style.transformOrigin = "top left";
        zoomScale += 0.1;
        if (zoomScale > 2.0) zoomScale = 1.0; // 可选重置缩放
      });
    }

    // 🔲 全屏功能
    const fullscreenBtn = document.querySelector(".fullscreenBtn");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
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
      });
    }

    // ❌ 退出全屏按钮
    const exitFullscreenBtn = document.querySelector(".exitFullscreenBtn");
    if (exitFullscreenBtn) {
      exitFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {
            console.error("退出全屏失败:", err);
          });
        }

        // 重新设置隐藏 UI 定时器
        hideUIAfterDelay();
      });
    }

    // 🎨 动态背景渐变颜色
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");

    function updateBackground() {
      const c1 = color1Input.value;
      const c2 = color2Input.value;
      const gradient = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
      document.body.style.background = gradient;
    }

    if (color1Input && color2Input) {
      color1Input.addEventListener("input", updateBackground);
      color2Input.addEventListener("input", updateBackground);
      updateBackground(); // 初始背景设置
    }
  })
  .catch((error) => console.error(error));

// 📏 滚动时缩小导航栏
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;
  if (window.scrollY > 30) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
});

// 🕒 数字时钟初始化
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
