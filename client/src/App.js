import { Switch, Route, useLocation } from 'react-router-dom'
import Homepage from './components/homepage/index';
import LoginSignup from './components/login_signup/index';
import Logout from './components/logout/index';
import HamburgerIcon from './components/hamburger-menu/hamburger-icon';
import HamburgerMenu from './components/hamburger-menu';
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive'

export default function App() {
  const location = useLocation()
  const isPhone = useMediaQuery({ query: "(max-width: 420px)" })

  // Sets initial login state
  const [isLoggedIn, changeIsLoggedIn] = useState(false)
  useEffect(() => {
    fetch("/api/isLoggedIn", {
      credentials: 'include',
      method: 'GET'
    }).then((response) => {
      response.json().then((responseJson) => {
        changeIsLoggedIn(responseJson.message)
      })
    })
  })

  // For hamburger menu
  const [isMenuActivated, changeIsMenuActivated] = useState(false)

  return (
    <div id="app-container">
      <HamburgerIcon changeIsMenuActivated={changeIsMenuActivated} isMenuActivated={isMenuActivated} />
      <HamburgerMenu isLoggedIn={isLoggedIn} isPhone={isPhone} isMenuActivated={isMenuActivated}
        changeIsMenuActivated={changeIsMenuActivated} />

      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/">
            <Homepage isPhone={isPhone} />
          </Route>
          <Route exact path="/login_signup">
            <LoginSignup changeIsLoggedIn={changeIsLoggedIn} />
          </Route>
          <Route exact path="/logout">
            <Logout changeIsLoggedIn={changeIsLoggedIn} />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}