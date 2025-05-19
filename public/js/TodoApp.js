(function (global) {
  'use strict';

  /** ============================
   * 🔹 Estado e DOM
   * ============================ */
  function TodoApp() {
    // Estado da aplicação
    this.state = {
      todos: []
    };

    // Referências de elementos
    this.DOM = {
      inputTodo: document.querySelector('#inputTodo'),
      btnAdd: document.querySelector('#btnAdd'),
      todoList: document.querySelector('#todoList'),
      todoListEmpty: document.querySelector('#todoListEmpty'),
      createdCounter: document.querySelector('#createdCounter'),
      completedCounter: document.querySelector('#completedCounter'),
      todoForm: document.querySelector('#todoForm'),
      inputFeedback: document.querySelector('#inputFeedback'),
      toasty: document.querySelector('#toasty'),
      toastyText: document.querySelector('#toastyText'),
      toastyIcon: document.querySelector('#toastyIcon')
    };
  }

  /** ============================
   * 🔸 Ciclo de vida
   * ============================ */
  TodoApp.prototype = {
    // 🔸 Inicialização
    init: function () {
      console.log(this.state.todos);
      this.getTodosFromCache();
      this.bindEvents();
      this.render();
      console.log('App inicializado 🚀');
    },

    /** ============================
     * 🔸 Controller (Eventos)
     * ============================ */
    bindEvents: function () {
      this.DOM.btnAdd.addEventListener('click', (event) => this.validateTodo(event));
      this.DOM.todoForm.addEventListener('submit', (event) => this.validateTodo(event));
      this.DOM.toastyIcon.addEventListener('click', () => this.hideToasty());
    },

    /** ============================
     * 🔸 Services (Regras de negócio)
     * ============================ */

    validateTodo: function (event) {
      event.preventDefault();

      const text = this.DOM.inputTodo.value.trim();
      const alreadyHaveText = this.state.todos.some(
        (t) => t.text.toLowerCase() === text.toLowerCase()
      );

      if (text && !alreadyHaveText) {
        this.addTask({ text: text, completed: false });
        this.DOM.inputTodo.value = '';

        const menssage = 'Tarefa adicionada com sucesso.';
        this.showToasty(menssage, 'success');
        return;
      }

      const message = 'Já existe uma tarefa com esse nome.';

      this.showToasty(message, 'error');
    },

    addTask: function (todo) {
      this.setTasksInState(todo);
      this.setTasksInCache();
      this.render();
    },

    toggleTask: function (index) {
      this.state.todos[index].completed = !this.state.todos[index].completed;
      this.render();
    },

    setTasksInCache: function () {
      const jsonTodos = JSON.stringify(this.state.todos);
      localStorage.setItem('todos', jsonTodos);
    },

    getTodosFromCache: function () {
      const todosFromCache = localStorage.getItem('todos');
      const parsedsTodos = JSON.parse(todosFromCache);
      parsedsTodos && parsedsTodos.forEach((todo) => this.setTasksInState(todo));
    },

    setTasksInState: function (todo) {
      this.state.todos.push(todo);
    },

    deleteTask: function (event, index) {
      event.stopPropagation();
      this.deleteTasksFromState(index);
      this.setTasksInCache();
      this.render();

      this.showToasty('Tarefa excluída com sucesso.', 'success');
    },

    deleteTasksFromState: function (index) {
      this.state.todos.splice(index, 1);
    },

    countCompletedTodos: function () {
      return this.state.todos.reduce((accumulator, currentValue) => {
        const value = currentValue.completed ? 1 : 0;
        return accumulator + value;
      }, 0);
    },

    isToatyVisible: function () {
      return this.DOM.toasty.classList.contains('toasty--show');
    },

    /** ============================
     * 🔸 View (Renderização e UI)
     * ============================ */
    render: function () {
      this.DOM.todoList.innerHTML = '';
      const fragment = document.createDocumentFragment();

      if (this.state.todos.length > 0) {
        this.hideTodoListEmpty();
        this.state.todos.forEach((todo, index) => {
          const li = this.createTodoItem(todo, index);

          fragment.appendChild(li);
        });

        this.DOM.todoList.appendChild(fragment);
      } else {
        this.showTodoListEmpty();
      }

      this.setCreatedTodos();
      this.setCompletedTodos();
    },

    createTodoItem: function (todo, index) {
      const li = document.createElement('li');
      const checkbox = this.createCheckbox();
      const text = this.createTodoText();
      const btnDelete = this.createDeleteButton();

      li.classList.add('todo-list__item');

      text.textContent = todo.text;

      li.appendChild(checkbox);
      li.appendChild(text);

      if (todo.completed) {
        li.classList.add('todo-list__item--checked');
        text.classList.add('todo-list__text--checked');
        checkbox.classList.add('todo-list__checkbox--checked');
      }

      btnDelete.addEventListener('click', (event) => this.deleteTask(event, index));

      li.appendChild(btnDelete);

      li.addEventListener('click', () => this.toggleTask(index));

      return li;
    },

    createCheckbox: function () {
      const container = document.createElement('div');
      container.classList.add('todo-list__checkbox');

      const fill = document.createElement('div');
      fill.classList.add('todo-list__fill');

      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');

      fill.appendChild(checkbox);
      container.appendChild(fill);

      return container;
    },

    createTodoText: function () {
      const span = document.createElement('span');
      span.classList.add('todo-list__text');

      return span;
    },

    createDeleteButton: function () {
      const button = document.createElement('span');
      button.classList.add('todo-list__icon', 'material-icons-outlined');
      button.textContent = 'delete';

      return button;
    },

    showToasty: function (message, type) {
      if (this.isToatyVisible()) {
        this.hideToasty();
      }

      this.DOM.toasty.classList.remove('toasty--error', 'toasty--success');

      this.DOM.toasty.classList.add('toasty--show', `toasty--${type}`);
      this.DOM.toastyText.textContent = message;

      setTimeout(() => {
        this.DOM.toasty.classList.remove('toasty--show');
      }, 3000);
    },

    hideToasty: function () {
      this.DOM.toasty.classList.remove('toasty--show');
    },

    showTodoListEmpty: function () {
      this.DOM.todoListEmpty.classList.remove('todo-empty--hidden');
    },

    hideTodoListEmpty: function () {
      this.DOM.todoListEmpty.classList.add('todo-empty--hidden');
    },

    setCreatedTodos: function () {
      this.DOM.createdCounter.textContent = this.state.todos.length;
    },

    setCompletedTodos: function () {
      const totalCompleted = this.countCompletedTodos();

      this.DOM.completedCounter.textContent = totalCompleted;
    }
  };

  /** ============================
   * 🔸 Bootstrap (Instanciação)
   * ============================ */
  global.TodoApp = new TodoApp();
})(window);

/** ============================
 * 🔸 Inicialização (após DOM pronto)
 * ============================ */
window.addEventListener('DOMContentLoaded', function () {
  window.TodoApp.init();
});
