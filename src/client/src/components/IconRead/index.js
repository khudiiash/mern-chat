import React from "react";
import PropTypes from "prop-types";
import readSvg from "assets/img/read.svg";
import unreadSvg from "assets/img/unread.svg";

const IconRead = ({ isMe, isRead }) =>
  (isMe &&
    (isRead ? (
      <img className="message__icon-read" src={readSvg} alt="Read icon" />
    ) : (
      <img
        className="message__icon-read message__icon-read--no"
        src={unreadSvg}
        alt="Not read icon"
      />
    ))) ||
  null;

IconRead.propTypes = {
  isMe: PropTypes.bool,
  isRead: PropTypes.bool
};

export default IconRead;
