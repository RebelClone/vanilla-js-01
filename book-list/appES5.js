console.log('ES5')

// Book Constructor
function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.addBookToList = book =>{
    const list = document.querySelector('#book-list');
    const { title, author, isbn } = book
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
        <td>${isbn}</td>
        <td><a class="delete font-weight-bold" href="#">X</a></td>
    `;
    list.appendChild(tr)
}   

UI.prototype.clearList = () =>{
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
}

UI.prototype.showAlert = (msg, className) =>{
    if( !document.querySelector(`.${className}`) ){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
    
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
    
        container.insertBefore(div, form)
        setTimeout(()=>{
            document.querySelector('.alert').remove()
        }, 2000)
     }
}

UI.prototype.deleteBook = (target)=>{
    if(target.className === 'delete font-weight-bold'){
        target.parentElement.parentElement.remove()
    }
}

// LocalStorage Constructor
function LocalStorageData() {}

LocalStorageData.prototype.getStore = () =>{
    let bookList;
    if(localStorage.getItem('bookList')===null){
        bookList = [];
    } else {
        bookList = JSON.parse(localStorage.getItem('bookList'))
    }
    return bookList;
}

LocalStorageData.prototype.setStore = (bookList, book) =>{
    bookList.push(book)
    localStorage.setItem('bookList', JSON.stringify(bookList))
}

LocalStorageData.prototype.removeBook = (bookList, isbn) =>{ 
    bookList.forEach((book,index,arr)=>{
        if(book.isbn===isbn){
            arr.splice(index,1)
        }
    })
    localStorage.setItem('bookList', JSON.stringify(bookList))
}

//Event Listeners

document.querySelector('#book-form').addEventListener('submit', e =>{
    const title = document.querySelector('#title').value,
          author = document.querySelector('#author').value,
          isbn = document.querySelector('#isbn').value;

    const book = new Book(title, author, isbn);

    const ui = new UI()

    const storage = new LocalStorageData()

    const bookList = storage.getStore()


    if( title === '' || author === '' || isbn === '' ){

        ui.showAlert('Please fill in all fields', 'alert-danger');

    } else if(bookChecker(isbn)) {
    
        ui.showAlert('Book with same ISBN Number already exists', 'alert-danger')

    } else {
        ui.addBookToList(book)

        storage.setStore(bookList, book)
        
        ui.showAlert('Book Added', 'alert-success')

        ui.clearList()        
    }

    e.preventDefault()
})


document.querySelector('#book-list').addEventListener('click', e=>{
    const ui = new UI()
    ui.deleteBook(e.target)
    ui.clearList()
    ui.showAlert('Book removed', 'alert-info')

    const storage = new LocalStorageData()
    const bookList = storage.getStore()
    
    storage.removeBook(bookList,e.target.parentElement.previousElementSibling.textContent)
})

function bookChecker(isbn){

    const storage = new LocalStorageData()

    const bookCheck = storage.getStore()

    for(let book=0; book < bookCheck.length; book++){
        if(bookCheck[book].isbn === isbn){
            return true
        }
    }
    return false
}

function componentOnMount(){
    const storage = new LocalStorageData()
    const ui = new UI()
    const bookList = storage.getStore()
    if( bookList !== [] ){
        for(let i=0; i<bookList.length;i++){
            ui.addBookToList(bookList[i])
        }

    }
}

componentOnMount()
