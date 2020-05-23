import API from "./api.js";
import Board from "./components/board/board";
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";
import SiteMenu, {MenuItem} from "./components/menu/site-menu";
import Statistics from "./components/statistics";
import TasksModel from "./models/tasks";
import {render} from "./util/dom-util";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(AUTHORIZATION);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenu();
const statisticsComponent = new Statistics({tasks: tasksModel, dateFrom, dateTo});

const boardComponent = new Board();
const boardController = new BoardController(boardComponent, tasksModel);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuComponent);
filterController.render();

render(siteMainElement, boardComponent);

render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.tasks = tasks;
    boardController.render();
  });
