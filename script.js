const userPromptInput = document.getElementById("user-prompt");
const chatContainer = document.getElementById("chat-container");
const attachImageButton = document.querySelector(".attach-image-button");
const imageFileInput = attachImageButton.querySelector("input[type='file']");
const imageButtonIcon = attachImageButton.querySelector("img");
const sendMessageButton = document.querySelector(".send-message-button");

const API_KEY = "AIzaSyC4CWtQJ2FJ6FYMxmxGYjSvPwMavtgIrcA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessageData = {
  text: null,
  file: {
    mime_type: null,
    data: null,
  },
};

function createChatMessageElement(htmlContent, classNames) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = htmlContent;
  messageDiv.className = `message ${classNames}`;
  return messageDiv;
}

function showBotTypingIndicator() {
  const html = `
    <img src="pngtree-artificial-intelligence-technology-robot-ai-vector-png-image_13223482.png" alt="AI Assistant Avatar" class="message-avatar">
    <div class="message-content" id="typing-indicator">
      <span class="load"></span><span style="margin-left:15px;">Bot is typing...</span>
    </div>
  `;
  const aiChatBox = createChatMessageElement(html, "ai-message");
  chatContainer.appendChild(aiChatBox);
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
  return aiChatBox;
}

async function generateAIResponse(aiChatBoxElement) {
  const messageContentElement = aiChatBoxElement.querySelector(".message-content");

  const requestBody = {
    contents: [
      {
        parts: [{ text: userMessageData.text }],
      },
    ],
  };

  if (userMessageData.file.data) {
    requestBody.contents[0].parts.push({ inline_data: userMessageData.file });
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(API_URL, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(
        `HTTP error! Status: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (apiResponse) {
      messageContentElement.innerHTML = apiResponse;
    } else {
      messageContentElement.innerHTML =
        "<span style='color:red;'>No valid response from AI.</span>";
      console.warn("AI response was empty or malformed:", data);
    }
  } catch (error) {
    messageContentElement.innerHTML =
      "<span style='color:red;'>Something went wrong! Please try again.</span>";
    console.error("Error generating AI response:", error);
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    imageButtonIcon.src = `img.svg`;
    imageButtonIcon.classList.remove("choose");
    userMessageData.file = { mime_type: null, data: null };
  }
}

function handleUserMessage(messageText) {
  userMessageData.text = messageText;

  let userHtml = `
    <img src="OIP.jpg" alt="User Avatar" class="message-avatar">
    <div class="message-content">
      ${userMessageData.text}
      ${
        userMessageData.file.data
          ? `<img src="data:${userMessageData.file.mime_type};base64,${userMessageData.file.data}" class="attached-image" alt="Attached image" />`
          : ""
      }
    </div>
  `;

  userPromptInput.value = "";
  const userChatBox = createChatMessageElement(userHtml, "user-message");
  chatContainer.appendChild(userChatBox);
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });

  const aiTypingBox = showBotTypingIndicator();
  setTimeout(() => {
    generateAIResponse(aiTypingBox);
  }, 600);
}

userPromptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userPromptInput.value.trim() !== "") {
    e.preventDefault();
    handleUserMessage(userPromptInput.value);
  }
});

sendMessageButton.addEventListener("click", () => {
  if (userPromptInput.value.trim() !== "") {
    handleUserMessage(userPromptInput.value);
  }
});

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64string = e.target.result.split(",")[1];
    userMessageData.file = {
      mime_type: file.type,
      data: base64string,
    };
    imageButtonIcon.src = `data:${userMessageData.file.mime_type};base64,${userMessageData.file.data}`;
    imageButtonIcon.classList.add("choose");
  };
  reader.readAsDataURL(file);
});

attachImageButton.addEventListener("click", () => {
  imageFileInput.click();
});
