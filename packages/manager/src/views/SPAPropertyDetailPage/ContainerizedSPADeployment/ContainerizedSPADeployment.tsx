/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { usePopUp } from '@app/hooks';
import { useListOfPods } from '@app/services/appLogs';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { convertDateFormat } from '@app/utils/convertDateFormat';
import { ViewLogs } from '@app/views/WebPropertyDetailPage/components/SSR/ViewLogs';
import {
  TDataContainerized,
  TDataWorkflow
} from '@app/views/WebPropertyDetailPage/components/workflow3.0/types';
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
import { BuildIcon, CubesIcon, GithubIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ApplicationStatus } from '../../WebPropertyDetailPage/components/SSR/ApplicationStatus';
import { Lighthouse } from '../Lighthouse/Lighthouse';
import './ContainerizedSPADeployment.css';
import { ModalForConfigureSpa } from './ModalForConfigureSpa';
import { ModalForCreateSpa } from './ModalForCreateSpa';
import { ModalForRedeploymentSpa } from './ModalForRedeploymentSpa';

const INTERNAL_ACCESS_URL_LENGTH = 40;
const SLICE_VAL_LENGTH = 20;

export const ContainerizedSPADeployment = (): JSX.Element => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const [filterByEnv, setFilterByEnv] = useState('');
  const [selectedDataListItemId, setSelectedDataListItemId] = useState<string>('dataListItem1');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const spaProperty = query.spaProperty as string;
  const containerizedDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (item) => item.isContainerized === true
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('More Actions');
  const paginatedData = containerizedDeploymentData;
  const [selectedData, setSelectedData] = useState<any>(containerizedDeploymentData?.[0]);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'redeploySsrApplication',
    'reconfigureSsrApplication',
    'createSSRDeployment'
  ] as const);

  const [redeployData, setRedeployData] = useState<TDataContainerized>({
    propertyIdentifier: '',
    name: '',
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
    port: 3000
  });
  const [configureData, setConfigureData] = useState<TDataWorkflow | TDataContainerized>({
    propertyIdentifier: '',
    name: '',
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
    port: 3000
  });

  const [isChecked, setIsChecked] = useState<boolean>(true);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const onSelectDataListItem = (id: string) => {
    const index = parseInt(id.charAt(id.length - 1), 10);
    const rowSelectedData = paginatedData && paginatedData[index];
    setSelectedData(rowSelectedData);
    setSelectedDataListItemId(id);
    setIsExpanded(true);
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

  const [rowOpenStates, setRowOpenStates] = useState<{ [key: string]: boolean }>({});

  const onToggle = (rowId: string, isSelectOpen: boolean) => {
    setRowOpenStates((prevStates) => ({
      ...prevStates,
      [rowId]: isSelectOpen
    }));
  };

  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [envName, setEnvName] = useState('');
  const [isLogsGit, setIsLogsGit] = useState(false);
  const [buildIdList, setbuildIdList] = useState<string[]>([]);
  const [buildDetails, setBuildDetails] = useState<string[]>([]);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const podIdList = useListOfPods(propertyIdentifier, spaProperty, envName);
  const { pods: podList } = (podIdList?.data && podIdList?.data[0]) || {};
  const drawerRef = useRef<HTMLDivElement>();

  const onLogsExpand = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    drawerRef.current && drawerRef.current.focus();
  };

  const onLogsCloseClick = () => {
    setIsLogsExpanded(false);
  };
  const handleTabClick = async (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
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
  useEffect(() => {
    if (!selectedData) {
      setSelectedData(containerizedDeploymentData?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerizedDeploymentData]);

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

  return (
    <div>
      <Split className="pf-u-mb-md">
        <SplitItem>
          <Button
            className="pf-u-mb-md"
            onClick={() => handlePopUpOpen('createSSRDeployment')}
            icon={<PlusCircleIcon />}
          >
            Add New App
          </Button>
        </SplitItem>
        <SplitItem
          isFilled
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label icon={<GithubIcon />}>Containerized deployment (Git)</Label>{' '}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
            <Label icon={<BuildIcon />}>Containerized deployment</Label>{' '}
          </div>
        </SplitItem>
      </Split>
      {!containerizedDeploymentData?.length ? (
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
      )}
      <ModalForConfigureSpa
        propertyIdentifier={propertyIdentifier}
        configureData={configureData}
        handlePopUpClose={handlePopUpClose}
        isOpen={popUp.reconfigureSsrApplication.isOpen}
      />
      <ModalForCreateSpa
        propertyIdentifier={propertyIdentifier}
        spaProperty={spaProperty}
        handlePopUpClose={handlePopUpClose}
        isOpen={popUp.createSSRDeployment.isOpen}
      />
      <ModalForRedeploymentSpa
        propertyIdentifier={propertyIdentifier}
        handlePopUpClose={handlePopUpClose}
        isOpen={popUp.reconfigureSsrApplication.isOpen}
        redeployData={redeployData}
      />
    </div>
  );
};

// /* eslint-disable no-underscore-dangle */
// /* eslint-disable react/no-array-index-key */
// import { usePopUp } from '@app/hooks';
// import {
//   TDataContainerized,
//   TDataWorkflow
// } from '@app/views/WebPropertyDetailPage/components/workflow3.0/types';
// import { Button, Label, Split, SplitItem } from '@patternfly/react-core';
// import { BuildIcon, GithubIcon, PlusCircleIcon } from '@patternfly/react-icons';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import './ContainerizedSPADeployment.css';
// import { DrawerForActionItems } from './DrawerForActionItems';
// import { ModalForConfigureSpa } from './ModalForConfigureSpa';
// import { ModalForCreateSpa } from './ModalForCreateSpa';
// import { ModalForRedeploymentSpa } from './ModalForRedeploymentSpa';

// export const ContainerizedSPADeployment = (): JSX.Element => {
//   const { query } = useRouter();
//   const propertyIdentifier = query.propertyIdentifier as string;
//   const spaProperty = query.spaProperty as string;
//   const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
//     'redeploySsrApplication',
//     'reconfigureSsrApplication',
//     'createSSRDeployment'
//   ] as const);

//   const [redeployData, setRedeployData] = useState<TDataContainerized>({
//     propertyIdentifier: '',
//     name: '',
//     path: '',
//     ref: '',
//     env: '',
//     identifier: '',
//     nextRef: '',
//     accessUrl: [],
//     updatedAt: '',
//     imageUrl: '',
//     healthCheckPath: '',
//     _id: 0,
//     isContainerized: false,
//     isGit: false,
//     config: {},
//     port: 3000
//   });
//   const [configureData, setConfigureData] = useState<TDataWorkflow | TDataContainerized>({
//     propertyIdentifier: '',
//     name: '',
//     path: '',
//     ref: '',
//     env: '',
//     identifier: '',
//     nextRef: '',
//     accessUrl: [],
//     updatedAt: '',
//     imageUrl: '',
//     healthCheckPath: '',
//     _id: 0,
//     isContainerized: false,
//     isGit: false,
//     config: {},
//     port: 3000
//   });

//   return (
//     <div>
//       <Split className="pf-u-mb-md">
//         <SplitItem>
//           <Button
//             className="pf-u-mb-md"
//             onClick={() => handlePopUpOpen('createSSRDeployment')}
//             icon={<PlusCircleIcon />}
//           >
//             Add New App
//           </Button>
//         </SplitItem>
//         <SplitItem
//           isFilled
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-end'
//           }}
//         >
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <Label icon={<GithubIcon />}>Containerized deployment (Git)</Label>{' '}
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
//             <Label icon={<BuildIcon />}>Containerized deployment</Label>{' '}
//           </div>
//         </SplitItem>
//       </Split>

//       <DrawerForActionItems
//         propertyIdentifier={propertyIdentifier}
//         spaProperty={spaProperty}
//         handlePopUpOpen={handlePopUpOpen}
//         setRedeployData={setRedeployData}
//         setConfigureData={setConfigureData}
//       />
//       <ModalForConfigureSpa
//         propertyIdentifier={propertyIdentifier}
//         configureData={configureData}
//         handlePopUpClose={handlePopUpClose}
//         isOpen={popUp.reconfigureSsrApplication.isOpen}
//       />
//       <ModalForCreateSpa
//         propertyIdentifier={propertyIdentifier}
//         spaProperty={spaProperty}
//         handlePopUpClose={handlePopUpClose}
//         isOpen={popUp.createSSRDeployment.isOpen}
//       />
//       <ModalForRedeploymentSpa
//         propertyIdentifier={propertyIdentifier}
//         handlePopUpClose={handlePopUpClose}
//         isOpen={popUp.redeploySsrApplication.isOpen}
//         redeployData={redeployData}
//       />
//     </div>
//   );
// };
