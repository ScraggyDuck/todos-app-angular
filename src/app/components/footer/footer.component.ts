import { TodoService } from "./../../services/todo.service";
import { Observable, Subject } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FilterButton, Filter } from "src/app/models/filtering.model";
import { Todo } from "src/app/models/todo.model";
import { takeUntil, map } from "rxjs/operators";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: "All", isActive: true },
    { type: Filter.Active, label: "Active", isActive: false },
    { type: Filter.Completed, label: "Completed", isActive: false }
  ];

  length = 0;

  hasCompletedTodo$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.hasCompletedTodo$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)),
      takeUntil(this.destroy$)
    );

    this.todoService.length$
      .pipe(takeUntil(this.destroy$))
      .subscribe(length => (this.length = length));
  }

  filter(type: Filter) {
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  onClearCompleted() {
    this.todoService.onClearCompleted();
  }

  private setActiveFilterBtn(type: Filter) {
    this.filterButtons.forEach(btn => {
      btn.isActive = btn.type === type;
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
