import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
    const host = 'http://localhost:5000';
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // console.log("Email:",credentials.email,"Password:", credentials.password);
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          });
          const json = await response.json();
          if(!json.success){
              props.showAlert("Invalid Credentials", "danger");
          }
          else{
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.showAlert("Successfully Logged in", "success");
          }
        //   console.log(json);
    }
  return (
    <>
    <h1 className='my-3'>Login to Continue to NotesZone</h1>
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' onChange={onChange} id="password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
    </form>
    </>
  )
}

export default Login
