import { Component, OnInit, Input } from '@angular/core';
import { Todo } from '../../services/todo';

@Component({
  selector: 'app-quickview-detail',
  templateUrl: './quickview-detail.component.html',
  styleUrls: ['./quickview-detail.component.css']
})
export class QuickviewDetailComponent implements OnInit {

  @Input() todo?: Todo

  constructor() { }

  ngOnInit(): void {
  }

}
