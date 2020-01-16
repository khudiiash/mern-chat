import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Input, Icon } from "antd";
import { UploadField } from "@navjobs/upload";
import { Picker } from "emoji-mart";

import { UploadFiles } from "components";
import {useMediaQuery} from 'react-responsive'
import "./ChatInput.scss";

const { TextArea } = Input;

const ChatInput = props => {
  const {
    emojiPickerVisible,
    value,
    addEmoji,
    setValue,
    handleSendMessage,
    sendMessage,
    toggleEmojiPicker,
    attachments,
    onSelectFiles,
    isRecording,
    onRecord,
    onHideRecording,
    removeAttachment,
    isLoading,
  } = props;
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return (
    <Fragment>
      <div className="chat-input" style={{ width: isMobile ? '96vw' : '96%', top:  isMobile ? '10px' : '50px' }}>
        <div>
          <div className="chat-input__smile-btn">
            <div className="chat-input__emoji-picker">
              {emojiPickerVisible && (
                <Picker onSelect={emojiTag => addEmoji(emojiTag)} set="apple" />
              )}
            </div>
            <Button
              className="chat-input-button"
              onClick={toggleEmojiPicker}
              type="link"
              shape="circle"
            >
              <Icon type='smile' className='chat-input-icon'/>
            </Button>
          </div>
          {isRecording ? (
            <div className="chat-input__record-status">
              <i className="chat-input__record-status-bubble"></i>
              Recording...
              <Button
                onClick={onHideRecording}
                type="link"
                shape="circle"
                className="stop-recording chat-input-button"
              >
                 <Icon type='close' className='chat-input-icon'/>
              </Button>
            </div>
          ) : (
            <TextArea
              onChange={e => setValue(e.target.value)}
              id='chatTextarea'
              onKeyUp={handleSendMessage}
              className='chat-input-textarea'
              size="large"
              placeholder="Введите текст сообщения…"
              value={value}
              autoSize={{ minRows: 1, maxRows: 6 }}
              style={{width: isMobile ? '100vw' : '100%'}}
            />
          )}

          <div className="chat-input__actions">
            <UploadField
              onFiles={onSelectFiles}
              containerProps={{
                className: "chat-input__actions-upload-btn"
              }}
              uploadProps={{
                accept: ".jpg,.jpeg,.png,.gif,.bmp",
                multiple: "multiple"
              }}
            >
              <Button  className='chat-input__button' type="link" shape="circle">
                  <Icon type='camera' className='chat-input-icon'/>
              </Button>
            </UploadField>
            {isLoading ? (
              <Button  className='chat-input__button' type="link" shape="circle"><Icon type='loading' className='chat-input-icon'/></Button>
            ) : isRecording || value || attachments.length ? (
              <Button
                className='chat-input__button'
                onClick={sendMessage}
                type="link"
                shape="circle"
              > <Icon type='check-circle' className='chat-input-icon' /></Button>
            ) : (
              <div className="chat-input__record-btn">
                <Button
                  className='chat-input__button'
                  onClick={onRecord}
                  type="link"
                  shape="circle"
                >
                   <Icon type='audio' className='chat-input-icon' />
                </Button>
              </div>
            )}
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="chat-input__attachments" style={{position: 'relative',top:'-180px'}}>
            <UploadFiles
              removeAttachment={removeAttachment}
              attachments={attachments}
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

ChatInput.propTypes = {
  className: PropTypes.string
};

export default ChatInput;
