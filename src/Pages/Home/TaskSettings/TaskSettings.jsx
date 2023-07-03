import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import styles from "./TaskSettings.module.css";
import React from "react";
import Popup from "../../Shared/Popup/Popup";
import Button from "../../Shared/Button/Button";
import DeleteTaskModal from "../DeleteTaskModal/DeleteTaskModal";

const TaskSettings = ({ _id }) => {
    console.log(_id);
    // defines whether to show the popup
    const [isPopupActive, setIsPopupActive] = React.useState(false);

    // deletingTaskId is the _id of the task that the user wants to delete
    const [deletingTaskId, setDeletingTaskId] = React.useState("");

    console.log(isPopupActive, deletingTaskId);

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
                            <Button handleClick={() => setDeletingTaskId(_id)} className="btnMedium btnFlex btnDanger">
                                <AiOutlineDelete />
                                Delete
                            </Button>
                        </li>
                    </ul>
                </Popup>
            )}
            {/* modals to open when edit or delete button clicked */}
            {deletingTaskId && <DeleteTaskModal
                deletingTaskId={deletingTaskId}
                setDeletingTaskId={setDeletingTaskId}
            />}
        </div>
    )
};

export default TaskSettings
