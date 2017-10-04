import Clock from '../clock';
jest.useFakeTimers();

describe('Clock class', function () {
  describe('init', function () {
    it('accepts dates in the HH:MM format', function () {
      const date = '01:50';
      const clock = new Clock(date);

      expect(clock.hours).toEqual(1);
      expect(clock.minutes).toEqual(50);
    });

    it('defaults to the current time when nothing is provided', function () {
      const date = new Date();
      const clock = new Clock();
      expect(clock.minutes).toEqual(date.getMinutes());
      expect(clock.hours).toEqual(date.getHours());
    });
  });

  describe('getDegreesForMinutes', function () {
    let clock;
    function minuteTest(timeString, degree) {
      clock = new Clock(timeString);
      expect(clock.getDegreesForMinutes()).toEqual(degree);
    }

    it('returns the clockwise degree for the minute hand', function () {
      let minute = 0;
      while(minute < 60) {
        minuteTest(`01:${minute}`, minute * 6);
        minute += 1;
      }
    });
  });

  describe('getDegreesForHours', function () {
    let clock;
    function hourTest(timeString, degree) {
      clock = new Clock(timeString);
      expect(clock.getDegreesForHours()).toEqual(degree);
    }

    it('returns the clockwise degree for the minute hand', function () {
      let hour = 0;
      while(hour <= 12) {
        hourTest(`${hour}:00`, hour * 30);
        hour += 1;
      }
    });
  });

  describe('subscribe', function () {
    it('notifies the subscriber on each tick', function () {
      let cb = jest.fn();
      const clock = new Clock('01:55');
      clock.subscribe(cb);
      clock.tick();
      expect(cb).toHaveBeenCalledWith(clock);
    });
  });

  describe('tick', function () {
    it('increments the date', function () {
      const clock = new Clock('01:59');
      clock.tick();
      expect(clock.hours).toEqual(2);
      expect(clock.minutes).toEqual(0);
    });
  });

  describe('start', function () {
    it('increments time every minute', function () {
      const clock = new Clock('01:59');
      jest.runTimersToTime(60001);
      expect(clock.hours).toEqual(2);
      expect(clock.minutes).toEqual(0);
    });
  });
});
