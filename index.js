var myRequest = new Request("/template.html");
document.write(`<link rel="stylesheet" href="/index.css" />`);
// document.write(
//   `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />`
// );

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

    // 5秒后隐藏导航栏
    let hideTimer = setTimeout(() => {
      document.querySelector(".navContainer").classList.add("fadeOut");
    }, 5000);

    // 点击切换导航栏显示隐藏
    document.querySelector("body").addEventListener("click", () => {
      const navContainer = document.querySelector(".navContainer");
      navContainer.classList.toggle("fadeOut");
    });

    // 放大功能
    let zoomScale = 1;
    document.querySelector(".handleZoom").addEventListener("click", (e) => {
      e.stopPropagation();
      const bodyDom = document.querySelector("body");
      bodyDom.style.transform = `scale(${zoomScale})`;
      zoomScale += 0.1;
    });

    // 全屏按钮绑定
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

    // --- 新增：颜色选择器动态背景功能 ---
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');

    function updateBackground() {
      const c1 = color1Input.value;
      const c2 = color2Input.value;
      const gradient = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
      // 直接修改body背景或根元素CSS变量
      document.body.style.background = gradient;
    }

    if (color1Input && color2Input) {
      color1Input.addEventListener('input', updateBackground);
      color2Input.addEventListener('input', updateBackground);
      updateBackground(); // 初始化执行一次
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
nav.style.transform = `scale(${1 / zoomScale})`;
nav.style.transformOrigin = 'top left';

