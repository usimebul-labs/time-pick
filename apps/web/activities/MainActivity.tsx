import { ActivityComponentType } from '@stackflow/react';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { MonthlyCalendar, WeeklyCalendar } from '@repo/ui';
import { useState } from 'react';

const MainActivity: ActivityComponentType = () => {
  const [value, setValue] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  return (
    <AppScreen>
      <div className="p-8 h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col gap-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <h1 className="text-2xl font-bold">가능한 시간을 선택해주세요</h1>
          <div className="text-sm text-muted-foreground">{value.length}개의 시간대 선택됨</div>
        </div>

        <div className="max-w-5xl mx-auto w-full h-[600px] border shadow-sm rounded-xl bg-background">
          <MonthlyCalendar
            minDate={today}
            maxDate={twoWeeksLater}
            value={value}
            onChange={setValue}
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
          />
        </div>

        {/* 디버깅용 (선택된 데이터 확인) */}
        <pre className="max-w-5xl mx-auto w-full text-xs bg-black text-white p-4 rounded mt-4">{JSON.stringify(value, null, 2)}</pre>
      </div>
    </AppScreen>
  );
};

export default MainActivity;
