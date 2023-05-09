const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

console.log(filter);


eventListeners();

function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);


}
function clearAllTodos(){
    // Öncelikle arayüzden todoları silelim
    if(confirm("Tümünü silmek istediğinizden emin misiniz ?")){
         while(todoList.firstElementChild != null)
         {
            todoList.removeChild(todoList.firstElementChild);
         }
         localStorage.removeItem("todos");
    }
}
function filterTodos(e){ // amacımız input'a girilen texte göre liste içerisindeki veriyi eşitleyip sunmak
    // bunu yaparken kullanıcıların büyük ve küçük harf karakterler girme ihtimalleri olduğu için biz her türlü
    // bu durumu küçük harfe çevirerek değeri alıyoruz.
    // hali hazırdaki liste ieçrisinde kullanıcı tarafından girilen değere sahip data varsa displayini block yoksa none yapıyoruz.
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue)=== -1)
        {
            listItem.setAttribute("style","display : none !important");
        }
        else
        {
            listItem.setAttribute("style","display:block");
        }
    })

}
function addTodo(e){

    const newTodo = todoInput.value.trim(); // boşluksuz değeri almak
    if(newTodo === "")
    {
        showAlert("danger","Lütfen yapılması plananan işi giriniz.!");

    }
    else
    {
        
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Ekleme işlemi başarılı bir şekilde gerçekleşmiştir.");
       
    }
    e.preventDefault();

   


}

// todos keyine sahip storage'da veri varsa getir, yoksa boş bir şekilde array  oluştur.
// boş [] veya dolu [...] bir şekilde dönecek. 
getTodosFromStorage = () =>{
    let todos;
    if(localStorage.getItem("todos") === null)
    {
        todos = [];
    }
    else
    {
        todos = JSON.parse(localStorage.getItem("todos"));
   
    }
    return todos;
}
addTodoToStorage = (newTodo) => {
  let todos = getTodosFromStorage();
  todos.push(newTodo);

  localStorage.setItem("todos",JSON.stringify(todos));


}

function addTodoToUI(newTodo){
//     <li class="list-group-item d-flex justify-content-between">
//          Todo 1
//          <a href = "#" class ="delete-item">
//              <i class = "fa fa-remove"></i>
//           </a>

//      </li> 
    //list-item oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    // link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>"; // i added


    listItem.appendChild(document.createTextNode(newTodo)); // inputa kullanıcı tarafından girilen text
    // listItem'a oluşturduğumuz <a></a> elementini ekleyelim.
    listItem.appendChild(link);

    // TodoList'e listItem'ı eklemek,, todoList'i daha önce yukarıda querySelector ile seçmiştik
    todoList.appendChild(listItem);
    // ekleme işlemi yapıldıktan sonra kullanıcının girdiği değer input alanında kalmasın temizlensin
    todoInput.value = "";

}
function deleteTodo(e){
    if(e.target.className === "fa fa-remove")
    {
        // tıklanan elementin classı fa fa-remove ise iki üst parentını yani li elementini komple silmemiz gerekli

        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Silme işlemi başarılı bir şekilde gerçekleşmiştir.");
    }
}
function loadAllTodosToUI()
{
    let todos = getTodosFromStorage(); // todolar storage'dan alındı.
    todos.forEach(todo => {
        addTodoToUI(todo);
    });

}
function deleteTodoFromStorage(deleteTodo)
{
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deleteTodo)
        {
            todos.splice(index,1);
        }
    })
    // silme işlemi bittikten sonra storage ı son şekliyle güncelleyelim.
    localStorage.setItem("todos",JSON.stringify(todos));
}


showAlert = (type,message) => {
    const alertElement = document.createElement("div");
    alertElement.className = `alert alert-${type}`;
    alertElement.appendChild(document.createTextNode(message));
    firstCardBody.appendChild(alertElement);
    setTimeout(()=>{
        alertElement.remove();
    },2000);
    
}
