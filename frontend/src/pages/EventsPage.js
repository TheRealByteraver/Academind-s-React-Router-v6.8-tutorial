import { Suspense } from 'react';
import { useLoaderData, json, defer, Await } from 'react-router-dom';

import EventsList from '../components/EventsList';

async function loadEvents() {
  const response = await fetch('http://localhost:8080/events');
  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    // throw new Error('could not fetch data from /events backend');

    // throw new Response(
    //   JSON.stringify({ message: 'Could not fetch events.' }),
    //   { status: 500 }
    // );

    // same as the 'throw' statement above:
    return json(
      { message: 'Could not fetch events.' },
      { status: 500 }
    );
  } else {
    // code for the original component using useEffect()
    // const resData = await response.json();
    // return resData.events;

    // code for the component when not using defer()
    // return response;

    // code for the component using defer()
    const resData = await response.json();
    return resData.events;
  }  
}

// By convention, the code for loader function is placed in the same file
// as the component that uses this loader() function
export const loader = () => {
  return defer({
    events: loadEvents() // note how we _execute_ the async loadEvents() fn here
  });

}

function EventsPage() {
  const { events } = useLoaderData(); 

  return (
    // The <Suspense /> component is a React component which can be used in certain 
    // situations to show a fallback whilst we are waiting for other data to arrive.
    // It is not specific to React Router. <Await> on the other hand _is_ react router
    // specific.
    // This fallback + Await is especially useful if we have to load data from multiple 
    // locations with different delays.
    <Suspense fallback={<p style={{textAlign: 'center'}}>fallback component =  Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
    // <EventsList events={events} />
  );
}

// ****************************************************************************
// ****************************************************************************
// Below is the code we would use without defer()

// function EventsPage() {
//   // get data returned by loader() as defined in the router object.
//   // Note that the loader() returns a promise, but React Router will
//   // automatically wait for it to resolve before rendering this component.
//   const data = useLoaderData(); 
//   const events = data.events;

//   return (
//     // Note that because <EventsList /> is a child component of <EventsPage />
//     // We could also have used the useLoaderData() hook directly in <EventsList />
//     // instead, thus not needing to pass it as a prop.
//     // Note that it is not possible to get access to the data returned by the
//     // loader() function in a higher route (closer to the root route).
//     <EventsList events={events} />
//   );
// }

export default EventsPage;


// ****************************************************************************
// ****************************************************************************
// Below is the pre-loader() code

// import { useEffect, useState } from 'react';

// import EventsList from '../components/EventsList';

// function EventsPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchedEvents, setFetchedEvents] = useState();
//   const [error, setError] = useState();

//   useEffect(() => {
//     async function fetchEvents() {
//       setIsLoading(true);
//       const response = await fetch('http://localhost:8080/events');

//       if (!response.ok) {
//         setError('Fetching events failed.');
//       } else {
//         const resData = await response.json();
//         setFetchedEvents(resData.events);
//       }
//       setIsLoading(false);
//     }

//     fetchEvents();
//   }, []);
//   return (
//     <>
//       <div style={{ textAlign: 'center' }}>
//         {isLoading && <p>Loading...</p>}
//         {error && <p>{error}</p>}
//       </div>
//       {!isLoading && fetchedEvents && <EventsList events={fetchedEvents} />}
//     </>
//   );
// }

// export default EventsPage;