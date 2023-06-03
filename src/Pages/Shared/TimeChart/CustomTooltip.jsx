import styles from "./CustomTooltip.module.css";

const CustomTooltip = ({ payload, label, active }) => {
  if (active) {
    return (
      <div className={styles.customTooltip}>
        <p>Date: {label} </p>
        <p>Worked: {`${payload[0].value}h 30m`}</p>
      </div>
    );
  }
};

export default CustomTooltip;
