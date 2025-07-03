import React from 'react';

import Featured from './Featured';
import Works from './Works';
import About from './About';
import HeroSection from './HeroSecion';

export default function Home() {
  return (
    <div>
       <HeroSection/>
      <Featured />
      <Works />
      <About />

    </div>
  );
}
