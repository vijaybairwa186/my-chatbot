let prompt = document.querySelector("#prompt");
let chatcontainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let imageinput = document.querySelector("#image input");
let image = document.querySelector("#image img");
const Api_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD9LLvMc-eSy1uvKRmUSfnclJmo0i6OWgA";

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  let RequestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: user.message },
            user.file.data ? [{ inline_data: user.file }] : [],
          ],
        },
      ],
    }),
  };

  try {
    let response = await fetch(Api_Url, RequestOption);
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text.trim();

    text.innerHTML = apiResponse;
  } catch (error) {
    console.log(error);
  } finally {
    chatcontainer.scrollTo({
      top: chatcontainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function handlechatResponse(userMessage) {
  user.message = userMessage;
  let html = `<img src="OIP.jpg" alt="" id="userImage" width="10%">
    <div class="user-chat-area">
     ${user.message}
     ${
       user.file.data
         ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`
         : ""
     }

    </div>`;
  prompt.value = "";

  let userChatBox = createChatBox(html, "user-chatbox");
  chatcontainer.appendChild(userChatBox);
  chatcontainer.scrollTo({
    top: chatcontainer.scrollHeight,
    behavior: "smooth",
  });

  setTimeout(() => {
    let html = `<img src="pngtree-artificial-intelligence-technology-robot-ai-vector-png-image_13223482.png" alt="" id="aiImage" width="13%">
    <div class="ai-chat-area">
     <img src="loading-bar-progress-icon-with-transparent-background-free-png.webp" alt="" class="load" width="50px">
  </div>

    </div>`;
    let aiChatBox = createChatBox(html, "ai-chatbox");
    chatcontainer.appendChild(aiChatBox);

    generateResponse(aiChatBox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handlechatResponse(prompt.value);
  }
});

imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (e) => {
    // console.log(e)
    let base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});
