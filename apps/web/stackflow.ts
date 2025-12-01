import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import MainActivity from "./activities/MainActivity";

export const { Stack, useFlow } = stackflow({
  transitionDuration: 350,
  activities: {
    MainActivity,
  },
  
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes: {
        MainActivity: "/",
      },
      fallbackActivity: () => "MainActivity",
    }),
  ],
  initialActivity: () => "MainActivity",
});