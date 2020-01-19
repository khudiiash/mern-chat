import React from "react";
import PropTypes from "prop-types";
import { generateAvatarFromName } from "utils/helpers";
import "./Avatar.scss";
import {useMediaQuery} from 'react-responsive'

const Avatar = ({ user, isWithin }) => {

  const isMobile = useMediaQuery({ maxWidth: 767 })

  if (user.avatar) {
    return (
      <img
        className="avatar"
        src={user.avatar}
        alt={`Avatar ${user.fullName}`}
        style={{display : isMobile && isWithin ? 'none':'block',width: isMobile?'45px':'40px',height: isMobile? '45px':'40px'}}
      />
    );
  } else {
    const { color, colorLighten } = generateAvatarFromName(user.fullName);
    const firstChar = user.fullName[0].toUpperCase();
    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${colorLighten} 96.52%)`,
          display : isMobile && isWithin ? 'none':'block',
          width: isMobile?'45px':'40px',height: isMobile? '45px':'40px',
          lineHeight: isMobile?'43px':'38px',
        }}
        className="avatar avatar--symbol"
        
        >
        {firstChar}
      </div>

    );
  }
  
};

Avatar.propTypes = {
  className: PropTypes.string
};

export default Avatar;
