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
        db.collection("users")
          .find()
          .toArray(async (err, allUsers) => {
            db.collection("chat")
              .find({ participants: req.user._id.toString() })
              .toArray(async (err, myMessages) => {
                db.collection("galleries")
                  .find({
                    createdBy: [
                      req.user._id.toString(),
                      req.user.local.userName,
                    ],
                  })
                  .toArray((err, galleries) => {
                    res.render("home.ejs", {
                      objectId: ObjectId,
                      user: req.user,
                      themes: themes,
                      galleries: galleries,
                      allUsers,
                      myMessages,
                    });
                  });
              });
          });
      });
  });
  app.get("/user/:userName/:id", isLoggedIn, function (req, res) {
    db.collection("themes")
      .find()
      .toArray((err, themes) => {
        db.collection("galleries")
          .find({
            createdBy: [req.params.id, req.params.userName],
          })
          .toArray((err, galleries) => {
            db.collection("users")
              .find({
                _id: ObjectId(req.params.id),
              })
              .toArray((err, otherUser) => {
                res.render("otherUser.ejs", {
                  objectId: ObjectId,
                  user: req.user,
                  themes: themes,
                  galleries: galleries,
                  otherUser: otherUser,
                });
              });
          });
      });
  });
  app.get(
    "/gallery/:galleryId/:userId/:userName",
    isLoggedIn,
    function (req, res) {
      db.collection("themes")
        .find()
        .toArray((err, themes) => {
          db.collection("galleries")
            .find({
              createdBy: [req.params.userId, req.params.userName],
            })
            .toArray((err, galleries) => {
              db.collection("galleries")
                .find({
                  _id: ObjectId(req.params.galleryId),
                })
                .toArray((err, galleryData) => {
                  db.collection("users")
                    .find({
                      _id: ObjectId(req.params.userId),
                    })
                    .toArray((err, otherUser) => {
                      res.render("gallery.ejs", {
                        objectId: ObjectId,
                        user: req.user,
                        themes: themes,
                        galleries: galleries,
                        galleryData: galleryData,
                        otherUser: otherUser,
                      });
                    });
                });
            });
        });
    }
  );

  app.get("/feed", isLoggedIn, async function (req, res) {
    db.collection("themes")
      .find()
      .toArray(async (err, themes) => {
        db.collection("galleries")
          .find({
            createdBy: [req.user._id.toString(), req.user.local.userName],
          })
          .toArray(async (err, galleries) => {
            db.collection("galleries")
              .find()
              .toArray(async (err, following) => {
                res.render("feed.ejs", {
                  objectId: ObjectId,
                  user: req.user,
                  themes: themes,
                  galleries: galleries,
                  following: following,
                });
              });
          });
      });
  });

  app.get("/explore", isLoggedIn, async function (req, res) {
    db.collection("themes")
      .find()
      .toArray(async (err, themes) => {
        db.collection("users")
          .find()
          .toArray(async (err, recommendedUsers) => {
            db.collection("galleries")
              .find()
              .toArray(async (err, galleries) => {
                db.collection("galleries")
                  .find()
                  .toArray(async (err, following) => {
                    res.render("explore.ejs", {
                      objectId: ObjectId,
                      user: req.user,
                      recommendedUsers: recommendedUsers,
                      themes: themes,
                      galleries: galleries,
                      following: following,
                    });
                  });
              });
          });
      });
  });

  app.get("/settings", isLoggedIn, function (req, res) {
    db.collection("messages")
      .find()
      .toArray((err, result) => {
        db.collection("themes")
          .find()
          .toArray((err, themes) => {
            db.collection("galleries")
              .find({
                createdBy: [req.user._id.toString(), req.user.local.userName],
              })
              .toArray((err, galleries) => {
                if (err) return console.log(err);
                res.render("setting.ejs", {
                  user: req.user,
                  themes,
                  galleries,
                  messages: result,
                });
              });
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
        userID: ObjectId(req.user._id),
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.post("/newGallery", (req, res) => {
    let imagesArr = [];

    if (req.body.addsNewTheme === "on") req.body.addsNewTheme = true;
    else req.body.addsNewTheme = false;

    if (req.body.hasPost === "on") req.body.hasPost = true;
    else req.body.hasPost = false;

    console.log(req.body);
    if (Array.isArray(req.body.url)) {
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
    } else {
      imagesArr.push([
        {
          _id: uuidv4(),
          url: req.body.url,
          caption: req.body.caption,
          likes: [],
          comments: [],
          createdBy: ObjectId(req.user._id),
          date: new Date(),
        },
      ]);
    }
    console.log(imagesArr);

    if (!req.body.addsNewTheme) {
      db.collection("galleries").save(
        {
          name: req.body.name,
          theme: req.body.theme,
          images: imagesArr,
          likes: [],
          repostedBy: [],
          createdBy: [req.user._id.toString(), req.user.local.userName],
          date: new Date(),
        },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
          res.redirect("/profile");
        }
      );
    }
    if (req.body.addsNewTheme) {
      db.collection("galleries").save(
        {
          name: req.body.name,
          theme: req.body.newTheme,
          images: imagesArr,
          likes: [],
          repostedBy: [],
          createdBy: [req.user._id.toString(), req.user.local.userName],
          date: new Date(),
        },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
        }
      );
      db.collection("themes").updateOne(
        {
          _id: ObjectId("63850774a3991e28a424406a"),
        },
        { $addToSet: { themes: req.body.newTheme } },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
          res.redirect("/feed");
        }
      );
    }
  });

  app.post("/newPost", (req, res) => {
    let path = `images`;
    db.collection("galleries").updateOne(
      {
        _id: ObjectId(req.body.galleryId),
      },
      {
        $push: {
          [path]: [
            {
              _id: uuidv4(),
              url: req.body.url,
              caption: req.body.caption,
              likes: [],
              comments: [],
              createdBy: req.user._id,
              date: new Date(),
            },
          ],
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/feed");
      }
    );
  });
  app.post("/getChat", (req, res) => {
    db.collection("chat").updateOne(
      {
        participants: [req.user._id.toString(), req.body.selectedUserId],
      },
      {
        $push: {
          messages: [
            "chat created",
            "Operator",
            `${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}, ${new Date().toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}`,
          ],
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
      }
    );
  });
  app.post("/newMessage", (req, res) => {
    db.collection("chat").updateOne(
      {
        participants: [req.user._id.toString(), req.body.otherUser],
      },
      {
        $push: {
          messages: [
            req.body.newMessage,
            req.user.local.userName,
            `${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}, ${new Date().toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}`,
          ],
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
      }
    );
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

  app.put("/user/:otherUser/follow", (req, res) => {
    db.collection("users").updateOne(
      { _id: ObjectId(req.body._id) },
      {
        $addToSet: {
          followers: [req.user._id, req.user.local.userName],
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    );
    db.collection("users").updateOne(
      { _id: ObjectId(req.user._id) },
      {
        $addToSet: {
          following: [req.body._id, req.body.otherUser],
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
  app.put("/user/:otherUser/unfollow", (req, res) => {
    db.collection("users").updateOne(
      { _id: ObjectId(req.body._id) },
      {
        $pull: {
          followers: [req.user._id, req.user.local.userName],
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    );
    db.collection("users").updateOne(
      { _id: ObjectId(req.user._id) },
      {
        $pull: {
          following: [req.body._id, req.body.otherUser],
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
    let displayName,
      firstTitle,
      secondTitle,
      bio,
      profileImg,
      bannerImg,
      email,
      themeColor;
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
    req.body.themeColor === ""
      ? (themeColor = req.user.themeColor)
      : (themeColor = req.body.themeColor);
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
          themeColor: themeColor,
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
