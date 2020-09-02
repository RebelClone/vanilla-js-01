// Storage Controller
const StorageCtrl = (function(){
    const callStorage = ()=>{
        let data;
        if( localStorage.getItem('data') === null ){
            data = []
        }
        else {
            data = JSON.parse(localStorage.getItem('data'))
        }
        return data
    }
    return {
        
        storeItem: (item)=>{
            let data = callStorage()
            data.push(item)
            localStorage.setItem('data',JSON.stringify(data))
        },
        getItemStorage: ()=>{
            return callStorage()
        },
        updateLocalStorage: update=>{
            let data = callStorage()
            data.forEach(item=>{
                if(item.id === update.id){
                    item.name = update.name
                    item.calories = update.calories
                }
            })
            localStorage.setItem('data',JSON.stringify(data))

        },
        deleteLocalStorage:(id)=>{
            let data = callStorage()

            data.forEach((item,index,arr)=>{
                if(item.id===id){
                    arr.splice(index,1)
                }
            })

            localStorage.setItem('data',JSON.stringify(data))

        },
        clearStorage:()=>{
            localStorage.clear()
        }
    }

})();


// Item Controller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories
    }

    // State
    const data = {
        // items: [
        //     {id:0, name:'meal-0', calories: 1000},
        //     {id:1, name:'meal-1', calories: 1000},
        //     {id:2, name:'meal-2', calories: 1000}
        // ],
        items: StorageCtrl.getItemStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: ()=> data.items,
        addItem: (name, calories)=>{
            let ID;
            if(data.items.length>0){
                ID = data.items[data.items.length-1].id + 1
            } else {
                ID = 0
            }

            calories  = parseInt(calories)

            newItem = new Item(ID, name, calories)

            data.items.push(newItem)

            return newItem
        },
        getItemById: id=>{
            let found = null
            data.items.forEach((item)=>{
                if(item.id === id){
                    found = item
                }
            })
            return found
        },
        setCurrentItem: item=>{
            data.currentItem = item
        },
        getTotalCalories: ()=>{
            let total = 0;
            data.items.forEach(({calories})=>{
                total += calories
            })
            data.totalCalories = total
            return total
        },
        getCurrentItems:()=>data.currentItem,
        updateItem: (name,calories)=>{
            let found = null;
            calories = parseInt(calories)
            data.items.forEach(item=>{
                if( item.id === data.currentItem.id ){
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })
            return found
        },
        deleteItem: id=>{
            data.items.forEach((item,index,arr)=>{
                if(item.id===id){
                    arr.splice(index,1)
                }
            })
            data.currentItem = null
        },
        clearData: ()=>{
            data.items = []
            data.currentItem = null
            data.totalCalories = 0
        },
        logData: ()=> data
    }


})();


// UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItem: '#item-list li',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemcalories: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backbtn: '.back-btn',
        clearAll: '.clear-btn'
    }


    return {

        populateItems: items=>{
            let html = ''
            
            items.forEach(item=>{
                html += `
            <li id="item-${item.id}" class="collection-item">
                <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
                `;
            })
            document.querySelector(UISelectors.itemList).innerHTML =  html
        },
        getItemInput: ()=>({
            name: document.querySelector(UISelectors.itemName).value,
            calories: document.querySelector(UISelectors.itemcalories).value
        }),
        addListItem: item=>{

            let html = `
                <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            const li  = document.createElement('li')
            li.id = `item-${item.id}`
            li.className = 'collection-item'
            li.innerHTML = html
            
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem:item=>{
           let listItem = document.querySelectorAll(UISelectors.listItem)

           listItem.forEach(list=>{
               const itemID = list.getAttribute('id')

               if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                `;
            }
           })
        },
        clearInput: ()=>{
            document.querySelector(UISelectors.itemName).value = ''
            document.querySelector(UISelectors.itemcalories).value = ''
        },
        hideList: ()=>{
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        unHideList: ()=>{
            document.querySelector(UISelectors.itemList).style.display = 'block'
        },
        totalCalories: total=>{
            document.querySelector(UISelectors.totalCalories).innerHTML = total
        },
        clearEditState: ()=>{
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backbtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: ()=>{
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backbtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        addItemForm: ()=>{
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItems().name
            document.querySelector(UISelectors.itemcalories).value = ItemCtrl.getCurrentItems().calories
            UICtrl.showEditState()
        },
        deleteListItem:(id)=>{
            document.querySelector(`#item-${id}`).remove()
        },
        clearAllItems: ()=>{
            const liAll = document.querySelectorAll(UISelectors.listItem)
            liAll.forEach(list=>{
                list.remove()
            })
            UICtrl.hideList()
        },
        getSelectors: ()=> UISelectors

    }

})();


// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

    const loadEventListeners = ()=>{
        const UISelectors = UICtrl.getSelectors()

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.addEventListener('keypress',e=>{
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false
            }
        })
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
        document.querySelector(UISelectors.backbtn).addEventListener('click', (e)=>{
            UICtrl.clearEditState()
            e.preventDefault()
        })
        document.querySelector(UISelectors.clearAll).addEventListener('click', clearListItem)
    }

    const itemAddSubmit = e=>{

        const input = UICtrl.getItemInput()

        if(input.name !== '' && input.calories !== ''){

            const newItem = ItemCtrl.addItem(input.name, input.calories)

            UICtrl.unHideList()

            UICtrl.addListItem(newItem)

            const totalCalories = ItemCtrl.getTotalCalories()

            UICtrl.totalCalories(totalCalories)

            StorageCtrl.storeItem(newItem)

            UICtrl.clearInput();
        }

        e.preventDefault()
    }

    const itemEditClick = e=>{

        if(e.target.classList.contains('edit-item')){
            const liID = e.target.parentElement.parentElement.id;
            const idArr = liID.split('-')
            const id = parseInt(idArr[1])

            const itemEdit = ItemCtrl.getItemById(id)
            ItemCtrl.setCurrentItem(itemEdit)

            UICtrl.addItemForm()
        }

        e.preventDefault()
    }

    const itemUpdateSubmit = e=>{

        const input = UICtrl.getItemInput();

        const update = ItemCtrl.updateItem(input.name, input.calories)

        UICtrl.updateListItem(update)

        const total = ItemCtrl.getTotalCalories()
        UICtrl.totalCalories(total)

        StorageCtrl.updateLocalStorage(update)
        
        UICtrl.clearEditState()

        e.preventDefault()
    }

    const itemDeleteSubmit = e=>{

        const currentItem  = ItemCtrl.getCurrentItems();

        ItemCtrl.deleteItem(currentItem.id)

        UICtrl.deleteListItem(currentItem.id)

        StorageCtrl.deleteLocalStorage(currentItem.id)

        const totalCalories = ItemCtrl.getTotalCalories()

        UICtrl.totalCalories(totalCalories)

        UICtrl.clearEditState()

        if(ItemCtrl.getItems().length === 0){
            UICtrl.hideList()
        }

        e.preventDefault()
    }

    const clearListItem = e=>{

        ItemCtrl.clearData()

        UICtrl.clearAllItems()

        UICtrl.clearEditState()

        StorageCtrl.clearStorage()

        const totalCalories = ItemCtrl.getTotalCalories()

        UICtrl.totalCalories(totalCalories)

        e.preventDefault()
    }

    return {
        init: ()=>{

            UICtrl.clearEditState()

            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList()
            } else {
                UICtrl.unHideList()
                UICtrl.populateItems(items)
            }
            const totalCalories = ItemCtrl.getTotalCalories()

            UICtrl.totalCalories(totalCalories)

            loadEventListeners()
        }

    }


})(ItemCtrl, UICtrl, StorageCtrl);

App.init()