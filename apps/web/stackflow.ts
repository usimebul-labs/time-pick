import { stackflow } from "@stackflow/react";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import Landing from "./activities/Landing";
import Dashboard from "./activities/app/Dashboard";
import Login from "./activities/app/Login";
import Error from "./activities/app/auth/Error";
import Share from "./activities/app/calendar/Share";
import Select from "./activities/app/calendar/Select";
import Result from "./activities/app/calendar/Result";
import Confirm from "./activities/app/calendar/Confirm";
import Link from "next/link";
import Status from "./activities/app/calendar/Status";
import Modify from "./activities/app/calendar/Modify";
import Join from "./activities/app/calendar/Join";
import {
  CreateBasicInfo,
  CreateCalendarType,
  CreateDateRange,
  CreateExclusions,
  CreateDeadline,
} from "./activities/app/calendar/Create";

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
  Share,
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
        Share: "/app/calendar/share/:id",
        Join: "/app/calendar/:id/guest",
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
