// Selectors
const form = document.querySelector('#task-form'),
    taskList = document.querySelector('.collection'),
    clearBtn = document.querySelector('.clear-tasks'),
    filter = document.querySelector('#filter'),
    taskInput = document.querySelector('#task'),
    taskLabel = document.querySelector('.changeText')

// Load event Listeners
loadEventListeners()

function loadEventListeners(){

    document.addEventListener('DOMContentLoaded', getTasks)

    form.addEventListener('submit', addTask)

    taskList.addEventListener('click', removeTask)

    clearBtn.addEventListener('click', clearAll)

    filter.addEventListener('keyup', filterTask)

}

// Local Storage
function store(){
    let tasks;
    if(localStorage.getItem('tasks')===null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    return tasks;
}

// Add Task
function addTask(e) {
    
    // Showing User task field
    if(taskInput.value === '') {
        return taskLabel.innerHTML = "Add Task Here"
    }

    // Getting Store
    const tasks = store()

    // Alerting about same Task
    if(tasks.indexOf(taskInput.value)!==-1){
        alert(`Task: ${taskInput.value} already in list`)

        // Clear Input
        taskInput.value = ''
        taskLabel.innerHTML = 'New Task'
    }
    else{
        // Creating task
        const li = document.createElement('li')
        li.className = "collection-item"
        li.appendChild(document.createTextNode(taskInput.value))

        const link = document.createElement('a')
        link.className = 'delete-item secondary-content'
        link.setAttribute('href', '#')
        link.innerHTML = '<i class="fa fa-remove" ></i>'

        li.appendChild(link)
        taskList.appendChild(li)
        
        // Local storage
        storeTask(taskInput.value)

        // Clear Input
        taskInput.value = ''
        taskLabel.innerHTML = 'New Task'
    }
    
    // disabling form submit
    e.preventDefault()
}

// Storing new Task in Local storage
function storeTask(task){
    
    const tasks = store()

    tasks.push(task)

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Removing task
function removeTask(e){

    // Selecting elem to remove
    if( e.target.parentElement.classList.contains('delete-item') ){

        // removing from DOM
        if(confirm('Are you Sure?')){

            e.target.parentElement.parentElement.remove();
            
            // removing from LocalStorage
            storeRemove(e.target.parentElement.parentElement.firstChild.textContent)
        } 
        
    } else if( e.target.classList.contains('delete-item') ){
        
        // removing from DOM
        if(confirm('Are you Sure?')){
            e.target.parentElement.remove();

            // removing from LocalStorage
            storeRemove(e.target.parentElement.firstChild.textContent)
        } 
    }
}

// Remove from LocalStorage
function storeRemove(text){
    
    // Getting store
    const tasks = store()

    // Removing from Arr
    tasks.forEach((task, index)=>{
        if(task===text) tasks.splice(index,1);
    })

    // Adding to store after changes
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Clear All Tasks
function clearAll(){
    
    // Clearing from DOM
    if(confirm('Are you Sure?')){
        
        // Using remove child
        while(taskList.firstChild){
            taskList.removeChild(taskList.firstChild)
        }
        
        // Using innerHTML
        // taskList.innerHTML = '';

        // Clearing from Storage
        localStorage.clear()
    }

    

}

// Filter Task
function filterTask(e){

    const text = e.target.value.toLowerCase()

    // Finding Tasks to show and to hide
    document.querySelectorAll('.collection-item').forEach(li=>{
        if(li.textContent.toLowerCase().indexOf(text)!=-1){
            li.style.display = 'block';
        } else {
            li.style.display = 'none';
        }
    });

}

// Initiating the Tasks when dom gets loaded and store has tasks in it
function getTasks(e){
    
    // Getting store
    const tasks = store()

    // Adding tasks to DOM
    tasks.forEach(task=>{
        const li = document.createElement('li')
        li.className = "collection-item"
        li.appendChild(document.createTextNode(task))

        const link = document.createElement('a')
        link.className = 'delete-item secondary-content'
        link.setAttribute('href', '#')
        link.innerHTML = '<i class="fa fa-remove" ></i>'

        li.appendChild(link)
        taskList.appendChild(li)
    })
}