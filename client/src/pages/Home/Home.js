import React, { useState, useEffect } from 'react';
import ImageSlider from '../../components/ImageSlider/ImageSlider.js';
import ShopBanner from '../../components/ShopBanner/ShopBanner.js';
import ProductTab from '../../components/ProductTab/ProductTab.js';
import './Home.css'

const Home = () => {
  // Array containing slide information (image URLs and titles).
  const slides = [
    { url: "/watch_shop/image-1.jpg", title: "Watch 1" },
    { url: "/watch_shop/image-2.jpg", title: "Watch 2" },
    { url: "/watch_shop/image-3.jpg", title: "Watch 3" }
  ];

  // State to manage the dimensions of the viewport.
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // useEffect hook to handle window resize events.
  useEffect(() => {
    const handleResize = () => {
      // Updating the viewport dimensions when the window is resized.
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
    };

    // Adding an event listener for the resize event.
    window.addEventListener("resize", handleResize);
    // Cleaning up the event listener when the component is unmounted.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Styles to constrain the maximum dimensions of the ImageSlider container.
  const containerStyles = {
    width: '100%',
    height: '75vh',
    overflow: 'hidden',
  };

  return (
    <div className='Home'>
      <div style={containerStyles}>
        {/* ImageSlider component displaying a series of slides */}
        <ImageSlider slides={slides} parentWidth={viewportDimensions.width} autoSlide={true}/>
      </div>
      {/* ShopBanner component for showcasing promotions or information */}
      <ShopBanner />
      {/* ProductTab component for displaying product categories or items */}
      <ProductTab parentWidth={viewportDimensions.width}/>
    </div>
  );
};

export default Home;