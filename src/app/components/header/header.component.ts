import { TodoService } from "./../../services/todo.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private todoService: TodoService) {}

  ngOnInit() {}

  toggleAll() {
    this.todoService.toggleAll();
  }
}
