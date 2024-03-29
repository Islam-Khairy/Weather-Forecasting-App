import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import '../App.css';

const Footer = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ['Generated with ❤️ by Islam Khairy'],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 2000,
      loop: true,
    };

    typedRef.current = new Typed('.footer-text', options); 

    if (typedRef.current && typedRef.current.cursor) {
      typedRef.current.cursor.style.display = 'none';
    }

    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className='footer'>
      <div className='footer-text'></div>
    </div>
  );
};

export default Footer;