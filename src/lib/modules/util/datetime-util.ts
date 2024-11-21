
import { format } from 'date-fns';
import { tz } from '@date-fns/tz';

export const DateTimeUtil = {
  getDateStr,
  getDateFileStr,
  getLexicalDateTimeStr,
  getDebugDateTimeStr,
  getDayStr,
  get24HourTimeStr,
} as const;

function getDateStr(date: Date) {
  /*
    [02-27-2024] 09:45 PM
    [02-27-2024] 09:49 PM
  */
  return format(date, 'MM-dd-y hh:mm aa');
}

function getDateFileStr(date: Date) {
  /*
    02272024_0945
    02272024_1304
  */
  return format(date, 'MMddy_kkmm');
}

/*
  alphabetically sortable datetime string
*/
function getLexicalDateTimeStr(date: Date) {
  return format(date, 'y-MM-dd_HH-mm-ss');
}
function getDebugDateTimeStr(date: Date) {
  return format(date, 'MM-dd-y HH:mm:ss.SSS');
}

function getDayStr(date: Date) {
  return format(date, 'E');
}

function get24HourTimeStr(date: Date) {
  let tzStr: string;
  tzStr = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  return format(date, 'HH:mm:ss', {
    in: tz(tzStr),
  });
}
