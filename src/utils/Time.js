class Time {
  /**
   * A class representing a time (hours / mins).
   * @param {number} hours
   * @param {number} mins
   */
  constructor(hours, mins) {
    this._hours = hours;
    this._mins = mins;
  }

  /**
   * Format a number int a two digit number (e.g. 5 -> 05)
   * @param {number} num
   * @returns The number formated.
   */
  oneDigitToTwo(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  get hours() {
    return this._hours;
  }

  get mins() {
    return this._mins;
  }

  /**
   * Format : hh:mm.
   */
  get toString() {
    return `${this.oneDigitToTwo(this.hours)}:${this.oneDigitToTwo(this.mins)}`;
  }

  /**
   * Only get the date of the date to locale string.
   * @param {Date} date
   * @returns A array of the day, the month and the year. (e.g. [1, 12, 2021])
   */
  static getLocalDateDate(date) {
    return date.toLocaleDateString().split(' ')[0].split('/').map(parseFloat);
  }

  /**
   * Only get the time of the date to locale string.
   * @param {Date} date
   * @returns A array of the hour and the minute. (e.g. [1, 12])
   */
  static getLocalDateTime(date) {
    return date.toLocaleTimeString({ timeZone: 'Europe/Paris' }).split(':').map(parseFloat);
  }

  /**
   * Only get the hour of the time array.
   * @param {array} date
   * @returns A array of the day, the month and the year. (e.g. [1, 12] -> 1)
   */
  static getLocalHours(date) {
    return this.getLocalDateTime(date)[0];
  }

  /**
   * Only get the minutes of the time array.
   * @param {array} date
   * @returns A number . (e.g. [1, 12] -> 12)
   */
  static getLocalMins(date) {
    return this.getLocalDateTime(date)[1];
  }

  /**
   * Reset the hours, the minutes the seconds and the milliseconds of a date.
   * @param {Date} date The date to reset.
   * @returns A date.
   */
  static resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return new Date(date);
  }

  /**
   * Get a Time class from a date.
   * @param {Date} date The date object.
   * @returns A Time class.
   */
  static timeFromDate(date) {
    return new Time(this.getLocalHours(new Date(date)), this.getLocalMins(new Date(date)));
  }
}

export default Time;
