import { TodoService } from "./../../services/todo.service";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Todo } from "src/app/models/todo.model";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"]
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todos$ = this.todoService.todos$;
  }

  onChangeTodoStatus(todo: Todo) {
    this.todoService.changeTodoStatus(todo.id, todo.isCompleted);
  }

  onEditTodo(todo: Todo) {
    this.todoService.editTodo(todo);
  }

  onDeleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo);
  }
}
