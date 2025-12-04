import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import MainActivity from "./activities/MainActivity";
import NewScheduleActivity from "./activities/new/NewScheduleActivity";
import ShareLinkActivity from "./activities/new/ShareLinkActivity";
import JoinScheduleActivity from "./activities/schedule/JoinScheduleActivity";
import ScheduleResultActivity from "./activities/schedule/ScheduleResultActivity";
import ConfirmScheduleActivity from "./activities/schedule/ConfirmScheduleActivity";
import ConfirmedActivity from "./activities/schedule/ConfirmedActivity";
import LoginActivity from "./activities/login/LoginActivity";
import DashboardActivity from "./activities/dashboard/DashboardActivity";

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
  },
  
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes: {
        MainActivity: "/",
        NewScheduleActivity: "/new",
        ShareLinkActivity: "/new/share",
        JoinScheduleActivity: "/schedule/:id",
        ScheduleResultActivity: "/schedule/:id/results",
        ConfirmScheduleActivity: "/schedule/:id/confirm",
        ConfirmedActivity: "/schedule/:id/confirmed",
        LoginActivity: "/login",
        DashboardActivity: "/dashboard",
      },
      fallbackActivity: () => "MainActivity",
    }),
  ],
  initialActivity: () => "MainActivity",
});