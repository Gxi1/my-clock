// 加载 template.html
fetch("/template.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("templateContainer").innerHTML = html;
  });

// 更新时钟
function updateTime() {
  const now = new Date();
  document.getElementById("hour").textContent = String(now.getHours()).padStart(2, "0");
  document.getElementById("minute").textContent = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("second").textContent = String(now.getSeconds()).padStart(2, "0");
}
updateTime();
setInterval(updateTime, 1000);

// 自动隐藏 UI
setTimeout(() => {
  document.body.classList.add("fadeOut");
}, 5000);

// 点击页面显示/隐藏 UI
document.body.addEventListener("click", () => {
  document.body.classList.toggle("fadeOut");
});

// 防止点击颜色选择器时关闭 UI
const colorPicker = document.querySelector(".color-picker-cyber");
if (colorPicker) {
  colorPicker.addEventListener("click", (e) => e.stopPropagation());
}

// 放大功能
let zoomScale = 1;
document.querySelector(".handleZoom").addEventListener("click", (e) => {
  e.stopPropagation();
  zoomScale += 0.1;
  document.getElementById("mainContainer").style.transform = `scale(${zoomScale})`;
});

// 全屏功能
document.querySelector(".fullscreenBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const el = document.documentElement;
  (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || (() => alert("你的浏览器不支持全屏API")))();
});

// 渐变背景功能
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");

function updateBackground() {
  const c1 = color1Input.value;
  const c2 = color2Input.value;
  document.body.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
}

color1Input.addEventListener("input", updateBackground);
color2Input.addEventListener("input", updateBackground);
updateBackground();

// 滚动时缩小导航栏
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navContainer");
  if (window.scrollY > 30) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
});
