let addForm = document.querySelector("#addUserForm");

addForm.onsubmit = async (event) => {
  // disbale reload on form submit
  try {
    event.preventDefault();

    // remove error message
    document
      .querySelectorAll("div.addUserFields")
      .forEach((i) => (i.innerHTML = ""));

    // remove error field color
    const inputErrors = document.querySelectorAll(".errorFild");
    if (inputErrors.length > 0) {
      inputErrors.forEach((i) => i.classList.remove("errorFild"));
    }

    // form data
    let formData = new URLSearchParams(new FormData(addForm));
    // send data to server
    let response = await fetch("/tadmin/employees", {
      method: "POST",
      body: formData,
    });
    // response from serevr
    let result = await response.json();
    // if server send error
    if (result.error) {
      // get keys from error object
      Object.keys(result.error).forEach((fieldName) => {
        // class for make red input field on error
        addForm[fieldName].classList.add("errorFild");

        // getting error message field for show message
        const errfields = document.querySelector(`#${fieldName}-error`);

        errfields.innerHTML = result.error[fieldName].msg;
      });
    } else {
      // reload after 1s
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

let editForm = document.querySelector("#editUserForm");
let editBtn = document.querySelectorAll(".editBtnUsers");

editBtn.forEach((singleBtn) => {
  singleBtn.addEventListener("click", () => {
    let { id } = singleBtn.dataset;
    editForm.onsubmit = async (event) => {
      // disbale reload on form submit
      try {
        event.preventDefault();

        // form data
        let formData = new URLSearchParams(new FormData(editForm));
        formData.append("userId", id);

        // send data to server
        let response = await fetch("/tadmin/employees", {
          method: "PUT",
          body: formData,
        });
        // response from serevr
        let result = await response.json();
        // if server send error
        console.log(result.error);
        if (result.error) {
          // make red on blank submit
          console.log("in if");
          editForm.querySelectorAll("select").forEach((i) => {
            i.classList.add("errorFild");
            // i.querySelector('option').textContent = result.error;
            i.previousElementSibling.innerHTML = result.error;
          });
        } else {
          console.log("in else");
          // reload after 1s
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    };
  });
});

$(document).on("ready", function () {
  // User edit

  // INITIALIZATION OF FORM SEARCH
  // =======================================================
  $(".js-form-search").each(function () {
    new HSFormSearch($(this)).init();
  });

  // INITIALIZATION OF SELECT2
  // =======================================================
  $(".js-select2-custom").each(function () {
    var select2 = $.HSCore.components.HSSelect2.init($(this));
  });

  // INITIALIZATION OF COUNTERS
  // =======================================================
  $(".js-counter").each(function () {
    var counter = new HSCounter($(this)).init();
  });
});
