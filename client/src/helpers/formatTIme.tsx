// Import Moment.js
import moment from "moment";

export const formatTime = (time: string) => {
  console.log(time);

  const date = moment(time);
  const formattedDate = date.format("DD/MM/YYYY");

  const splitTime = formattedDate.split("/");

  const rsTime = `Ngày ${splitTime[0]}/${splitTime[1]}/${splitTime[2]}`;

  return rsTime;
};
