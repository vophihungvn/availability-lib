import moment, { Moment } from "moment";
import { AvailabilityEvent, Interval } from "./avaiability.types";
import {
  convertNumberToTime,
  convertTimeToNumber,
  setUnavailability,
} from "./availability.util";
import { DATE_FORMAT } from "./constant";

class AvailabilityService {
  private availabilityEvents: AvailabilityEvent[] = [];
  private from: Moment;
  private to: Moment;

  constructor({
    from = moment(),
    to = moment(),
  }: {
    from: Moment;
    to: Moment;
  }) {
    this.from = from;
    this.to = to;

    this.initAvaiabilty();
  }

  private initAvaiabilty = (): void => {
    const currentTime = this.from.clone();

    while (currentTime.isBefore(this.to)) {
      const avaiability: AvailabilityEvent = {
        date: currentTime.format(DATE_FORMAT),
        dow: currentTime.weekday(),
        dom: currentTime.date(),
        doy: currentTime.dayOfYear(),
        slots: [],
      };

      // TO-DO: Refactor these block to make it readable
      let from = 0;
      let to = 0;
      if (currentTime.isBefore(this.from)) {
        from = convertTimeToNumber(this.from);
      } else {
        from = convertTimeToNumber(currentTime);
      }

      const endOfCurrentTime = currentTime.clone().endOf("D");
      if (endOfCurrentTime.isBefore(this.to)) {
        to = convertTimeToNumber(endOfCurrentTime);
      } else {
        to = convertTimeToNumber(this.to);
      }

      avaiability.slots?.push({
        from,
        to,
      });

      this.availabilityEvents.push(avaiability);
      // Check the next date
      currentTime.add(1, "d").startOf("d");
    }
  };

  public getAvaiabilityEvents = (): AvailabilityEvent[] =>
    this.availabilityEvents;

  private setUnAvailabilityOnce = (date: string, from: number, to: number) => {
    const event = this.availabilityEvents.find((event) => event.date === date);
    if (event) {
      event.slots = setUnavailability(event.slots, from, to);
    }
  };

  private setUnavailabilityByDay = (from: number, to: number) => {
    this.availabilityEvents.forEach((event) => {
      event.slots = setUnavailability(event.slots, from, to);
    });
  };

  private setUnavailabilityByWeekday = (
    dow: number,
    from: number,
    to: number
  ) => {
    this.availabilityEvents
      .filter((event) => event.dow === dow)
      .forEach((event) => {
        event.slots = setUnavailability(event.slots, from, to);
      });
  };

  private setUnavailabilityByMonth = (
    dom: number,
    from: number,
    to: number
  ) => {
    this.availabilityEvents
      .filter((event) => event.dom === dom)
      .forEach((event) => {
        event.slots = setUnavailability(event.slots, from, to);
      });
  };

  private setUnavailabilityByYear = (doy: number, from: number, to: number) => {
    this.availabilityEvents
      .filter((event) => event.doy === doy)
      .forEach((event) => {
        event.slots = setUnavailability(event.slots, from, to);
      });
  };

  public setUnAvailability = (
    from: Moment,
    to: Moment,
    interval: Interval
  ): void => {
    const timeFrom = convertTimeToNumber(from);
    const timeTo = convertTimeToNumber(to);
    switch (interval) {
      case Interval.ONCE:
        this.setUnAvailabilityOnce(from.format(DATE_FORMAT), timeFrom, timeTo);
        break;
      case Interval.DAILY:
        this.setUnavailabilityByDay(timeFrom, timeTo);
        break;
      case Interval.WEEKLY:
        this.setUnavailabilityByWeekday(from.day(), timeFrom, timeTo);
        break;
      case Interval.MONTHLY:
        this.setUnavailabilityByMonth(from.date(), timeFrom, timeTo);
        break;
      case Interval.YEARLY:
        this.setUnavailabilityByYear(from.dayOfYear(), timeFrom, timeTo);
        break;
      default:
        throw new Error("Interval not supported");
    }
  };

  public isAvailable = (from: Moment, to?: Moment): boolean => {
    const day = from.format(DATE_FORMAT);
    const availability = this.availabilityEvents.find(
      (event) => event.date === day
    );

    if (!availability) return false; // not setup for this date

    const timeFrom = convertTimeToNumber(from);
    let timeTo = to ? convertTimeToNumber(to) : timeFrom;

    const found = availability.slots.find(
      (slot) => slot.from <= timeFrom && slot.to >= timeTo
    );

    if (found) return true;

    return false;
  };

  // Get available from
  public getNextAvailability = (from: Moment): Moment | undefined => {
    const day = from.format(DATE_FORMAT);
    const availability = this.availabilityEvents.find(
      (event) => event.date === day
    );

    const timeFrom = convertTimeToNumber(from);

    if (availability) {
      const found = availability.slots.find((slot) => slot.from > timeFrom);

      if (!!found) {
        const result = moment(availability.date, DATE_FORMAT);
        const timeAvail = convertNumberToTime(found.from);
        result
          .hour(timeAvail.hour())
          .minute(timeAvail.minute())
          .add(1, "minute");
        return result;
      }
    }

    for (let i = 0; i < this.availabilityEvents.length; i++) {
      if (this.availabilityEvents[i].date > day) {
        if ((this.availabilityEvents[i].slots?.length ?? 0) > 0) {
          const result = moment(this.availabilityEvents[i].date, DATE_FORMAT);

          const timeAvail = convertNumberToTime(
            this.availabilityEvents?.[i].slots?.[0]?.from ?? 0
          );
          result
            .hour(timeAvail.hour())
            .minute(timeAvail.minute())
            .add(1, "minute");
          return result;
        }
      }
    }
  };
}

export { AvailabilityService };
