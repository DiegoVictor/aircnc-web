import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import Details from '~/pages/Details';
import Spot from '~/pages/Spot';
import history from '~/services/history';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/spots/:id/edit" exact component={Spot} />
      <Route path="/spots/:id" exact component={Details} />
      <Route path="/spot" exact component={Spot} />
    </Switch>
  </Router>
);
