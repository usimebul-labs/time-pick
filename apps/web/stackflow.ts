import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import MainActivity from "./activities/MainActivity";
import NewScheduleActivity from "./activities/NewScheduleActivity";
import ShareLinkActivity from "./activities/ShareLinkActivity";
import JoinScheduleActivity from "./activities/JoinScheduleActivity";
import ScheduleResultActivity from "./activities/ScheduleResultActivity";
import ConfirmScheduleActivity from "./activities/ConfirmScheduleActivity";
import ConfirmedActivity from "./activities/ConfirmedActivity";
import LoginActivity from "./activities/LoginActivity";
import DashboardActivity from "./activities/DashboardActivity";
import AuthErrorActivity from "./activities/AuthErrorActivity";
import { CalendarTestActivity } from "./activities/CalendarTestActivity";


export const { Stack, useFlow } = stackflow({
  transitionDuration: 350,
  activities: {
    MainActivity,
    NewScheduleActivity,
    ShareLinkActivity,
    JoinScheduleActivity,
    ScheduleResultActivity,
    ConfirmScheduleActivity,
    ConfirmedActivity,
    LoginActivity,
    DashboardActivity,
    AuthErrorActivity,
    CalendarTestActivity,
  },

  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes: {
        MainActivity: "/app",
        NewScheduleActivity: "/app/new",
        ShareLinkActivity: "/app/new/share",
        JoinScheduleActivity: "/app/schedule/:id",
        ScheduleResultActivity: "/app/schedule/:id/results",
        ConfirmScheduleActivity: "/app/schedule/:id/confirm",
        ConfirmedActivity: "/app/schedule/:id/confirmed",
        LoginActivity: "/app/login",
        DashboardActivity: "/app/dashboard",
        AuthErrorActivity: "/app/auth/auth-code-error",
        CalendarTestActivity: "/app/calendar-test",
      },
      fallbackActivity: () => "MainActivity",
    }),
  ],
  initialActivity: () => "MainActivity",
});