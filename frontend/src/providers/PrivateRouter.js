import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from '../session';

export default ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated() === true ? (
            <>
              <section>
                <div className="container-sm p-4">
                    <Component {...props} />
                </div>
              </section>
            </>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )
};