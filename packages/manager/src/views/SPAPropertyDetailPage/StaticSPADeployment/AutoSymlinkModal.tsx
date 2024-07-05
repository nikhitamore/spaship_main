import { useAutoEnableSymlink } from '@app/services/spaProperty';
import { Modal, ModalVariant, Checkbox, ActionGroup, Button } from '@patternfly/react-core';
import { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AutoSymlinkModalProps {
  popUp: any;
  onClose: () => void;
  selectedDataListItemId: string;
  refetch: () => void;
  selectedData: any;
  session: any;
}

export const AutoSymlinkModal = ({
  popUp,
  onClose,
  selectedData,
  refetch,
  session,
  selectedDataListItemId
}: AutoSymlinkModalProps): JSX.Element => {
  const [isSymlinkAutoEnabled, setIsSymlinkAutoEnabled] = useState<{ [key: string]: boolean }>({});
  const toggleSymlinkAutoEnabled = (rowId: string) => {
    setIsSymlinkAutoEnabled((prevStates) => ({
      ...prevStates,
      [rowId]: !prevStates[rowId] // Toggle the value for the specified rowId
    }));
  };
  const autoEnableSymlinkData = useAutoEnableSymlink();
  const handleAutoEnableSymlink = async (symlinkFlag: boolean) => {
    if (selectedData) {
      try {
        await autoEnableSymlinkData
          .mutateAsync({
            propertyIdentifier: selectedData?.propertyIdentifier,
            env: selectedData?.env,
            createdBy: session?.user?.email || '',
            identifier: selectedData?.identifier,
            autoSymlinkCreation: symlinkFlag
          })
          .then(() => {
            refetch();
          });
        onClose();
        if (symlinkFlag) {
          toast.success('Auto Symlink has been enabled successfully.');
        } else {
          toast.success('Auto Symlink has been disabled successfully.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 403) {
            toast.error("You don't have access to perform this action");
            onClose();
          } else {
            toast.error('Failed to autoenable symlink');
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
      title="AutoEnable symlink Confirmation"
      variant={ModalVariant.small}
      isOpen={popUp.isOpen}
      onClose={() => onClose()}
    >
      <Checkbox
        label={
          isSymlinkAutoEnabled[selectedDataListItemId]
            ? 'AutoEnable symlink Enabled'
            : 'AutoEnable symlink Disabled'
        }
        isChecked={isSymlinkAutoEnabled[selectedDataListItemId]}
        onChange={() => toggleSymlinkAutoEnabled(selectedDataListItemId)}
        id="autoEnableSymlink"
        name="autoEnableSymlink"
      />
      <ActionGroup>
        <Button
          onClick={() => handleAutoEnableSymlink(isSymlinkAutoEnabled[selectedDataListItemId])}
          className="pf-u-mr-md pf-u-mt-md"
        >
          Submit
        </Button>
        <Button onClick={() => onClose()} className="pf-u-mt-md">
          Cancel
        </Button>
      </ActionGroup>
    </Modal>
  );
};
