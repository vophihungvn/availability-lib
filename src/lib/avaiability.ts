import moment, { Moment } from "moment";
import { AvailabilityEvent, Interval, IntervalType } from "./avaiability.types";
import { setUnavailability } from "./availability.util";

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

  private convertTimeToNumber = (time: Moment): number =>
    time.hour() * 60 + time.minute();

  private initAvaiabilty = (): void => {
    const currentTime = this.from.clone();

    while (currentTime.isBefore(this.to)) {
      const avaiability: AvailabilityEvent = {
        date: currentTime.format("YYYYMMDD"),
        dow: currentTime.weekday(),
        dom: currentTime.date(),
        doy: currentTime.dayOfYear(),
        slots: [],
      };

      // TO-DO: Refactor these block to make it readable
      let from = 0;
      let to = 0;
      if (currentTime.isBefore(this.from)) {
        from = this.convertTimeToNumber(this.from);
      } else {
        from = this.convertTimeToNumber(currentTime);
      }

      const endOfCurrentTime = currentTime.clone().endOf("D");
      if (endOfCurrentTime.isBefore(this.to)) {
        to = this.convertTimeToNumber(endOfCurrentTime);
      } else {
        to = this.convertTimeToNumber(this.to);
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
    const timeFrom = this.convertTimeToNumber(from);
    const timeTo = this.convertTimeToNumber(to);
    switch (interval) {
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
    const day = from.format("YYYYMMDD");
    const availability = this.availabilityEvents.find(
      (event) => event.date === day
    );

    if (!availability) return true;

    const timeFrom = this.convertTimeToNumber(from);
    let timeTo = to ? this.convertTimeToNumber(to) : timeFrom;

    const found = availability.slots?.find(
      (slot) => slot.from > timeTo || slot.to < timeFrom
    );

    if (found) return false;

    return true;
  };

  // Get available from
  public getNextAvailability = (from: Moment): number => {
    const day = from.format("YYYYMMDD");
    const availability = this.availabilityEvents.find(
      (event) => event.date === day
    );

    const timeFrom = this.convertTimeToNumber(from);

    if (availability) {
      const found = availability.slots?.find((slot) => slot.to < timeFrom);
      if (!!found) return found.from;
    }

    for (let i = 0; i < this.availabilityEvents.length; i++) {
      if (this.availabilityEvents[i].date > day) {
        if ((this.availabilityEvents[i]?.slots?.length ?? 0) > 0) {
          return this.availabilityEvents[i]?.slots?.[0]?.from ?? 0;
        }
      }
    }

    return -1; // Cannot find available slot
  };
}

export { AvailabilityService };
