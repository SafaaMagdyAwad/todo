window.addEventListener("load", function () {
    var taskInput = document.getElementById("taskInput");
    var addTaskBtn = document.getElementById("addTaskBtn");
    var taskTable = document.getElementById("taskTable");
    var SpanMessage = document.getElementById("spanMessage");
    let todoes = JSON.parse(localStorage.getItem("todoes")) || [];
    let date = document.getElementById("reminderDate");
    let time = document.getElementById("reminderTime");
    let statusDiv = document.getElementById("notificationStatus");

    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                statusDiv.innerText = "✅ تم تفعيل الإشعارات.";
                statusDiv.style.color = "green";
            } else if (permission === "denied") {
                statusDiv.innerText = "❌ تم رفض الإشعارات.";
                statusDiv.style.color = "red";
            } else {
                statusDiv.innerText = "ℹ️ لم يتم اتخاذ قرار بشأن الإشعارات.";
                statusDiv.style.color = "orange";
            }

        });
    }

    function scheduleReminder(taskText, reminderDateTime) {
        const now = new Date();
        const delay = reminderDateTime - now;

        if (delay > 0 && Notification.permission === "granted") {
            setTimeout(() => {
                new Notification("📝 تذكير!", {
                    body: `لا تنسَ: ${taskText}`,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                });

                // تشغيل صوت
                let audio = new Audio("alarm.wav");
                audio.play();
            }, delay);
        }
    }

    function checkDeadlinesPeriodically() {
        setInterval(() => {
            let now = new Date();

            todoes.forEach(todo => {
                if (!todo.done && !todo.reminded && todo.date && todo.time) {
                    let reminderDateTime = new Date(`${todo.date}T${todo.time}`);
                    let diff = reminderDateTime - now;

                    // إذا الموعد في خلال دقيقة
                    if (diff <= 60000 && diff > 0) {
                        // أرسل إشعار
                        new Notification("📝 تذكير!", {
                            body: `لا تنسَ: ${todo.taskText}`,
                            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                        });

                        let audio = new Audio("alarm.wav");
                        audio.play();

                        // حدد أن التذكير أُرسل
                        todo.reminded = true;
                        localStorage.setItem("todoes", JSON.stringify(todoes));
                    }
                }
            });
        }, 60000); // كل دقيقة
    }


    addTaskBtn.addEventListener("click", function () {
        //check the value of taskinput
        /// validating the imput
        var taskText = taskInput.value.trim();
        let id = Math.random();
        if (taskText === "") {

            SpanMessage.innerText = "Message Can not be null";
            SpanMessage.style.display = "inline";
            return;
        } else {
            if (date && time) {
                let reminderDateTime = new Date(`${date.value}T${time.value}`);
                console.log(reminderDateTime);
                console.log(new Date());


                if (reminderDateTime > new Date()) {
                    todoes.push({
                        "id": id,
                        "taskText": taskText,
                        "done": false,
                        "date": date.value,
                        "time": time.value,
                        "reminded": false
                    });
                    alert("the TODO was added successfully! ");
                    localStorage.setItem("todoes", JSON.stringify(todoes));
                    SpanMessage.style.display = "none";
                    taskInput.value = "";
                    scheduleReminder(taskText, reminderDateTime);

                } else {
                    alert("⚠️ التاريخ أو الوقت يجب أن يكون في المستقبل!");
                }

            }

        }
        showTodoes();

    });

    function showTodoes() {
        taskTable.innerHTML = "";
        todoes.forEach(todo => {
            //starting creating elements
            //table row
            var row = document.createElement("tr");

            // done cell
            let doneCell = document.createElement("td");
            let doneBox = document.createElement("input");
            // task cell
            var taskTextCell = document.createElement("td");
            taskTextCell.innerText = todo.taskText;  //done    task   ?
            //deadline cell
            var deadlinecell = document.createElement("td");
            deadlinecell.innerText = `${todo.date} , ${todo.time}`;  //done    task   ?

            doneBox.type = "checkbox";

            // doneBox.value=id;
            if (todo["done"]) {
                taskTextCell.className = "done";//will style the text to be line througth
                doneBox.checked = true;
            }
            doneBox.addEventListener("change", function () {
                todo["done"] = doneBox.checked;
                if (todo["done"]) {
                    taskTextCell.className = "done";
                } else {
                    taskTextCell.className = "active";
                    todo["reminded"] = false; // إعادة التذكير إذا رجعت المهمة لحالة غير منتهية
                }
                localStorage.setItem("todoes", JSON.stringify(todoes));
            });
            doneCell.appendChild(doneBox);   //  done   ?   ?



            // delete Button
            var deleteCell = document.createElement("td");
            var deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.style = "background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 5px;"
            deleteBtn.addEventListener("click", function () {
                // delete the compelete row
                let deletetodo = confirm(`are you sure you want to delete ${todo["taskText"]} `);
                if (deletetodo) {
                    todoes = removeElement(todoes, todo);
                    localStorage.setItem("todoes", JSON.stringify(todoes));
                    taskTable.removeChild(row);
                }
            });
            deleteCell.appendChild(deleteBtn);

            // Append to row
            row.appendChild(doneCell);
            row.appendChild(taskTextCell);
            row.appendChild(deadlinecell);
            row.appendChild(deleteCell);

            // Add row to table
            taskTable.appendChild(row);
        });
    }
    showTodoes();
    checkDeadlinesPeriodically();


    function removeElement(a, ele) {
        a.forEach((item, index) => {
            if (item === ele) {
                a.splice(index, 1);
            }
        });
        return a;
    }
});
