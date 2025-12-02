import { ActivityComponentType } from '@stackflow/react';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { Button } from '@repo/ui';
``;

const MainActivity: ActivityComponentType = () => {
  return (
    <AppScreen>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <h1 className="text-2xl font-bold">Hello Monorepo!</h1>
        <Button appName="" onClick={() => alert('Clicked shared button!')}>
          Click Me (Shared UI)
        </Button>
      </div>
    </AppScreen>
  );
};

export default MainActivity;
