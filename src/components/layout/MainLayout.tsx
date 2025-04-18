import React from 'react';
import { ReactNode, FC } from 'react';
import { Box } from '@mui/material';

interface MainLayoutProps { children: ReactNode }
const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return <Box>{children}</Box>;
};

export default MainLayout;