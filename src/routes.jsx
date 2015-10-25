import React from 'react';
import { Route } from 'react-router';

export default (
  <Route component={ require('components/Layout') }>
    <Route path='/'
      component={ require('components/Projects/List') } />
    <Route path='/create'
      component={ require('components/Projects/Create') } />
  </Route>
);
