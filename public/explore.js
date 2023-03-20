// result grid

let feedNodes = document.querySelectorAll(".card-half");
let newBool = true;
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

// search bar
document
  .querySelector(".selectBar")
  .querySelector("select")
  .addEventListener("change", () => {
    if (
      document.querySelector(".selectBar").querySelector("select").value != ""
    ) {
      document.querySelector(".selectBar").querySelector("select").style.color =
        "black";
    }
  });

// carousel

function HoverCarousel(elm, settings) {
  this.DOM = {
    scope: elm,
    wrap: elm.querySelector("ul").parentNode,
  };

  this.containerWidth = 0;
  this.scrollWidth = 0;
  this.posFromLeft = 0; // Stripe position from the left of the screen
  this.stripePos = 0; // When relative mouse position inside the thumbs stripe
  this.animated = null;
  this.callbacks = {};

  this.init();
}

HoverCarousel.prototype = {
  init() {
    this.bind();
  },

  destroy() {
    this.DOM.scope.removeEventListener(
      "mouseenter",
      this.callbacks.onMouseEnter
    );
    this.DOM.scope.removeEventListener("mousemove", this.callbacks.onMouseMove);
  },

  bind() {
    this.callbacks.onMouseEnter = this.onMouseEnter.bind(this);
    this.callbacks.onMouseMove = (e) => {
      if (this.mouseMoveRAF) cancelAnimationFrame(this.mouseMoveRAF);

      this.mouseMoveRAF = requestAnimationFrame(this.onMouseMove.bind(this, e));
    };

    this.DOM.scope.addEventListener("mouseenter", this.callbacks.onMouseEnter);
    this.DOM.scope.addEventListener("mousemove", this.callbacks.onMouseMove);
  },

  // calculate the thumbs container width
  onMouseEnter(e) {
    this.nextMore = this.prevMore = false; // reset

    this.containerWidth = this.DOM.wrap.clientWidth;
    this.scrollWidth = this.DOM.wrap.scrollWidth;
    // padding in percentage of the area which the mouse movement affects
    this.padding = 0.2 * this.containerWidth;
    this.posFromLeft = this.DOM.wrap.getBoundingClientRect().left;
    var stripePos = e.pageX - this.padding - this.posFromLeft;
    this.pos = stripePos / (this.containerWidth - this.padding * 2);
    this.scrollPos = (this.scrollWidth - this.containerWidth) * this.pos;

    // temporary add smoothness to the scroll
    this.DOM.wrap.style.scrollBehavior = "smooth";

    if (this.scrollPos < 0) this.scrollPos = 0;

    if (this.scrollPos > this.scrollWidth - this.containerWidth)
      this.scrollPos = this.scrollWidth - this.containerWidth;

    this.DOM.wrap.scrollLeft = this.scrollPos;
    this.DOM.scope.style.setProperty(
      "--scrollWidth",
      (this.containerWidth / this.scrollWidth) * 100 + "%"
    );
    this.DOM.scope.style.setProperty(
      "--scrollLleft",
      (this.scrollPos / this.scrollWidth) * 100 + "%"
    );

    // lock UI until mouse-enter scroll is finihsed, after aprox 200ms
    clearTimeout(this.animated);
    this.animated = setTimeout(() => {
      this.animated = null;
      this.DOM.wrap.style.scrollBehavior = "auto";
    }, 200);

    return this;
  },

  // move the stripe left or right according to mouse position
  onMouseMove(e) {
    // don't move anything until inital movement on 'mouseenter' has finished
    if (this.animated) return;

    this.ratio = this.scrollWidth / this.containerWidth;

    // the mouse X position, "normalized" to the carousel position
    var stripePos = e.pageX - this.padding - this.posFromLeft;

    if (stripePos < 0) stripePos = 0;

    // calculated position between 0 to 1
    this.pos = stripePos / (this.containerWidth - this.padding * 2);

    // calculate the percentage of the mouse position within the carousel
    this.scrollPos = (this.scrollWidth - this.containerWidth) * this.pos;

    this.DOM.wrap.scrollLeft = this.scrollPos;

    // update scrollbar
    if (this.scrollPos < this.scrollWidth - this.containerWidth)
      this.DOM.scope.style.setProperty(
        "--scrollLleft",
        (this.scrollPos / this.scrollWidth) * 100 + "%"
      );

    // check if element has reached an edge
    this.prevMore = this.DOM.wrap.scrollLeft > 0;
    this.nextMore =
      this.scrollWidth - this.containerWidth - this.DOM.wrap.scrollLeft > 5;

    this.DOM.scope.setAttribute(
      "data-at",
      (this.prevMore ? "left " : " ") + (this.nextMore ? "right" : "")
    );
  },
};

var carouselElm = document.querySelector(".carousel");
new HoverCarousel(carouselElm);
