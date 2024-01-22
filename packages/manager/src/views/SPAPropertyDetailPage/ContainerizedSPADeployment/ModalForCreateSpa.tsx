import { ConfigureSSRForm } from '@app/views/WebPropertyDetailPage/components/SSR/ConfigureSSRForm';
import { ConfigureWorkflowForm } from '@app/views/WebPropertyDetailPage/components/workflow3.0/ConfigureWorkflowForm';
import {
  TDataContainerized,
  TDataWorkflow
} from '@app/views/WebPropertyDetailPage/components/workflow3.0/types';
import { Modal, ModalVariant, Switch, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import Link from 'next/link';
import { useState } from 'react';

type Props = {
  handlePopUpClose: any;
  isOpen: boolean;
  propertyIdentifier: string;
  spaProperty: string;
};
export const ModalForCreateSpa = ({
  handlePopUpClose,
  isOpen,

  propertyIdentifier,

  spaProperty
}: Props): JSX.Element => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
  };
  const spaDetailedWorkflowInitialData: TDataWorkflow | TDataContainerized = {
    healthCheckPath: '/',
    path: '/',
    gitRef: 'main',
    type: 'monolithic',
    name: spaProperty,
    env: '',
    repoUrl: '',
    ref: '',
    contextDir: '/',
    config: {},
    buildArgs: [],
    propertyIdentifier,
    port: 3000,
    isGit: true,
    isContainerized: false
  };
  const spaDetailedInitialData = {
    propertyIdentifier,
    name: spaProperty,
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: [],
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: 0
  };
  return (
    <Modal
      title="Create Containerized Deployment"
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={() => handlePopUpClose('createSSRDeployment')}
      style={{ minHeight: '600px' }}
    >
      <div>
        <Switch
          id="simple-switch"
          label="From Git Repo"
          labelOff="From Container"
          isChecked={isChecked}
          onChange={handleChange}
          className="pf-u-mr-md pf-u-mb-md"
        />
        <Tooltip
          content={
            isChecked ? (
              <div>
                Provide your application&apos;s repository details, and SPAship will handle the
                entire build and deployment process. No more external CIs are needed! Enjoy a more
                direct and interactive deployment experience. To know more check SPAship get started
                section <Link href="/documents">here</Link>.{' '}
              </div>
            ) : (
              <div>
                Containerized deployment for Supporting the SSR capability. It is assumed the
                container for this app is already available. For a more direct and interactive
                deployment experience,toggle the switch to From Git Repo
              </div>
            )
          }
        >
          <InfoCircleIcon style={{ marginLeft: '10px', color: '#6A6E73' }} />
        </Tooltip>
        {isChecked ? (
          <ConfigureWorkflowForm
            propertyIdentifier={propertyIdentifier}
            onClose={() => handlePopUpClose('createSSRDeployment')}
            dataProps={spaDetailedWorkflowInitialData}
            flag="addnew"
          />
        ) : (
          <ConfigureSSRForm
            propertyIdentifier={propertyIdentifier}
            onClose={() => handlePopUpClose('createSSRDeployment')}
            dataProps={spaDetailedInitialData}
            flag="addnew"
          />
        )}
      </div>
    </Modal>
  );
};
