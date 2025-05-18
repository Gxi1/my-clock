var myRequest = new Request("/template.html");
document.write(`<link rel="stylesheet" href="/index.css" />`);

function hideUIAfterDelay(delay = 5000) {
  clearTimeout(window._hideUITimer);
  window._hideUITimer = setTimeout(() => {
    const uiContainer = document.querySelector(".uiContainer");
    if (uiContainer) {
      uiContainer.classList.add("fadeOut");
    }
  }, delay);
}

// 用户触发全屏函数
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

    // 5秒后提示用户点击进入全屏
    setTimeout(() => {
      if (confirm("点击确定进入全屏模式")) {
        enterFullscreen();
      }
    }, 5000);

    // 初始隐藏UI
    hideUIAfterDelay();

    // 点击页面切换 UI 显示/隐藏
    document.body.addEventListener("click", () => {
      const uiContainer = document.querySelector(".uiContainer");
      if (!uiContainer) return;
      uiContainer.classList.toggle("fadeOut");
    });

    // 阻止颜色选择器点击事件冒泡
    const colorPicker = document.querySelector(".color-picker-cyber");
    if (colorPicker) {
      colorPicker.addEventListener("click", (e) => e.stopPropagation());
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

    // 全屏按钮事件
    const fullscreenBtn = document.querySelector(".fullscreenBtn");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        enterFullscreen();
      });
    }

    // 退出全屏按钮事件
    const exitFullscreenBtn = document.querySelector(".exitFullscreenBtn");
    if (exitFullscreenBtn) {
      exitFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen()
            .catch((err) => {
              console.error("退出全屏失败:", err);
            })
            .finally(() => {
              hideUIAfterDelay();
            });
        } else {
          hideUIAfterDelay();
        }
      });
    }

    // 监听全屏状态变化，退出全屏时重新启动隐藏UI计时器
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        // 退出全屏了
        hideUIAfterDelay();
      }
    });

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

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;
  if (window.scrollY > 30) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
});

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
