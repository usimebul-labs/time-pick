import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";
import Landing from "./activities/Landing";
import Dashboard from "./activities/app/Dashboard";
import Login from "./activities/app/Login";
import Error from "./activities/app/auth/Error";
import Confirm from "./activities/app/calendar/Confirm";
import {
  CreateBasicInfo,
  CreateCalendarType,
  CreateDateRange,
  CreateDeadline,
  CreateExclusions,
} from "./activities/app/calendar/Create";
import Join from "./activities/app/calendar/Join";
import Modify from "./activities/app/calendar/Modify";
import Result from "./activities/app/calendar/Result";
import Select from "./activities/app/calendar/Select";
import Status from "./activities/app/calendar/Status";

const groupRoutes = (prefix: string, routes: Record<string, string>) => {
  const grouped: Record<string, string> = {};
  for (const [activityName, path] of Object.entries(routes)) {
    grouped[activityName] = `${prefix}${path}`;
  }
  return grouped;
};


const activities = {
  Landing,
  Dashboard,
  Login,
  Error,
  Select,
  SelectEdit: Select,
  Result,
  Confirm,
  Status,
  Modify,
  Join,
  CreateBasicInfo,
  CreateCalendarType,
  CreateDateRange,
  CreateExclusions,
  CreateDeadline,
};

export type Activities = typeof activities;

const stack = stackflow({
  transitionDuration: 350,
  activities,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
    historySyncPlugin({
      routes: {
        Landing: "/",
        Dashboard: "/app/dashboard",
        Login: "/app/login",
        Error: "/app/auth/auth-code-error",
        ...groupRoutes("/app/calendar/new", {
          CreateBasicInfo: "",
          CreateCalendarType: "/type",
          CreateDateRange: "/date",
          CreateExclusions: "/exclusions",
          CreateDeadline: "/deadline",
        }),
        Join: "/app/calendar/:id/join",
        Select: "/app/calendar/:id",
        SelectEdit: "/app/calendar/:id/edit",
        Result: "/app/calendar/:id/results",
        Confirm: "/app/calendar/:id/confirm",
        Status: "/app/calendar/:id/status",
        Modify: "/app/calendar/:id/modify",
      },
      fallbackActivity: () => "Landing",
    }),
  ],
  initialActivity: () => "Landing",
});

export const { Stack, useFlow } = stack;
