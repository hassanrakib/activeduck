import { format } from "date-fns";
import styles from "./WorkedTimeSpans.module.css";
import { RxCross2 } from "react-icons/rx";
import Button from "../../Shared/Button/Button";

const WorkedTimeSpans = ({
    workedTimeSpans,
    deleteOption,
    deleteMarkedTimeSpansIds,
    setDeleteMarkedTimeSpansIds
}) => {
    // format every workedTimeSpan's start time and end time
    function formatSpanTime(time) {
        // start time and end time stored in utc time in db
        // so we have to first convert the utc time to local time using new Date()
        // if time is truthy, because endTime can be undefined
        if (time) {
            // get the utc time string converted to local time
            const localTime = new Date(time);
            // then format to "12:00 AM"
            return format(localTime, "p");
        }

        // if endTime is undefined
        return "";
    }

    // set deleteMarkedTimeSpansIds state to get the _ids of the workedTimeSpans
    // that are marked for deletion
    const setDeleteMarkedTimeSpansIdsFn = (_id) => {
        // if a workedTimeSpan's _id already in deleteMarkedTimeSpansIds
        // another click will remove the _id of that workedTimeSpan from deleteMarkedTimeSpansIds

        // find index of workedTimeSpan's _id in deleteMarkedTimeSpansIds
        const indexOfWorkedTimeSpanId = deleteMarkedTimeSpansIds.indexOf(_id);

        // indexOfWorkedTimeSpanId is greater than -1, that means workedTimeSpan's 
        // _id exists in deleteMarkedTimeSpansIds
        if (indexOfWorkedTimeSpanId > - 1) {

            // splice changes the original array
            // immutably copy the deleteMarkedTimeSpansIds array
            const deleteMarkedTimeSpansIdsCopy = [...deleteMarkedTimeSpansIds];

            // remove the workedTimeSpan's _id from deleteMarkedTimeSpansIdsCopy
            deleteMarkedTimeSpansIdsCopy.splice(indexOfWorkedTimeSpanId, 1);

            // set deleteMarkedTimeSpansIds state to the new array
            setDeleteMarkedTimeSpansIds(deleteMarkedTimeSpansIdsCopy);
        } else {
            // add new workedTimeSpan's _id to the deleteMarkedTimeSpansIds
            setDeleteMarkedTimeSpansIds([...deleteMarkedTimeSpansIds, _id]);
        }
    }
    return (
        <div className={styles.timeSpans}>
            {/* show workedTimeSpans */}
            {workedTimeSpans?.map((timeSpan) => (
                <Button
                    // if deleteOption true, add click event handler to setDeleteMarkedTimeSpansIdsFn
                    handleClick={deleteOption ? () => setDeleteMarkedTimeSpansIdsFn(timeSpan._id) : undefined}
                    key={timeSpan._id}
                    // adding 'btnDanger' class when the workedTimeSpan's _id exists in deleteMarkedTimeSpansIds
                    className=
                    {`btnGrayBorder btnSmall btnFlex${deleteOption && deleteMarkedTimeSpansIds.includes(timeSpan._id) ? " btnDanger" : ""}`}
                >
                    {formatSpanTime(timeSpan.startTime)} -{" "}
                    {/* if deleteOption true, show the cross button */}
                    {formatSpanTime(timeSpan.endTime)}{deleteOption && <RxCross2 color="#d50000" />}
                </Button>
            ))}
        </div>
    )
};

export default WorkedTimeSpans;
