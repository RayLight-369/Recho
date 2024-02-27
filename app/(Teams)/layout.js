import Provider from '@/Provider/Provider.jsx';
import ThemeProvider from '../Contexts/ThemeContext/ThemeContext';
import DataProvider from '../Contexts/DataContext/DataContext';
// import { AnimatePresence, motion } from 'framer-motion';
import IsMobileProvider, { ToggleNavProvider } from '../Contexts/IsMobileContext/IsMobileContext';
import ChildLayout from './ChildLayout.jsx';
import PageWrapper from '../Components/PageWrapper/PageWrapper.jsx';
import "../globals.css";

export default function RootLayout ( { children } ) {

  return (
    <html lang="en">
      <body>
        <Provider >
          <ThemeProvider>
            {/* <AnimatePresence mode='wait'> */ }
            <DataProvider>
              {/* <PageWrapper> */ }
              <IsMobileProvider>
                <ToggleNavProvider>
                  <ChildLayout>
                    { children }
                  </ChildLayout>
                </ToggleNavProvider>
              </IsMobileProvider>
              {/* </PageWrapper> */ }
            </DataProvider>
            {/* </AnimatePresence> */ }
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
