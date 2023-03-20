let index = 0,
  bool = true;
console.log(window.location.href);
if (window.location.href === "http://localhost:6060/feed") {
  document.querySelectorAll(".card-half").forEach((e, i) => {
    console.log(e, i);
    if (i === index && bool) {
      e.classList.add("wide");
      index = index + 3;
      bool = false;
    } else if (i === index && bool === false) {
      e.classList.add("wide");
      index = index + 1;
      bool = true;
    }
  });
  let feedNodes = document.querySelectorAll(".card-half");
  let newBool = true;
  document.querySelectorAll(".card-half").forEach((e, i) => {
    console.log(e.children[0].innerText);
    let payload = JSON.parse(e.children[0].innerText);
    console.log(payload);
    let random = Math.floor(Math.random() * payload.length);
    let newCard = document.createElement("div");
    let cardImg = document.createElement("img");
    let cardTitle = document.createElement("div");

    newCard.classList.add("card");
    newCard.classList.add("random");
    cardTitle.classList.add("info-center");

    cardImg.src = payload[random][0].url;
    cardTitle.innerText = payload[random][0].caption;

    newCard.appendChild(cardImg);
    newCard.appendChild(cardTitle);

    if (newBool) {
      feedNodes[i + 1].after(newCard);
      newBool = false;
    } else if (!newBool) {
      document
        .querySelectorAll(".card.random")
        [document.querySelectorAll(".card.random").length - 1].after(newCard);
      newBool = true;
    }
  });
  let imFalse = false;
  // carousel
  // if (imFalse) {
  document.querySelectorAll(".card-imgs").forEach((e, i) => {
    console.log(e.children.length);
    if (e.children.length < 4) {
      let newWidth = Math.round(((100 / e.children.length) * 100) / 100) + "%";
      newWidth =
        e.parentNode.offsetWidth * parseFloat("0." + newWidth.substring(0, 1)) +
        "px";
      console.log(newWidth);
      for (let newIndex = 0; newIndex < e.children.length; newIndex++) {
        e.children[newIndex].style.width = newWidth;
      }
      e.innerHTML = e.innerHTML + e.innerHTML + e.innerHTML + e.innerHTML;
      function scroll() {
        if (e.offsetLeft < -e.offsetWidth / 2) {
          e.style.left = "0";
        }
        e.style.left = e.offsetLeft - 4 + "px";
      }
      var timer = setInterval(scroll, 50);
      //     setInterval(function(){
      //         if(e.offsetLeft>0){
      //             e.style.left=-e.offsetWidth/2+'px';
      //         }
      //         e.style.left=e.offsetLeft+2+'px';},30);

      e.onmouseover = function () {
        clearInterval(timer);
      };
      e.onmouseout = function () {
        timer = setInterval(scroll, 50);
      };
      document.getElementsByTagName("a").onclick = function () {
        e.style.left = e.offsetLeft + 4 + "px";
      };
    } else if (e.children.length < 7) {
      let newWidth = Math.round(((100 / e.children.length) * 100) / 100) + "%";
      newWidth =
        e.parentNode.offsetWidth *
          2 *
          parseFloat("0." + newWidth.substring(0, 1)) +
        "px";
      if (e.children.length === 6) {
        newWidth =
          e.parentNode.offsetWidth *
            4 *
            parseFloat("0." + newWidth.substring(0, 1)) +
          "px";
      }
      console.log(newWidth);
      for (let newIndex = 0; newIndex < e.children.length; newIndex++) {
        e.children[newIndex].style.width = newWidth;
      }
      e.innerHTML = e.innerHTML + e.innerHTML;
      function scroll() {
        if (e.offsetLeft < -e.offsetWidth / 2) {
          e.style.left = "0";
        }
        e.style.left = e.offsetLeft - 4 + "px";
      }
      var timer = setInterval(scroll, 50);
      //     setInterval(function(){
      //         if(e.offsetLeft>0){
      //             e.style.left=-e.offsetWidth/2+'px';
      //         }
      //         e.style.left=e.offsetLeft+2+'px';},30);

      e.onmouseover = function () {
        clearInterval(timer);
      };
      e.onmouseout = function () {
        timer = setInterval(scroll, 50);
      };
      document.getElementsByTagName("a").onclick = function () {
        e.style.left = e.offsetLeft + 4 + "px";
      };
    } else {
      var e2 = document.createElement("a");
      var li = e.querySelectorAll(".previewItem");
      var speed = 2;

      e.innerHTML = e.innerHTML + e.innerHTML;
      e2.innerHTML = e.innerHTML;
      // alert(li.length);
      e2.classList.add("card-imgs-reverse");
      e.after(e2);
      e2.style.left = -e2.offsetWidth + e2.offsetWidth * 0.25 + "px";
      function scroll() {
        if (e.offsetLeft < -e.offsetWidth / 2) {
          e.style.left = "0";
        }
        e.style.left = e.offsetLeft - 4 + "px";
        if (e2.offsetLeft > -e2.offsetWidth / 4) {
          e2.style.left = -e2.offsetWidth + e2.offsetWidth * 0.25 + "px";
        }
        e2.style.left = e2.offsetLeft + 4 + "px";
      }
      var timer = setInterval(scroll, 50);
      //     setInterval(function(){
      //         if(e.offsetLeft>0){
      //             e.style.left=-e.offsetWidth/2+'px';
      //         }
      //         e.style.left=e.offsetLeft+2+'px';},30);

      e.onmouseover = function () {
        clearInterval(timer);
      };
      e.onmouseout = function () {
        timer = setInterval(scroll, 50);
      };
      e2.onmouseover = function () {
        clearInterval(timer);
      };
      e2.onmouseout = function () {
        timer = setInterval(scroll, 50);
      };

      document.getElementsByTagName("a").onclick = function () {
        e.style.left = e.offsetLeft + 4 + "px";
        e2.style.left = e2.offsetLeft + 4 + "px";
      };
    }
  });
}
