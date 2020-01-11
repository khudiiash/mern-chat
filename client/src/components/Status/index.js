import React from 'react';
import PropTypes from 'prop-types';

import { Button, Popover, Icon } from 'antd';

import './Status.scss';
import { useSelector } from 'react-redux';
import { timeFromNow } from 'utils/helpers'



const Status = ({ partner, deleteDialogById }) => {

  let currentDialogId = useSelector(state => state.dialogs.currentDialogId)
  return (
    <div className="chat__dialog-header">
      <div className="chat__dialog-header-center">
        <b className="chat__dialog-header-username">{partner.fullName}</b>
        <div className="chat__dialog-header-status">
          {partner.isOnline ? <span className='status status--online'>В сети</span> : <span className='status--offline'>{timeFromNow(partner.last_seen)}</span>}

        </div>
      </div>
      <Popover
        className="chat__dialog-header-action"
        content={
          <div>
            <Button type='danger' onClick={() => deleteDialogById(currentDialogId)}>Удалить диалог</Button>
          </div>
        }
        trigger="click">
        <div>
          <Button type="link" shape="circle" >
            <Icon type='ellipsis' style={{color: 'white'}}></Icon>
          </Button>
        </div>
      </Popover>
    </div>
  )
};

Status.propTypes = {
  online: PropTypes.bool,
};

export default Status;
