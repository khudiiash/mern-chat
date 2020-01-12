import formatDistance from 'date-fns/formatDistance'
import { ru } from 'date-fns/locale'

const timeFromNow = time => {
  let settings = {
    includeSeconds: false,
    addSuffix: false,
    locale: ru
  }
   
  return time ? `${formatDistance(new Date(time), new Date(), settings)} назад`.replace(/около /,''):'';

  };
  
export default timeFromNow;