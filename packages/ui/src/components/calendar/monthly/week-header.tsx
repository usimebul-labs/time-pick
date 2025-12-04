export function WeekHeader() {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7 text-center">
      {weekDays.map((day) => (
        <div key={day} className="text-muted-foreground text-xs font-medium py-2">
          {day}
        </div>
      ))}
    </div>
  );
}
