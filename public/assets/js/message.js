// elements of contact search
let searchForm = document.querySelector("form#contactSearchForm");
let searchInput = document.querySelector("input.search-input");
let searchTimer;

// elements of showing contact search result
let chat_list_title = document.querySelector("p#title-chat-list");
let chatList = document.querySelector("div#chat-list");
let search_result_show = document.querySelector("div#search-result-show");

// elements of messages sections
let messageBox = document.querySelector("div#message-box");
let blank_messageBox = document.querySelector("div#blank-message-box");
let messageForm = document.querySelector("#send-nessages");

//
let receiverData = null;
let this_conversation_id = null;
let this_conversation_name = document.querySelector("#currentConversationName");
let this_conversation_avatar = document.querySelector(
  "#currentConversationAvatar"
);

// messages display section
let chatBody = document.querySelector("#chat-body");

// dynamic html template, which load data from db
// function for show search result
function userComponents(name, avatar, id) {
  // avatar set
  let useravatar = avatar
    ? `/uploads/avatars/${avatar}`
    : `/assets2/img/160x160/img1.jpg`;

  // template to show users in conversation list
  let html = `
      <a href='#'
      onclick="startConversation('${name.firstname}', '${name.lastname}', '${avatar}', '${id}')"
       id='ffr' class="btn list-group-item d-flex align-items-center link-1 pl-0 pr-0 pb-3 pt-3" >
        <div class="pr-3">
          <div class="avatar avatar-sm m-r-15">
              <img src="${useravatar}" class="rounded-circle" alt="user">
          </div>
        </div>
        <div>
          <h6>${name.firstname} ${name.lastname}</h6>
          <span id="userId" class="d-none">${id}</span>
        </div>
      </a>`;
  return html;
}

// for show messages
let messageShow = {
  // for show text content
  text: (text, cls) => {
    let html = `
      <div class="message-item ${cls}">
          <div class="message-item-content">
              ${text}
          </div>
          <span class="time small text-muted font-italic">Yesterday</span>
        </div>`;
    return html;
  },

  // for show files
  attachment: (fileName, cls) => {
    let html = ` <div class="message-item ${cls}">
            <div class="message-item-content ">
              <div>
                <i class="ti-file mr-2 font-size-20 mt-2"></i>
                <p>
                  ${fileName}
                </p>
               
                <ul class="list-inline small text-white">
                    <li class="list-inline-item"><a href="/uploads/messages/" download="${fileName}">Download</a></li>
                    <li class="list-inline-item"><a href="/uploads/messages/${fileName}">View</a></li>
                </ul>
              </div>
            </div>
            <span class="small text-muted font-italic ml-3 mr-3">02:30 PM</span>
          </div> `;
    return html;
  },
};

// templates end

// for display title of chat list
chat_list_title.textContent = "Recent chats";

// init a wait time when user stop to write input
searchInput.addEventListener("keyup", () => {
  clearTimeout(searchTimer);

  if (searchInput.value) {
    searchTimer = setTimeout(searchUser, 500); // search after .5s type delay
  } else {
    search_result_show.innerHTML = "";
    chatList.classList.remove("d-none");
    chat_list_title.textContent = "Recent chats";
  }
});
// clear the timeout while typing
searchInput.addEventListener("keydown", () => {
  clearTimeout(searchTimer);
});

// fucntion for find user on search
async function searchUser() {
  try {
    let response = await fetch(
      `/tadmin/messages/new-conversation/${searchInput.value}`,
      {
        method: "POST",
      }
    );
    let result = await response.json();
    if (result.length > 0) {
      chat_list_title.textContent = "Available Contacts"; // section title
      chatList.classList.add("d-none"); // hide chat list
      search_result_show.classList.remove("d-none"); // show result list
      search_result_show.innerHTML = "";

      result.forEach((user) => {
        // show found users
        search_result_show.innerHTML += userComponents(
          user.name,
          user.avatar,
          user._id
        ); // template function for show user list
      });
    } else {
      chat_list_title.textContent = "no contact found"; // section title
      chatList.classList.add("d-none"); // show chat list
      search_result_show.classList.remove("d-none"); // hide search result list
      search_result_show.innerHTML = ""; // clear result
    }
  } catch (err) {
    console.log(err);
  }
}

// function for start new conversation
async function startConversation(firstname, lastname, avatar, id) {
  try {
    await fetch("/tadmin/messages/start-conversation/", {
      method: "POST",
      body: JSON.stringify({
        firstname,
        lastname,
        avatar,
        id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    location.reload();
  } catch (error) {
    console.log(error);
  }
}

// function for get all messages of a conversation
async function getMessages(
  conversation_id,
  conversation_name,
  conversation_avatar,
  receiver_id
) {
  try {
    messageBox.classList.remove("d-none"); // display the message box
    blank_messageBox.classList.add("d-none"); // block empty messages box

    // store receiver data
    receiverData = {
      id: receiver_id,
      name: conversation_name,
      avatar: conversation_avatar,
    };

    // set selected conversation id
    this_conversation_id = conversation_id;

    // set the user name and avatar in messages box
    this_conversation_name.innerHTML = conversation_name;
    this_conversation_avatar.src = `/uploads/avatars/${conversation_avatar}`;

    // get conversation details from server by conversation id
    let response = await fetch(
      `/tadmin/messages/get-messages/${conversation_id}`
    );

    let result = await response.json();

    if (result.length > 0) {
      chatBody.innerHTML = "";
      result.forEach((res) => {
        if (res.attachment && res.attachment.length > 0) {
          res.attachment.forEach((file) => {
            if (res.sender.id == loggedIn_user_id) {
              chatBody.innerHTML += messageShow.attachment(file, "me"); // add the template with data, template is in a function
            } else {
              chatBody.innerHTML += messageShow.attachment(file);
            }
          });
        }
        if (res.message) {
          if (res.sender.id == loggedIn_user_id) {
            chatBody.innerHTML += messageShow.text(res.message, "me"); // add the template with data, template is in a function
          } else {
            chatBody.innerHTML += messageShow.text(res.message);
          }
        }
      });

      // getting all done, scroll to bottom
      chatBody.scrollTop = chatBody.scrollHeight;
    } else {
      console.log("in else");
      chatBody.innerHTML =
        '<h3 class="text-center m-auto text-muted">start sending message</h3>';
    }
  } catch (err) {
    console.log(err);
  }
}

// socket for load the messages in real time
socket.on("new_message", (data) => {
  // if server give messages
  if (data) {
    if (data.conversation_id == this_conversation_id) {
      // match yhe correct conversation
      if (data.attachment && data.attachment.length > 0) {
        // find attachment
        data.attachment.forEach((file) => {
          if (data.sender_id == loggedIn_user_id) {
            chatBody.insertAdjacentHTML(
              "beforeend",
              messageShow.attachment(file, "me") // add the template with data, template is in a function
            );
          } else {
            chatBody.insertAdjacentHTML(
              "beforeend",
              messageShow.attachment(file, "")
            );
          }
        });
      }
      if (data.message) {
        if (data.sender_id == loggedIn_user_id) {
          chatBody.insertAdjacentHTML(
            "beforeend",
            messageShow.text(data.message, "me") // add the template with data, template is in a function
          );
        } else {
          chatBody.insertAdjacentHTML(
            "beforeend",
            messageShow.text(data.message, "")
          );
        }
        // when new message arrives, scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  }
});

// send message from
messageForm.onsubmit = async function (event) {
  try {
    event.preventDefault();

    let formData = new FormData(messageForm);

    // set the receiver data
    formData.append("receiverId", receiverData.id);
    formData.append("receiverName", receiverData.name);
    formData.append("receiverAvatar", receiverData.avatar);
    formData.append("conversationId", this_conversation_id);

    await fetch("/tadmin/messages/new-message", {
      method: "POST",
      body: formData,
    });

    // after message sent, reset form
    messageForm.reset();
  } catch (error) {
    console.log(error);
  }
};
