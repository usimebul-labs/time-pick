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
import HeatmapTestActivity from "./activities/HeatmapTestActivity";
import LandingActivity from "./activities/LandingActivity";

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
    HeatmapTestActivity,
    LandingActivity,
  },

  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes: {
        MainActivity: "/app",
        NewScheduleActivity: "/app/calendar/new",
        ShareLinkActivity: "/app/calendar/share",
        JoinScheduleActivity: "/app/calendar/:id",
        ScheduleResultActivity: "/app/calendar/:id/results",
        ConfirmScheduleActivity: "/app/calendar/:id/confirm",
        ConfirmedActivity: "/app/calendar/:id/confirmed",
        LoginActivity: "/app/login",
        DashboardActivity: "/app/dashboard",
        AuthErrorActivity: "/app/auth/auth-code-error",
        CalendarTestActivity: "/app/calendar-test",
        HeatmapTestActivity: "/app/heatmap-test",
        LandingActivity: "/",
      },
      fallbackActivity: () => "LandingActivity",
    }),
  ],
  initialActivity: () => "LandingActivity",
});