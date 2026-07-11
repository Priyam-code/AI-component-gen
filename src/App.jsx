import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NoPage from './pages/NoPage';

// App is the root React component for the application.
// It sets up client-side routing using react-router-dom v6.
const App = () => {
  return (
    // A fragment here groups elements but is not necessary because
    // BrowserRouter can be the single root element — it's kept for clarity.
    <>
      {/*
        BrowserRouter: provides the routing context that keeps the UI in sync
        with the browser's address bar (history API: pushState/popState).
        Any routing hooks or components inside this provider (Routes/Route)
        can read the current location and navigate programmatically.
      */}
      <BrowserRouter>
        {/*
          Routes: container for Route elements. It examines the current URL
          and renders the first matching Route's element.
          In v6, matching is "best match" by default rather than first-match
          semantics from earlier versions.
        */}
        <Routes>
          {/*
            Route with path="/":
            - When the URL path is exactly "/", the Home component is rendered.
            - In react-router-dom v6, route matching is exact/best-match by default,
              so you don't need an "exact" prop like in v5.
          */}
          <Route path="/" element={<Home />} />

          {/*
            Route with path="*":
            - "*" is a wildcard that matches any path not matched earlier.
            - It's commonly used as a fallback "404" route. When no other route
              matches the current URL, NoPage will be rendered.
          */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
