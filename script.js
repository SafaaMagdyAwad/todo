window.addEventListener("load", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskTable = document.getElementById("taskTable");
  const SpanMessage = document.getElementById("spanMessage");
  const date = document.getElementById("reminderDate");
  const time = document.getElementById("reminderTime");
  const statusDiv = document.getElementById("notificationStatus");

  let todoes = JSON.parse(localStorage.getItem("todoes")) || [];

  // REQUEST NOTIFICATIONS
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      statusDiv.innerText =
        permission === "granted"
          ? "✅ notifications are allowed"
          : permission === "denied"
          ? "❌ notifications are blocked"
          : "ℹ️ no decision about notifications";
      statusDiv.style.color =
        permission === "granted"
          ? "green"
          : permission === "denied"
          ? "red"
          : "orange";
    });
  }

  // REGISTER SERVICE WORKER
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error(err));
  }

  // ADD TASK
  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      SpanMessage.innerText = "Task cannot be empty";
      SpanMessage.style.display = "inline";
      return;
    }

    const reminderDateTime = new Date(`${date.value}T${time.value}`);
    if (reminderDateTime <= new Date()) {
      alert("⚠️ Date & time must be in the future");
      return;
    }

    todoes.push({
      id: Math.random(),
      taskText,
      date: date.value,
      time: time.value,
      done: false,
      reminded: false,
    });

    localStorage.setItem("todoes", JSON.stringify(todoes));
    taskInput.value = "";
    SpanMessage.style.display = "none";
    showTodoes();
    checkReminders();
  });

  // SHOW TODOES
  function showTodoes() {
    taskTable.innerHTML = "";
    todoes.forEach(todo => {
      const tr = document.createElement("tr");

      // Done checkbox
      const doneCell = document.createElement("td");
      const doneBox = document.createElement("input");
      doneBox.type = "checkbox";
      doneBox.checked = todo.done;
      doneBox.addEventListener("change", () => {
        todo.done = doneBox.checked;
        if (!todo.done) todo.reminded = false; // allow reminder again
        localStorage.setItem("todoes", JSON.stringify(todoes));
      });
      doneCell.appendChild(doneBox);

      // Task text
      const taskTextCell = document.createElement("td");
      taskTextCell.innerText = todo.taskText;
      if (todo.done) taskTextCell.className = "done";

      // Deadline
      const deadlineCell = document.createElement("td");
      deadlineCell.innerText = `${todo.date} ${todo.time}`;

      // Delete button
      const deleteCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.style =
        "background-color:red;color:white;padding:5px 10px;border:none;border-radius:5px";
      deleteBtn.addEventListener("click", () => {
        if (confirm(`Delete "${todo.taskText}"?`)) {
          todoes = todoes.filter(t => t.id !== todo.id);
          localStorage.setItem("todoes", JSON.stringify(todoes));
          showTodoes();
        }
      });
      deleteCell.appendChild(deleteBtn);

      tr.append(doneCell, taskTextCell, deadlineCell, deleteCell);
      taskTable.appendChild(tr);
    });
  }

  showTodoes();

  // CHECK REMINDERS
  function checkReminders() {
    const now = new Date();
    todoes.forEach(todo => {
      if (!todo.done && !todo.reminded) {
        const reminderTime = new Date(`${todo.date}T${todo.time}`);
        if (reminderTime <= now) {
          // Trigger notification
          if (Notification.permission === "granted") {
            new Notification("📝 Reminder!", {
              body: `Don't forget: ${todo.taskText}`,
              icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
            });
          }
          todo.reminded = true;
        }
      }
    });
    localStorage.setItem("todoes", JSON.stringify(todoes));
  }

  // Run reminders when page loads
  checkReminders();

  // Optional: check when user comes back online
  window.addEventListener("online", checkReminders);
});
