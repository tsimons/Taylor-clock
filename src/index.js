import Clock from './clock';

const twoDigitNumber = num => num < 10 ? `0${num}` : num;
const timePattern = /\d{2}:\d{2}/;

/**
 * @class ClockElement
 * DOM bindings for the Clock Class
 */
export default class ClockElement {
  constructor(ele) {
    if (!ele) { return; }

    this.refs = {};
    this.refs.clockElement = ele;
    this.refs.clockInput = this.refs.clockElement.querySelector('.clock__input');

    this.refs.hoursElement = this.refs.clockElement.querySelector('.clock__hours-degree');
    this.refs.minutesElement = this.refs.clockElement.querySelector('.clock__minutes-degree');
    this.refs.bothElement = this.refs.clockElement.querySelector('.clock__both-degree');

    // call this before adding the events listeners to avoid a change event firing needlessly
    this.updateTime();
    this.refs.clockInput.value = `${twoDigitNumber(this.clock.hours)}:${twoDigitNumber(this.clock.minutes)}`;

    
    this.refs.clockInput.addEventListener('input', () => this.handleInputChange());
  }

  /**
   * Handles updates from the input element
   * If the value is not in the HH:MM format, it does not update the date
   */
  handleInputChange() {
    if (!this.refs.clockInput.value.match(timePattern)) { return false; }

    this.updateTime(this.refs.clockInput.value);
  }

  /**
   * Given a timestamp, creates and subscribes to a new clock class
   * @param  {String} timeSring HH:MM format
   */
  updateTime(timeSring) {
    this.clock = new Clock(timeSring);
    this.clock.subscribe(() => this.updateDegrees());
  }

  /**
   * Update the DOM nodes that display the degrees for the clock hands
   */
  updateDegrees() {
    this.refs.minutesElement.innerHTML = this.clock.getDegreesForMinutes();
    this.refs.hoursElement.innerHTML = this.clock.getDegreesForHours();
    this.refs.bothElement.innerHTML = this.clock.getDegreesBetween();
  }
}

new ClockElement(document.querySelector('#clock'));
