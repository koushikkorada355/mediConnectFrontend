import React from 'react';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Testimonials from '../../components/Testimonials/Testimonials';
import Stats from '../../components/Stats/Stats';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <Testimonials />
      <Stats />
    </div>
  );
};


export default Home;
