import React from 'react'
import { LuUser } from 'react-icons/lu';

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className='flex items-center'>
      {avatars.slice(0, maxVisible).map((avatar, index) => {
        const imageUrl = typeof avatar === 'string' ? avatar : avatar?.profileImageUrl;
        const name = typeof avatar === 'object' ? avatar?.name : null;

        return imageUrl ? (
          <div key={index} className='relative w-9 h-9 -ml-3 first:ml-0 flex-shrink-0'>
            <img
              src={imageUrl}
              alt={name || `Avatar ${index}`}
              className='w-9 h-9 rounded-full border-2 border-white object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.querySelector('.fallback').style.display = 'flex';
              }}
            />
            <div
              className='fallback w-9 h-9 rounded-full border-2 border-white bg-blue-100 items-center justify-center text-blue-600 text-xs font-semibold absolute top-0 left-0'
              style={{ display: 'none' }}
            >
              {name ? name.charAt(0).toUpperCase() : <LuUser className="text-sm" />}
            </div>
          </div>
        ) : (
          <div
            key={index}
            className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold'
          >
            {name ? name.charAt(0).toUpperCase() : <LuUser className="text-sm" />}
          </div>
        );
      })}

      {avatars.length > maxVisible && (
        <div className='w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3'>
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  )
}

export default AvatarGroup