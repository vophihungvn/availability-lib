import moment, { Moment } from "moment";
import { AvailabilityEvent, IntervalType } from "./avaiability.types";

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

    console.log(this.getAvaiabilityEvents());
  };

  public getAvaiabilityEvents = (): AvailabilityEvent[] =>
    this.availabilityEvents;

  public setUnAvailability = (
    from: Moment,
    to: Moment,
    interval?: IntervalType
  ): void => {};
}

export { AvailabilityService };
