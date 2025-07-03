import React from 'react'
import '../../styles/Works.css'

export default function Works() {
  return (
    <div>
        <div className='container-works'>
        <div className='work-header'>
        <h2 className='work-header1'>How It Works</h2>
        <h4 className='work-header2'>Follow these simple steps to find your ideal property effortlessly.</h4>
        </div>
        <div className='items-section'>
          <div className='item-1'>
          <h3 className='heading-1'>Seach Properties</h3>
          <div className='para-head'>Utilize our advanced search filters to find properties that meet your specific criteria in just a few clicks.</div>
          </div>
          <div className='item-2'>
          <h3 className='heading-1'>Connect with Owners</h3>
          <div className='para-head'>Reach out to property owners directly to ask questions, schedule viewings, or negotiate terms smoothly and efficiently.</div>
          </div>
          <div className='item-3'>
          <h3 className='heading-1'>Finalize Your Deal</h3>
          <div className='para-head'>Complete your transaction with confidence, backed by our secure platform and dedicated support team ready to assist you at every step.</div>
          </div>
        </div>
        </div>
    </div>
  )
}
