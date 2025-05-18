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

    const zoomContainer = document.querySelector(".zoomContainer");
    const nav = document.querySelector(".navContainer");
    let zoomScale = 1;

    // 自动隐藏导航栏
    setTimeout(() => {
      if (nav) nav.classList.add("fadeOut");
    }, 5000);

    // 点击切换导航栏显示/隐藏
    document.body.addEventListener("click", () => {
      if (nav) nav.classList.toggle("fadeOut");
    });

    // 双击放大
    document.body.addEventListener("dblclick", () => {
      zoomScale += 0.1;
      zoomScale = Math.min(zoomScale, 3); // 最大3倍
      applyZoom();
    });

    // 双指缩放
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

    // 全屏功能
    const fullscreenBtn = document.querySelector(".fullscreenBtn");
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

    // 颜色选择器：动态背景
    const color1Input = document.getElementById("color1");
    const color2Input = document.getElementById("color2");

    function updateBackground() {
      const c1 = color1Input.value;
      const c2 = color2Input.value;
      document.body.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    }

    if (color1Input && color2Input) {
      color1Input.addEventListener("input", updateBackground);
      color2Input.addEventListener("input", updateBackground);
      updateBackground(); // 初始化背景
    }
  })
  .catch((error) => console.error("加载模板失败：", error));

// 滚动时导航栏收缩
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;
  nav.classList.toggle("shrink", window.scrollY > 30);
});
