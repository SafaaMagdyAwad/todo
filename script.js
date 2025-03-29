window.addEventListener("load", function() {
    var taskInput = document.getElementById("taskInput");
    var addTaskBtn = document.getElementById("addTaskBtn");
    var taskTable = document.getElementById("taskTable");
    var SpanMessage = document.getElementById("spanMessage");
    let todoes=[];

    addTaskBtn.addEventListener("click", function() {
            //check the value of taskinput
            /// validating the imput
        var taskText = taskInput.value.trim();
        if (taskText === "") {
            SpanMessage.innerText="Message Can not be null";
            SpanMessage.style.display="inline";
            return;// to not complete the coed & not add the empty task
        }else{
            // to hide the error message if the message had acontent 
            todoes.push(taskText);
            localStorage.setItem("todoes",JSON.stringify(todoes));
            SpanMessage.style.display="none";
        }


        //starting creating elements
        //table row
        var row = document.createElement("tr");

        // done cell
        let doneCell = document.createElement("td");
        let doneBox = document.createElement("input");


        doneBox.type="checkbox";
        doneBox.addEventListener("click", function() {
            if(doneBox.checked){
                // the task is done
                taskTextCell.style=" text-decoration: line-through; color: gray;"//will style the text to be line througth
            }else{
                //the task is not
                taskTextCell.style="text-decoration: none; color: black;";//will style the text to be line througth
            }
        });
        doneCell.appendChild(doneBox);   //  done   ?   ?

        // task cell
        var taskTextCell = document.createElement("td");
        taskTextCell.innerText = taskText;  //done    task   ?

        // delete Button
        var deleteCell = document.createElement("td");
        var deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 5px;"
        deleteBtn.addEventListener("click", function() {
            // delete the compelete row
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
});
