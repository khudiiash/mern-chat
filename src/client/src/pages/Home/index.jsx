import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Messages, ChatInput, Status, Sidebar } from 'containers';
import { connect } from 'react-redux';
import { userActions, messagesActions } from 'redux/actions'
import { userApi } from 'utils/api'

import './Home.scss';

import { dialogsActions } from 'redux/actions';

const Home = props => {
  let { setCurrentDialogId, user, setOnline, setOffline } = props;
  if (user && !user.isOnline) {setOnline(user); userApi.setOnline(user)}
  window.onbeforeunload = () => {
    
  document.addEventListener('onunload',() => {
    setOffline(user)
    userApi.setOffline(user)
  })
 
  useEffect(() => {
    const { pathname } = props.location;
    const dialogId = pathname.split('/').pop();
    setCurrentDialogId(dialogId);
  }, [props.location.pathname]);
  
  return (
    <section className="home">
      <div className="chat">
        <Sidebar me={user}/>
        {user && (
          <div className="chat__dialog">
            <Status history={props.history}/>
            <Messages me={user}/>
            <div className="chat__dialog-input" >
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
