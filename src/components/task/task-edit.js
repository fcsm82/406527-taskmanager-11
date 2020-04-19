import {COLORS, DAYS, MONTH_NAMES} from "../../util/consts";
import {createElement, formatTime} from "../../util/util";
import {createColorsMarkup} from "./task-color";
import {createRepeatingDaysMarkup} from "./repeating-days";

const toggleYesNo = (element) => {
  return element ? `yes` : `no`;
};

const showDeadline = (isDateShowing, date, time) => {
  return isDateShowing ?
    `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>`
    : ``;
};

const getRepeatingTaskMarkup = (isRepeatingTask, repeatingDaysMarkup) => {
  return isRepeatingTask ?
    `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${repeatingDaysMarkup}
        </div>
      </fieldset>`
    : ``;
};

export const createTaskEditTemplate = ({description, dueDate, color, repeatingDays}) => {
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${toggleYesNo(isDateShowing)}</span>
                </button>
                ${showDeadline(isDateShowing, date, time)}
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${toggleYesNo(isRepeatingTask)}</span>
                </button>
                ${getRepeatingTaskMarkup(isRepeatingTask, repeatingDaysMarkup)}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${createColorsMarkup(COLORS, color)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
