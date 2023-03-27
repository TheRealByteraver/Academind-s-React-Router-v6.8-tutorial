import { Suspense } from 'react';
import { json, useRouteLoaderData, redirect, defer, Await } from 'react-router-dom';

import EventItem from '../components/EventItem';
import EventsList from '../components/EventsList';

// the function loadEvents() was copy-pasted here from EventsPage.js for 
// the single purpose of showing how deferred loading can be usefull when 
// loading data from more than one source, with different delays.

async function loadEvent(id) {
  const response = await fetch(`http://localhost:8080/events/${id}`);
  if (!response.ok) {
    throw json(
      {message: 'Could not fetch details for selected event.'},
      { status: 500 }
    );
  } else {
    // return response;
    const resData = await response.json();
    return resData.event;    
  }
}

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

export async function loader({request, params}) {
  const id = params.eventId;
  // Consider the scenario where we only want to defer loading _certain_ 
  // components' data, but not all, for example, because we _know_ that
  // a specific component will be loaded very fast anyway, not requiring
  // a "Loading" message on the site. 
  // Disabling this deferred loading can be accomplishing by using the 
  // **await** keyword, as we do below for loading a single events' details.
  // This means the component <EventDetailPage /> will only start loading
  // once the call to _loadEvent(id)_ has completed.
  return defer({
    event: await loadEvent(id), // disable defer logic in <EventDetailPage />
    events: loadEvents()        // load after initial rendering <EventDetailPage />
  })


  // pre-defer code:
  // const response = await fetch(`http://localhost:8080/events/${params.eventId}`);
  // if (!response.ok) {
  //   throw json(
  //     {message: 'Could not fetch details for selected event.'},
  //     { status: 500 }
  //   );
  // } else {
  //   return response;
  // }
}

export async function action({request, params}) {
  const eventId = params.eventId;
  const response = await fetch('http://localhost:8080/events/' + eventId, {
    method: request.method, //'DELETE'
  });
  if (!response.ok) {
    // console.log('error deleting event:', response.status);
    throw json(
      {message: 'Could not delete event.'},
      { status: 500 }
    );
  } else {
    return redirect('/events');
  }
}

function EventDetailPage() {
  // The id 'event-detail' was defined in the router config in App.js. Besides
  // the extra id specification, the useRouteLoaderData() hook is similar to the
  // useLoaderData() hook.

  // pre-defer code:
  // const data = useRouteLoaderData('event-detail'); 

  const { event, events } = useRouteLoaderData('event-detail'); 

  return (
    <>
      {/* Note how we wrap each <Await /> block in its own <Suspense /> block. 
      This is done so each <Await /> block will be rendered when it's ready.
      If we would wrap both <Await /> blocks in a single <Suspense /> block,
      they would only render when _both_ <Await /> blocks are ready. */}
      <Suspense fallback={<p style={{textAlign: 'center'}}>Deferred Loading single event...</p>}>
        <Await resolve={event}>
          { loadedEvent => <EventItem event={loadedEvent} /> }
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{textAlign: 'center'}}>Deferred Loading all events...</p>}>
        <Await resolve={events}>
          { loadedEvents => <EventsList events={loadedEvents} /> }
        </Await>
      </Suspense>
    </>

  );
}

export default EventDetailPage;