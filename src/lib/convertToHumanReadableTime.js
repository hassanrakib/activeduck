import { formatDuration, millisecondsToHours, millisecondsToMinutes } from "date-fns";

// converts the time in milliseconds to {hours: 3, minutes: 30} type object
// then return a human readable string that uses the object
const convertToHumanReadableTime = (timeInMilliseconds, isShorterFormat) => {
    const duration = {
        hours: millisecondsToHours(timeInMilliseconds),
        // removing the number of milliseconds for hours by using remainder operator
        // then the remaining milliseconds are converted to minutes
        minutes: millisecondsToMinutes(timeInMilliseconds % (1000 * 60 * 60)),
    };

    // convert duration object to human readable time
    let humanReadableTime = formatDuration(duration, { format: ['hours', 'minutes'] });

    // if timeInMilliseconds parameter is assigned a value of zero 
    // humanReadableTime will be empty string. so, instead return "0 minute"
    // timeInMilliseconds will be zero if completedTimeInMs is zero
    // completedTimeInMs will be zero if no element in workedTimeSpans array of the task
    // or an element exists with startTime property but has not completed 1 minute
    if (!humanReadableTime) { humanReadableTime = "0 minute" }


    if (isShorterFormat) {
        // changes the matched string to its shorter format
        humanReadableTime = humanReadableTime.replace(/\s(minutes|minute)/, "m").replace(/\s(hours|hour)/, "h");
    }

    return humanReadableTime;
};

export default convertToHumanReadableTime;