import { forwardRef } from "react";
import { Button, Notification, NotificationProps, Stack } from "rsuite";

export interface ICommonNotificationContentProp {
	message: string;
	title: string;
}

interface ICommonNotificationProp extends NotificationProps, ICommonNotificationContentProp {}

//#region Success
export interface ISuccessNotificationProps extends ICommonNotificationProp {
	onCloseNotification?: () => void;
}

export const SuccessNotification = forwardRef((props: ISuccessNotificationProps, ref: any) => (
	<Notification type={"success"} header={props.title} closable ref={ref} {...props}>
		<h5>{props.message}</h5>
		<hr />
		<Button appearance="default" onClick={props.onCloseNotification}>
			Got it!
		</Button>
	</Notification>
));
SuccessNotification.displayName = "succeessNotification";
//#endregion

//#region Failed
export interface IFailedNotificationProps extends ICommonNotificationProp {
	onRetry: () => void;
	onCancel?: () => void;
}

export const FailedNotification = forwardRef((props: IFailedNotificationProps, ref: any) => (
	<Notification type="error" header={props.title} {...props} closable ref={ref} {...props}>
		<h5>{props.message}</h5>
		<hr />
		<Stack spacing={10} direction="row">
			<Button appearance="default" onClick={props.onRetry}>
				Retry
			</Button>
			{props.onCancel && (
				<Button appearance="default" onClick={props.onCancel}>
					Cancel
				</Button>
			)}
		</Stack>
	</Notification>
));
FailedNotification.displayName = "failedNotification";
//#endregion

//#region Error
interface IErrorNotificationProps extends ICommonNotificationProp {}
export const ErrorNotification = forwardRef((props: IErrorNotificationProps, ref: any) => (
	<Notification type="error" header={props.title} closable ref={ref} {...props}>
		<h5>{props.message}</h5>
	</Notification>
));
ErrorNotification.displayName = "errorNotification";
//#endregion

//#region Info
interface IInfoNotificationProps extends ICommonNotificationProp {}
export const InfoNotification = forwardRef((props: IInfoNotificationProps, ref: any) => (
	<Notification type="info" header={props.title} closable ref={ref} {...props}>
		<h5>{props.message}</h5>
	</Notification>
));
InfoNotification.displayName = "informationNotification";
//#endregion

//#region Warning
interface IWarningNotificationProps extends ICommonNotificationProp {}
export const WarningNotification = forwardRef((props: IWarningNotificationProps, ref: any) => (
	<Notification type="warning" header={props.title} closable ref={ref} {...props}>
		<h5>{props.message}</h5>
	</Notification>
));
WarningNotification.displayName = "warningNotification";
//#endregion
