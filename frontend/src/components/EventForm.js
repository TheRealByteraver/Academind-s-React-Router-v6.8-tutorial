import { useNavigate, Form, useNavigation, useActionData, json, redirect } from 'react-router-dom';

import classes from './EventForm.module.css';

export async function action({request, params}) {
  // access the form data:
  const data = await request.formData();

  const eventData = {
    title: data.get('title'),
    image: data.get('image'),
    date: data.get('date'),
    description: data.get('description'),
  }

  let url = 'http://localhost:8080/events';
  if (request.method.toUpperCase() === 'PATCH') {
    url += '/' + params.eventId;
  }

  const response = await fetch(url, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData),
  });

  // If the backend returns 422, it means a validation error occured
  // (for this particular backend, not necessarily in general)
  if (response.status === 422) { 
    // we do not redirect to a different page, so we stay on the original page,
    // in this case /events/:eventId/edit, i.e. the <EventForm /> component
    return response;
  }

  if (!response.ok) {
    throw json({message: 'Could not save event'}, {status: 500});
  }

  // The redirect function also creates a response object
  return redirect('/events');
}


function EventForm({ method, event }) {
  const data = useActionData();     // get feedback from action() function
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  function cancelHandler() {
    navigate('..');
  }

  console.log('submission errors:', data?.errors);

  // note that, for Forms to work well with React Router, each input *must* have a _name_ attribute.
  // Note that we use a <Form /> element from React Router. This Form element will prevent a server submission 
  // (what a normal form would do) and instead dispatch it to the action() function that is associated with 
  // the current route. If you want to dispatch the Form data to the action() function of another route, you can 
  // specify the target route with the 'action' attribute like so: 
  // <Form method='post' action='/events' >
  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && <ul>
        { Object.values(data.errors).map(err => (
            <li key={err}>
              {err}
            </li>
          ))}
      </ul>}
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" required defaultValue={event ? event.title : ''} />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="url" name="image" required defaultValue={event ? event.image : ''} />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" required defaultValue={event ? event.date : ''} />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" required defaultValue={event ? event.description : ''} />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>{ isSubmitting ? 'Submitting...' : 'Save'}</button>
      </div>
    </Form>
  );
}

export default EventForm;
