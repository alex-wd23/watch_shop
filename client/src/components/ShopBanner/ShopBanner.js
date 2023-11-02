import React from 'react';
import './ShopBanner.css';
import image1 from './Images/image-1.jpg';
import image2 from './Images/image-2.jpg';
import image3 from './Images/image-3.jpg';

// Functional Component for the Shop Banner, for reusability
const BannerItem = ({ href, src, alt, text }) => (
  <div className='imageWithText'>
    <a href={href}>
      <img className='image_style' src={src} alt={alt}></img>
      <div className='imageText'>{text}</div>
    </a>
  </div>
);

const ShopBanner = () => {
  return (
    <div className='bannerContainer'>
      <BannerItem href='/mens-watches' src={image1} alt='Men’s Watches' text="MEN'S WATCHES" />
      <BannerItem href='/womens-watches' src={image2} alt='Women’s Watches' text="WOMEN'S WATCHES" />
      <BannerItem href='/couple-watches' src={image3} alt='Couple Watches' text="COUPLE WATCHES" />
    </div>
  );
};

export default ShopBanner;