import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import styles from "./TaskSettings.module.css";
import React from "react";
import Popup from "../../Shared/Popup/Popup";
import Button from "../../Shared/Button/Button";

const TaskSettings = () => {
    const [isPopupActive, setIsPopupActive] = React.useState(false);

    return (
        <div
            className={styles.taskSettings}
            onClick={() => setIsPopupActive(prevIsPopupActive => !prevIsPopupActive)}
        >
            <BsThreeDots />
            {isPopupActive && (
                <Popup position="forTaskSettings">
                    <ul>
                        <li>
                            <Button className="btnMedium btnBlueviolet">
                                <AiOutlineEdit />
                                Edit
                            </Button>
                        </li>
                        <li>
                            <Button className="btnMedium btnDanger">
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
