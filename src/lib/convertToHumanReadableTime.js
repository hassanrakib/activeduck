import { formatDuration, millisecondsToHours, millisecondsToMinutes } from "date-fns";

// converts the time in milliseconds to {hours: 3, minutes: 30} type object
// then return a human readable string that uses the object
const convertToHumanReadableTime = (timeInMilliseconds) => {
    const duration = {
        hours: millisecondsToHours(timeInMilliseconds),
        // removing the number of milliseconds for hours by using remainder operator
        // then the remaining milliseconds are converted to minutes
        minutes: millisecondsToMinutes(timeInMilliseconds % (1000 * 60 * 60)),
    };

    // convert duration object to human readable time
    const humanReadableTime = formatDuration(duration);

    // if timeInMilliseconds parameter is assigned a value of zero 
    // humanReadableTime will be empty string. so, instead return "0 minute"
    // timeInMilliseconds will be zero if completedTimeInMilliseconds is zero
    // completedTimeInMilliseconds will be zero if no element in workedTimeSpans array of the task
    // or an element exists with startTime property but has not completed 1 minute
    if (!humanReadableTime) return "0 minute";

    return humanReadableTime;
};

export default convertToHumanReadableTime;