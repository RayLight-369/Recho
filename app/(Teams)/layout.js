import Provider from '@/Provider/Provider.jsx';
import ThemeProvider from '../Contexts/ThemeContext/ThemeContext';
import DataProvider from '../Contexts/DataContext/DataContext';
// import { AnimatePresence, motion } from 'framer-motion';
import IsMobileProvider, { ToggleNavProvider } from '../Contexts/IsMobileContext/IsMobileContext';
import ChildLayout from './ChildLayout.jsx';
import PageWrapper from '../Components/PageWrapper/PageWrapper.jsx';
import "../globals.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                  <ToastContainer
                    position="top-right"
                    autoClose={ 5000 }
                    // hideProgressBar={ false }
                    // newestOnTop={ false }
                    // closeOnClick
                    // rtl={ false }
                    // pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  // transition="Bounce"
                  />
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
