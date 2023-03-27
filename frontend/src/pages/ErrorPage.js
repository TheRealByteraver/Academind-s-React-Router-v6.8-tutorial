import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

import PageContent from "../components/PageContent";

function ErrorPage() {
  const error = useRouteError(); 
  console.log('error:', error);
  console.log('typeof error:', typeof error);

  // error.status === http status, error.data = JSON object of response

  let title = 'An error occured!';
  let message = 'Something went wrong!';

  if (error.status === 500) {
    try {
      message = JSON.parse(error.data).message;
    } catch {
      message = error.data?.message;
    }
  }

  if (error.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }
  
  return (
    <>
      <MainNavigation />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;