import { useMediaQuery } from "@mui/material";
import { theme } from "../Themes/style";
import { useCallback } from "react";

export const useDynamicFontSize = () => {
    const isMobileScreen = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
    const isTabletScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLaptopScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isDesktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
    // Use useCallback to memoize the function
    const getFontSize = useCallback(() => {
      if (isMobileScreen) return '8px';
      if (isTabletScreen) return '12px';
      if (isLaptopScreen) return '14px';
      if (isDesktopScreen) return '16px';
      return '14px'; // Default size
    }, [isMobileScreen, isTabletScreen, isLaptopScreen, isDesktopScreen]);
  
    return getFontSize();
  };