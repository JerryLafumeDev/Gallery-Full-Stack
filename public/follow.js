document
  .querySelector(".material-icons.follow")
  .addEventListener("click", (e) => {
    let url = window.location.href.split("/");
    let _id = url[url.length - 1];
    let otherUser = url[url.length - 2];
    console.log(url, _id);

    console.log(e.target);
    const result = e.target.classList.toggle("toggle");
    if (e.target.innerText === "person_add") {
      fetch("follow", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          otherUser,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    } else {
      fetch("unfollow", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          otherUser,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
    e.target.innerText = result ? "person_add" : "person_remove";
    e.target.style.background = result ? "#1d88e5" : "#f44236";
    e.target.parentElement.parentElement.children[2].children[1].innerText =
      result
        ? Number(
            e.target.parentElement.parentElement.children[2].children[1]
              .innerText
          ) - 1
        : Number(
            e.target.parentElement.parentElement.children[2].children[1]
              .innerText
          ) + 1;
  });
document
  .querySelector(".material-icons.unfollow")
  .addEventListener("click", (e) => {
    let url = window.location.href.split("/");
    let _id = url[url.length - 1];
    let otherUser = url[url.length - 2];
    console.log(url, _id);
    const result = e.target.classList.toggle("toggle");
    if (e.target.innerText === "person_remove") {
      fetch("unfollow", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          otherUser,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    } else {
      fetch("follow", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          otherUser,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
    e.target.innerText = result ? "person_remove" : "person_add";
    e.target.style.background = result ? "#f44236" : "#1d88e5";
    e.target.parentElement.parentElement.children[2].children[1].innerText =
      result
        ? Number(
            e.target.parentElement.parentElement.children[2].children[1]
              .innerText
          ) + 1
        : Number(
            e.target.parentElement.parentElement.children[2].children[1]
              .innerText
          ) - 1;
  });
