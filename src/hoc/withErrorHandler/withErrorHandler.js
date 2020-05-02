import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {

    const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

    return (
      <Auxiliary>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Auxiliary>
    );
  };
};

export default withErrorHandler;
