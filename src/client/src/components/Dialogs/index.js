import React from "react";
import orderBy from "lodash/orderBy";
import { Input, Empty } from "antd";

import { DialogItem } from "../";

import "./Dialogs.scss";
import { useSelector } from "react-redux";

const Dialogs = ({ items, friends,userId, onSearch, inputValue, currentDialogId }) => {

 
  let typingInDialogWithId = useSelector(state => state.dialogs.typingInDialogWithId)
  let unreadDialogs = items.filter(item => !item.lastMessage.read)
  let readDialogs = items.filter(item => item.lastMessage.read)
 
  return(
  <div className="dialogs">
    <div className="dialogs__search">
      <Input.Search
       className='dialogs__search-input'
        placeholder="Поиск среди контактов"
        onChange={e => onSearch(e.target.value)}
        value={inputValue}
      />
      
    </div>
    {items.length ? (
      unreadDialogs.length && readDialogs.length ? 
      orderBy(unreadDialogs, ["createdAt"], ["desc"]).concat(orderBy(readDialogs, ["createdAt"], ["desc"])).map(item => {
        
        return(
        <DialogItem
          key={item._id}
          friends={friends}
          isTyping={item._id === typingInDialogWithId}
          isMe={item.author._id === userId}
          unread={item.unread}
          userId={userId}
          currentDialogId={currentDialogId}
          {...item}

        />
      )})
     : unreadDialogs.length && !readDialogs.length ? 
      orderBy(unreadDialogs, ["createdAt"], ["desc"]).map(item => {
       
      return(
      <DialogItem
        key={item._id}
        friends={friends}
        isTyping={item._id === typingInDialogWithId}
        isMe={item.author._id === userId}
        unread={item.unread}
        userId={userId}
        currentDialogId={currentDialogId}
        {...item}

      />
    )})
    : !unreadDialogs.length && readDialogs.length 
    ?  orderBy(readDialogs, ["createdAt"], ["desc"]).map(item => {
       
      return(
      <DialogItem
        key={item._id}
        friends={friends}
        isTyping={item._id === typingInDialogWithId}
        isMe={item.author._id === userId}
        unread={item.unread}
        userId={userId}
        currentDialogId={currentDialogId}
        {...item}

      />
    )}) :
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{color: 'rgba(255,255,255,.7)'}}
        description="Ничего не найдено"
      />
    ): <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    style={{color: 'rgba(255,255,255,.7)'}}
    description="Ничего не найдено"
  />}
  </div>
)};

export default Dialogs;
