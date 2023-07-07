import React from "react"

interface IProps {
	title: string;
	onClick: () => void;
}

export const CButton : React.FC<IProps> = ({
	title,
	onClick

})  => {

return (
  <button
    style={{
      display: 'inline-block',
      outline: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      lineHeight: '1',
      borderRadius: '500px',
      transitionProperty: 'background-color, border-color, color, box-shadow, filter',
      transitionDuration: '.3s',
      border: '1px solid transparent',
      letterSpacing: '2px',
      minWidth: '160px',
      textTransform: 'uppercase',
      whiteSpace: 'normal',
      fontWeight: '700',
      textAlign: 'center',
      padding: '17px 48px',
      color: '#fff',
      backgroundColor: '#1ED760',
      height: '48px',
    }}
    // onMouseEnter={(e) => e.target.style.backgroundColor = '#21e065'}
    // onMouseLeave={(e) => e.target.style.backgroundColor = '#1ED760'}
  >
    {title}
  </button>
);
}