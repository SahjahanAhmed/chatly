const socket = io();

const enterBtn = document.getElementById("enter-btn");
const form = document.getElementById("form");
const nameEl = document.getElementById("name");
const roomEl = document.getElementById("room");
const overlay = document.querySelector(".overlay");
const messages = document.getElementById("messages");
const chat = document.getElementById("chat");
const sendBoxInput = document.getElementById("send-box-input");
const sendBoxBtn = document.getElementById("send-box-button");
const totalUsersEl = document.getElementById("total-users");

//add
const addMessage = (data, position) => {
  const li = document.createElement("li");
  li.classList.add("message");
  li.innerHTML = data;
  li.classList.add(position);
  messages.appendChild(li);
};

//messages box scroll to the top when window reload
window.addEventListener("DOMContentLoaded", () => {
  messages.scrollTo(0, 1000);
});

//notified people that a user has joined
socket.on("user-joined", (userName) => {
  addMessage(`${userName} joined the chat!`, "left");
  messages.scrollTo(0, 1000);
});

//notified people that a user has joined
socket.on("user-leave", (userName) => {
  addMessage(`${userName} leave the chat!`, "left");
});

//getting active users
socket.on("active-users", (totalUsers) => {
  totalUsersEl.innerHTML = ` Active users: ${totalUsers}`;
});

//getting wellcome message and showing to the screen
socket.on("welcome", (msg) => {
  const welcomeEl = document.createElement("h3");
  welcomeEl.innerText = msg;
  welcomeEl.classList.add("message");
  welcomeEl.classList.add("left");
  welcomeEl.classList.add("right");
  messages.insertAdjacentElement("beforebegin", welcomeEl);
});

//getting user name
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = nameEl.value;
  if (userName == "") return;
  if (userName != null) {
    socket.emit("new-user-joined", userName);
  }
  overlay.classList.add("d-none");
});

// sending message to server and also showing to my screen
sendBoxBtn.addEventListener("click", () => {
  const messageText = sendBoxInput.value;
  if (messageText == "") return;
  addMessage(`You: ${messageText}`, "right");
  socket.emit("sendMessage", { messageText, userName: nameEl.value });
  messages.scrollTo(0, 1000);
  sendBoxInput.value = "";
});

//getting message from the server and showing to the screen
socket.on("sendBackMessage", (message) => {
  addMessage(message, "left");
  messages.scrollTo(0, 1000);
});
