import React, { useContext, useEffect } from 'react'
import noteContext from '../context/notes/noteContext'
const About = () => {
    const info = useContext(noteContext);
    useEffect(()=>{
        info.update();
        //eslint-disable-next-line
    }, [])
  return (
    <div>
      This is about {info.state.name} studying in {info.state.status}
    </div>
  )
}

export default About
