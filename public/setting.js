$(document).ready(function () {
  $("#contact_form")
    .bootstrapValidator({
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh",
      },
      fields: {
        first_name: {
          validators: {
            stringLength: {
              min: 2,
            },
            notEmpty: {
              message: "Please supply your first name",
            },
          },
        },
        last_name: {
          validators: {
            stringLength: {
              min: 2,
            },
            notEmpty: {
              message: "Please supply your last name",
            },
          },
        },
        email: {
          validators: {
            notEmpty: {
              message: "Please supply your email address",
            },
            emailAddress: {
              message: "Please supply a valid email address",
            },
          },
        },
        phone: {
          validators: {
            notEmpty: {
              message: "Please supply your phone number",
            },
            phone: {
              country: "US",
              message: "Please supply a vaild phone number with area code",
            },
          },
        },
        address: {
          validators: {
            stringLength: {
              min: 8,
            },
            notEmpty: {
              message: "Please supply your street address",
            },
          },
        },
        city: {
          validators: {
            stringLength: {
              min: 4,
            },
            notEmpty: {
              message: "Please supply your city",
            },
          },
        },
        state: {
          validators: {
            notEmpty: {
              message: "Please select your state",
            },
          },
        },
        zip: {
          validators: {
            notEmpty: {
              message: "Please supply your zip code",
            },
            zipCode: {
              country: "US",
              message: "Please supply a vaild zip code",
            },
          },
        },
        comment: {
          validators: {
            stringLength: {
              min: 10,
              max: 200,
              message:
                "Please enter at least 10 characters and no more than 200",
            },
            notEmpty: {
              message: "Please supply a description of your project",
            },
          },
        },
      },
    })
    .on("success.form.bv", function (e) {
      $("#success_message").slideDown({ opacity: "show" }, "slow"); // Do something ...
      $("#contact_form").data("bootstrapValidator").resetForm();

      // Prevent form submission
      e.preventDefault();

      // Get the form instance
      var $form = $(e.target);

      // Get the BootstrapValidator instance
      var bv = $form.data("bootstrapValidator");

      // Use Ajax to submit form data
      $.post(
        $form.attr("action"),
        $form.serialize(),
        function (result) {
          console.log(result);
        },
        "json"
      );
    });
});

document.querySelector(".btn-warning").addEventListener("click", (e) => {
  e.preventDefault();

  let displayName = document.querySelector("#displayName").value,
    firstTitle = document.querySelector("#firstTitle").value,
    secondTitle = document.querySelector("#secondTitle").value,
    email = document.querySelector("#email").value,
    profileImg = document.querySelector("#profileImg").value,
    bannerImg = document.querySelector("#bannerImg").value,
    bio = document.querySelector("#bio").value,
    _id = document.querySelector("#invisId").innerText;

  fetch("updateUser", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id,
      displayName,
      firstTitle,
      secondTitle,
      email,
      profileImg,
      bannerImg,
      bio,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
      window.location.assign("http://localhost:6060/home");
    });
});

document.querySelector(".btn-danger").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.assign("http://localhost:6060/home");
});
