import { usePopUp } from '@app/hooks';
import {
  ActionList,
  ActionListItem,
  Button,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant
} from '@patternfly/react-core';
import { SyncAltIcon } from '@patternfly/react-icons';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AutoSymlinkModal } from './AutoSymlinkModal';
import { AutoSyncModal } from './AutoSyncModal';

const SLICE_VAL_LENGTH = 20;

type Props = {
  propertyIdentifier: string;
  staticDeploymentData: any;
  setIsLogsExpanded: any;
  setEnvName: any;
  setIsLogsGit: any;
  setIsExpanded: any;
  refetch: any;
  setSelectedData: any;
  selectedData: any;
};
export const StaticSpaDrawerContent = ({
  propertyIdentifier,
  staticDeploymentData,
  setIsLogsExpanded,
  refetch,
  setEnvName,
  setIsLogsGit,
  setSelectedData,
  selectedData,
  setIsExpanded
}: Props): JSX.Element => {
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'autoSync',
    'autoEnableSymlink'
  ] as const);
  const [selectedDataListItemId, setSelectedDataListItemId] = useState<string>('data-list-item0');

  const paginatedData = staticDeploymentData;

  const { data: session } = useSession();
  const [rowOpenStates, setRowOpenStates] = useState<{ [key: string]: boolean }>({});

  const onToggle = (rowId: string, isSelectOpen: boolean) => {
    setRowOpenStates((prevStates) => ({
      ...prevStates,
      [rowId]: isSelectOpen
    }));
  };

  useEffect(() => {
    refetch();
    const index: any = selectedDataListItemId.replace('data-list-item', '');
    setSelectedData(staticDeploymentData?.[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, staticDeploymentData]);

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    rowId: string
  ) => {
    const selectedValue = value as string;
    if (value === 'View Logs') {
      setIsLogsExpanded(true); // Expand logs if View Logs is selected
    } else {
      setIsLogsExpanded(false); // Collapse logs for other selections
    }
    setSelected((prevSelected) => ({
      ...prevSelected,
      [rowId]: selectedValue
    }));
    // Manually close the dropdown by updating rowOpenStates
    setRowOpenStates((prevStates) => ({
      ...prevStates,
      [rowId]: false
    }));
  };

  const onClickLogs = async (
    e: React.MouseEvent<any> | React.KeyboardEvent | React.ChangeEvent<Element>,
    env: string,
    isContainerized: boolean
  ) => {
    setEnvName(env);
    setIsLogsExpanded(true);
    setIsLogsGit(isContainerized);
  };

  const onSelectDataListItem = (id: string) => {
    const index = parseInt(id.charAt(id.length - 1), 10);
    const rowSelectedData = paginatedData && paginatedData[index];
    setSelectedData(rowSelectedData);
    setSelectedDataListItemId(id);
    setIsExpanded(true);
  };

  const openModel = async (data: any, value: 'autoSync' | 'autoEnableSymlink', rowId: string) => {
    setSelectedData(data);
    setSelectedDataListItemId(rowId);
    handlePopUpOpen(value);
  };

  useEffect(() => {
    if (!selectedData) {
      setSelectedData(staticDeploymentData?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDeploymentData]);
  return (
    <>
      <DataList
        style={{ margin: '0px' }}
        aria-label="drawerContent"
        selectedDataListItemId={selectedDataListItemId}
        onSelectDataListItem={(id) => onSelectDataListItem(id)}
      >
        {paginatedData?.map(({ env, ref, path, isContainerized }: any, index: number) => {
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
                      <DataListCell className="spaTitleText" key={`data-list-cell${index}-ref`}>
                        <div>{env}</div>
                        <p className="bodyText">
                          Ref:{' '}
                          {`${ref.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                            ref && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                          }`}
                        </p>
                      </DataListCell>
                      <DataListCell key={`data-list-cell${index}-path`}>
                        <p className="bodyText">
                          Path:{' '}
                          {`${path.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                            path && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                          }`}
                        </p>
                      </DataListCell>
                      <DataListCell style={{ display: 'contents' }}>
                        <ActionList key={`action-item${index}`}>
                          <ActionListItem style={{ minWidth: '150px' }}>
                            <Button
                              variant="primary"
                              isSmall
                              icon={<SyncAltIcon />}
                              onClick={() =>
                                openModel({ propertyIdentifier, env }, 'autoSync', rowId)
                              }
                            >
                              Auto Sync
                            </Button>
                          </ActionListItem>
                          <ActionListItem style={{ minWidth: '150px' }}>
                            <Select
                              key={`action-item-viewLogs-${index}`}
                              variant={SelectVariant.single}
                              isPlain
                              aria-label={`Select Input with descriptions ${index}`}
                              onToggle={(isSelectOpen) => onToggle(rowId, isSelectOpen)}
                              onSelect={(e, value) => onSelect(e, value, rowId)} // Pass rowId here
                              selections={selected[rowId] || 'More Actions'} // Use selected value for this row
                              isOpen={rowOpenStates[rowId]}
                            >
                              <SelectOption
                                value="View Logs"
                                onClick={(e) => onClickLogs(e, env, isContainerized)}
                              >
                                View Logs
                              </SelectOption>
                              <SelectOption
                                key={`action-item-autoSymlink-${index}`}
                                value="AutoEnable symlink"
                                onClick={() =>
                                  openModel({ propertyIdentifier, env }, 'autoEnableSymlink', rowId)
                                }
                              >
                                AutoEnable symlink
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

      <AutoSymlinkModal
        popUp={popUp.autoEnableSymlink}
        onClose={() => handlePopUpClose('autoEnableSymlink')}
        selectedData={selectedData}
        refetch={refetch}
        session={session}
        selectedDataListItemId={selectedDataListItemId}
      />

      <AutoSyncModal
        popUp={popUp.autoSync}
        onClose={() => handlePopUpClose('autoSync')}
        selectedData={selectedData}
      />
    </>
  );
};
