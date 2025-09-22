/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_http from "../actions/http.js";
import type * as alarms from "../alarms.js";
import type * as calendar from "../calendar.js";
import type * as calendar_export from "../calendar_export.js";
import type * as calendar_notifications from "../calendar_notifications.js";
import type * as cameras from "../cameras.js";
import type * as community from "../community.js";
import type * as contacts from "../contacts.js";
import type * as emergency_protocols from "../emergency_protocols.js";
import type * as notifications from "../notifications.js";
import type * as payment_attempts from "../payment_attempts.js";
import type * as radio from "../radio.js";
import type * as rss from "../rss.js";
import type * as seeds_cameras from "../seeds/cameras.js";
import type * as seeds_emergency_protocols from "../seeds/emergency_protocols.js";
import type * as seeds_index from "../seeds/index.js";
import type * as seeds_payments from "../seeds/payments.js";
import type * as seeds_radio from "../seeds/radio.js";
import type * as seeds_rss from "../seeds/rss.js";
import type * as seeds_weather from "../seeds/weather.js";
import type * as users from "../users.js";
import type * as utils_alarmScheduler from "../utils/alarmScheduler.js";
import type * as utils_crons from "../utils/crons.js";
import type * as utils_paymentAttemptTypes from "../utils/paymentAttemptTypes.js";
import type * as weather from "../weather.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/http": typeof actions_http;
  alarms: typeof alarms;
  calendar: typeof calendar;
  calendar_export: typeof calendar_export;
  calendar_notifications: typeof calendar_notifications;
  cameras: typeof cameras;
  community: typeof community;
  contacts: typeof contacts;
  emergency_protocols: typeof emergency_protocols;
  notifications: typeof notifications;
  payment_attempts: typeof payment_attempts;
  radio: typeof radio;
  rss: typeof rss;
  "seeds/cameras": typeof seeds_cameras;
  "seeds/emergency_protocols": typeof seeds_emergency_protocols;
  "seeds/index": typeof seeds_index;
  "seeds/payments": typeof seeds_payments;
  "seeds/radio": typeof seeds_radio;
  "seeds/rss": typeof seeds_rss;
  "seeds/weather": typeof seeds_weather;
  users: typeof users;
  "utils/alarmScheduler": typeof utils_alarmScheduler;
  "utils/crons": typeof utils_crons;
  "utils/paymentAttemptTypes": typeof utils_paymentAttemptTypes;
  weather: typeof weather;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
