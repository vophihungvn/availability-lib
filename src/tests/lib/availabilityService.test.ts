import moment from "moment";
import { AvailabilityService } from "../../lib/avaiability";

describe("My test", () => {
  let service: AvailabilityService;

  beforeEach(() => {
    service = new AvailabilityService({
      from: moment().startOf("M"),
      to: moment().endOf("M"),
    });
  });

  it("Should run correctly", () => {
    expect(service.getAvaiabilityEvents().length).toEqual(30);
  });
});
