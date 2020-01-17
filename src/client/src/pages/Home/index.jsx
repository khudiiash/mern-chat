import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Messages, ChatInput, Status, Sidebar } from 'containers';
import { connect } from 'react-redux';
import { userActions, messagesActions } from 'redux/actions'
import { useMediaQuery } from 'react-responsive'
import socket from 'core/socket'

import './Home.scss';

import { dialogsActions } from 'redux/actions';

const Home = props => {
  let { setCurrentDialogId, user } = props;
  if (user) {
    socket.emit('USER:ONLINE', user)
  }
 
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const mobileOpenDialog = () => {
    let sidebarElement = document.querySelector('.chat__sidebar')
    let dialogElement = document.querySelector('.chat__dialog')
    if (sidebarElement && dialogElement) {
      sidebarElement.style.transform = 'translateX(-100vw)'
      dialogElement.style.transform = 'translateX(-100vw)'
    }
  }
  useEffect(() => {
    const { pathname } = props.location;
    const dialogId = pathname.split('/').pop();
    setCurrentDialogId(dialogId);
    
    if (isMobile && dialogId) mobileOpenDialog()
    
  }, [props.location.pathname]);

  
  return (
    <section className="home">
      <div className="chat">
        <Sidebar me={user}/>
        {user && (
          <div className="chat__dialog" style={{width: isMobile ? '100vw' : 'auto'}}>
            <Status history={props.history}/>
            <Messages me={user}/>
            <div className="chat__dialog-input" style={{height: isMobile ? '70px' : '120px'}}>
              <ChatInput />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default withRouter(
  connect(
    ({ user }) => ({ user: user.data }),
    { ...dialogsActions, ...userActions, ...messagesActions }
  )(Home),
);
