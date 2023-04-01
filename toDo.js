const input = document.querySelector("#todo-creation");
const btn = document.querySelector("#create-todo-btn");
const output = document.querySelector("#output");
const usersOutput = document.querySelector("#users-output");
const clearCurrentUser = document.querySelector("#clear-current-user");
const searchTodoInput = document.querySelector("#todo-search");
const scrollBtn = document.querySelector("#scroll-up");
const clearSearch =document.querySelector("#clear-search-btn");

let getTodos = localStorage.getItem("todos");

let todos = getTodos ? JSON.parse(getTodos) : [];

let users = [];
let currentUser = undefined;

renderTodos(todos);

btn.onclick = () => {
  const todo = {
    text: input.value,
    done: false,
  };

  input.value = "";

  todos.push(todo);
  console.log(todos);

  renderTodos(todos);
};

function renderTodos(todosToRender) {
  output.innerHTML = "";
  todosToRender.forEach((todo, i) => {
    output.innerHTML += `
        <div class="todo ${todo.done && "done"}">
        <div>
            <span>${i + 1}.</span>
            <input type="checkbox" ${
              todo.done && "checked"
            } class="todo-checkbox"/>
            <span>${todo.text}</span>
            </div>
            <button class="delete-btn">Delete</button>
        </div>
        `;

    localStorage.setItem("todos", JSON.stringify(todos));
    // console.log(todos, "todos from LS");
  });

  const checkboxes = [...document.querySelectorAll(".todo-checkbox")];

  checkboxes.forEach((checkbox, i) => {
    checkbox.onchange = () => {
      // alert("!!!")
      const todo = todos[i];
      changeTodo(todos.text, !todo.done);
    };
  });

  const deleteBtns = [...document.querySelectorAll(".delete-btn")];

  deleteBtns.forEach((button, i) => {
    button.onclick = () => {
      const todo = todos[i];
      deleteTodo(todo.text);
    };
  });
}

function changeTodo(text, newDone) {
  todos = todos.map((todo) => {
    if (text === todo.text) {
      return { text, done: newDone };
    }
    return todo;
  });

  renderTodos(currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos);
};

function deleteTodo(text) {
  todos = todos.filter((todo) => text !== text);
  renderTodos(currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos);
};

function searchTodo(value) {
  const filteredTodos = currentUser
    ? todos.filter(
        (todo) => todo.text.includes(value) && todo.userId === currentUser.id
      )
    : todos.filter((todo) => todo.text.includes(value));

  renderTodos(filteredTodos);
};

function getServerTodos() {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((json) => {
      const transformedTodos = json.map((todo) => {
        return {
          text: todo.title,
          done: todo.completed,
          userId: todo.userId,
          id: todo.id,
        };
      });
      console.log(transformedTodos);

      todos = transformedTodos;
      renderTodos(todos);
    });
}
getServerTodos();

function getServerUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((usersFromServer) => {
      console.log(usersFromServer);

      users = usersFromServer;

      renderUsers();
    });
}
getServerUsers();

function renderUsers() {
  usersOutput.innerHTML = "";

  users.forEach((user) => {
    usersOutput.innerHTML += `
    <div class="users-btns">
    <button class="user-todos-btn">${user.name}</button>
    </div>
    `;
  });

  const userBtns = [...document.querySelectorAll(".user-todos-btn")];

  userBtns.forEach((el, i) => {
    el.onclick = (event) => {
      // alert(i);
      searchTodoInput.value = "";
      currentUser = users[i];
      console.log(currentUser);
      clearCurrentUser.disabled = false;

      userBtns.forEach((btn) => btn.classList.remove("active-user-button"));

      event.target.classList.add("active-user-button")

      const todosOfCurrentUser = todos.filter(
        (todo) => todo.userId === currentUser.id
        // console.log(todosOfCurrentUser);
      );

      renderTodos(todosOfCurrentUser);
    };
  });
};

clearCurrentUser.disabled = true;

clearCurrentUser.onclick = () => {
  currentUser = undefined;
  clearCurrentUser.disabled = true;
  renderTodos(todos);
};

searchTodoInput.oninput = () => {
  console.log(searchTodoInput.value);
  searchTodo(searchTodoInput.value)
};


// HOME
//Реалізуйте:

// 1. Кнопку, що прогортує весь контент до гори (для великої кількості todo) 
// 2. Кнопку очищення input для пошуку (кнопка має очистити value інпуту)


scrollBtn.textContent = "Scroll Up";

scrollBtn.onclick = () => {
  window.scrollTo({top: 0, behavior: "smooth"});
};

clearSearch.onclick = () => {
  searchTodoInput.value = "";
};