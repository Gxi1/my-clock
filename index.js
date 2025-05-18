var myRequest = new Request("/template.html");

// 加载样式表
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

    // 自动隐藏导航栏（5秒后）
    let hideTimer = setTimeout(() => {
      const nav = document.querySelector(".navContainer");
      if (nav) nav.classList.add("fadeOut");
    }, 5000);

    // 点击切换导航栏显示/隐藏
    document.body.addEventListener("click", () => {
      const nav = document.querySelector(".navContainer");
      if (nav) nav.classList.toggle("fadeOut");
    });

    // 放大功能（缩放 zoomContainer，导航栏反向缩放保持原样）
    let zoomScale = 1;
    document.querySelector(".handleZoom").addEventListener("click", (e) => {
      e.stopPropagation();
      const zoomContainer = document.querySelector(".zoomContainer");
      const nav = document.querySelector(".navContainer");

      zoomScale += 0.1;

      if (zoomContainer) {
        zoomContainer.style.transform = `scale(${zoomScale})`;
        zoomContainer.style.transformOrigin = "top left";
      }

      if (nav) {
        nav.style.transform = `scale(${1 / zoomScale})`;
        nav.style.transformOrigin = "top left";
      }
    });

    // 全屏功能
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

    // 颜色选择器：动态渐变背景
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
      updateBackground(); // 初始调用一次
    }
  })
  .catch((error) => console.error("加载模板失败：", error));

// 滚动时导航栏缩小
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navContainer");
  if (!nav) return;
  if (window.scrollY > 30) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
});
