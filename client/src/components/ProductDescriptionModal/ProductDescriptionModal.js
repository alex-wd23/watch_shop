import {React, useState, useEffect} from 'react'
import './ProductDescriptionModal.css'
import ImageSlider from '../ImageSlider/ImageSlider';

const ProductDescriptionModal = ({ product, onClose }) => {

  const [currentTab, setCurrentTab] = useState('description');
  const [closing, setClosing] = useState(false);

  const slides = [
    { url: "/watch_shop/image-1.jpg", title: "Watch 1" },
    { url: "/watch_shop/image-2.jpg", title: "Watch 2" },
    { url: "/watch_shop/image-3.jpg", title: "Watch 3" }
  ];

  useEffect(() => {
    // Add a class to body to disable scrolling
    document.body.classList.add('no-scroll');

    return () => {
      // Remove the class from body to re-enable scrolling
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const setTabDescription = () => {
      setCurrentTab('description')
  }
  
  const setTabSpecifications = () => {
    setCurrentTab('specifications')
  }
    // State to manage the dimensions of the viewport.
    const [viewportDimensions, setViewportDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  
   const handleClose = () => {
        setClosing(true); // Start closing animation
        setTimeout(() => {
            onClose(); // Actual close action after animation
            setClosing(false); // Reset the state (if the modal is opened again)
        }, 300); // Duration should match the CSS animation
    };
  
    // useEffect hook to handle window resize events.
    useEffect(() => {
      const handleResize = () => {
        // Updating the viewport dimensions when the window is resized.
        setViewportDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      {console.log(viewportDimensions.width)}
  
      // Adding an event listener for the resize event.
      window.addEventListener("resize", handleResize);
      // Cleaning up the event listener when the component is unmounted.
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

        // useEffect hook to handle ESC key press
    useEffect(() => {
      const handleKeyDown = (event) => {
          if (event.keyCode === 27) { // 27 is the key code for the ESC key
            handleClose(); // Call the onClose function when ESC key is pressed
          }
      };

      // Add event listener
      window.addEventListener('keydown', handleKeyDown);

      // Cleanup the event listener on unmount
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleClose])

    return (
      <div className="productModal">
        <div className={`productModalContent ${closing ? 'scale-down' : ''}`}>
        <span className="close" onClick={handleClose}>&times;</span>
          <h1>{product.name}</h1>
          <ImageSlider slides={slides} parentWidth={viewportDimensions.width * 0.75}  autoSlide={false}/>
          <div className='options'>
            <p className={currentTab === 'description' ? 'onClickUnderline' : ''} onClick={setTabDescription}>DESCRIPTION</p>
            <p className={currentTab === 'specifications' ? 'onClickUnderline' : ''} onClick={setTabSpecifications}>SPECIFICATIONS</p>
          </div>
          {currentTab === 'description' ?
          <div className='description-box'> 
          <h2>Description</h2>
          <p>Oreseu thiyrese sngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.
          Oreseu thiyrese sngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc:
          </p>
          <ol>
            <li>thiyrese</li>
            <li>thiyrese</li>
            <li>mauris</li>
          </ol>
          <p>Oreseu thiyrese sngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.
          Oreseu thiyrese sngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc:
          </p>
          </div> : 
          currentTab === 'specifications' ? 
          <div className="specifications-box">
            <h2>Specifications</h2>
            <p>Huirese ngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.</p>
            <table className="specifications-table">
            <tbody>
              <tr>
                <td>Belt Material</td>
                <td>{product.belt_material}</td>
              </tr>
              <tr>
                <td>Dial Size</td>
                <td>{product.dial_size}</td>
              </tr>
              <tr>
                <td>Mechanism</td>
                <td>{product.mechanism}</td>
              </tr>
              <tr>
                <td>Waterproof</td>
                <td>{product.waterproof}</td>
              </tr>
              <tr>
                <td>Special Functions</td>
                <td>{product.special_functions}</td>
              </tr>
              <tr>
                <td>Dial Color</td>
                <td>{product.dial_color}</td>
              </tr>
              <tr>
                <td>Bracelet Color</td>
                <td>{product.bracelet_color}</td>
              </tr>
            </tbody>
          </table>  
          </div>         
            : <p></p>}
        </div>
      </div>
    );
}

export default ProductDescriptionModal;