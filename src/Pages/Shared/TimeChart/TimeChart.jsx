import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import convertToHumanReadableTime from "../../../lib/convertToHumanReadableTime";
import { format } from "date-fns";

// show customized data on tooltip
const CustomTooltip = ({ payload, label, active }) => {
  // if tooltip is active
  if (active) {
    const localDateObject = new Date(label);
    const formattedDate = format(localDateObject, "PP");
    return (
      <div>
        <p>
          Date: <span style={{ color: "blueviolet" }}>{formattedDate}</span>
        </p>
        <p style={{ marginTop: "3px" }}>
          Total Worked:{" "}
          <span style={{ color: "blueviolet" }}>
            {convertToHumanReadableTime(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }

  // if tooltip is not active
  return null;
};

const TimeChart = ({ totalCompletedTimes }) => {
  //  label on the top of every bar that shows total completed time for every date
  // the value we recieve here is the value of completedTime (which is in ms) for a localDate
  // we convert the value to human readable time
  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="black"
        textAnchor="middle"
        dy={-6}
        fontSize="12px"
      >
        {convertToHumanReadableTime(value)}
      </text>
    );
  };

  // x-axis custom tick
  // here payload.value is the value of localDate
  const renderCustomAxisTick = ({ x, y, payload }) => {
    // create local date object from local date string to use in format function
    const localDateObject = new Date(payload.value);
    // format localDateObject to something like '17 Jul'
    const formattedLocalDate = format(localDateObject, "d MMM");
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="end"
          fill="#a5a5a5"
          transform="rotate(-35)"
        >
          {formattedLocalDate}
        </text>
      </g>
    );
  };

  return (
    // ResponsiveContainer component makes the BarChart adapt to the size of parent container
    // here BarChart is given fixed height of 150px and width of 100% of parent by ResponsiveContainer
    <ResponsiveContainer height={150} width="100%">
      {/* BarChart is the parent for necessary components to create a bar chart */}
      {/* it takes array of objects in its data prop to generate chart on the data */}
      {/* margin prop takes an object that defines margins around the BarChart */}
      <BarChart
        data={totalCompletedTimes}
        margin={{ top: 25, right: 0, bottom: 15, left: 20 }}
      >
        {/* XAxis is the line parallel to the ground, it uses localDate property (given to dataKey prop) */}
        {/* from the array of objects that was provided to the data prop of the BarChart */}
        {/* to generate x axis ticks */}
        {/* tick prop is a render prop that takes renderCustomAxisTick function and returns a custom axis tick for every axis tick */}
        <XAxis
          dataKey="localDate"
          tick={renderCustomAxisTick}
          stroke="#a5a5a5"
          // interval set to 0, means all the ticks (localDates) will be shown in the x axis
          interval={0}
          // padding around the x axis
          padding={{ left: 10, right: 10 }}
        />
        {/* tooltip shows data when hovered over every Bar */}
        {/* CustomTooltip is a component to show customized data on the tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{
            backgroundColor: "white",
            padding: "5px 15px",
            border: ".5px solid #dadada",
          }}
        />
        {/* Bar creates the actual bar. it uses "completedTime" from the data to create bars along the y axis */}
        {/* barSize defines the bar width */}
        {/* label is a render prop that shows customized label on top of every bar */}
        <Bar
          dataKey="completedTime"
          fill="blueviolet"
          barSize={30}
          label={renderCustomBarLabel}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeChart;
