import Lottie from 'react-lottie';
import animationData from '../../resources/lottie/finalItienary.json';

export const FinalItinerary = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: 'transparent', flexDirection: 'column', justifyContent: 'center' }}>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
      />
    </div>
  );
};
