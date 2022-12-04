// window.addEventListener("load", () => {
//   let numOfPImages = 0;
//   let numOfSImages = 0;
//   let numOfLImages = 0;
//   let postArr = Array.from(document.querySelectorAll(".post"));
//   let i = postArr.length - 1;
//   while (postArr.length > 0) {
//     console.log(i, "value of i");
//     if (i < 0 && postArr.length > 0) {
//       i = postArr.length - 1;
//     } else if (i < 0) {
//       return;
//     }
//     console.log(postArr[i].classList[1]);
//     console.log(numOfPImages, numOfSImages, numOfLImages);
//     if (
//       (postArr[i].classList[1] === "portrait" &&
//         numOfPImages < 3 &&
//         postArr.includes()) ||
//       (postArr.length === 1 && postArr[0].classList[1] === "portrait")
//     ) {
//       document.querySelector(".allPost").appendChild(postArr[i]);
//       console.log("portrait appended");
//       numOfPImages = numOfPImages + 1;
//       postArr = postArr.filter((e) => e !== postArr[i]);
//       if (numOfPImages === 3) {
//         numOfSImages = 0;
//       }
//     } else if (
//       (postArr[i].classList[1] === "square" &&
//         numOfSImages < 2 &&
//         numOfPImages === 3) ||
//       (postArr.length === 1 && postArr[0].classList[1] === "square")
//     ) {
//       document.querySelector(".allPost").appendChild(postArr[i]);
//       console.log("square appended");
//       numOfSImages = numOfSImages + 1;
//       postArr = postArr.filter((e) => e !== postArr[i]);
//       if (numOfSImages === 2) {
//         numOfLImages = 0;
//       }
//     } else if (
//       (postArr[i].classList[1] === "landscape" &&
//         numOfLImages < 1 &&
//         numOfSImages === 2) ||
//       (postArr.length === 1 && postArr[0].classList[1] === "landscape")
//     ) {
//       document.querySelector(".allPost").appendChild(postArr[i]);
//       console.log("landscape appended");
//       numOfLImages = numOfLImages + 1;
//       postArr = postArr.filter((e) => e !== postArr[i]);
//       if (numOfLImages === 1) {
//         numOfPImages = 0;
//       }
//     }
//     i--;
//     console.log(postArr.length, "length or array");
//   }
// });

let numOfImages = Number(document.querySelector(".numOfMyImages").innerText);

if (numOfImages < 1) {
  document.querySelector(".addImgForm").classList.remove("invis");
}

document.querySelector(".addImgBtn").addEventListener("click", () => {
  document.querySelector(".addImgForm").classList.toggle("invis");
});
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".addImgForm").classList.toggle("invis");
});

let hearts = document.querySelectorAll("#heart");
hearts.forEach((heart) => {
  heart.addEventListener("click", liked);
});

function liked(e) {
  let postId = e.target.parentElement.parentElement.children[2].innerText;
  console.log(postId);
  fetch("liked", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postId: postId,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
      window.location.reload(true);
    });
}

var trash = document.getElementsByClassName("trash");

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    fetch("trash", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        url: img,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
