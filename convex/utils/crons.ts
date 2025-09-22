import { cronJobs } from 'convex/server';

import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';

const crons = cronJobs();

// Check for scheduled alarms every minute
crons.interval(
  'check-scheduled-alarms',
  { minutes: 1 },
  internal.utils.alarmScheduler.checkScheduledAlarms,
  {}
);

export default crons;