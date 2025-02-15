import moment from "moment";

export const BASE_URL = "https://backend-project-5zo6.onrender.com/"

export const BLOG_DEFAULT_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"

export const getTimeAgo = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    const diffInSeconds = now.diff(time, "seconds");
    const diffInMinutes = now.diff(time, "minutes");
    const diffInHours = now.diff(time, "hours");
    const diffInDays = now.diff(time, "days");
    const diffInMonths = now.diff(time, "months");
    const diffInYears = now.diff(time, "years");
  
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} h${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 30) {
      return `${diffInDays} d ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} m${diffInMonths > 1 ? "s" : ""} ago`; 
    } else {
      return `${diffInYears} y${diffInYears > 1 ? "s" : ""} ago`;
    }
  };