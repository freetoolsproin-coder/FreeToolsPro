import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";


Sentry.init({
  dsn: "https://YOUR_KEY@sentry.io/freetoolspro.in",
  tracesSampleRate: 1.0,
  environment: "production",
});

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>

);