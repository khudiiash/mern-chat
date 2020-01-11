import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format"
import isToday from "date-fns/isToday"

const Time = ({ date }) => {
  if (isToday(new Date(date))) {
    return(
      <div className="message__time">
        {format(new Date(date),'HH:mm')}
      </div>
    );
  } else {
    return(
      <div className="message__time">
        {format(new Date(date),'dd.MM')}
      </div>
    );
  }
}
  

Time.propTypes = {
  date: PropTypes.string
};

export default Time;
