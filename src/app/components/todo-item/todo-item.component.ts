import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Todo } from "src/app/models/todo.model";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

const fadeStrikeThroughAnimation = trigger("fadeStrikeThrough", [
  state(
    "active",
    style({
      fontSize: "18px",
      color: "black"
    })
  ),
  state(
    "completed",
    style({
      fontSize: "17px",
      color: "lightgrey",
      textDecoration: "line-through"
    })
  ),
  transition("active <=> completed", [animate(250)])
]);

@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"],
  animations: [fadeStrikeThroughAnimation]
})
export class TodoItemComponent implements OnInit {
  isHovered = false;
  isEditing = false;

  @Input() todo: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  constructor() {}

  ngOnInit() {}

  changeTodoStatus() {
    this.changeStatus.emit({
      ...this.todo,
      isCompleted: !this.todo.isCompleted
    });
  }

  onSubmitEdit(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const { keyCode } = event;
    event.preventDefault();
    if (keyCode === 13) {
      if (this.todo.content.trim() === "") {
        alert("Công việc không được để trống! Vui lòng nhập lại!");
      } else {
        this.editTodo.emit(this.todo);
        this.isEditing = false;
      }
    }
  }

  removeTodo() {
    this.deleteTodo.emit(this.todo);
  }
}
