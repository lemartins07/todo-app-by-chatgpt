(function (global) {
  'use strict';

  /** ============================
   * 🔹 Estado e DOM
   * ============================ */
  function TodoApp() {
    // Estado da aplicação
    this.state = {
      todos: [
        //{ texto: 'lavar a louça', concluida: false },
        //{ texto: 'Comprar ração', concluida: true }
      ]
    };

    // Referências de elementos
    this.DOM = {
      input: document.querySelector('#tarefa'),
      button: document.querySelector('#adicionar'),
      lista: document.querySelector('#lista-tarefas'),
      status: document.querySelector('#status'),
      form: document.querySelector('#formTodo'),
      inputStatus: document.querySelector('#inputStatus')
    };
  }

  /** ============================
   * 🔸 Ciclo de vida
   * ============================ */
  TodoApp.prototype = {
    // 🔸 Inicialização
    init: function () {
      this.obterTodosDoCache();
      this.bindEvents();
      this.render();
      console.log('App inicializado 🚀');
    },

    /** ============================
     * 🔸 Controller (Eventos)
     * ============================ */
    bindEvents: function () {
      this.DOM.button.addEventListener('click', (event) => this.validarTarefa(event));
      this.DOM.form.addEventListener('submit', (event) => this.validarTarefa(event));
    },

    /** ============================
     * 🔸 Services (Regras de negócio)
     * ============================ */

    validarTarefa: function (event) {
      event.preventDefault();

      const texto = this.DOM.input.value.trim();
      const jahTemTexto = this.state.todos.some(
        (t) => t.texto.toLowerCase() === texto.toLowerCase()
      );

      if (texto && !jahTemTexto) {
        this.adicionarTarefa({ texto, concluido: false });
        this.DOM.input.value = '';

        this.hideInputError();
        return;
      }

      this.showInputError();
    },

    adicionarTarefa: function (todo) {
      this.salvarTodoNoEstado(todo);
      this.salvarNoCache();
      this.render();
    },

    toggleTarefa: function (index) {
      this.state.todos[index].concluida = !this.state.todos[index].concluida;
      this.render();
    },

    salvarNoCache: function () {
      const jsonTodos = JSON.stringify(this.state.todos);
      localStorage.setItem('todos', jsonTodos);
    },

    obterTodosDoCache: function () {
      const todosDoCache = localStorage.getItem('todos');
      const todosParseados = JSON.parse(todosDoCache);
      todosParseados.forEach((todo) => this.salvarTodoNoEstado(todo));
    },

    salvarTodoNoEstado: function (todo) {
      this.state.todos.push(todo);
    },

    deletarTarefaDoEstado: function (index) {
      this.state.todos.splice(index, 1);
    },

    /** ============================
     * 🔸 View (Renderização e UI)
     * ============================ */
    render: function () {
      this.DOM.lista.innerHTML = '';
      const fragment = document.createDocumentFragment();

      this.state.todos.forEach((todo, index) => {
        const li = this.createTodoItem(todo, index);

        fragment.appendChild(li);
      });

      this.DOM.lista.appendChild(fragment);
    },

    createTodoItem: function (todo, index) {
      const li = document.createElement('li');
      const btnDelete = this.createDeleteButton();

      li.textContent = todo.texto;
      li.className = todo.concluida ? 'feito' : '';

      btnDelete.addEventListener('click', (event) => {
        event.stopPropagation();
        this.deletarTarefaDoEstado(index);
        this.salvarNoCache();
        this.render();
      });

      li.addEventListener('click', () => this.toggleTarefa(index));

      li.appendChild(btnDelete);

      return li;
    },

    createDeleteButton: function () {
      const button = document.createElement('button');
      button.textContent = 'X';

      return button;
    },

    showInputError: function () {
      this.DOM.inputStatus.classList.add('active', 'error');
      this.DOM.inputStatus.textContent = 'Task already exists.';
    },

    hideInputError: function () {
      this.DOM.inputStatus.classList.remove('active', 'error');
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
