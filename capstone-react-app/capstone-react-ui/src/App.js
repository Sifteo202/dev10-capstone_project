import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginContext from "./contexts/LoginContext";
import Fail from "./components/Fail";
import MainPage from "./MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminTools from "./components/AdministratorTools/AdminTools";
import UserForm from "./components/AdministratorTools/UserForm";
import UserConfirmDelete from "./components/AdministratorTools/UserConfirmDelete";
import LocationConfirmDelete from "./components/AdministratorTools/LocationConfirmDelete";
import LocationForm from "./components/AdministratorTools/LocationForm";
import Nav from "./components/Nav";
import Location from "./components/Location/Location";
import Profile from "./components/Profile/Profile";

function App() {
  const [credentials, setCredentials] = useState({
    username: null,
    jwt: null
  });

  const afterAuth = token => {
    const firstDot = token.indexOf(".");
    const secondDot = token.indexOf(".", firstDot + 1);
    const jwtBody = token.substring(firstDot + 1, secondDot);
    const body = JSON.parse(atob(jwtBody));
    setCredentials({
      username: body.sub,
      jwt: token
    });
  };

  const logout = () => setCredentials({ username: null, jwt: null })

  return (<div className="container">
    <LoginContext.Provider value={{ ...credentials, afterAuth, logout }}>
        <Router>
          <Nav/>
          <Switch>
          <Route path={["/admintools/user/edit/:id", "/admintools/user/add"]}>
            {credentials.username ? <UserForm/> : <Redirect to="/login" />}
          </Route>
          <Route path={["/admintools/user/delete/:id"]}>
            {credentials.username ? <UserConfirmDelete/> : <Redirect to="/login" />}
          </Route>
          <Route path={["/admintools/location/edit/:id", "/admintools/location/add"]}>
            {credentials.username ? <LocationForm/> : <Redirect to="/login" />}
          </Route>
          <Route path={["/admintools/location/delete/:id"]}>
            {credentials.username ? <LocationConfirmDelete/> : <Redirect to="/login" />}
          </Route>
          <Route path="/admintools">
            {credentials.username ? <AdminTools/> : <Redirect to="/login" />}
          </Route>
          <Route path="/location/:description">
            <Location />
          </Route>
          <Route path="/profile">
            {credentials.username ? <Profile/> : <Redirect to="/login" />}
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/profile">
            <Profile username={username}/>
          </Route>
          <Route path="/failure">
            <Fail />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
            <Route>
              <Fail />
            </Route>
          </Switch>
        </Router>
      </LoginContext.Provider>
    </div>
  );
}

export default App;