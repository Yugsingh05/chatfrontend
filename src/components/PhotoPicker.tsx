import React from 'react'
import ReactDOM from 'react-dom'

const PhotoPicker = ({onChange} : {onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  const component = (
    <input type='file' hidden id='photo-picker' onChange={onChange} accept='image/*'/>
  )

  const portalRoot = document.getElementById('photo-picker-element');
  if (!portalRoot) return null;
  return ReactDOM.createPortal(
    component,
    portalRoot
  )
}

export default PhotoPicker