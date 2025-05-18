// ⏳ 加载 template.html 插入页面
fetch("/template.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("templateContainer").innerHTML = html;
  })
  .catch((err) => console.error("加载 template.html 失败：", err));

// ⏰ 实时时钟更新函数
function updateTime() {
  const now = new Date();
  document.getElementById("hour").textContent = String(now.getHours()).padStart(2, "0");
  document.getElementById("minute").textContent = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("second").textContent = String(now.getSeconds()).padStart(2, "0");
}
updateTime();
setInterval(updateTime, 1000);

// 🕶️ 页面自动隐藏 UI（5秒后）
setTimeout(() => {
  document.body.classList.add("fadeOut");
}, 5000);

// 👆 点击页面切换 UI 显示/隐藏
document.body.addEventListener("click", () => {
  document.body.classList.toggle("fadeOut");
});

// 🎨 阻止颜色选择器点击冒泡，避免隐藏 UI
const colorPicker = document.querySelector(".color-picker-cyber");
if (colorPicker) {
  colorPicker.addEventListener("click", (e) => e.stopPropagation());
}

// 🔍 放大功能（对整个主容器进行 scale 缩放）
let zoomScale = 1;
const mainContainer = document.getElementById("mainContainer");
const zoomBtn = document.querySelector(".handleZoom");
if (zoomBtn && mainContainer) {
  zoomBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomScale += 0.1;
    mainContainer.style.transform = `scale(${zoomScale})`;
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

// 🌈 渐变背景色选择器功能
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");

function updateBackground() {
  const c1 = color1Input.value;
  const c2 = color2Input.value;
  document.body.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
}

if (color1Input && color2Input) {
  color1Input.addEventListener("input", updateBackground);
  color2Input.addEventListener("input", updateBackground);
  updateBackground();
}

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
