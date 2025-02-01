import React from 'react';
import Header from './components/Header';
import GalvanicTheory from './components/GalvanicTheory';
import GalvanicCalculator from './components/GalvanicCalculator';
import Footer from './components/Footer';


function App() {
  return (
    <div className="app-container">
      <Header />
      <GalvanicTheory />
      <GalvanicCalculator />
      <Footer/>
    </div>
  );
}

export default App;
