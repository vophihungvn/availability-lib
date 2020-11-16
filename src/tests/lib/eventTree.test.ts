import moment from "moment";
import { AvailabilityService } from "../../lib/avaiability";
import { EventTree } from "../../lib/eventTree";

describe("Event tree", () => {
  describe("Tree initiate", () => {
    it("Should init the tree successfully", () => {
      const service = new AvailabilityService({
        from: moment().month(10).date(1),
        to: moment().month(10).date(10),
      });
      const tree = new EventTree(service.getAvaiabilityEvents());
      expect(tree.getHead()).not.toBeUndefined();
    });

    it("Should return undefine node if availability is empty", () => {
      const tree = new EventTree([]);
      expect(tree.getHead()).toBeUndefined();
    });
  });

  describe("Get node from tree", () => {
    it("Should get the node correctly", () => {
      const service = new AvailabilityService({
        from: moment().year(2020).month(10).date(1),
        to: moment().year(2020).month(10).date(20),
      });
      const tree = new EventTree(service.getAvaiabilityEvents());
      expect(tree.getNode("20201110")?.event?.date).toEqual("20201110");
    });
  });
});
