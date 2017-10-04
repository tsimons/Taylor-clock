var Clock = (function () {
'use strict';

/**
 * Clock Class
 * @class Clock
 * @param {Number} hours the current hours of the clock
 * @param {Number} minutes the current minutes of the clock
 * Transform a date object in to a 12 hour analog clock
 */
class Clock {
  constructor(timeString) {
    this.subscribers = [];
    this.date = new Date();
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      this.date.setHours(hours);
      this.date.setMinutes(minutes);
    }

    this.start();
  }

  /**
   * The current minutes
   * @return {Number}
   */
  get minutes() {
    return this.date.getMinutes();
  }

  /**
   * The current hours
   * @return {Number}
   */
  get hours() {
    const hour = this.date.getHours();
    if (hour > 12) {
      return hour - 12;
    }

    return hour;
  }

  /**
   * uses the current minutes to determine the clockwise degree from 0 of the minute hand
   * @return {Number} the degree from 0
   * @example
   *   // given a clock set to 15 minutes
   *   clock.getDegreesForMinutes();
   *   // => 90
   */
  getDegreesForMinutes() {
    return this.minutes * 6;
  }

  /**
   * uses the current hours to determine the clockwise degree from 0 of the hour hand
   * @return {Number} the degree from 0
   * @example
   *   // given a clock set to 6 o'clock
   *   clock.getDegreesForHours();
   *   // => 180
   */
  getDegreesForHours() {
    return this.hours * 30;
  }

  /**
   * gets the clockwise degree between the hour and minutes hand
   * @return {Number} the degree between the 2 hands
   * @example
   * // given a clock set to 3:30
   * clock.getDegreesBetween();
   * // => 90
   */
  getDegreesBetween() {
    return Math.abs(
      this.minutes - (this.hours * 5)
    ) * 6;
  }

  /**
   * @callback ClockSubscribeCallback
   * @param {Clock} the clock instance that updated
   */

  /**
   * Subscribe to when the time updates
   * @param  {ClockSubscribeCallback} cb the function to be called when the time udpates
   */
  subscribe(cb) {
    this.subscribers = [...this.subscribers, cb];
    cb(this);
  }

  /**
   * Add 1 to the curent minutes and notify subscribers
   * @return {[type]} [description]
   */
  tick() {
    this.date.setMinutes(this.date.getMinutes() + 1);
    this.notify();
  }

  /**
   * Calls all subscribed callbacks, passing the clock instance to each function
   */
  notify() {
    this.subscribers.forEach((cb) => cb(this));
  }

  /**
   * Starts updating the clock each minute
   */
  start() {
    setInterval(() => this.tick(), 60000);
  }
}

const twoDigitNumber = num => num < 10 ? `0${num}` : num;
const timePattern = /\d{2}:\d{2}/;

/**
 * @class ClockElement
 * DOM bindings for the Clock Class
 */
class ClockElement {
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

  handleInputChange() {
    if (!this.refs.clockInput.value.match(timePattern)) { return false; }

    this.updateTime(this.refs.clockInput.value);
  }

  updateTime(timeSring) {
    this.clock = new Clock(timeSring);
    this.clock.subscribe(() => this.updateDegrees());
  }

  updateDegrees() {
    this.refs.minutesElement.innerHTML = this.clock.getDegreesForMinutes();
    this.refs.hoursElement.innerHTML = this.clock.getDegreesForHours();
    this.refs.bothElement.innerHTML = this.clock.getDegreesBetween();
  }
}

new ClockElement(document.querySelector('#clock'));

return ClockElement;

}());
