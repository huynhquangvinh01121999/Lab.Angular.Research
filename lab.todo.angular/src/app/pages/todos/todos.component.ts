import { Component, OnInit } from '@angular/core';
import { Todo, TODOS } from '../../services/todo';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos: Todo[] = []
  selectedTodo?: Todo
  constructor(
    private todosService: TodosService
  ) { }

  ngOnInit(): void {
    this.getTodos()
    this.getTodoFromApi()
    this.getTodoByIdFromApi(2)
  }

  onSelectedTodo(todo: Todo): void {
    this.selectedTodo = todo
  }

  // getTodos: Todo[] {
  //   this.todos = this.TodosService.getTodos()
  // }

  getTodos(): void {
    this.todosService.getTodos().subscribe(todos => this.todos = todos)
  }

  getTodoFromApi(): void {
    this.todosService.getTodosFromApi().subscribe(todos => console.log(todos));
  }

  getTodoByIdFromApi(id: number): void {
    this.todosService.getTodoByIdFromApi(id).subscribe(todo => console.log(todo));
  }
}
