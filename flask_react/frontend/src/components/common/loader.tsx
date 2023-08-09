import { useState, useEffect } from 'react';
import "./Loader.css";
import Lottie from 'react-lottie';
import animationData from '../../resources/lottie/loader_pin.json';

export const Loader = ({ isVisible = true, timeout = 15000 }) => {

  const [showLoader, setShowLoader] = useState(isVisible);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (!showLoader) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <div className="loader-container">
        <Lottie
          options={defaultOptions}
          height={200}
          width={200}
        />
        <p style={{
          textAlign: 'center',
          marginTop: '15px',
          fontFamily: '"Roboto", sans-serif',
          color: '#333'
        }}>Loading...</p>
      </div>
    </div>
  );
};