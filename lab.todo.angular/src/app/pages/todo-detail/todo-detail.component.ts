import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TodosService } from '../../services/todos.service';
import { Todo } from '../../services/todo';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  todo?: Todo

  constructor(
    private route: ActivatedRoute,
    private todoService: TodosService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHeroById()
  }

  getHeroById(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));  // get id from parameter
    this.todoService.getTodoById(id)
      .subscribe(todo => this.todo = todo)
  }

  goBack(): void {
    this.location.back()
  }

}
