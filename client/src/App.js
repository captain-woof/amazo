import { Switch, Route, useLocation, Redirect } from 'react-router-dom'
import Homepage from './components/homepage/index';
import LoginSignup from './components/login_signup/index';
import Logout from './components/logout/index';
import Settings from './components/settings/index'
import ResetPassword from './components/resetPassword/index'
import HamburgerIcon from './components/hamburger-menu/hamburger-icon';
import HamburgerMenu from './components/hamburger-menu/index';
import { AnimatePresence } from 'framer-motion'
import { useState, useContext, useEffect } from 'react';
import Dashboard from './components/dashboard';
import UserContext from './contexts/userContext';
import KnowMore from './components/know_more';
import FAQ from './components/faq';
import DeleteAccount from './components/deleteAccount';
import Donate from './components/donate';

export default function App() {
  const location = useLocation()

  // For setting initial user context
  const { fetchAndSetUserContextState, userContextState } = useContext(UserContext)
  useEffect(() => {
    fetchAndSetUserContextState()
  }, [fetchAndSetUserContextState])

  // For hamburger menu
  const [isMenuActivated, changeIsMenuActivated] = useState(false)

  return (
    <div id="app-container">
      <HamburgerIcon changeIsMenuActivated={changeIsMenuActivated} isMenuActivated={isMenuActivated} />
      <HamburgerMenu isMenuActivated={isMenuActivated} changeIsMenuActivated={changeIsMenuActivated} />

      <AnimatePresence>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/">
            {userContextState.isLoggedIn
              ? <Dashboard />
              : <Homepage />
            }
          </Route>
          <Route exact path="/login_signup">
            <LoginSignup />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/settings">
            {userContextState.isLoggedIn
              ? <Settings />
              : <Redirect to='/login_signup' />}
          </Route>
          <Route path="/resetPassword">
            <ResetPassword />
          </Route>
          <Route exact path="/know_more">
            <KnowMore />
          </Route>
          <Route exact path="/faq">
            <FAQ />
          </Route>
          <Route exact path="/deleteAccount">
            <DeleteAccount />
          </Route>
          <Route exact path="/donate">
            <Donate />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}