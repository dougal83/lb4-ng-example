import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TodoControllerService } from '../api';
import { Todo } from '../api/model/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: Todo[];
  addTodoForm: FormGroup;
  addTodoFormDefaults: Todo = {
    title: '',
    desc: '',
    isComplete: false,
  };

  constructor(
    private todosService: TodoControllerService,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getTodos();
  }

  private buildForm(): void {
    this.addTodoForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: [''],
      isComplete: [false],
    });
  }

  getTodos() {
    this.todosService
      .todoControllerFind()
      .subscribe(data => (this.todos = data), error => console.log(error));
  }

  addTodo() {
    const todo: Todo = this.addTodoForm.value;
    this.todosService.todoControllerCreate(todo).subscribe(
      res => {
        this.todos.push(res);
        this.addTodoForm.reset(this.addTodoFormDefaults);
      },
      error => console.log(error),
    );
  }

  deleteTodo(todo: Todo) {
    this.todosService.todoControllerDeleteById(todo.id).subscribe(
      () => {
        const pos = this.todos.map(elem => elem.id).indexOf(todo.id);
        this.todos.splice(pos, 1);
      },
      error => console.log(error),
    );
  }
}
