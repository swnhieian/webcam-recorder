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
          props.confirmFunc();
          toggleCompleteModal();
          cogoToast.info(props.toast);
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
  socket: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonCancel: PropTypes.string.isRequired,
  buttonConfirm: PropTypes.string.isRequired,
  toast: PropTypes.string.isRequired,
  confirmFunc: PropTypes.func.isRequired,
  modalID: PropTypes.string.isRequired
};
