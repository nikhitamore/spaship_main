/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { LogsPanelDrawer } from './LogsPanelDrawer';
import { StaticSpaDrawerContent } from './StaticSpaDrawerContent';
import { StaticSpaPanelContent } from './StaticSPAPanelContent';

export const StaticSPADeployment = (): JSX.Element => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperty = query.spaProperty as string;

  const drawerRef = useRef<HTMLDivElement>(null);

  const onLogsExpand = () => {
    drawerRef.current?.focus();
  };

  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const staticDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (data) => data.isContainerized === false
  );

  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [envName, setEnvName] = useState('');
  const [isLogsGit, setIsLogsGit] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(staticDeploymentData?.[0]);
  const { refetch } = useGetSPAPropGroupByName(propertyIdentifier, '');

  return (
    <div id="static-spa-deployment-page">
      {!staticDeploymentData?.length ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No Static Deployment exists.
          </Title>
          <EmptyStateBody>Please create a deployment to view them here</EmptyStateBody>
        </EmptyState>
      ) : (
        <Drawer position="bottom" onExpand={onLogsExpand} isExpanded={isLogsExpanded}>
          <DrawerContent
            panelContent={
              <LogsPanelDrawer
                propertyIdentifier={propertyIdentifier}
                envName={envName}
                spaProperty={spaProperty}
                setIsLogsExpanded={setIsLogsExpanded}
                isLogsGit={isLogsGit}
              />
            }
          >
            <DrawerContentBody style={{ overflowX: 'hidden', padding: '0px' }}>
              <Drawer isStatic isExpanded={isExpanded}>
                <DrawerContent
                  panelContent={
                    <StaticSpaPanelContent
                      propertyIdentifier={propertyIdentifier}
                      refetch={refetch}
                      selectedData={selectedData}
                    />
                  }
                >
                  <DrawerContentBody>
                    <StaticSpaDrawerContent
                      propertyIdentifier={propertyIdentifier}
                      staticDeploymentData={staticDeploymentData}
                      selectedData={selectedData}
                      setIsLogsExpanded={setIsLogsExpanded}
                      refetch={refetch}
                      setEnvName={setEnvName}
                      setIsLogsGit={setIsLogsGit}
                      setSelectedData={setSelectedData}
                      setIsExpanded={setIsExpanded}
                    />
                  </DrawerContentBody>
                </DrawerContent>
              </Drawer>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
