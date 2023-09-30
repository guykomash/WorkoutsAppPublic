import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Workouts from './components/Workouts/Workouts';
import AddWorkout from './components/Workouts/AddWorkout';
import PageNotFound from './components/PageNotFound';

import WorkoutDetails from './components/Workouts/WorkoutDetails';
import Sessions from './components/Sessions/Sessions';
import EditWorkout from './components/Workouts/EditWorkout';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Welcome from './components/Welcome';
import ExploreWorkouts from './components/Workouts/ExploreWorkouts';
import Account from './components/Account';
import AdminControlPanel from './components/Admin/AdminControlPanel';
import NewSession from './components/Sessions/NewSession';
import EditSession from './components/Sessions/EditSession';

export const ROLES = {
  User: 1111,
  Editor: 2222,
  Admin: 3333,
};

export const NAV = {
  Welcome: '/welcome',
  Login: '/login',
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*public routes*/}
        <Route path="welcome" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/*Protected routes*/}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequireAuth
                logoutNavTo={NAV.Welcome}
                allowedRoles={[ROLES.User]}
              />
            }
          >
            <Route path="/" element={<Home />} />
          </Route>
          <Route
            element={
              <RequireAuth
                logoutNavTo={NAV.Login}
                allowedRoles={[ROLES.User]}
              />
            }
          >
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:workoutId" element={<WorkoutDetails />} />
            <Route path="/workouts/add-workout" element={<AddWorkout />} />
            <Route path="/workouts/edit/:workoutId" element={<EditWorkout />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:sessionId" element={<EditSession />} />
            <Route path="/sessions/new-session" element={<NewSession />} />

            <Route path="/explore" element={<ExploreWorkouts />} />
            <Route path="/myaccount" element={<Account />} />
          </Route>

          <Route
            element={
              <RequireAuth
                logoutNavTo={NAV.Login}
                allowedRoles={[ROLES.Admin]}
              />
            }
          >
            <Route path="admin/control-panel" element={<AdminControlPanel />} />
          </Route>
        </Route>
        {/* 404 is not a protected route. */}
        <Route path="/*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
