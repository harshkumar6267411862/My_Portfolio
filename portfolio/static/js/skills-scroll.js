const track = document.querySelector(".skills-track");
const leftBtn = document.querySelector(".carousel-btn.left");
const rightBtn = document.querySelector(".carousel-btn.right");

rightBtn.addEventListener("click", () => {
track.scrollBy({ left:300, behavior:"smooth" });
});

leftBtn.addEventListener("click", () => {
track.scrollBy({ left:-300, behavior:"smooth" });
});