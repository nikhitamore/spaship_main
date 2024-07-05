import { useListOfPods } from '@app/services/appLogs';
import { extractPodIdsForStatic } from '@app/utils/extractPodIds';
import { ViewLogs } from '@app/views/WebPropertyDetailPage/components/SSR/ViewLogs';
import {
  DrawerPanelContent,
  DrawerHead,
  Tabs,
  Tab,
  TabTitleText,
  DrawerCloseButton
} from '@patternfly/react-core';
import { useState } from 'react';

type Props = {
  propertyIdentifier: string;
  spaProperty: string;
  envName: string;
  setIsLogsExpanded: any;
  isLogsGit: boolean;
};
export const LogsPanelDrawer = ({
  propertyIdentifier,
  spaProperty,
  envName,
  setIsLogsExpanded,
  isLogsGit
}: Props): JSX.Element => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const handleTabClick = async (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const podIdList = useListOfPods(propertyIdentifier, spaProperty, envName);
  const podList = extractPodIdsForStatic(podIdList?.data, true, propertyIdentifier, envName) || {};
  const onLogsCloseClick = () => {
    setIsLogsExpanded(false);
  };
  return (
    <DrawerPanelContent
      isResizable
      style={{ borderBottom: '1px solid #333', backgroundColor: '#212427' }}
    >
      <DrawerHead>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} className="select-tab-ids">
          <Tab
            eventKey={0}
            style={{ paddingBottom: '0px', color: '#D2d2d2' }}
            title={<TabTitleText style={{ paddingBottom: '10px' }}>Deployment Logs</TabTitleText>}
          >
            {activeTabKey === 0 && (
              <ViewLogs
                key={envName}
                propertyIdentifier={propertyIdentifier}
                spaName={spaProperty}
                env={envName}
                type={activeTabKey}
                idList={podList}
                isGit={isLogsGit}
                con={podIdList}
                isStatic
              />
            )}
          </Tab>
        </Tabs>
        <div className="pf-c-drawer__actions-right">
          <DrawerCloseButton onClick={onLogsCloseClick} />
        </div>
      </DrawerHead>
    </DrawerPanelContent>
  );
};
