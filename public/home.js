let num = 0;

document.querySelector(".toggleBtn").addEventListener("click", () => {
  if (num === 0) {
    document.querySelector(".toggleBtn").innerText =
      "Create a Gallery Instead?";
    num = 1;
  } else {
    document.querySelector(".toggleBtn").innerText = "Create a Post Instead?";
    num = 0;
  }
  // Switches the Icon
  $(this).children("i").toggleClass("fa-pencil");
  // Switches the forms
  $(".galleryForm").animate(
    {
      height: "toggle",
      "padding-top": "toggle",
      "padding-bottom": "toggle",
      opacity: "toggle",
    },
    "slow"
  );
});

let inputSwitch = false;

document.querySelector(".switchBtn").addEventListener("click", () => {
  if (!inputSwitch) {
    document.querySelector(".switchBtn").style.background = "black";
    document.querySelector(".switchBtn").style.color = "white";
    document.querySelector(".selectTheme").classList.add("hidden");
    document.querySelector(".newThemeInput").classList.remove("hidden");
    document.querySelector("#hasNewTheme").checked = true;

    inputSwitch = true;
  } else {
    document.querySelector(".switchBtn").style.background = "white";
    document.querySelector(".switchBtn").style.color = "black";
    document.querySelector(".selectTheme").classList.remove("hidden");
    document.querySelector(".newThemeInput").classList.add("hidden");
    document.querySelector("#hasNewTheme").checked = false;
    inputSwitch = false;
  }
});

document.querySelector(".openGallery").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".galleryOverlay").style.display = "flex";

  document.querySelector("#addPostBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let inputUrl = document.createElement("input");
    let inputGroup = document.createElement("div");
    let inputCaption = document.createElement("input");
    let deletebtn = document.createElement("span");
    let deletebtnIcon = document.createElement("i");

    inputUrl.name = "url";
    inputCaption.name = "caption";

    inputUrl.placeholder = "Enter Image Url";
    inputCaption.placeholder = "Enter Caption";

    inputGroup.classList.add("inputGroup");
    deletebtnIcon.classList.add("fa-solid", "fa-minus");
    deletebtn.classList.add("deletePostBtn");

    deletebtn.appendChild(deletebtnIcon);
    inputGroup.appendChild(deletebtn);
    inputGroup.appendChild(inputUrl);
    inputGroup.appendChild(inputCaption);
    document.querySelector(".formInputs").appendChild(inputGroup);

    deletebtnIcon.addEventListener("click", (evt) => {
      evt.target.parentElement.parentElement.remove();

      if (Array.from(document.querySelectorAll(".inputGroup")).length === 0) {
        document.querySelector("#hasPostInForm").checked = false;
      }
    });
    deletebtn.addEventListener("click", (evt) => {
      evt.target.parentElement.remove();

      if (Array.from(document.querySelectorAll(".inputGroup")).length === 0) {
        document.querySelector("#hasPostInForm").checked = false;
      }
    });
    if (Array.from(document.querySelectorAll(".inputGroup")).length > 0) {
      document.querySelector("#hasPostInForm").checked = true;
    }
  });
});
document.querySelector(".closeBtn").addEventListener("click", () => {
  document.querySelector(".galleryOverlay").style.display = "none";
});

document.querySelectorAll(".card-love.like").forEach((e) => {
  e.addEventListener("click", (evt) => {
    const result = evt.target.classList.toggle("like");
    galleryId = evt.target.parentElement.children[2].innerText;
    postIndex = Number(evt.target.parentElement.children[3].innerText);
    if (e.innerText === "favorite_border") {
      evt.target.parentElement.children[0].innerText =
        Number(evt.target.parentElement.children[0].innerText) + 1;
      fetch("/likePost", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleryId,
          postIndex,
        }),
      }).then(function (response) {
        window.location.reload();
      });
    } else if (e.innerText === "favorite") {
      evt.target.parentElement.children[0].innerText =
        Number(evt.target.parentElement.children[0].innerText) - 1;
      fetch("/unlikePost", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleryId,
          postIndex,
        }),
      }).then(function (response) {
        window.location.reload();
      });
    }
    evt.target.innerText = result ? "favorite_border" : "favorite";
  });
});
document.querySelectorAll(".card-love.unlike").forEach((e) => {
  e.addEventListener("click", (evt) => {
    const result = evt.target.classList.toggle("unlike");
    galleryId = evt.target.parentElement.children[2].innerText;
    postIndex = Number(evt.target.parentElement.children[3].innerText);
    if (e.innerText === "favorite") {
      evt.target.parentElement.children[0].innerText =
        Number(evt.target.parentElement.children[0].innerText) - 1;
      fetch("/unlikePost", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleryId,
          postIndex,
        }),
      }).then(function (response) {
        window.location.reload();
      });
    } else if (e.innerText === "favorite_border") {
      evt.target.parentElement.children[0].innerText =
        Number(evt.target.parentElement.children[0].innerText) + 1;
      fetch("/likePost", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleryId,
          postIndex,
        }),
      }).then(function (response) {
        window.location.reload();
      });
    }
    evt.target.innerText = result ? "favorite" : "favorite_border";
  });
});

document.querySelector(".chatDrawer").addEventListener("click", () => {
  // document.querySelector(".sidebar").style.left =
  //   "calc(var(--sidebar-width) - var(--sidebar-width) - var(--sidebar-width))";
  document.querySelector(".sidebar.position-fixed").style.transform =
    "translateX(calc(var(--sidebar-width) - var(--sidebar-width) - var(--sidebar-width)))";
  document.querySelector("#wrapper").style.marginLeft = "0";
  document.querySelector("#wrapper").style.width = "80%";
  document.querySelector("span.followers").style.transform =
    "translateX(-300px)";
  document.querySelector("span.following").style.transform =
    "translateX(-315px)";
});
document.querySelector(".sideDrawer").addEventListener("click", () => {
  // document.querySelector(".sidebar").style.left =
  //   "calc(var(--sidebar-width) - var(--sidebar-width) - var(--sidebar-width))";
  document.querySelector(".sidebar.position-fixed").style.transform =
    "translateX(0)";
  document.querySelector("#wrapper").style.marginLeft = "var(--sidebar-width)";
  document.querySelector("#wrapper").style.width = "100%";
  document.querySelector("span.followers").style.transform = "translateX(0)";
  document.querySelector("span.following").style.transform = "translateX(0)";
});

Array.from(document.querySelectorAll(".chatUser")).forEach((e) =>
  e.addEventListener("click", (evt) => {
    let classArrMain = [];
    console.log(evt.target.children[0].innerText);
    document.querySelector(".people-list").style.transform =
      "translateY(-100vh)";
    document.querySelector(".chatHistory").style.transform =
      "translateY(-100vh)";

    let selectedUserId = evt.target.children[0].innerText;
    let selectedUserName = evt.target.children[2].children[0].innerText;
    let selectedPfpUrl = evt.target.children[1].children[0].src;

    document.querySelector(".chat-with").innerText = selectedUserName;
    document.querySelector(".chat-pfp").src = selectedPfpUrl;
    document.querySelector(".chat-otherUser").value = selectedUserId;

    Array.from(document.querySelectorAll(".chatThreads")).forEach(
      (element, index) => {
        var classArr = element.classList[1].split("-");
        classArrMain[index] = classArr;
        console.log(classArr.includes(selectedUserId));
        if (!classArr.includes(selectedUserId)) {
          element.style.display = "none";
        }
      }
    );
    classArrMain = [].concat(...classArrMain);
    console.log(classArrMain);
    if (!classArrMain.includes(selectedUserId)) {
      fetch("/getChat", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedUserId,
        }),
      }).then(function (response) {});
    } else {
      console.log("that chat has been generated already");
    }
  })
);

document.querySelector(".backArrow").addEventListener("click", (e) => {
  console.log(e.target);
  document.querySelector(".people-list").style.transform = "translateY(0vh)";
  document.querySelector(".chatHistory").style.transform = "translateY(100vh)";

  Array.from(document.querySelectorAll(".chatThreads")).forEach((element) => {
    element.style.display = "block";
  });
});
