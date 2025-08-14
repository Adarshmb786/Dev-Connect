import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Components/Body";
import LandingPage from "./Components/LandingPage";
import appStore from "./utils/store";
import { Provider } from "react-redux";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Feed from "./Components/Feed";
import EditProfile from "./Components/EditProfile";
import Profile from "./Components/Profile";
import UpdatePassword from "./Components/UpdatePassword";
import Requests from "./Components/Requests";
import Connections from "./Components/Connections";
import ViewProfile from "./Components/ViewProfile";
import Inbox from "./Components/Inbox";

const App = () => {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            <Route path="/start" element={<LandingPage />}>
              <Route path="/start" element={<Login />} />
              <Route path="/start/signup" element={<Signup />} />
            </Route>
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/updatepassword" element={<UpdatePassword />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/viewprofile/:id" element={<ViewProfile />} />/
            <Route path="/connections/inbox/:id" element={<Inbox />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
