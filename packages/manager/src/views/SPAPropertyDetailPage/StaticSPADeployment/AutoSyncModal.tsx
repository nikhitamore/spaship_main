import { useApplicationAutoSync } from '@app/services/sync';
import { Modal, ModalVariant, Checkbox, ActionGroup, Button } from '@patternfly/react-core';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AutoSyncModalProps {
  popUp: any;
  onClose: () => void;
  selectedData: any;
}

export const AutoSyncModal = ({
  popUp,
  onClose,
  selectedData
}: AutoSyncModalProps): JSX.Element => {
  const [isChecked, setIsChecked] = useState<boolean>(selectedData?.autoSync || false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(
    selectedData?.autoSync || false
  );

  useEffect(() => {
    setIsChecked(isAutoSyncEnabled);
  }, [isAutoSyncEnabled]);

  const autoSyncData = useApplicationAutoSync();

  const toggleAutoSyncEnabled = () => {
    setIsAutoSyncEnabled((prev) => !prev);
  };

  const handleAutoSync = async () => {
    if (selectedData) {
      const { propertyIdentifier: propertyIdentifierForAutoSync, env, identifier } = selectedData;
      try {
        await autoSyncData.mutateAsync({
          propertyIdentifier: propertyIdentifierForAutoSync,
          env,
          identifier,
          autoSync: isChecked
        });

        onClose();
        if (isChecked) {
          toast.success('Auto Sync has been enabled successfully.');
        } else {
          toast.success('Auto Sync has been disabled successfully.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 403) {
            toast.error("You don't have access to perform this action");
            onClose();
          } else {
            toast.error('Failed to autosync');
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('An error occurred:', error);
        }
      }
    }
  };

  return (
    <Modal
      title="AutoSync Confirmation"
      variant={ModalVariant.small}
      isOpen={popUp.isOpen}
      onClose={() => onClose()}
    >
      <Checkbox
        label={isChecked ? 'AutoSync Enabled' : 'AutoSync Disabled'}
        isChecked={isChecked}
        onChange={() => {
          setIsChecked((prev) => !prev);
          toggleAutoSyncEnabled(); // Toggle state for the current row
        }}
        id="controlled-check-1"
        name="AutoSync"
      />

      <ActionGroup>
        <Button onClick={() => handleAutoSync()} className="pf-u-mr-md pf-u-mt-md">
          Submit
        </Button>
        <Button onClick={() => onClose()} className="pf-u-mt-md">
          Cancel
        </Button>
      </ActionGroup>
    </Modal>
  );
};
