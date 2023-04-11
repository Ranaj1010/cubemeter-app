import PageNextIcon from "@rsuite/icons/PageNext";
import PagePreviousIcon from "@rsuite/icons/PagePrevious";
import { ReactNode } from "react";
import { IconButton, Stack, Steps } from "rsuite";
//#region Steppers
export interface IStepperItemProp {
	title: string;
	description: string;
	content: ReactNode;
}

export enum StepperStateEnum {
	encoding,
	submitting,
	succeeded,
	failed,
}

interface IStepperProp {
	step: number;
	items: IStepperItemProp[];
	onHandleSubmit: () => void;
	onChangeStep: (value: number) => void;
	state: StepperStateEnum;
	onRetry: () => void;
	onReset: () => void;
}

export const StepperComponent = (props: IStepperProp) => {
	const { items, onHandleSubmit, onChangeStep, step, onRetry, state, onReset } = props;

	const onNext = () => onChangeStep(Math.min(step + 1, 4));
	const onPrevious = () => onChangeStep(Math.max(step - 1, 0));

	return (
		<Stack direction="column" alignItems="stretch" spacing={40}>
			<div style={{ marginTop: 20, marginBottom: 20 }}>
				<Steps current={step}>
					{items.map((item) => (
						<Steps.Item key={item.title} title={item.title} description={item.description} />
					))}
				</Steps>
			</div>
			<div>{items.length && items.at(step)?.content}</div>
			<Stack justifyContent="flex-start" spacing={30}>
				{step !== 0 && state !== StepperStateEnum.succeeded && (
					<IconButton icon={<PagePreviousIcon />} onClick={onPrevious}>
						Back
					</IconButton>
				)}
				{step !== 3 && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onNext}>
						Next
					</IconButton>
				)}
				{step === 3 && state === StepperStateEnum.encoding && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onHandleSubmit}>
						Submit
					</IconButton>
				)}

				{step === 3 && state === StepperStateEnum.submitting && (
					<IconButton icon={<PageNextIcon />} placement="right" loading appearance="primary" disabled onClick={onHandleSubmit}>
						Submitting
					</IconButton>
				)}

				{step === 3 && state === StepperStateEnum.succeeded && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onReset}>
						Start Over
					</IconButton>
				)}

				{step === 3 && state === StepperStateEnum.failed && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onRetry}>
						Retry
					</IconButton>
				)}
			</Stack>
		</Stack>
	);
};
//#endregion
