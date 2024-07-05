/* eslint-disable no-underscore-dangle */
import { convertDateFormat } from '@app/utils/convertDateFormat';
import { Symlink } from '@app/views/Settings/components/Symlink';
import { ApplicationStatus } from '@app/views/WebPropertyDetailPage/components/SSR/ApplicationStatus';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerPanelBody,
  Spinner,
  Tooltip
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { v4 as uuidv4 } from 'uuid';
import { Lighthouse } from '../Lighthouse/Lighthouse';
import { VirtualPath } from '../VirtualPath/VirtualPath';

const INTERNAL_URL_LENGTH = 40;

export const StaticSpaPanelContent = ({
  selectedData,
  refetch,
  propertyIdentifier
}: any): JSX.Element => (
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
              <Tr key={uuidv4()} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
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
                        {`${url.slice(0, INTERNAL_URL_LENGTH)} ${
                          url.length > INTERNAL_URL_LENGTH ? '...' : ''
                        }`}
                      </a>
                    </Tooltip>
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
              <Tr key={uuidv4()} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
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
                        {`${url.slice(0, INTERNAL_URL_LENGTH)} ${
                          url.length > INTERNAL_URL_LENGTH ? '...' : ''
                        }`}
                      </a>
                    </Tooltip>
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
      <br />
      <VirtualPath
        propertyIdentifier={selectedData?.propertyIdentifier || ''}
        identifier={selectedData?.identifier}
        environment={selectedData?.env}
        refetch={refetch}
        data={selectedData}
      />
      <Symlink
        propertyIdentifier={propertyIdentifier}
        selectedData={selectedData}
        refetch={refetch}
      />

      <Lighthouse
        webPropertyIdentifier={selectedData?.propertyIdentifier}
        identifier={selectedData?.identifier}
        environment={selectedData?.env}
        data={selectedData}
      />
    </DrawerPanelBody>
  </DrawerPanelContent>
);
