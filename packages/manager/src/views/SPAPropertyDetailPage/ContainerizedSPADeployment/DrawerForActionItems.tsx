/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { useListOfPods } from '@app/services/appLogs';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { convertDateFormat } from '@app/utils/convertDateFormat';
import { ApplicationStatus } from '@app/views/WebPropertyDetailPage/components/SSR/ApplicationStatus';
import { ViewLogs } from '@app/views/WebPropertyDetailPage/components/SSR/ViewLogs';
import {
  ActionList,
  ActionListItem,
  Button,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { BuildIcon, CubesIcon, GithubIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useEffect, useRef, useState } from 'react';
import { Lighthouse } from '../Lighthouse/Lighthouse';

const INTERNAL_ACCESS_URL_LENGTH = 40;
const SLICE_VAL_LENGTH = 20;
type Props = {
  propertyIdentifier: string;
  spaProperty: string;
  handlePopUpOpen: any;
  setConfigureData: any;
  setRedeployData: any;
};
export const DrawerForActionItems = ({
  propertyIdentifier,
  spaProperty,
  handlePopUpOpen,
  setConfigureData,
  setRedeployData
}: Props): JSX.Element => {
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const containerizedDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (item) => item.isContainerized === true
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedDataListItemId, setSelectedDataListItemId] = useState<string>('dataListItem1');
  const [selected, setSelected] = useState<string>('More Actions');
  const paginatedData = containerizedDeploymentData;
  const [selectedData, setSelectedData] = useState<any>(containerizedDeploymentData?.[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false);
  // Logs sections
  const [isLogsGit, setIsLogsGit] = useState(false);
  const [buildIdList, setbuildIdList] = useState<string[]>([]);
  const [buildDetails, setBuildDetails] = useState<string[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>();
  const [envName, setEnvName] = useState('');
  const podIdList = useListOfPods(propertyIdentifier, spaProperty, envName);
  const { pods: podList } = (podIdList?.data && podIdList?.data[0]) || {};

  useEffect(() => {
    if (!selectedData) {
      setSelectedData(containerizedDeploymentData?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerizedDeploymentData]);

  const onSelectDataListItem = (id: string) => {
    const index = parseInt(id.charAt(id.length - 1), 10);
    const rowSelectedData = paginatedData && paginatedData[index];
    setSelectedData(rowSelectedData);
    setSelectedDataListItemId(id);
    setIsExpanded(true);
  };

  const [rowOpenStates, setRowOpenStates] = useState<{ [key: string]: boolean }>({});

  const onToggle = (rowId: string, isSelectOpen: boolean) => {
    setRowOpenStates((prevStates) => ({
      ...prevStates,
      [rowId]: isSelectOpen
    }));
  };
  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Redeploy') {
      handlePopUpOpen('redeploySsrApplication');
      setRedeployData(selectedData); // Assuming selectedData contains the required data
    } else if (value === 'Configure') {
      handlePopUpOpen('reconfigureSsrApplication');
      setConfigureData(selectedData); // Assuming selectedData contains the required data
    }

    setIsOpen(false);
  };
  const onClick = async (
    e: React.MouseEvent<any> | React.KeyboardEvent | React.ChangeEvent<Element>,
    name: string,
    buildName: string[],
    rowData: any
  ) => {
    const buildNamesOnly: string[] = buildName.map((item: any) => item.name);
    setBuildDetails(buildName);
    setbuildIdList(buildNamesOnly);
    setEnvName(rowData.env);
    setIsLogsExpanded(true);
    setIsLogsGit(rowData.isGit);
  };
  // Application details panel
  const panelContent = (
    <DrawerPanelContent isResizable minSize="500px">
      <DrawerHead>
        <div>
          <p className="spaTitleText">Action Items</p>
          <p className="spaDetailsTitleText">{selectedData?.env}</p>
        </div>
      </DrawerHead>
      <DrawerPanelBody>
        <Table aria-label="Simple table" variant="compact">
          <Thead>
            <Tr>
              <Th>Internal Access</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedData?.accessUrl ? (
              selectedData?.accessUrl.map((url: string, i: number) => (
                <Tr key={`accessUrl${url}`} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                  {url === 'NA' ? (
                    <Spinner isSVG diameter="30px" />
                  ) : (
                    <div>
                      <Tooltip
                        className="my-custom-tooltip"
                        content={
                          <div>
                            <a
                              className="text-decoration-none"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url}
                            </a>
                          </div>
                        }
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', marginRight: '8px' }}
                        >
                          {`${url.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                            url.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                          }`}
                        </a>
                      </Tooltip>{' '}
                      <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                    </div>
                  )}
                  <Td className="bodyText">{convertDateFormat(selectedData?.updatedAt)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2}>No Access URLs available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Table aria-label="Simple table" variant="compact">
          <Thead>
            <Tr>
              <Th>Router Url</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedData?.routerUrl ? (
              selectedData?.routerUrl.map((url: string, i: number) => (
                <Tr key={`routerUrl${url}`} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                  {url === 'NA' ? (
                    <Spinner isSVG diameter="30px" />
                  ) : (
                    <div>
                      <Tooltip
                        className="my-custom-tooltip"
                        content={
                          <div>
                            <a
                              className="text-decoration-none"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url}
                            </a>
                          </div>
                        }
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', marginRight: '8px' }}
                        >
                          {`${url.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                            url.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                          }`}
                        </a>
                      </Tooltip>{' '}
                      <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                    </div>
                  )}
                  <Td className="bodyText">{convertDateFormat(selectedData?.updatedAt)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2}>No router URLs available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        <Lighthouse
          webPropertyIdentifier={selectedData?.propertyIdentifier}
          identifier={selectedData?.identifier}
          environment={selectedData?.env}
          data={selectedData}
        />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  const drawerContent = (
    <DataList
      style={{ margin: '0px' }}
      aria-label="drawerContent"
      selectedDataListItemId={selectedDataListItemId}
      onSelectDataListItem={onSelectDataListItem}
    >
      {paginatedData?.map(({ env, ref, path, isGit }, index) => {
        const rowId = `data-list-item${index}`;
        return (
          <DataListItem
            key={`data-list-item-${index}`} // Ensure a unique key
            style={{ margin: '0px' }}
            aria-label={`${rowId}-in-card`}
            id={rowId}
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <>
                    <DataListCell className="spaTitleText" key={`data-list-cell${index}`}>
                      <Split>
                        <SplitItem>
                          <Label>{isGit ? <GithubIcon /> : <BuildIcon />}</Label>{' '}
                        </SplitItem>
                        <SplitItem>
                          <div>&nbsp;{env}</div>
                        </SplitItem>
                      </Split>

                      <p className="bodyText">
                        Ref:{' '}
                        {`${ref.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                          ref && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                        }`}
                      </p>
                    </DataListCell>
                    <DataListCell key={`data-list-cell${index}`}>
                      <p className="bodyText">
                        Path:{' '}
                        {`${path.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                          path && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                        }`}
                      </p>
                    </DataListCell>
                    <DataListCell style={{ display: 'contents' }}>
                      <ActionList>
                        <ActionListItem>
                          <Button
                            variant="primary"
                            id={`single-group-next-button${index}`}
                            onClick={() => {
                              handlePopUpOpen('reconfigureSsrApplication');
                              setConfigureData(paginatedData[index]); // Assuming paginatedData contains the required data
                            }}
                          >
                            Configure
                          </Button>
                        </ActionListItem>
                        <ActionListItem>
                          <Select
                            variant={SelectVariant.single}
                            isPlain
                            aria-label={`Select Input with descriptions ${index}`}
                            onToggle={(isSelectOpen) => onToggle(rowId, isSelectOpen)}
                            onSelect={onSelect}
                            selections={selected}
                            isOpen={rowOpenStates[rowId]}
                          >
                            <SelectOption value="Redeploy">Redeploy</SelectOption>
                            <SelectOption
                              value="View Logs"
                              onClick={(e) =>
                                onClick(
                                  e,
                                  selectedData?.name,
                                  selectedData?.buildName,
                                  selectedData
                                )
                              }
                            >
                              View Logs
                            </SelectOption>
                          </Select>
                        </ActionListItem>
                      </ActionList>
                    </DataListCell>
                  </>
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        );
      })}
    </DataList>
  );

  const handleTabClick = async (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  const onLogsExpand = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    drawerRef.current && drawerRef.current.focus();
  };
  const onLogsCloseClick = () => {
    setIsLogsExpanded(false);
  };

  const panelLogsContent = (
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
              />
            )}
          </Tab>
          <Tab
            eventKey={1}
            style={{ paddingBottom: '4px', color: '#D2d2d2' }}
            title={<TabTitleText>Build Logs</TabTitleText>}
          >
            {activeTabKey === 1 && (
              <ViewLogs
                key={envName}
                propertyIdentifier={propertyIdentifier}
                spaName={spaProperty}
                env={envName}
                type={activeTabKey}
                idList={buildIdList}
                isGit={isLogsGit}
                con={buildDetails}
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

  return !containerizedDeploymentData?.length ? (
    <EmptyState>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        No containerized deployment exists.
      </Title>
      <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
    </EmptyState>
  ) : (
    <Drawer position="bottom" onExpand={onLogsExpand} isExpanded={isLogsExpanded}>
      <DrawerContent panelContent={panelLogsContent}>
        <DrawerContentBody style={{ overflowX: 'hidden', padding: '0px' }}>
          <Drawer isStatic isExpanded={isExpanded}>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>{drawerContent}</DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
