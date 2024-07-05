import React from 'react';
import { Modal, ModalVariant, Checkbox, ActionGroup, Button } from '@patternfly/react-core';

interface ConfirmationModalProps {
  title: string;
  isOpen: boolean;
  isChecked: boolean;
  checkboxLabel: string;
  onClose: () => void;
  onCheckboxChange: (checked: boolean) => void; // Updated type for onCheckboxChange
  onSubmit: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  isOpen,
  isChecked,
  checkboxLabel,
  onClose,
  onCheckboxChange,
  onSubmit
}) => (
  <Modal title={title} variant={ModalVariant.small} isOpen={isOpen} onClose={onClose}>
    <Checkbox
      label={checkboxLabel}
      isChecked={isChecked}
      onChange={onCheckboxChange} // Pass the function directly
      id="controlled-check-1"
    />
    <ActionGroup>
      <Button onClick={onSubmit} className="pf-u-mr-md pf-u-mt-md">
        Submit
      </Button>
      <Button onClick={onClose} className="pf-u-mt-md">
        Cancel
      </Button>
    </ActionGroup>
  </Modal>
);

export default ConfirmationModal;
