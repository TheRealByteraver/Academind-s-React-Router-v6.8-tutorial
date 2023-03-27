import { Outlet } from "react-router-dom";

import EventsNavigation from '../components/EventsNavigation';

function EventsRootLayout() {
  return (
    <>
      {/* <p>(Events Layout)</p> */}
      <EventsNavigation />
      <Outlet />
    </>
  );
}

export default EventsRootLayout;