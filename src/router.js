import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import NavLayout from './layout/nav/Nav';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
      	<Route path="/" component={NavLayout} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
