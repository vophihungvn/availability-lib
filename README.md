## Availability lib

### Introduction

This package is use for:

- Cheking the given time is available or not with configured availability slots.
- Find the next available time with the given time

### APIs

#### Initiate a availability service

```ts
import { AvailabilityService } from "availability-lib";

const service = new AvailabilityService(from, to);

// from, to is moment instance
```

#### Add an unavailable event

```ts
import { AvailabilityService, Interval } from "availability-lib";

const service = new AvailabilityService(from, to);
service.setUnAvailability(from, to, Interval.ONCE);

// from, to: moment instance
// Interval: Enum {"ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY" }
```

> NOTE: Currently, from and to should be in the same date. Will make improvement to set in difference day

#### Check if the given time is available or not

```ts
import { AvailabilityService, Interval } from "availability-lib";

const service = new AvailabilityService(from, to);
const result = service.isAvailable(from, to);

// from, to: moment instance
// result: boolean
```

#### Check if when is the next available with the given time

```ts
import { AvailabilityService, Interval } from "availability-lib";

const service = new AvailabilityService(from, to);
const result = service.getNextAvailability(time);

// time: moment instance
// result: Moment instance
```
