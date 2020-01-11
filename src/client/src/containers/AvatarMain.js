import React, {  useState } from 'react';
import { AvatarMain as AvatarMainBase } from "components";
import { connect } from "react-redux";
import { userActions } from 'redux/actions'
import { filesApi, userApi } from 'utils/api';



const AvatarMain = props => {
    let {setAvatar,user} = props

    const [previewImage, setPreviewImage] = useState(null)

    const onSelectAvatar = async (files, data) => {
  
        let uploaded = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uid = Math.round(Math.random() * 1000);
          uploaded = [
            ...uploaded,
            {
              uid,
              name: file.name,
              status: 'uploading',
            },
          ];
          // eslint-disable-next-line no-loop-func
          await filesApi.upload(file).then(({ data }) => {
            uploaded = uploaded.map(item => {
              if (item.uid === uid) {
                return {
                  status: 'done',
                  uid: data.file._id,
                  name: data.file.filename,
                  url: data.file.url,
                };
              }
              return item;
            });
          });
        }
        if (uploaded) {
          let url = uploaded[0].url
          data.avatar = url

          setAvatar(data) // update avatar in the state
          userApi.setAvatar(data) // send avatar to the server
        }
       
      };
 
     return <AvatarMainBase 
        user={user}
        onSelectAvatar={onSelectAvatar}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
  />;
};

export default connect(({avatar}) => ({avatar}),{ ...userActions },
)(AvatarMain);
