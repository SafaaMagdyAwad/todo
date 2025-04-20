window.addEventListener("load", function () {
    var taskInput = document.getElementById("taskInput");
    var addTaskBtn = document.getElementById("addTaskBtn");
    var taskTable = document.getElementById("taskTable");
    var SpanMessage = document.getElementById("spanMessage");
    let todoes = JSON.parse(localStorage.getItem("todoes")) || [];

    addTaskBtn.addEventListener("click", function () {
        //check the value of taskinput
        /// validating the imput
        var taskText = taskInput.value.trim();
        let id = Math.random();
        if (taskText === "") {
            SpanMessage.innerText = "Message Can not be null";
            SpanMessage.style.display = "inline";
            return;// to not complete the coed & not add the empty task
        } else {
            // to hide the error message if the message had acontent 
            todoes.push({
                "id": id,
                "taskText": taskText,
                "done": false,
            });
            localStorage.setItem("todoes", JSON.stringify(todoes));
            SpanMessage.style.display = "none";
        }
        showTodoes();
    });

    function showTodoes() {
        taskTable.innerHTML="";
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

            doneBox.type = "checkbox";
            // doneBox.value=id;
            if (todo["done"]) {
                taskTextCell.className = "done";//will style the text to be line througth
                doneBox.checked = true;
            }
            doneBox.addEventListener("change", function () {
                // console.log(doneBox.value);
                if (!todo["done"]) {
                    // the task is done                
                    todo["done"] = true;
                    taskTextCell.className = "done";//will style the text to be line througth
                } else {
                    //the task is not
                    todo["done"] = false;
                    taskTextCell.className = "active";//will style the text to be normal
                }
            });
            doneCell.appendChild(doneBox);   //  done   ?   ?



            // delete Button
            var deleteCell = document.createElement("td");
            var deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.style = "background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 5px;"
            deleteBtn.addEventListener("click", function () {
                // delete the compelete row
                todoes=removeElement(todoes,todo);
                localStorage.setItem("todoes", JSON.stringify(todoes));

                console.log(todoes);
                
                taskTable.removeChild(row);
            });
            deleteCell.appendChild(deleteBtn);

            // Append to row
            row.appendChild(doneCell);
            row.appendChild(taskTextCell);
            row.appendChild(deleteCell);

            // Add row to table
            taskTable.appendChild(row);
        });
    }
    showTodoes();


    function removeElement(a, ele) {
        a.forEach((item, index) => {
            if (item === ele) {
                a.splice(index, 1);
            }
        });
        return a;
    }
});
