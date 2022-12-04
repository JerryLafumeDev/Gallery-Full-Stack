const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs", {
      logMessage: req.flash("loginMessage"),
      signMessage: req.flash("signupMessage"),
    });
  });

  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("themes")
      .find()
      .toArray((err, themes) => {
        db.collection("galleries")
          .find({ createdBy: ObjectId(req.user._id) })
          .toArray((err, galleries) => {
            res.render("home.ejs", {
              objectId: ObjectId,
              user: req.user,
              themes: themes,
              galleries: galleries,
            });
          });
      });
  });

  app.get("/feed", isLoggedIn, async function (req, res) {
    db.collection("themes")
      .find()
      .toArray(async (err, themes) => {
        var followingArr = [];
        db.collection("galleries")
          .find({ createdBy: ObjectId(req.user._id) })
          .toArray(async (err, galleries) => {
            if (req.user.following.length === 0) {
              res.render("feed.ejs", {
                objectId: ObjectId,
                user: req.user,
                themes: themes,
                galleries: galleries,
                following: followingArr,
              });
            } else {
              for (let i = 0; i < req.user.following.length; i++) {
                db.collection("galleries")
                  .find({ createdBy: ObjectId(req.user.following[i][0]) })
                  .toArray(async (err, following) => {
                    console.log("im running $$$$");
                    followingArr.push(following);
                  });
              }
              await res.render("feed.ejs", {
                objectId: ObjectId,
                user: req.user,
                themes: themes,
                galleries: galleries,
                following: followingArr,
              });
            }
          });
        console.log(followingArr);
      });
  });

  app.get("/settings", isLoggedIn, function (req, res) {
    db.collection("messages")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("setting.ejs", {
          user: req.user,
          messages: result,
        });
      });
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("images")
      .find()
      .toArray((err, result) => {
        db.collection("images")
          .find({ userID: req.user._id })
          .toArray((err, result2) => {
            if (err) return console.log(err);
            res.render("profile.ejs", {
              user: req.user,
              images: result,
              myImages: result2,
            });
          });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  // message board routes ===============================================================

  app.post("/images", (req, res) => {
    db.collection("images").save(
      {
        name: req.body.name,
        img: req.body.img,
        layout: req.body.layout,
        likes: 0,
        userID: ObjectID(req.user._id),
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.post("/newGallery", (req, res) => {
    if (req.body.addsNewTheme === "on") req.body.addsNewTheme = true;
    else req.body.addsNewTheme = false;

    if (req.body.hasPost === "on") req.body.hasPost = true;
    else req.body.hasPost = false;

    if (req.body.theme[1] === "") req.body.theme = req.body.theme[0];
    else req.body.theme = req.body.theme[1];

    console.log(req.body);
    let imagesArr = [];
    for (let i = 0; i < req.body.url.length; i++) {
      imagesArr[i] = [
        {
          _id: uuidv4(),
          url: req.body.url[i],
          caption: req.body.caption[i],
          likes: [],
          comments: [],
          createdBy: ObjectId(req.user._id),
          date: new Date(),
        },
      ];
    }
    console.log(imagesArr);
    db.collection("galleries").save(
      {
        name: req.body.name,
        theme: req.body.theme,
        images: imagesArr,
        likes: [],
        repostedBy: [],
        createdBy: ObjectId(req.user._id),
        date: new Date(),
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
    if (req.body.addsNewTheme) {
      db.collection("themes").updateOne(
        {
          _id: ObjectId("63850774a3991e28a424406a"),
        },
        { $addToSet: { themes: req.body.theme } },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
        }
      );
    }
  });

  app.post("/addComment", (req, res) => {
    console.log(req.body);
    let path = `images.${req.body.postIndex}.0.comments`;
    db.collection("galleries").updateOne(
      {
        _id: ObjectId(req.body.galleryId),
      },
      {
        $push: {
          [path]: {
            comment: req.body.comment,
            createdById: req.user._id,
            createdBy: req.user.local.userName,
          },
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/likePost", (req, res) => {
    let path = `images.${req.body.postIndex}.0.likes`;
    db.collection("galleries").updateOne(
      { _id: ObjectId(req.body.galleryId) },
      {
        $addToSet: {
          [path]: req.user._id.toString(),
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
      }
    );
  });

  app.put("/unlikePost", (req, res) => {
    let path = `images.${req.body.postIndex}.0.likes`;
    db.collection("galleries").updateOne(
      { _id: ObjectId(req.body.galleryId) },
      {
        $pull: {
          [path]: req.user._id.toString(),
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
      }
    );
  });

  app.put("/updateUser", (req, res) => {
    console.log(req.body);
    let displayName, firstTitle, secondTitle, bio, profileImg, bannerImg, email;
    req.body.displayName === ""
      ? (displayName = req.user.displayName)
      : (displayName = req.body.displayName);
    req.body.firstTitle === ""
      ? (firstTitle = req.user.firstTitle)
      : (firstTitle = req.body.firstTitle);
    req.body.secondTitle === ""
      ? (secondTitle = req.user.secondTitle)
      : (secondTitle = req.body.secondTitle);
    req.body.bio === "" ? (bio = req.user.bio) : (bio = req.body.bio);
    req.body.profileImg === ""
      ? (profileImg = req.user.profileImg)
      : (profileImg = req.body.profileImg);
    req.body.bannerImg === ""
      ? (bannerImg = req.user.bannerImg)
      : (bannerImg = req.body.bannerImg);
    req.body.email === ""
      ? (email = req.user.local.email)
      : (email = req.body.email);
    db.collection("users").findOneAndUpdate(
      { _id: ObjectId(req.body._id) },
      {
        $set: {
          displayName: displayName,
          firstTitle: firstTitle,
          secondTitle: secondTitle,
          bio: bio,
          profileImg: profileImg,
          bannerImg: bannerImg,
          email: email,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.put("/images", (req, res) => {
    db.collection("images").findOneAndUpdate(
      { name: req.body.name, url: url, likes: req.body.liked },
      {
        $set: {
          likes: req.body.liked + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  /*app.put('/thumbDown', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbDown:req.body.thumbDown + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })*/

  app.delete("/trash", (req, res) => {
    db.collection("messages").findOneAndDelete(
      { _id: req.body._id },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
