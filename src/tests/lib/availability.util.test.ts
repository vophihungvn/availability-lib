import { setUnavailability } from "../../lib/availability.util";

describe("Availability utils", () => {
  describe("setUnavailability function", () => {
    it.each`
      availabilityEvents         | from    | to      | expectedResults
      ${[{ from: 0, to: 1000 }]} | ${200}  | ${300}  | ${[{ from: 0, to: 200 }, { from: 300, to: 1000 }]}
      ${[{ from: 0, to: 1000 }, { from: 1200, to: 1890 }]} | ${200} | ${300} | ${[{ from: 0, to: 200 }, { from: 300, to: 1000 }, {
    from: 1200,
    to: 1890,
  }]}
      ${[{ from: 50, to: 1000 }, { from: 1200, to: 1890 }]} | ${10} | ${1100} | ${[{
    from: 1100,
    to: 1890,
  }]}
      ${[{ from: 0, to: 1000 }]} | ${200}  | ${300}  | ${[{ from: 0, to: 200 }, { from: 300, to: 1000 }]}
      ${[{ from: 0, to: 1000 }]} | ${2000} | ${3000} | ${[{ from: 0, to: 1000 }]}
    `(
      "should return correct value when ",
      ({ availabilityEvents, from, to, expectedResults }) => {
        expect(setUnavailability(availabilityEvents, from, to)).toEqual(
          expectedResults
        );
      }
    );
  });
});
