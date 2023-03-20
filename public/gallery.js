let layoutArr = ["square", "horizontal", "vertical"];
let figureArr = Array.from(document.querySelectorAll("figure"));

window.addEventListener("load", () => {
  figureArr.forEach((e) => {
    let random = Math.floor(Math.random() * 3);
    e.classList.add(layoutArr[random]);
  });
});
