import { LoadingButton } from "@mui/lab";
import React from "react"

interface IProps {
  title: string;
  onClick: () => void;
  style?: any;
  hoverStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  loading?: boolean;
  disabled?: boolean
  // style?: React.CSSProperties;
  fullWidth?: boolean;
  startIcon?: JSX.Element;
}

export const CButton: React.FC<IProps> = ({
  title,
  onClick,
  style,
  hoverStyle,
  activeStyle,
  loading = false,
  disabled = false
}) => {

  return (
    <LoadingButton
      disabled={disabled}
      onClick={onClick}
      loading={loading}
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
        // minWidth: '160px',
        textTransform: 'uppercase',
        whiteSpace: 'normal',
        fontWeight: '700',
        textAlign: 'center',
        padding: '17px 48px',
        height: '48px',
        margin: 'auto 0',
        ...style
      }}
    // onMouseEnter={(e) => e.target.style.backgroundColor = '#21e065'}
    // onMouseLeave={(e) => e.target.style.backgroundColor = '#1ED760'}
    >
      {!loading && <span>{title}</span>}
    </LoadingButton>
  );
}