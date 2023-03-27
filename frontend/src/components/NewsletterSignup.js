import classes from './NewsletterSignup.module.css';

import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';

function NewsletterSignup() {
  const fetcher = useFetcher();

  // 'data' is returned by the action() or loader() function that was triggered
  // 'state' can be 'idle', 'loading' or 'submitting'
  const { data, state } = fetcher;

  useEffect(() => {
    if (state === 'idle' && data && data.message) {
      // submit anything to the backend here, clear the input, etc
      window.alert(data.message);
    }
  }, [data, state])

  // Note how we use fetcher.Form instead of the regular react router 'Form' 
  // component. If we would use the regular Form component instead, and the user
  // would submit the newsletter Sign up Form from the /events page, the user
  // would be forwarded to the /newsletter page after submitting the Form,
  // which is not what we want. fetcher.Form does not do this. 
  return (
    <fetcher.Form method="post" className={classes.newsletter}>
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;