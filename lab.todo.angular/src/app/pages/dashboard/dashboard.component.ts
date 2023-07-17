import { Component, OnInit } from '@angular/core';
import { Todo } from '../../services/todo';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todos?: Todo[]
  constructor(private todoService: TodosService) { }

  ngOnInit(): void {
    this.getTodos()
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos)
  }
}
