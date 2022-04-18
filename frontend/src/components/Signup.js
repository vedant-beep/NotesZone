import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

const Signup = (props) => {
    const host = 'http://localhost:5000';
    const [credentials, setCredentials] = useState({name:'', email: '', password: '', cpassword: ''});
    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name, email, password} = credentials;
        // console.log("Email:",credentials.email,"Password:", credentials.password);
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
          });
          const json = await response.json();
          if(!json.success){
              props.showAlert("Invalid Details", "danger");
          }
          else{
            localStorage.setItem('token', json.authToken);
            props.showAlert("Successfully created a new user", "success");
            navigate("/");
          }
    }
  return (
    <>
    <h1 className='my-3'>Create a new Account to use NotesZone</h1>
    <form onSubmit={handleSubmit}>
    <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name='name' onChange={onChange} minLength={3} aria-describedby="emailHelp" required />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" required/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' onChange={onChange} minLength={5} id="password" required/>
        </div>
        <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name='cpassword' onChange={onChange} id="cpassword" required/>
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
    </form>
    </>
  )
}

export default Signup
