import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import Landing from "./activities/Landing";
import Main from "./activities/app/Main";
import Dashboard from "./activities/app/Dashboard";
import Login from "./activities/app/Login";
import Error from "./activities/app/auth/Error";
import CalendarTest from "./activities/app/CalendarTest";
import Create from "./activities/app/calendar/Create";
import Share from "./activities/app/calendar/Share";
import Join from "./activities/app/calendar/Join";
import Result from "./activities/app/calendar/Result";
import Confirm from "./activities/app/calendar/Confirm";
import Confirmed from "./activities/app/calendar/Confirmed";
import Modify from "./activities/app/calendar/Modify";

const activities = {
  Landing,
  Main,
  Dashboard,
  Login,
  Error,
  CalendarTest,
  Create,
  Share,
  Join,
  Result,
  Confirm,
  Confirmed,
  Modify,
};

export type Activities = typeof activities;

const stack = stackflow({
  transitionDuration: 350,
  activities,
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes: {
        Landing: "/",
        Main: "/app",
        Dashboard: "/app/dashboard",
        Login: "/app/login",
        Error: "/app/auth/auth-code-error",
        CalendarTest: "/app/calendar-test",
        Create: "/app/calendar/new",
        Share: "/app/calendar/share",
        Join: "/app/calendar/:id",
        Result: "/app/calendar/:id/results",
        Confirm: "/app/calendar/:id/confirm",
        Confirmed: "/app/calendar/:id/confirmed",
        Modify: "/app/calendar/:id/modify",
      },
      fallbackActivity: () => "Landing",
    }),
  ],
  initialActivity: () => "Landing",
});

export const { Stack, useFlow } = stack;