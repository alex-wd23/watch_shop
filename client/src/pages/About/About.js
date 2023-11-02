import React from 'react';
import './About.css';
import Portrait from '../../components/Portret/Portrait';
import TextBox from '../../components/TextBoxes/TextBox';

const About = () => {
  return (
    <div className='about'>
      <div>
        <h1 className='title'>ABOUT US</h1>
      </div>
      <div className='section1'>
        <div className='text1'>
          <h1>Extraordinary watch style</h1>
          <p>Your Passion is Watch Products</p>
          <p>
            Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
            Maecenas tempus, tellus eget condimentum rhoncus. Curabitur ullamcorper
            ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget
            condimentum rhoncus. Curabitur ullamcorper ultricies nisi.
            Curabitur ullamcorper ultricies nisi.
          </p>
        </div>
        <div className='midImageContainer'>
          <img className='midImage' src='/watch_shop/aboutImages/image-1.jpg' alt="Watch" />
        </div>
      </div>
      <div className='section2'>
        <h1>Our Journey So Far ...</h1> 
          <div className='firstLine'>
            <TextBox
              title="Founded in 2022"
              description="Thurese rhuyengilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
            <TextBox
              title="Trusted"
              description="Oreseu thiyrese sngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
            <TextBox
              title="Quality that speaks"
              description="Huirese ngilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
          </div>
          <div className='secondLine'>
            <TextBox
              title="Defining Fashion"
              description="Phurese vgilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
            <TextBox
              title="Apparels"
              description="Mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
            <TextBox
              title="QuickShop Accesories"
              description="Kiuerehsue seilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc."
            />
          </div>
      </div>
      <div className='section3'>
        <div className='text3'>
          <h1>Our Team</h1>
          <p>
            When we take care of our employees, knowing very well, they will feel the same
            towards the customers and would do everything in their power to take care of
            them!
          </p>
          <div className='teamPortraits'>
            <Portrait image='/watch_shop/aboutImages/portrait.png' name='Harvey Hadden' position='Designer' />
            <Portrait image='/watch_shop/aboutImages/portrait.png' name='Leah Collins' position='Human Resources' />
            <Portrait image='/watch_shop/aboutImages/portrait.png' name='Anthony Saddleworth' position='Front Office Manager' />
            <Portrait image='/watch_shop/aboutImages/portrait.png' name='Anna Quinn' position='Design Analyst' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;