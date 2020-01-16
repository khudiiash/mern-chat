import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Popover, Button, Icon } from "antd";
import { Emoji } from "emoji-mart";
import reactStringReplace from "react-string-replace";

import { convertCurrentTime, isAudio } from "utils/helpers";

import waveSvg from "assets/img/wave.svg";
import playSvg from "assets/img/play.svg";
import pauseSvg from "assets/img/pause.svg";
import { useMediaQuery } from 'react-responsive'
import exifOrient from 'exif-orient'
import EXIF from 'exif-js'


import { Time, IconRead, Avatar } from "../";

import "./Message.scss";
import { previewImage } from "antd/lib/upload/utils";

const MessageAudio = ({ audioSrc }) => {
  const audioElem = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!isPlaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
  };

  useEffect(() => {
    audioElem.current.volume = "0.01";
    audioElem.current.addEventListener(
      "playing",
      () => {
        setIsPlaying(true);
      },
      false
    );
    audioElem.current.addEventListener(
      "ended",
      () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      },
      false
    );
    audioElem.current.addEventListener(
      "pause",
      () => {
        setIsPlaying(false);
      },
      false
    );
    audioElem.current.addEventListener("timeupdate", () => {
      const duration = (audioElem.current && audioElem.current.duration) || 0;
      setCurrentTime(audioElem.current.currentTime);
      setProgress((audioElem.current.currentTime / duration) * 100);
    });
  }, []);
  return (
    <div className="message__audio">
      <audio ref={audioElem} src={audioSrc} preload="auto" />
      <div
        className="message__audio-progress"
        style={{ width: progress + "%" }}
      />
      <div className="message__audio-info">
        <div className="message__audio-btn">
          <button onClick={togglePlay}>
            {isPlaying ? (
              <img src={pauseSvg} alt="Pause svg" />
            ) : (
              <img src={playSvg} alt="Play svg" />
            )}
          </button>
        </div>
        <div className="message__audio-wave">
          <img src={waveSvg} alt="Wave svg" />
        </div>
        <span className="message__audio-duration">
          {convertCurrentTime(currentTime)}
        </span>
      </div>
    </div>
  );
};

const Message = ({
  _id,
  user,
  text,
  date,
  isMe,
  read,
  attachments,
  isTyping,
  onRemoveMessage,
  setPreviewImage
}) => {

  const isMobile = useMediaQuery({ maxWidth: 767 })
 
  const renderAttachment = item => {
    if (item.ext !== "webm") {
      return (
        <div
          key={item._id}
          onClick={() => setPreviewImage(item.url)}
          className="message__attachments-item"
        >
          <div className="message__attachments-item-overlay">
            <Icon type="eye" style={{ color: "white", fontSize: 18 }} />
          </div>

          <img src={item.url} alt={item.filename} />
        </div>
      );
    } else {
      return <MessageAudio key={item._id} audioSrc={item.url} />;
    }
  };

  return (
    <div
      className={classNames("message", {
        "message--isme": isMe,
        "message--is-typing": isTyping,
        "message--is-audio": isAudio(attachments),
        "message--image":
          !isAudio(attachments) &&
          attachments &&
          attachments.length === 1 &&
          !text
      })}
      style={{width: isMobile ? '90vw' : 'auto'}}

    >
      <div className="message__content" style={{maxWidth: isMobile? '60vw' : '440px'}}>
        <IconRead isMe={isMe} isRead={read} />
        <Popover
          content={
            <div>
              <Button type="danger" onClick={onRemoveMessage}>
                Удалить сообщение
              </Button>
            </div>
          }
          trigger="click"
        >
          <div className="message__icon-actions">
            <Button type="link" shape="circle">
              <Icon type="ellipsis" className="message__icon-actions-icon" />
            </Button>
          </div>
        </Popover>
        <div className="message__avatar">
          <Avatar user={user} isWithin={true}/>
        </div>
        <div className="message__info">
          {(text || isTyping) && (
            <div className="message__bubble">
              {text && (
                <p className="message__text">
                  {reactStringReplace(text, /:(.+?):/g, (match, i) => (
                    <Emoji key={i} emoji={match} set="apple" size={16} />
                  ))}
                </p>
              )}
              {date && (
                <span className="message__date">
                  <Time date={date} />
                </span>
              )}

              {isTyping && (
                <div className="message__typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {false && <MessageAudio audioSrc={null} />}
            </div>
          )}

          {attachments && (
            <div className="message__attachments">
              {attachments.map(item => renderAttachment(item))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Message.defaultProps = {
  user: {}
};

Message.propTypes = {
  avatar: PropTypes.string,
  text: PropTypes.string,
  date: PropTypes.string,
  user: PropTypes.object,
  attachments: PropTypes.array,
  isMe: PropTypes.bool,
  isRead: PropTypes.bool,
  isTyping: PropTypes.bool,
  audio: PropTypes.string
};

export default Message;
