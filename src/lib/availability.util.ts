import { EventSlot } from "./avaiability.types";

const setUnavailability = (events: EventSlot[] = [], from = 0, to = 0) => {
  for (let i = 0; i < events.length; i++) {
    const { from: currentFrom = 0, to: currentTo = 0 } = events[i];
    if (currentFrom < from && currentTo > to) {
      // [currentFrom, from, to, currentTo]
      events[i] = { from: currentFrom, to: from };
      events.splice(i + 1, 0, { from: to, to: currentTo });
      break;
    }
    if (from < currentFrom) {
      if (to > currentTo) {
        events.splice(i, 1);
        i -= 1;
        continue;
      } else {
        events[i] = {
          from: to,
          to: currentTo,
        };
        continue;
      }
    }

    if (to > currentTo && from < currentTo) {
      events[i] = {
        from: from,
        to: currentTo,
      };
    }
  }

  return [...events];
};

export { setUnavailability };
