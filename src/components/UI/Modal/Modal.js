import React from 'react';

import classes from './Modal.module.css';
import Auxiliary  from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

const Modal = props =>  {

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
    // with this, we ensure we update only what's in
    // the modal if the props changes
    // This is good for performances
    // console.log('[shouldUpdate]', nextProps);
    // return (nextProps.show !== props.show) || (nextProps.children !== props.children);
  // }

  return (
    <Auxiliary>
      <Backdrop show={props.show} clicked={props.modalClosed}/>
      <div className={classes.Modal}
           style={{
             transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
             opacity: props.show ? '1' : '0'
           }}>
        {props.children}
      </div>
    </Auxiliary>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
  (nextProps.show === prevProps.show)
    && (nextProps.children === prevProps.children));