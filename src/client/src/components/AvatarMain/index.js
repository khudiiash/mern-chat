import React from "react";
import PropTypes from "prop-types";
import { Modal, Icon } from 'antd'

import { generateAvatarFromName } from "utils/helpers";
import { Button } from 'antd'
import { UploadField } from "@navjobs/upload";

import "../Avatar/Avatar.scss";
import { useSelector } from "react-redux";


const AvatarMain = ({ user, onSelectAvatar, previewImage, setPreviewImage }) => {
  let data = useSelector(state => state.user.data)

  if (user.fullName) {
    if (user.avatar) {
      return (
        <div className='avatar-profile-container'>
          <img
            className="avatar-profile"
            src={user.avatar}
            alt={`Avatar ${user.fullName}`}
          />
          <div className='avatar-profile-buttons'>
            <div className='avatar-profile-button'>
              <UploadField
                onFiles={(files) => onSelectAvatar(files, data)}
                containerProps={{
                  className: "chat-input__actions-upload-btn"
                }}
                uploadProps={{
                  accept: ".jpg,.jpeg,.png,.gif,.bmp",
                  multiple: "multiple"
                }}
              >
                <Button className='avatar-profile-button-icon' type='circle'>
                  <Icon className='avatar-profile-button-icon' type='cloud-upload' />
                </Button>
              </UploadField>
            </div>
            <div className='avatar-profile-button'>
              <Button className='avatar-profile-button-icon' type='circle' onClick={() => setPreviewImage(user.avatar)} title='Смотреть'>
                <Icon className='avatar-profile-button-icon' type='eye' />
              </Button>
              <Modal className='image-preview' visible={!!previewImage} onCancel={() => setPreviewImage(null)} footer={null}>
                <img src={previewImage} style={{ width: '100%' }} alt="Preview" />
              </Modal>

            </div>
          </div>
        </div>

      );
    } else {
      const { color, colorLighten } = generateAvatarFromName(user.fullName);
      const firstChar = user.fullName[0].toUpperCase();
      return (
        <div className='avatar-profile-container'>
          <div
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${colorLighten} 96.52%)`
            }}
            className={`avatar-profile avatar--symbol`}>
            {firstChar}
          </div>
          <div className='avatar-profile-buttons'>
            <div className='avatar-profile-button'>
              <UploadField
                onFiles={(files) => onSelectAvatar(files, data)}
                containerProps={{
                  className: "chat-input__actions-upload-btn"
                }}
                uploadProps={{
                  accept: ".jpg,.jpeg,.png,.gif,.bmp",
                  multiple: "multiple"
                }}
              >
                <Button className='avatar-profile-button-icon' type='circle'>
                  <Icon className='avatar-profile-button-icon' type='cloud-upload' />
                </Button>
              </UploadField>
            </div>
            <div className='avatar-profile-button'>
              <Button className='avatar-profile-button-icon' type='circle' onClick={() => setPreviewImage(user.avatar)} title='Смотреть' style={{ opacity: '0' }}>
                <Icon className='avatar-profile-button-icon' type='eye' />
              </Button>
            </div>


          </div>

        </div>


      );
    }

  }

};

AvatarMain.propTypes = {
  className: PropTypes.string
};

export default AvatarMain;
