
import moment from 'moment'
import 'moment-timezone' 

export const getDateTimeBr = (date = '') => {
    const utcDateTime = date ? new Date(date) : new Date(moment().format('YYYY-MM-DD'));
    const timeZone = 'America/Sao_Paulo';
    const momentUtc = moment.utc(utcDateTime);
    const momentTimezone = momentUtc.tz(timeZone);
    return momentTimezone;
}

export const dateIsAfter = (dateCheck:string,dateLimit:string) => {
   
    const momentCheck: moment.Moment = getDateTimeBr(dateCheck);
    const momentLimit: moment.Moment = getDateTimeBr(dateLimit);

    return momentCheck.isAfter(momentLimit);
}

export const calculateDaysDifference = (startDate:string, endDate:string) =>{
    const startMoment: moment.Moment = getDateTimeBr(startDate);
    const endMoment: moment.Moment = getDateTimeBr(endDate);
    
    let differenceInDays = endMoment.diff(startMoment, 'days') ;
  
    return differenceInDays;
}

