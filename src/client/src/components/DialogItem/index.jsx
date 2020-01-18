import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Emoji } from "emoji-mart";
import reactStringReplace from "react-string-replace";
import { timeFromNow } from "utils/helpers";
import { useSelector } from "react-redux";

import { IconRead, Avatar } from "../";

const renderLastMessage = (message, userId) => {
  let text = "";
  if (!message.text && message.attachments.length) {
    text = "прикрепленный файл";
  } else {
    text = message.text;
  }
  return text
};

const DialogItem = props => {
  let {
    _id,
    unread,
    isMe,
    currentDialogId,
    partner,
    lastMessage,
    userId,
    isTyping,
    isOnline
  } = props;

  let messages = useSelector(state => state.messages.items);
 
  if (messages) {
    let newLastMessage = messages.find(m => m._id === lastMessage._id);
    if (newLastMessage) lastMessage = newLastMessage;
  }

  return (
    <Link to={`/dialog/${_id}`}>
      <div
        className={classNames("dialogs__item", {
          "dialogs__item--online": isOnline,
          "dialogs__item--selected": currentDialogId === _id
        })}
      >
        <div className="dialogs__item-avatar">
          <Avatar user={partner} />
        </div>
        <div className="dialogs__item-info">
          <div className="dialogs__item-info-top">
            <b className="dialogs__item-into-top-name">{partner.fullName}</b>
            <span className="dialogs__item-into-top-time">
              {timeFromNow(lastMessage.createdAt)}
            </span>
          </div>
          <div className="dialogs__item-info-bottom">
            {!isTyping ? (
              <p>
                {
                  (lastMessage.user._id === userId ? "Вы: " : "")}{reactStringReplace(
                  renderLastMessage(lastMessage,userId),
                  /:(.+?):/g,
                  (match, i) => (
                    <Emoji key={i} emoji={match} set="apple" size={16} />
                  )
                )}
               
                
              </p>
            ) : (
              <div className="message__typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {lastMessage.user._id === userId && (
              <IconRead isMe={isMe} isRead={lastMessage.read} />
            )}
            {unread > 0 && (
              <div className="dialogs__item-info-bottom-count">
                {unread > 9 ? "+9" : unread}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DialogItem;
