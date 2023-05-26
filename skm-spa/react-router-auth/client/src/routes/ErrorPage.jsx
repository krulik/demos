import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { LoginPage } from "..";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message || String(error)}</i>
      </p>
    </div>
  );
}
