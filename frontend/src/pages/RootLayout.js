import { Outlet, useNavigation } from "react-router-dom";

import MainNavigation from '../components/MainNavigation';

function RootLayout() {
  const navigation = useNavigation();

  // navigation.state can be 'idle', 'loading' or 'submitting'

  return (
    <>
      {/* <p>(Root Layout)</p> */}
      <MainNavigation />
      <main>
        {navigation.state === 'loading' && <p>Loading...</p>}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;