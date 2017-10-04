export default class Clock {
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

  getDegreesForMinutes() {
    return this.minutes * 6;
  }

  getDegreesForHours() {
    return this.hours * 30;
  }

  subscribe(cb) {
    this.subscribers = [...this.subscribers, cb];
  }

  tick() {
    this.date.setMinutes(this.date.getMinutes() + 1);
    this.notify();
  }

  notify() {
    this.subscribers.forEach((cb) => cb(this))
  }

  start() {
    setInterval(() => this.tick(), 60000);
  }

  get minutes() {
    return this.date.getMinutes();
  }

  get hours() {
    return this.date.getHours();
  }


}