import React from 'react'
import SpecialityMenu from '../Compenents/SpecialityMenu'
import Hero from '../Compenents/Hero'
import TopDoctor from '../Compenents/TopDoctor'
import Banner from '../Compenents/Banner'

function Home() {
  return (
    <div>
      <Hero />
      <SpecialityMenu />
      <TopDoctor />
      <Banner />
    </div>
  )
}

export default Home
