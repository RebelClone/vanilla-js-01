console.log('ES6')

// Class bases approach

// Book Class
class Book {
    constructor(title, author, isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI Class
class UI {
    addBookToList(book){
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

    showAlert(msg, className){
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

    deleteBook(target){
        if(target.className === 'delete font-weight-bold'){
            target.parentElement.parentElement.remove()
            this.showAlert('Book removed', 'alert-info')
        }
    }

    clearList(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    }
}

// LocalStorage CLass
class Store {

    static getBook(){
        let bookList;
        if(localStorage.getItem('bookList')===null){
            bookList = [];
        } else {
            bookList = JSON.parse(localStorage.getItem('bookList'))
        }
        return bookList;
    }

    static displayBook(){
        const bookList = Store.getBook()
        const ui = new UI()
        bookList.forEach(book =>ui.addBookToList(book))
    }
    

    static addBook(book){
        const bookList = this.getBook()
        bookList.push(book)
        localStorage.setItem('bookList', JSON.stringify(bookList))
    }

    static removeBook(isbn){
        const bookList = this.getBook()
        bookList.forEach((book,index,arr)=>{
            if(book.isbn===isbn){
                arr.splice(index,1)
            }
        })
        localStorage.setItem('bookList', JSON.stringify(bookList))
    }

}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBook)

// Event handlers
document.querySelector('#book-form').addEventListener('submit', e =>{
    const title = document.querySelector('#title').value,
          author = document.querySelector('#author').value,
          isbn = document.querySelector('#isbn').value;

    const book = new Book(title, author, isbn);

    const ui = new UI()

    // Checking if value exsits in book
    if( title === '' || author === '' || isbn === '' ){

        ui.showAlert('Please fill in all fields', 'alert-danger');

    } else if(bookChecker(isbn)) {
    
        ui.showAlert('Book with same ISBN Number already exists', 'alert-danger')

    } else {

        ui.addBookToList(book)

        Store.addBook(book)
        
        ui.showAlert('Book Added', 'alert-success')

        ui.clearList()        
    }

    e.preventDefault()
})

document.querySelector('#book-list').addEventListener('click', e=>{
    const ui = new UI()
    ui.deleteBook(e.target)
    ui.clearList()
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})

function bookChecker(isbn){

    const bookCheck = Store.getBook()

    for(let book=0; book < bookCheck.length; book++){
        if(bookCheck[book].isbn === isbn){
            return true
        }
    }
    return false
}