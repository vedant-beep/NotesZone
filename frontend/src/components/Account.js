import React, { useEffect, useState } from 'react'

const Account = () => {
  const host = 'http://localhost:5000';
    const [user, setUser] = useState({name:'', email: ''})
    const getUser = async () =>{
      const response = await fetch(`${host}/api/auth/getuser`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      const json = await response.json();
      // console.log(json);
      setUser({name: json.name, email: json.email})
    }
    useEffect(()=>{
      getUser();
      // eslint-disable-next-line
    }, [])
  return (
    <div>
        <div className="vstack gap-3">
          <h2>Your Details</h2>
            <div className="bg-light border"> <strong>Your Name:</strong> {user.name}</div>
            <div className="bg-light border"><strong>Your Email:</strong> {user.email}</div>
        </div>
    </div>
  )
}

export default Account
