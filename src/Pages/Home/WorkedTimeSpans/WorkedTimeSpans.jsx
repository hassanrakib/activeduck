import { format } from "date-fns";
import styles from "./WorkedTimeSpans.module.css";
import { RxCross2 } from "react-icons/rx";
import Button from "../../Shared/Button/Button";

const WorkedTimeSpans = ({ workedTimeSpans, deleteOption }) => {
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
    return (
        <div className={styles.timeSpans}>
            {/* show workedTimeSpans */}
            {workedTimeSpans?.map((timeSpan) => (
                <Button key={Math.random()} className="btnGrayBorder btnSmall btnFlex">
                    {formatSpanTime(timeSpan.startTime)} -{" "}
                    {formatSpanTime(timeSpan.endTime)}{deleteOption && <RxCross2 color="#d50000" />}
                </Button>
            ))}
        </div>
    )
};

export default WorkedTimeSpans
