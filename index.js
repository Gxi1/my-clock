var myRequest = new Request("/template.html");

// 动态加载样式
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
  .then(function (myHtml) {
    // 插入模板内容到页面
    const section = document.createElement("section");
    section.innerHTML = myHtml;
    section.classList.add("displayContainer");
    document.body.appendChild(section);

    const zoomContainer = document.querySelector(".zoomContainer");
    const nav = document.querySelector(".navContainer");
    const fullscreenBtn = document.querySelector(".fullscreenBtn");

    let zoomScale = 1;

    // 应用缩放
    function applyZoom() {
      if (zoomContainer) {
        zoomContainer.style.transform = `scale(${zoomScale})`;
        zoomContainer.style.transformOrigin = "top left";
      }
      if (nav) {
        nav.style.transform = `scale(${1 / zoomScale})`;
        nav.style.transformOrigin = "top left";
      }
    }

    // 自动隐藏导航栏（5秒后）
    if (nav) {
      setTimeout(() => nav.classList.add("fadeOut"), 5000);

      // 点击切换导航栏显示/隐藏
      document.body.addEventListener("click", () => {
        nav.classList.toggle("fadeOut");
      });

      // 滚动收缩导航栏
      window.addEventListener("scroll", () => {
        nav.classList.toggle("shrink", window.scrollY > 30);
      });
    }

    // 双击放大，步进0.1，最大3倍
    document.body.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      zoomScale = Math.min(zoomScale + 0.1, 3);
      applyZoom();
    });

    // 双指捏合缩放手势
    let initialDistance = null;
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const currentDistance = Math.sqrt(dx * dx + dy * dy);

          if (initialDistance === null) {
            initialDistance = currentDistance;
            return;
          }

          const scaleChange = currentDistance / initialDistance;
          zoomScale *= scaleChange;
          zoomScale = Math.max(0.5, Math.min(zoomScale, 3));
          applyZoom();
          initialDistance = currentDistance;
        }
      },
      { passive: false }
    );
    document.body.addEventListener("touchend", () => {
      initialDistance = null;
    });

    // 全屏按钮点击事件
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
        else alert("你的浏览器不支持全屏API");
      });
    }

    // 监听全屏状态变化，进入全屏自动放大1.5倍，退出恢复1倍
    function onFullScreenChange() {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ) {
        zoomScale = 1.5;
      } else {
        zoomScale = 1;
      }
      applyZoom();
    }
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("msfullscreenchange", onFullScreenChange);

    // 动态背景颜色（如果页面有id为color1、color2的input）
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");
    function updateBackground() {
      if (!color1Input || !color2Input) return;
      const c1 = color1Input.value;
      const c2 = color2Input.value;
      document.body.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    }
    if (color1Input && color2Input) {
      color1Input.addEventListener("input", updateBackground);
      color2Input.addEventListener("input", updateBackground);
      updateBackground();
    }
  })
  .catch((error) => console.error("加载失败：", error));
