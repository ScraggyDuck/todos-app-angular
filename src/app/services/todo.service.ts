import { LocalStorageService } from "./local-storage.service";
import { Filter } from "./../models/filtering.model";
import { Todo } from "./../models/todo.model";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TodoService {
  private static readonly TodoStorageKey = "todos";
  private todos: Todo[];
  private filteredTodos: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  fetchFromLocalStorage() {
    this.todos =
      this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  addTodo(content: string) {
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex(t => t.id === id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  editTodo(todo: Todo) {
    this.changeTodo(todo);
  }

  deleteTodo(todo: Todo) {
    this.changeTodo(todo, true);
  }

  toggleAll() {
    this.todos = this.todos.map(todo => ({
      ...todo,
      isCompleted: !this.todos.every(t => t.isCompleted)
    }));
    this.updateToLocalStorage();
  }

  onClearCompleted() {
    this.todos = this.todos.filter(t => !t.isCompleted);
    this.updateToLocalStorage();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;
    }
    if (isFiltering) {
      this.updateTodosData();
    }
  }

  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

  private changeTodo(todo: Todo, isRemoveTodo: boolean = false) {
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (isRemoveTodo) {
      this.todos.splice(index, 1);
    } else {
      this.todos.splice(index, 1, todo);
    }
    this.updateToLocalStorage();
  }
}
