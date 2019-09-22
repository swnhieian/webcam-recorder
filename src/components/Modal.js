import React, { useEffect } from 'react'
import Modali, { useModali } from 'modali';
import PropTypes from 'prop-types';
import cogoToast from 'cogo-toast';

export default function Modal(props) {
  const [completeModal, toggleCompleteModal] = useModali({
    animated: true,
    title: props.title,
    message: props.message,
    buttons: [
      <Modali.Button
        label={props.buttonCancel ? props.buttonCancel : ''}
        isStyleCancel
        className={!props.buttonCancel ? 'display_none' : ''}
        key={props.buttonCancel}
        hidden={!props.buttonCancel}
        onClick={() => toggleCompleteModal()}
      />,
      <Modali.Button
        label={props.buttonConfirm}
        isStyleDestructive
        onClick={() => {
          if (props.confirmFunc) props.confirmFunc();
          toggleCompleteModal();
          if (props.toast) cogoToast.info(props.toast);
        }}
        hidden={!props.buttonConfirm}
        key={props.buttonConfirm}
      />
    ]
  });
  useEffect(() => {
    if (props.onLoadFunc) props.onLoadFunc()
    try {
      if (!props.buttonCancel)
        document.getElementsByClassName(
          'modali-button-cancel'
          )[0].className += ' display_none';
      if (!props.buttonConfirm)
        document.getElementsByClassName(
          'modali-button-destructive'
        )[0].className += ' display_none';
    } catch (NotYetLoadedException) {
      // console.log(NotYetLoadedException);
    }
  })

  return (
    <div style={{ height: '0px' }}>
      <button
        className="hidden_button"
        id={props.modalID}
        onClick={toggleCompleteModal}
      >
        toggle modal
      </button>
      <Modali.Modal {...completeModal} />
    </div>
  );
}

Modal.propTypes = {
  socket: PropTypes.object,
  title: PropTypes.string,
  message: PropTypes.any,
  buttonCancel: PropTypes.string,
  buttonConfirm: PropTypes.string,
  toast: PropTypes.string,
  confirmFunc: PropTypes.func,
  modalID: PropTypes.string,
  onLoadFunc: PropTypes.func
};
