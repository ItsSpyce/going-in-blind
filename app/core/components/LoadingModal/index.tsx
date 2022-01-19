import { Modal, ModalBody } from 'reactstrap';
import { useLoading } from 'app/auth/hooks';

const LoadingModal = () => {
  const [isLoading] = useLoading();
  return (
    <>
      <Modal isOpen={isLoading} centered trapFocus>
        <ModalBody>
          <h1>Loading...</h1>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LoadingModal;
