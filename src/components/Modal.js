import React from 'react'
import Modali, { useModali } from 'modali';

export default function Modal() {
  const [completeModal, toggleCompleteModal] = useModali({
    animated: true,
    title: 'Are you sure?',
    message: 'Deleting progress will be permanent.',
    buttons: [
      <Modali.Button
        label='Cancel'
        isStyleCancel
        onClick={() => toggleCompleteModal()}
        key={'cancel'}
      />,
      <Modali.Button
        label='Reset Progress'
        isStyleDestructive
        onClick={() =>
          this.props.socket.emit('client: update recording progress', {})
        }
        key={'reset'}
      />
    ]
  });
  return (
    <div>
      <button onClick={toggleCompleteModal}>toggle modal</button>
      <Modali.Modal {...completeModal} />
    </div>
  );
}
