import React from 'react'
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
        label={props.buttonCancel}
        isStyleCancel
        onClick={() => toggleCompleteModal()}
        key={props.buttonCancel}
        hidden={!props.buttonCancel}
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
  message: PropTypes.string,
  buttonCancel: PropTypes.string,
  buttonConfirm: PropTypes.string,
  toast: PropTypes.string,
  confirmFunc: PropTypes.func,
  modalID: PropTypes.string
};
