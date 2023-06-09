import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import CustomTooltip from "./CustomTooltip";

const TimeChart = () => {
  // later use date-fns to manage date and times
  const data = [
    { date: "01/06/22", workingTime: 2 },
    { date: "02/06/22", workingTime: 3 },
    { date: "03/06/22", workingTime: 4 },
    { date: "04/06/22", workingTime: 5 },
    { date: "05/06/22", workingTime: 2 },
    { date: "06/06/22", workingTime: 1 },
    { date: "07/06/22", workingTime: 8 },
  ];

  //  label on the top of every bar
  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#a5a5a5"
        textAnchor="middle"
        dy={-6}
        fontSize="12px"
      >
        {value}h 30m
      </text>
    );
  };

  //   x-axis custom tick - date modified
  const renderCustomAxisTick = ({ x, y, payload }) => {
    return (
      <text x={x - 10} y={y + 15} fill="#a5a5a5">
        {payload.value.split("/")[0]}
      </text>
    );
  };

  return (
    <ResponsiveContainer height={150}>
      <BarChart data={data} margin={{ top: 25, right: 0, bottom: 0, left: 20 }}>
        <XAxis
          dataKey="date"
          tick={renderCustomAxisTick}
          stroke="#a5a5a5"
          interval={0}
          padding={{ left: 10, right: 10 }}
        />
        <Tooltip content={<CustomTooltip />}/>
        <Bar
          dataKey="workingTime"
          fill="blueviolet"
          barSize={30}
          label={renderCustomBarLabel}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeChart;
