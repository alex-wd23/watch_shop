import React, { useCallback, useEffect, useRef, useState } from "react";
import './ImageSlider.css';

const ImageSlider = ({ slides, parentWidth }) => {
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to the previous slide
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? slides.length - 1 : prevIndex - 1);
  };

  // Navigate to the next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex === slides.length - 1 ? 0 : prevIndex + 1);
  }, [slides.length]);

  // Handling keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Setting up auto-slide functionality
  useEffect(() => {
    timerRef.current = setTimeout(goToNext, 4000);
    return () => clearTimeout(timerRef.current); // Cleanup timer on component unmount
  }, [goToNext, currentIndex]);

  // Adding and cleaning up the keyboard event listener
  useEffect(() => {
    const sliderElement = sliderRef.current;
    sliderElement.addEventListener('keydown', handleKeyDown);
    return () => {
      sliderElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={sliderRef} tabIndex="0" className='sliderStyles'>  
      <div onClick={goToPrevious} className='imgSliderArrowStyles imgSliderLeftArrowStyles'>❰</div>
      <div onClick={goToNext} className='imgSliderArrowStyles imgSliderRightArrowStyles'>❱</div>  

      <div className='slidesContainerOverflowStyles'>
        <div className='slidesContainerStyles' style={{
          width: `${parentWidth * slides.length}px`,
          transform: `translateX(${-(currentIndex * parentWidth)}px)`
        }}>
          {slides.map((slide, index) => (
            <div key={index} className='slideStyles'>
              {/* Image applied with lazy loading and centered within each slide */}
              <img src={slide.url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;