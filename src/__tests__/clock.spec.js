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
      const clock = new Clock();
      // [TJS]
      // I mainly want to test that something other than undefined is returned
      // I dont want to add the 12 hour logic here
      expect(clock.minutes).toEqual(expect.any(Number));
      expect(clock.hours).toEqual(expect.any(Number));
    });
  });

  describe('hours getter', function () {
    it('returns the hour', function () {
      const clock = new Clock('01:00');
      expect(clock.hours).toEqual(1);
    });

    it('converts 24 hour number into 12 hour format', function () {
      const clock = new Clock('18:00');
      expect(clock.hours).toEqual(6);
    });
  });

  describe('minutes getter', function () {
    it('returns the current minutes', function () {
      const clock = new Clock('01:30');
      expect(clock.minutes).toEqual(30);
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

  describe('getDegreesBetween', function () {
    it('gets the degrees between the hour and minute hand when the minute hand is in front of the hour', function () {
      const clock = new Clock('03:30');
      expect(clock.getDegreesBetween()).toEqual(90);
    });

    it('gets the degrees between the hour and minute hand when the minute hand is behind the hour', function () {
      const clock = new Clock('09:30');
      expect(clock.getDegreesBetween()).toEqual(90);
    });
  });

  describe('subscribe', function () {
    it('adds the callback to the list of subscribers', function () {
      let cb = jest.fn();
      const clock = new Clock('01:55');
      clock.subscribe(cb);
      expect(clock.subscribers).toEqual(expect.arrayContaining([cb]));
    });

    it('calls the callback immediatly', function () {
      let cb = jest.fn();
      const clock = new Clock('01:55');
      clock.subscribe(cb);
      expect(cb).toHaveBeenCalledWith(clock);
    });
  });

  describe('notify', function () {
    it('calls all the subscribed callbacks', function () {
      let cb1 = jest.fn();
      let cb2 = jest.fn();
      let cb3 = jest.fn();

      const clock = new Clock('01:55');
      clock.subscribe(cb1);
      clock.subscribe(cb2);
      clock.subscribe(cb3);

      clock.notify();


      expect(cb1).toHaveBeenCalledWith(clock);
      expect(cb2).toHaveBeenCalledWith(clock);
      expect(cb3).toHaveBeenCalledWith(clock);
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
