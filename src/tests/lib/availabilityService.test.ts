import moment from "moment";
import { AvailabilityService } from "../../lib/avaiability";
import { Interval } from "../../lib/avaiability.types";

describe("My test", () => {
  let service: AvailabilityService;

  beforeEach(() => {
    service = new AvailabilityService({
      from: moment().month(10).startOf("M"),
      to: moment().month(10).endOf("M"),
    });
  });

  it("Should run correctly on initial", () => {
    expect(service.getAvaiabilityEvents().length).toEqual(30);
  });

  describe("Set unavailability", () => {
    describe("Set daily unavailability", () => {
      it("Should run correctly when setUnavailability", () => {
        service.setUnAvailability(
          moment().hour(10).startOf("h"),
          moment().hour(10).endOf("h"),
          Interval.DAILY
        );

        expect(service.getAvaiabilityEvents()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              date: "20201101",
              dow: 0,
              doy: 306,
              slots: [
                { from: 0, to: 600 },
                { from: 659, to: 1439 },
              ],
            }),
          ])
        );
      });
    });

    describe("Set weekly unavailability", () => {
      it("Should run correctly when setUnavailability with yearly", () => {
        service.setUnAvailability(
          moment().month(10).date(2).hour(10).startOf("h"),
          moment().month(10).date(2).hour(10).endOf("h"),
          Interval.YEARLY
        );
        expect(service.getAvaiabilityEvents()).toEqual(
          expect.arrayContaining([
            // the first date, it is full day
            {
              date: "20201101",
              dow: 0,
              dom: 1,
              doy: 306,
              slots: [{ from: 0, to: 1439 }],
            },
            {
              date: "20201102",
              dow: 1,
              dom: 2,
              doy: 307,
              slots: [
                { from: 0, to: 600 },
                { from: 659, to: 1439 },
              ],
            },
            {
              date: "20201103",
              dow: 2,
              dom: 3,
              doy: 308,
              slots: [{ from: 0, to: 1439 }],
            },
          ])
        );
      });
    });

    describe("Set monthly unavailability", () => {
      it("Should run correctly when setUnavailability with yearly", () => {
        service.setUnAvailability(
          moment().month(10).date(2).hour(10).startOf("h"),
          moment().month(10).date(2).hour(10).endOf("h"),
          Interval.YEARLY
        );
        expect(service.getAvaiabilityEvents()).toEqual(
          expect.arrayContaining([
            // the first date, it is full day
            {
              date: "20201101",
              dow: 0,
              dom: 1,
              doy: 306,
              slots: [{ from: 0, to: 1439 }],
            },
            {
              date: "20201102",
              dow: 1,
              dom: 2,
              doy: 307,
              slots: [
                { from: 0, to: 600 },
                { from: 659, to: 1439 },
              ],
            },
            {
              date: "20201103",
              dow: 2,
              dom: 3,
              doy: 308,
              slots: [{ from: 0, to: 1439 }],
            },
          ])
        );
      });
    });

    describe("Set yearly unavailability", () => {
      it("Should run correctly when setUnavailability with yearly", () => {
        service.setUnAvailability(
          moment().month(10).date(2).hour(10).startOf("h"),
          moment().month(10).date(2).hour(10).endOf("h"),
          Interval.YEARLY
        );
        expect(service.getAvaiabilityEvents()).toEqual(
          expect.arrayContaining([
            // the first date, it is full day
            {
              date: "20201101",
              dow: 0,
              dom: 1,
              doy: 306,
              slots: [{ from: 0, to: 1439 }],
            },
            {
              date: "20201102",
              dow: 1,
              dom: 2,
              doy: 307,
              slots: [
                { from: 0, to: 600 },
                { from: 659, to: 1439 },
              ],
            },
            {
              date: "20201103",
              dow: 2,
              dom: 3,
              doy: 308,
              slots: [{ from: 0, to: 1439 }],
            },
          ])
        );
      });
    });
  });

  describe("Check available", () => {
    beforeEach(() => {
      service.setUnAvailability(
        moment().month(10).date(2).hour(10).startOf("h"),
        moment().month(10).date(2).hour(10).endOf("h"),
        Interval.DAILY
      );
    });

    it("Should return correctly with given time available", () => {
      expect(
        service.isAvailable(moment().month(9).date(2).hour(10).minute(1))
      ).toBeTruthy();
    });

    it("Should return correctly with given time unavailable", () => {
      expect(
        service.isAvailable(moment().month(10).date(2).hour(10).minute(1))
      ).toBeFalsy();
    });
  });
});
