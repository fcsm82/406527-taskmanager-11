import {getTasksByFilter} from "../util/filter";
import {FilterType} from "../util/consts";

export default class Tasks {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  get tasks() {
    return this._tasks;
  }

  set tasks(tasks = []) {
    this._tasks = tasks;
    this._callHandlers(this._dataChangeHandlers);
  }

  getFilteredTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeTask(id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateTask(id, task) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
