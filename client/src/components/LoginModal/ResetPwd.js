import React from 'react'

const ResetPwd = ({formData, handleChange}) => {
  return (
    <div>
        <input type="password" name="newPassword" placeholder="New password" value={formData.newPassword} onChange={handleChange} required/>
        <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required/> 
        <button className="submit-button" type="submit">Reset</button>
    </div>
  )
}

export default ResetPwd;