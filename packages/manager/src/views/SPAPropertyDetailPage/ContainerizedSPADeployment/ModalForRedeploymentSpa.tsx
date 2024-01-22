import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { TDataContainerized } from '@app/views/WebPropertyDetailPage/components/workflow3.0/types';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import { useState } from 'react';

type Props = {
  handlePopUpClose: (popupName: 'redeploySsrApplication') => void;
  isOpen: boolean;
  propertyIdentifier: string;
  redeployData: TDataContainerized;
};
export const ModalForRedeploymentSpa = ({
  handlePopUpClose,
  isOpen,
  redeployData: initialRedeployData,
  propertyIdentifier
}: Props): JSX.Element => {
  const [redeployData, setRedeployData] = useState<TDataContainerized>(initialRedeployData);
  const createSsrSpaProperty = useAddSsrSpaProperty();

  const handleConfirmRedployment = async () => {
    const toastId = toast.loading('Submitting form...');

    const updatedRedeployData = { ...redeployData };
    updatedRedeployData.propertyIdentifier = propertyIdentifier;
    updatedRedeployData.reDeployment = true;

    try {
      await createSsrSpaProperty.mutateAsync({
        ...updatedRedeployData
      });
      toast.success('ReDeployed containerized application successfully', { id: toastId });
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action", { id: toastId });
      } else {
        toast.error('Failed to deploy containerized application', { id: toastId });
      }
    }
    setRedeployData(updatedRedeployData);
    handlePopUpClose('redeploySsrApplication');
  };
  return (
    <Modal
      title="Confirm Redeployment"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={() => handlePopUpClose('redeploySsrApplication')}
    >
      <p> Want to redeploy the SPA?</p>
      <Button onClick={handleConfirmRedployment} className="pf-u-mt-md">
        Confirm Redeployment
      </Button>
    </Modal>
  );
};
