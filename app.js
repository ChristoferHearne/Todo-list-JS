// Selectors
const todoInput = document.querySelector('.todo-input'); 
const todoButton = document.querySelector('.todo-button'); 
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const daysLeft = document.querySelector('#daysleft'); 
const todo = new Object();
let daysleft; 
//Event Listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck); 
filterOption.addEventListener("click", filterTodo);
document.addEventListener('DOMContentLoaded', getToDos);
// Functions
function addTodo(event){
    //Prevent form from submitting
    event.preventDefault();

    // Alert the user if the textinput is empty
    if (todoInput.value === ""){
        alert("Please write a title for the todo"); 
    }
    else{
       //TODO DIV
       const todoDiv = document.createElement("div");
       todoDiv.classList.add("todo");

       // Create LI
       const newTodo = document.createElement('li'); 
       newTodo.innerText = todoInput.value;
       newTodo.classList.add('todo-item');
       todoDiv.appendChild(newTodo);
       todo.title = todoInput.value;
       // Add duedate and days left
       if (setDueDate() !== undefined){
           const newDueDate = document.createElement('span');
           newDueDate.classList.add('todo-duedate');
           todoDiv.appendChild(newDueDate);
           todo.duedate = setDueDate().toString();
           todo.daysleft = setDaysLeft();
           newDueDate.innerText = formatInnerText(todo.duedate, todo.daysleft); 

           createCompleteButton(todoDiv); 
           createDeleteButton(todoDiv); 

           saveLocalTodos(todo);  
           //Append to list
           todoList.appendChild(todoDiv);
           
           //Clear textinput
           todoInput.value="";
           //Uncheck radiobuttons
           clearRadioButtons();      
        }
        else{
            const newDueDate = document.createElement('span');
            newDueDate.classList.add('todo-duedate');
            todoDiv.appendChild(newDueDate);
            newDueDate.innerText = formatInnerText(todo.duedate, todo.daysleft); 
            createCompleteButton(todoDiv);
            createDeleteButton(todoDiv); 
            saveLocalTodos(todo);
             
            //Append to list
            todoList.appendChild(todoDiv);
            
            //Clear textinput
            todoInput.value="";
            //Uncheck radiobuttons
            clearRadioButtons();
        }
        
    }
}

function clearRadioButtons(){
    var ele = document.getElementsByName("duedate");
    for(var i = 0; i < ele.length; i++)
    ele[i].checked = false;
}

function createCompleteButton(div){
    //Check Mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn"); 
    div.appendChild(completedButton); 
}

function createDeleteButton(div){
    //Delete button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn"); 
    div.appendChild(trashButton);
}




function deleteCheck(event){
    // Getting the item im clicking on 
    const item = event.target;

    // Delete to do
    if(item.classList[0] === "trash-btn")
    {
        const todo = item.parentElement;
        //Animate todo out
        todo.classList.add("fall");
        // Remove Todo from local storage
        removeLocalToDOs(todo); 
        //Add event listener for when animation is finished

        todo.addEventListener('transitionend', function(){
            todo.remove(); 
        }) 
    }

    if (item.classList[0] === "complete-btn")
    {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        createCookie("completed", "true", 7); 
        console.log(document.cookie); 
    }
}

// Filtering todo-list based on completion

function filterTodo(e){
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        if (todo.classList !== undefined){
            switch(e.target.value){
                case "all":
                    todo.style.display = "flex"; 
                    break;
                case "completed":
                    if (todo.classList.contains('completed')){
                        todo.style.display = "flex";
                    }
                    else{
                        todo.style.display = "none"; 
                    }
                    break; 
                case "uncompleted":
                    if (!todo.classList.contains('completed')){
                        todo.style.display ="flex";
                    }
                    else{
                        todo.style.display = "none";
                    }
                    break; 
            }
        }
    }); 
}

// Save local todos

function saveLocalTodos(todo){
    // Check if I have local todos
    let todos; 
    if (localStorage.getItem('todos') === null){
        todos = []; 
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos')); 
    }
    todos.push(todo); 
    localStorage.setItem('todos', JSON.stringify(todos)); 
}

function getToDos(){
    // Check if I have local todos
    let todos; 
    if (localStorage.getItem('todos') === null){
        todos = []; 
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos')); 
    } 
    todos.forEach(function(todo){
        //TODO DIV
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");

       // Create LI
      const newTodo = document.createElement('li'); 
      newTodo.innerText = todo.title;
      newTodo.classList.add('todo-item');
      todoDiv.appendChild(newTodo);
      
      // Add duedate
      if (todo.duedate !== undefined){
          const newDueDate = document.createElement('span');
          newDueDate.classList.add('todo-duedate');
          todoDiv.appendChild(newDueDate); 
          todo.daysleft = updateDaysLeft(todo.duedate); 
          newDueDate.innerText = formatInnerText(todo.duedate, todo.daysleft); 
          createCompleteButton(todoDiv);
          createDeleteButton(todoDiv);
          todoList.appendChild(todoDiv); 
       }

       else{
           const newDueDate = document.createElement('span');
           newDueDate.classList.add('todo-duedate');
           todoDiv.appendChild(newDueDate); 
           newDueDate.innerText = formatInnerText(todo.duedate, todo.daysleft);  
           createCompleteButton(todoDiv); 
           createDeleteButton(todoDiv); 
           todoList.appendChild(todoDiv); 
       }
      
    })
}

function removeLocalToDOs(todo){
    let todos; 
    if (localStorage.getItem('todos') === null){
        todos = []; 
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos')); 
    }

    const toDoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(toDoIndex), 1)
    localStorage.setItem('todos', JSON.stringify(todos)); 
}

function getTodaysDate(){
    var today = new Date();
    var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date; 
}

function getTomorrowsDate(){
    var today = new Date();
    var date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
    return date; 
}

function getNextWeeksDate(){
    var today = new Date();
    var date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    return date; 
}

function setDueDate(){
    // If rb for today is checked
    if (document.getElementById('today').checked){
        return getTodaysDate(); 
    }
    // If rb for tomorrow is checked 
    else if (document.getElementById('tomorrow').checked){
        return getTomorrowsDate(); 
    }
    // if rb for next week is checked
    else if (document.getElementById('next-week').checked){
        return getNextWeeksDate(); 
    }

    else{
        return;   
    }
}

function setDaysLeft(){
    if (setDueDate() === null){
        return;
    }
    else{
        daysleft = Math.floor((setDueDate() - getTodaysDate()) / (1000*60*60*24));
        return daysleft;
    }
}


function updateDaysLeft(duedate){
    daysleft = Math.floor((new Date(duedate) - getTodaysDate()) / (1000*60*60*24));
    return daysleft; 
}

function formatInnerText(duedate, nmrOfdaysleft){
    if (nmrOfdaysleft === 0){
        return duedate.slice(0, 10) + ' ' + '(' + 'Due Today' + ')';
    }

    else if (nmrOfdaysleft > 0){
        return duedate.slice (0, 10) + ' ' + '(' + nmrOfdaysleft + ' ' + 'day(s) left' + ')';
    }

    else if(nmrOfdaysleft < 0){
        return duedate.slice (0, 10) + ' ' + '(' + 'Overdue by' + Math.abs(nmrOfdaysleft) + ' ' + 'day(s)' + ')';
    }

    else{
        return 'No Due Date';
    }
}







