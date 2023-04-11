import { ReactNode } from "react";
import { Button, Modal } from "rsuite";
import { ModalSize } from "rsuite/esm/Modal/Modal";

interface IModalComponentProp {
	open: boolean;
	size: ModalSize;
	onHandleClose: () => void;
	onConfirm: () => void;
	onCancel: () => void;
	title: string;
	confirmText: string;
	cancelText: string;
	content: ReactNode;
}

export const ModalComponent = (props: IModalComponentProp) => {
	const { size, cancelText, content, title, confirmText, onCancel, onConfirm, onHandleClose, open } = props;
	return (
		<Modal size={size} open={open} onClose={onHandleClose}>
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{content}</Modal.Body>
			<Modal.Footer>
				<Button onClick={onCancel} appearance="subtle">
					{cancelText}
				</Button>
				<Button onClick={onConfirm} appearance="primary">
					{confirmText}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
