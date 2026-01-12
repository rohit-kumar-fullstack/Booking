import moment from 'moment';

export const format = {
  // Internal helper to safely parse any input
  parse: (date: string | Date) => {
    if (!date) return null;
    let d = date;
    if (typeof date === 'string') {
      // Replace IST or other known timezone abbreviations with UTC offset
      d = date.replace('IST', '+0530'); 
    }
    return moment(d);
  },

  date1: (date: string | Date) => format.parse(date)?.format('DD-MM-YYYY'),
  date2: (date: string | Date) => format.parse(date)?.format('YYYY-MM-DD'),
  date3: (date: string | Date) => format.parse(date)?.format('MMMM Do, YYYY'),
  date4: (date: string | Date) => format.parse(date)?.format('dddd, MMMM Do YYYY'),
  date5: (date: string | Date) => format.parse(date)?.format('MM/DD/YYYY'),
  date6: (date: string | Date) => format.parse(date)?.format('YYYY/MM/DD HH:mm'),
  time1: (date: string | Date) => format.parse(date)?.format('hh:mm A'),
  time2: (date: string | Date) => format.parse(date)?.format('HH:mm:ss'),
  iso: (date: string | Date) => format.parse(date)?.toISOString(),
  fromNow: (date: string | Date) => format.parse(date)?.fromNow(),
  custom: (date: string | Date, formatStr: string) => format.parse(date)?.format(formatStr),
};
