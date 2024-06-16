import packageJson from '@jsonPath';
import { Button, Modal, ModalVariant, Split, SplitItem } from '@patternfly/react-core';
import * as React from 'react';
import './WhatsNew.css';

interface IWhatsNewProp {
  confirm: () => void;
  broadCastFlag: boolean;
}

const WhatsNew = ({ broadCastFlag, confirm }: IWhatsNewProp) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(true);

  const handleModalToggle = () => {
    confirm();
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const header = `What's new in Version ${packageJson.version}`;

  return (
    <Modal
      bodyAriaLabel="Scrollable modal content"
      tabIndex={0}
      variant={ModalVariant.small}
      title={header}
      isOpen={isModalOpen || broadCastFlag}
      onClose={handleModalToggle}
      width="50%"
      actions={[
        <Button key="confirm" variant="primary" onClick={handleModalToggle}>
          Confirm
        </Button>
      ]}
    >
      <a
        target="_blank"
        href="https://source.redhat.com/groups/public/spaship/blog_article/whats_new_in_spaship_"
        rel="noreferrer"
      >
        SPAship Souce Page Release Notes
      </a>
      <br />
      <br />
      <p>
        We are excited to announce the release of <span className="highlight">DocsBot</span>, a
        chatbot designed to enhance your documentation experience. With DocsBot, you can:
      </p>
      <br />
      <Split hasGutter>
        <SplitItem>
          {' '}
          <img src="/img/Ask_me_1.png" alt="askme_sidebar" />
        </SplitItem>
        <SplitItem>
          {' '}
          <img src="/img/Ask_me_2.png" alt="askme_popup" />
        </SplitItem>
      </Split>

      <br />
      <li>
        <span className="highlight">Resolve Queries in Minutes:</span> Instantly get answers to your
        related questions.
      </li>
      <li>
        <span className="highlight">User-Friendly Interface:</span> Enjoy a seamless and intuitive
        user experience.
      </li>
      <br />
      <img src="/img/Ask_me_3.png" alt="release-3-1-snapshot" />
      <br />
      <li>
        <span className="highlight">Efficient Support:</span> Reduce the time spent searching
        through documentation with quick and accurate responses.
      </li>
      <br />
      <p>
        This beta pilot version is provided for the purpose of{' '}
        <span className="highlight">gathering feedback.</span> We look forward to your input to help
        us improve and refine this feature.
      </p>
    </Modal>
  );
};

export { WhatsNew };
