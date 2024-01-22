import { ConfigureSSRForm } from '@app/views/WebPropertyDetailPage/components/SSR/ConfigureSSRForm';
import { ConfigureWorkflowForm } from '@app/views/WebPropertyDetailPage/components/workflow3.0/ConfigureWorkflowForm';
import { Modal, ModalVariant } from '@patternfly/react-core';

type Props = {
  handlePopUpClose: any;
  isOpen: boolean;
  configureData: any;
  propertyIdentifier: string;
};
export const ModalForConfigureSpa = ({
  handlePopUpClose,
  isOpen,
  configureData,
  propertyIdentifier
}: Props): JSX.Element => (
  <Modal
    title="Configure SPA"
    variant={ModalVariant.large}
    isOpen={isOpen}
    onClose={() => handlePopUpClose('reconfigureSsrApplication')}
    style={{ minHeight: '600px' }}
  >
    {configureData.isGit ? (
      <ConfigureWorkflowForm
        propertyIdentifier={propertyIdentifier}
        onClose={() => handlePopUpClose('reconfigureSsrApplication')}
        dataProps={configureData}
        flag="configure"
      />
    ) : (
      <ConfigureSSRForm
        propertyIdentifier={propertyIdentifier}
        onClose={() => handlePopUpClose('reconfigureSsrApplication')}
        dataProps={configureData}
        flag="configure"
      />
    )}
  </Modal>
);
