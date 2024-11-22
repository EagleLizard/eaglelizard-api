
import { format } from 'date-fns';

export const DateTimeUtil = {
  getDebugDateTimeStr,
} as const;

function getDebugDateTimeStr(date: Date) {
  return format(date, 'MM-dd-y HH:mm:ss.SSS');
}
