import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import styles from "./TaskSettings.module.css";
import React from "react";
import Popup from "../../Shared/Popup/Popup";
import Button from "../../Shared/Button/Button";

const TaskSettings = () => {
    // defines whether to show the popup
    const [isPopupActive, setIsPopupActive] = React.useState(false);

    // delete the task
    const deleteTask = () => {

    }

    return (
        <div
            className={styles.taskSettings}
            onClick={() => setIsPopupActive(prevIsPopupActive => !prevIsPopupActive)}
        >
            <BsThreeDots />
            {isPopupActive && (
                // popup
                <Popup position="forTaskSettings">
                    {/* popup content */}
                    <ul className={styles.settingsList}>
                        <li>
                            <Button className="btnMedium btnFlex">
                                <AiOutlineEdit />
                                Edit
                            </Button>
                        </li>
                        <li>
                            <Button handleClick={deleteTask} className="btnMedium btnFlex btnDanger">
                                <AiOutlineDelete />
                                Delete
                            </Button>
                        </li>
                    </ul>
                </Popup>
            )}
        </div>
    )
};

export default TaskSettings
