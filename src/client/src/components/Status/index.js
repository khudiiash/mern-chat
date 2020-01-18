import React from 'react';
import PropTypes from 'prop-types';

import { Button, Popover, Icon } from 'antd';

import './Status.scss';
import { useSelector } from 'react-redux';
import { timeFromNow } from 'utils/helpers'
import { useMediaQuery } from 'react-responsive'

const GoBackIcon = ({goBack}) => {
  return(
    <div className='status-go-back' onClick={()=> goBack()}>
        <Icon className='status-go-back-arrow' type='left' style={{color: 'grey'}} />
    </div>
   
  )
}

const Status = ({ partner, deleteDialogById,goBack }) => {

  let currentDialogId = useSelector(state => state.dialogs.currentDialogId)
  const isMobile = useMediaQuery({ maxWidth: 767 })

  return (
    <div className="chat__dialog-header" style={{width: isMobile ? '100vw' : '100%', background: isMobile ? 'rgb(45,45,45)':'linear-gradient(to bottom,rgba(0, 0, 0, 0.144) 30%, rgba(255,255,255,0))'}}>
      {isMobile ?  <GoBackIcon goBack={goBack}/>: ''}
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
