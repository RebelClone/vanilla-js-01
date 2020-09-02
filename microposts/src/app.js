import {http} from './http'
import {ui} from './ui'

// Get Posts 
document.addEventListener('DOMContentLoaded', getPosts);

// Add posts
document.querySelector('.post-submit').addEventListener('click', addPost)

//delete posts
document.querySelector('#posts').addEventListener('click', deletePosts)

//edit posts
document.querySelector('#posts').addEventListener('click', editPosts)

//cancel edit
document.querySelector('.card-form').addEventListener('click', cancelEdit)


function getPosts(){

  http.get('http://localhost:3000/posts')
  .then(data=>ui.showPosts(data))
  .catch(console.log)

  
};


function addPost(){

  const title = document.querySelector('#title').value,
  body = document.querySelector('#body').value,
  id = document.querySelector('#id').value

  const data = {
    title,
    body
  }

  if( title !== "" && body !== "" && id === "" ) {

    
    http.post('http://localhost:3000/posts',data)
    .then(()=>{
      ui.showAlert('Post added', 'alert alert-success')
      getPosts()
      ui.clearFields()
    })
    .catch(console.log)
  } else if(id !== ""){

    http.put(`http://localhost:3000/posts/${id}`, data)
    .then(()=>{
      ui.showAlert('Post Updated', 'alert alert-success')
      ui.changeFormState('add')
      getPosts()
      ui.clearFields()
    })
    .catch(console.log)

    
    
  } else {
    ui.showAlert('Please fill in all fields', 'alert alert-danger')
  }

}

function deletePosts(e){ 
  e.preventDefault()
  
  if(e.target.parentElement.classList.contains('delete')){
    const id = e.target.parentElement.dataset.id;
    if(confirm('Are you sure?')){
      http.delete(`http://localhost:3000/posts/${id}`)
      .then(data=>{
        ui.showAlert('Post Deleted', 'alert alert-success')
        getPosts()
      })
      .catch(console.log)
    }
  }

}

function editPosts(e){
  e.preventDefault()

  if(e.target.parentElement.classList.contains('edit')){
    const id = e.target.parentElement.dataset.id,
    title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent,
    body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body
    }

    ui.fillForm(data)

  }

}

function cancelEdit(e){
  if(e.target.classList.contains('post-cancel')){
    ui.changeFormState('add')
  }

  e.preventDefault()
}