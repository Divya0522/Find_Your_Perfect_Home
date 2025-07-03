import React from 'react'
import '../../styles/About.css';
import image1 from '../../images/i1.png';
import image2 from '../../images/i2.png';
import image3 from '../../images/i3.png';

export default function About () {
  return (
    <div className='about'>
        <div className="atitle">
           <h2 className='ah1'>What Our Users Say</h2> 
           <h4 className='ah4'>Real experiences from those who have successfully found their place with us.</h4>
        <div className="acards">
  <div className="acard left">
    <img src={image1} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>A Game Changer!</strong>
      <p>
      I found my dream apartment in no time! The platform is intuitive and the support team was incredibly helpful throughout the process.
      </p>
    </div>
  </div>
  <div className="acard right">
    <img src={image2} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>Highly Recommend!</strong>
      <p>
      As a first-time renter, I was nervous. However, Find Your Place made everything so easy and straightforward. I would definitely recommend it!
      </p>
    </div>
  </div>
  <div className="acard left">
    <img src={image3} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>Fantastic Experience</strong>
      <p>
      Selling my property was a breeze thanks to the user-friendly interface and direct communication with potential buyers. Highly satisfied!
      </p>
    </div>
  </div>
    </div>
    </div>
    </div>
  )
}
