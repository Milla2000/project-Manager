class CompletedTodo {
    constructor(task_title, task_description, task_deadline, task_completed) {
      this.taskTitle = task_title;
      this.taskDescription = task_description;
      this.taskDeadline = task_deadline;
      this.taskCompleted = task_completed;

      this.late=this.deadlineBetween().split(' ')[0]
      this.howlate=this.deadlineBetween().split(' ')[1]
    }

    
    deadlineBetween() {
      // console.log(this.task_deadline)
      let currentDate = new Date().toJSON().slice(0, 10);

      let deadline = new Date(this.task_deadline).toJSON().slice(0, 10);
      let time_rem = '';
      let time_rem_str = ''

      if (deadline >= currentDate) {
          time_rem = new Date(deadline) - new Date(currentDate);
          time_rem_str = "early"
      } else {
          time_rem = new Date(currentDate) - new Date(deadline);
          time_rem_str = "late"
      }

      time_rem = time_rem / (1000 * 3600 * 24);
      console.log(`time remaining is : ${time_rem}`)
      // time_rem = Math.abs(time_rem); 

      let result = ''

      // if( time_rem = 1){
      //     result = `${time_rem} day ${time_rem_str}`
      // } else{
      //     result = `${time_rem} days ${time_rem_str}`
      // }

      if( time_rem == 1){
        result = `${time_rem} ${time_rem_str}`
    } else{
        result = `${time_rem} ${time_rem_str}`
    }
      return result
  
      
  }
  
    get task_title() {
      return this.taskTitle;
    }
  
    get task_description() {
      return this.taskDescription;
    }
  
    get task_deadline() {
      return this.taskDeadline;
    }
  
    get task_completed() {
      return this.taskCompleted;
    }
  
    set task_completed(isCompleted) {
      this.taskCompleted = isCompleted;
    }
  }

  
class Uncompleted_Todo {
    constructor(task_title, task_description, task_deadline, task_completed) {
      this.taskTitle = task_title;
      this.taskDescription = task_description;
      this.taskDeadline = task_deadline;
      this.taskCompleted = task_completed;
    }
  
    get task_title() {
      return this.taskTitle;
    }
  
    get task_description() {
      return this.taskDescription;
    }
  
    get task_deadline() {
      return this.taskDeadline;
    }
  
    get task_completed() {
      return this.taskCompleted;
    }
  
    set task_completed(isCompleted) {
      this.taskCompleted = isCompleted;
    }
  }
  
let taskList = [];



  
  const form = document.getElementById("task-form");
  let taskListContainer = document.querySelector(".tasklist-container");
  
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let task_title = document.getElementById("title").value;
    let task_description = document.getElementById("description").value;
    let task_deadline = document.getElementById("deadline").value;
    let task_completed = document.querySelector("#checkbox").checked

    console.log(task_completed)
    if (task_title!=='' & task_description!=='' & task_deadline!=='') {
      if (task_completed){
        const newTask = new CompletedTodo(task_title, task_description, task_deadline, task_completed);
        taskList.push(newTask); 
  
        console.log(newTask.late, newTask.howlate)
  
    }else if(!task_completed){
      
      const newTask = new Uncompleted_Todo(task_title, task_description, task_deadline, task_completed);
      taskList.push(newTask);
  
    
      
    }
    displayTasks(taskList);
    form.reset();
    } else{
      alert('fill all fields before submiting!')
    }
    
  
  
  });
  
  function displayTasks(list) {
    taskListContainer.innerHTML = "";
  
    list.forEach((task, index) => {
      count()
      const taskItem = document.createElement("div");
      taskItem.className = "new-task";

      // const taskIteminner = document.createElement("div");
      // taskIteminner.className = "new-task-inner";
  
      const taskTitle = document.createElement("h3");
      taskTitle.textContent = task.task_title;

      const detail = document.createElement("div");
      detail.className = "details";
  
      const taskDescription = document.createElement("p");
      taskDescription.textContent = task.task_description;
      taskDescription.className = "details-paragraph";
  
      const taskDeadline = document.createElement("p");
      taskDeadline.textContent = `Deadline: ${task.task_deadline}`;

      if (task instanceof CompletedTodo){
        if(task.late==1){
          taskDeadline.textContent = `completed ${task.late} day ${task.howlate}`;
        } else {
          taskDeadline.textContent = `completed ${task.late} days ${task.howlate}`;
        }
      }
  
      const taskCompleted = document.createElement("input");
      taskCompleted.type = "checkbox";
      taskCompleted.checked = task.task_completed;
      taskCompleted.addEventListener("change", () => {
        // task.task_completed = taskCompleted.checked;

        // console.log();

        if(task.task_completed){
          task.taskCompleted = false
          const newTask = new Uncompleted_Todo(task.task_title, task.task_description, task.task_deadline, task.task_completed);
          
          taskList.push(newTask);
          taskList.splice(index, 1);
          console.log(newTask);          
        } else if(!task.task_completed){
          task.taskCompleted = true
          const newTask = new CompletedTodo(task.task_title, task.task_description, task.task_deadline, task.task_completed);
          
          taskList.push(newTask);
          taskList.splice(index, 1);
          console.log(newTask);
          console.log(newTask.late, newTask.howlate)
          
        }

        
        

        displayTasks(taskList);
      });
  
      const editButton = document.createElement("button");
      editButton.textContent = "edit";
      editButton.addEventListener("click", () => {
        console.log("editing..")
        document.getElementById("title").value = task.taskTitle
        document.getElementById("description").value = task.taskDescription;
        document.getElementById("deadline").value = task.taskDeadline;
        document.querySelector("#checkbox").checked = task.taskCompleted;

        let update =document.querySelector('#submit-btn')
        let form_btn =document.querySelector('#form-submit-btn')
        let form = document.querySelector('#task-form')
        let checkbox = document.querySelector('#checkbox')
       
        update.style.display = "block";
        form_btn.style.display = "none";

        checkbox.addEventListener("change", (event) => {
          event.preventDefault();
          if (task.taskCompleted){
            task.checked = false
            checkbox.checked = false
            console.log(`task is now uncompleted  :: ${task.taskCompleted}`);
          } else if(!task.taskCompleted) {
            task.checked = true
            checkbox.checked = true
            console.log(`task is now completed  :: ${task.taskCompleted}`);
          } 
        })

        update.addEventListener("click", (event) => {
          event.preventDefault();

          let task_title_update = document.getElementById("title").value;
          let task_description_update = document.getElementById("description").value;
          let task_deadline_update = document.getElementById("deadline").value;
          let task_completed_update = document.querySelector("#checkbox").checked

          task.taskTitle = task_title_update
          task.taskDescription = task_description_update
          task.taskDeadline = task_deadline_update
          task.taskCompleted = task_completed_update

            // console.log(task);

            displayTasks(taskList);
            console.log(taskList);
            update.style.display = "none";
            form_btn.style.display = "block";
            form.reset()
            console.log(task.late, task.howlate)
            
          })
                
        // displayTasks();
      });
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        taskList.splice(index, 1);
        displayTasks(taskList);
      });
  
      // taskItem.appendChild(taskIteminner);
      taskItem.appendChild(taskTitle);
      taskItem.appendChild(taskDescription);
      taskItem.appendChild(detail)
      detail.appendChild(taskDeadline);
      detail.appendChild(taskCompleted);
      detail.appendChild(deleteButton);
      detail.appendChild(editButton);
  
      taskListContainer.appendChild(taskItem);
      
    });
    count()
  }


  let btnComplete = document.querySelector('#btn-complete');
  let btnActive = document.querySelector('#btn-active');
  let btnAll = document.querySelector('#btn-all');  
  let btnClear = document.querySelector('#btn-clear');
  let itemsleft = document.querySelector('.items_left');
  

displayTasks(taskList);
console.log(taskList);
  
btnClear.addEventListener('click', () => {
  
  const filteredTasks = taskList.filter((item) => item instanceof Uncompleted_Todo);
  console.log(filteredTasks);
  taskList = filteredTasks
  displayTasks(filteredTasks);
  count()
  
});

btnComplete.addEventListener('click', () => {
  const filteredTasks = taskList.filter((item) => item instanceof CompletedTodo);
  console.log("clicked complete");
  displayTasks(filteredTasks)
  count()
});
btnActive.addEventListener('click', () => {
  const filteredTasks = taskList.filter((item) => item instanceof Uncompleted_Todo);
  console.log("clicked complete");
  displayTasks(filteredTasks)
  count()
});
btnAll.addEventListener('click', () => {
  displayTasks(taskList)
  count()
});

function count(){
  remaining = taskList.filter((item) => item instanceof Uncompleted_Todo);
  count_remaining = remaining.length;
  console.log(count_remaining)
  itemsleft.textContent= count_remaining + " items left"
}