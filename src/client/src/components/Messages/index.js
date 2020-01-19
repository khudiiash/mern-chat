import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { Empty, Spin } from 'antd';
import classNames from 'classnames';

import { Message } from '../';

import './Messages.scss';
import { useMediaQuery } from 'react-responsive';

const Messages = ({
  onRemoveMessage,
  blockRef,
  isLoading,
  items,
  user,
  previewImage,
  setPreviewImage,
  blockHeight,
  isTyping,
  typingInDialogWithId,
  partner,
  me,
  currentDialog,

}) => {
  const isMobile = useMediaQuery({maxWidth:767})
  return (
    <div className="chat__dialog-messages" style={{ height: isMobile ? `calc(100% - ${blockHeight}px)` : `calc(100% - ${blockHeight}px)`,width: isMobile ? '100vw' : 'auto'}}>
      <div ref={blockRef} className={classNames('messages', { 'messages--loading': isLoading })}>
        {isLoading && !user ? (
          <Spin size="large" tip="Загрузка сообщений..." />
        ) : items && !isLoading ? (
          items.length > 0 ? (
            items.reduce((unique,item) => unique.includes(item) ? unique : [...unique,item],[]).map(item => {
              return(
              <Message
                {...item}
                date={item.createdAt}
                dialog={item.dialog}
                isMe={item.user._id === user._id}
                isTyping={false}
                onRemoveMessage={onRemoveMessage.bind(this, item._id)}
                setPreviewImage={setPreviewImage}
                key={item._id}
              />
            )})
          ) : (
            ''
          )
        ) : (
          <Empty description="Откройте диалог" className='chat__info-message'/>
        )}
        {isTyping && typingInDialogWithId===currentDialog._id &&
        <Message 
            isTyping={true} 
            user={partner}         
        />}
        <Modal  className='image-preview' visible={!!previewImage} onCancel={() => setPreviewImage(null)} footer={null}>
          <img src={previewImage} style={{ width: '100%' }} alt="Preview" />
        </Modal>
      </div>
    </div>
  );
};

Messages.propTypes = {
  items: PropTypes.array,
};

export default Messages;
