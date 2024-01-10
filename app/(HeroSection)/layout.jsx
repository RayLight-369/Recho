import Provider from '@/Provider/Provider';
import Image from 'next/image';
import React from 'react';
import DataProvider from '../Contexts/DataContext/DataContext';

const RootLayout = ( { children } ) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <DataProvider>
            { children }
          </DataProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;