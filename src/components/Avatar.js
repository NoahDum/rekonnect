import React from 'react'

const Avatar = ({ imgUrl }) => {
    return (
      <div className="avatar">
        <img src={imgUrl} alt="user avatar" className='avatar-img' />
      </div>
    );
  }

export default Avatar