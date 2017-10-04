jest.mock('../clock');
import ClockElement from '../index';
import Clock from '../clock';

describe('ClockElement', function () {
  let clock;
  beforeEach(function () {
    document.body.innerHTML = `<div id="clock" class="clock">
      <div class="clock__input-container">
        <input type="text" class="clock__input" pattern="\d{2}:\d{2}" >
      </div>

      <div class="clock__hours-degree-container">
        Clockwise hours degrees: <span class="clock__hours-degree"></span>
      </div>
      <div class="clock__minutes-degree-container">
        Clockwise minutes degrees: <span class="clock__minutes-degree"></span>
      </div>
      <div class="clock__both-degree-container">
        Clockwise degrees between both hands: <span class="clock__both-degree"></span>
      </div>

    </div>`;

    clock = new ClockElement(document.getElementById('clock'));
  });

  describe('handleInputChange', function () {
    it('does nothing if the clock input is invalid', function () {
      clock.refs.clockInput.value = '1:55';
      const updateSpy = jest.fn();
      clock.updateTime = updateSpy;

      clock.handleInputChange.call(clock);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('updates time when the value is valid', function () {
      clock.refs.clockInput.value = '01:55';
      const updateSpy = jest.fn();
      clock.updateTime = updateSpy;

      clock.handleInputChange.call(clock);
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('updateTime method', function () {
    it('creates a new Clock instance', function () {
      clock.updateTime();
      expect(clock.clock).toBeInstanceOf(Clock);
    });

    it('subscribes to the clock', function () {
      clock.updateTime();
      expect(clock.clock.subscribe).toHaveBeenCalled();
    });
  });

  describe('updateDegrees', function () {
    it('updates the HTML with the current degrees of the clock', function () {
      clock.updateDegrees();

      expect(clock.clock.getDegreesForMinutes).toHaveBeenCalled();
      expect(clock.clock.getDegreesForHours).toHaveBeenCalled();
      expect(clock.clock.getDegreesBetween).toHaveBeenCalled();
    });
  });
});