import React from "react";
import orderBy from "lodash/orderBy";
import { Input, Empty } from "antd";

import { DialogItem } from "../";

import "./Dialogs.scss";
import { useSelector } from "react-redux";

const orderDialogs = (items,allMessages,currentDialogId,typingInDialogWithId,userId) => {
  
  // assign unread messages to dialogs <number>

  // eslint-disable-next-line array-callback-return
  items.map(dialog => {
    if (allMessages && allMessages.length) {
        let unread = allMessages.filter(
          m => m.dialog === dialog._id && m.user !== userId && !m.read
        ).length;
        dialog.unread = unread
        return dialog
      }
    }
  )
    if (items.length) {
      return(
        orderBy(items, ["createdAt"], ["desc"])).map(item => {
           return(
             
           <DialogItem
             key={item._id}
             isTyping={item._id === typingInDialogWithId}
             isOnline={item.partner.isOnline}
             isMe={item.lastMessage.user._id === userId}
             unread={item.unread}
             userId={userId}
             currentDialogId={currentDialogId}
             {...item}
           />
         )})   
    }   
  else {
    return (<Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    style={{color: 'rgba(255,255,255,.7)'}}
    description="Нет диалогов. Попробуйте создать новый"
  />)
  }
  
}
const Dialogs = ({ items,userId, onSearch, inputValue, currentDialogId }) => {
  
  let allMessages = useSelector(state => state.messages.allItems);

  let typingInDialogWithId = useSelector(state => state.dialogs.typingInDialogWithId)
  
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
    {orderDialogs(items,allMessages,currentDialogId,typingInDialogWithId,userId)}
  </div>
)};

export default Dialogs;
