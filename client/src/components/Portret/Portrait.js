import React from 'react';
import './Portrait.css';

const Portrait = ({ image, name, position }) => {
    return (
        <div className='portrait'>
            <img className='portrait-image' src={image} alt={`${name}'s portrait`} />
            <h3 className='portrait-name'>{name}</h3>
            <p className='portrait-position'>{position}</p>
            <div className='socialMediaLinks'>
                <p>
                <a href="/home"><i className="fab fa-linkedin"></i></a>
                </p>
                <p>
                <a href="/home"><i className="fab fa-twitter"></i></a>
                </p>
                <p>
                <a href="https://github.com/"><i className="fab fa-github"></i></a>
                </p>
                <p>
                <a href="https://www.facebook.com/"><i className="fab fa-facebook"></i></a>
                </p>
                <p>
                <a href="https://www.instagram.com/"><i className="fab fa-instagram"></i></a>
                </p>
            </div>
        </div>
    );
}

export default Portrait;