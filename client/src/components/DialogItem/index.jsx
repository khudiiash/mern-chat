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

  return text[0] !== ":"
    ? `${message.user._id === userId ? "Вы: " : ""}${text}`
    : `${message.user._id === userId ? "Вы " : ""}${text}`;
};

const DialogItem = props => {
  let {
    _id,
    unread,
    isMe,
    currentDialogId,
    author,
    partner,
    lastMessage,
    userId,
    isTyping,
  } = props;
  let messages = useSelector(state => state.messages.items);
  let allMessages = useSelector(state => state.messages.allItems);
 if (allMessages && allMessages.length) {
   if (currentDialogId !== _id) {
    unread = allMessages.filter(m => m.dialog === _id && m.user !== userId && !m.read).length
   } 
   
 }

  if (messages) {
    let newLastMessage = messages.find(m => m._id === lastMessage._id);
    if (newLastMessage) lastMessage = newLastMessage;
  }

  return (
    <Link to={`/dialog/${_id}`}>
      <div
        className={classNames("dialogs__item", {
          "dialogs__item--online":
            userId === partner._id ? author.isOnline : partner.isOnline,
          "dialogs__item--selected": currentDialogId === _id
        })}
      >
        <div className="dialogs__item-avatar">
          <Avatar user={userId === partner._id ? author : partner} />
        </div>
        <div className="dialogs__item-info">
          <div className="dialogs__item-info-top">
            <b className="dialogs__item-into-top-name">
              {userId === partner._id ? author.fullName : partner.fullName}
            </b>
            <span className="dialogs__item-into-top-time">
              {timeFromNow(lastMessage.createdAt)}
            </span>
          </div>
          <div className="dialogs__item-info-bottom">
          {!isTyping ? 
          (<p>
            {reactStringReplace(
              renderLastMessage(lastMessage, userId),
              /:(.+?):/g,
              (match, i) => (
                <Emoji key={i} emoji={match} set="apple" size={16} />
              )
            )}
          </p>)
          : (<div className="message__typing">
              <span />
              <span />
              <span />
          </div>)}
            
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
