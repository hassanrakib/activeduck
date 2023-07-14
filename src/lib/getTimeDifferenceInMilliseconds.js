import { differenceInMilliseconds } from "date-fns";

// get time difference in milliseconds between two date objects
const getTimeDifferenceInMilliseconds = (
    startTimeInString,
    endTimeInString
) => {
    // converts utc date strings to the date objects
    const startTime = new Date(startTimeInString);
    const endTime = new Date(endTimeInString);

    // get the time difference between startTime and endTime in milliseconds
    return differenceInMilliseconds(endTime, startTime);
};

export default getTimeDifferenceInMilliseconds;