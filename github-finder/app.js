const searchUser = document.querySelector('.searchContainer')
const github = new GitHub
const ui = new UI

//Event Listerner
searchUser.addEventListener('keyup', e =>{
    const userText = e.target.value

    if(userText !== ''){
        //http call
        github.getUser(userText)
        .then(data => {
            if(data.profile.message === 'Not Found'){
                ui.showAlert('User Not Found', 'alert alert-danger')
                console.clear()
            } else {
                ui.showProfile(data.profile)
                ui.showRepos(data.repos)
            }
        })
    } else {
        ui.clearProfile()
    }

    e.preventDefault()
})