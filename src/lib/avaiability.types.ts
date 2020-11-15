interface EventSlot {
  from: number;
  to: number;
}

interface AvailabilityEvent {
  date: string;
  dow?: number;
  dom?: number;
  doy?: number;
  slots?: EventSlot[];
}

enum Interval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

type IntervalType = typeof Interval;

export { AvailabilityEvent, Interval, IntervalType, EventSlot };
