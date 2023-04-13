import { CSSProperties, SyntheticEvent, forwardRef } from "react";
import { Form, Input, InputNumber, SelectPicker, SelectPickerProps } from "rsuite";
import { ItemDataType } from "rsuite/esm/@types/common";
import { ValueType } from "rsuite/esm/Checkbox";
import type { CheckType } from "schema-typed";

//#region CommonProps

export enum IEntryModeEnum {
	create,
	update,
}

interface ICommonFormControlProps {
	name: string;
	formlabel: string;
	placeholder?: string;
}

//#region InputFormControl
interface IInputFormControlProps extends ICommonFormControlProps {
	rule?: CheckType<unknown, any>;
	value?: string;
	required?: boolean;
	onChange?: (value: ValueType, event: SyntheticEvent) => void;
}
export const InputFormControl = (props: IInputFormControlProps) => {
	const { required, name, rule, value, formlabel, onChange, placeholder } = props;
	return (
		<Form.Group controlId={name}>
			<Form.ControlLabel>
				{required ? (
					<RequiredFieldLabelText text={formlabel} />
				) : (
					<label>
						{<Form.ControlLabel>{required ? <RequiredFieldLabelText text={formlabel} /> : <label>{formlabel}</label>}</Form.ControlLabel>}
					</label>
				)}
			</Form.ControlLabel>
			<Form.Control name={name} placeholder={placeholder} rule={rule} value={value} onChange={onChange} />
		</Form.Group>
	);
};
//#endregion

//#region SelectFormControl
interface ISelectFormControl extends ICommonFormControlProps {
	rule?: CheckType<unknown, any>;
	value?: string;
	required?: boolean;
	data: ItemDataType<unknown>[];
	searchable?: boolean;
	onChange?: (value: ValueType, event: SyntheticEvent) => void;
}
const SelectAccepter = forwardRef((props: SelectPickerProps<ISelectFormControl>, ref: any) => (
	<SelectPicker style={{ width: 300 }} {...props} ref={ref} />
));
SelectAccepter.displayName = "select";

export const SelectFormControl = (props: ISelectFormControl) => {
	const { required, name, rule, value, formlabel, onChange, placeholder, data, searchable } = props;
	return (
		<Form.Group controlId={name}>
			<Form.ControlLabel>
				{required && required !== undefined ? <RequiredFieldLabelText text={formlabel} /> : <label>{formlabel}</label>}
			</Form.ControlLabel>
			<Form.Control placeholder={placeholder} {...props} rule={rule} onChange={onChange} accepter={SelectAccepter} />
		</Form.Group>
	);
};
//#endregion

//#region TextAreaFormControl
interface ITextAreaProps extends ICommonFormControlProps {
	rule?: CheckType<unknown, any>;
	value?: string;
	required?: boolean;
	style?: CSSProperties;
	onChange?: (value: ValueType, event: SyntheticEvent) => void;
}
const TextAreaAccepter = forwardRef((props, ref: any) => <Input {...props} as="textarea" ref={ref} />);
TextAreaAccepter.displayName = "textarea";

export const TextAreaFormControl = (props: ITextAreaProps) => {
	const { required, name, rule, value, style, formlabel, onChange, placeholder } = props;

	return (
		<Form.Group controlId={name}>
			<Form.ControlLabel>
				<Form.ControlLabel>{required ? <RequiredFieldLabelText text={formlabel} /> : <label>{formlabel}</label>}</Form.ControlLabel>
			</Form.ControlLabel>
			<Form.Control
				name={name}
				aria-multiline="true"
				as="address"
				accepter={TextAreaAccepter}
				placeholder={placeholder}
				rule={rule}
				value={value}
				onChange={onChange}
			/>
		</Form.Group>
	);
};
//#endregion

//#region InputNumberFormControl
interface IInputNumberFormControlProps extends ICommonFormControlProps {
	rule?: CheckType<unknown, any>;
	value?: string;
	required?: boolean;
	style?: CSSProperties;
	onChange?: (value: ValueType, event: SyntheticEvent) => void;
}
const InputNumberAccepter = forwardRef((props, ref: any) => <InputNumber {...props} ref={ref} />);
InputNumberAccepter.displayName = "in";

export const InputNumberFormControl = (props: IInputNumberFormControlProps) => {
	const { required, name, rule, value, style, formlabel, onChange, placeholder } = props;

	return (
		<Form.Group controlId={name}>
			<Form.ControlLabel>{required ? <RequiredFieldLabelText text={formlabel} /> : <label>{formlabel}</label>}</Form.ControlLabel>
			<Form.Control name={name} accepter={InputNumberAccepter} value={value} onChange={onChange} rule={rule} />
		</Form.Group>
	);
};
//#endregion

//#region RequiredField
interface IRequiredFieldLabelTextProps {
	text: string;
}
export const RequiredFieldLabelText = (props: IRequiredFieldLabelTextProps) => {
	const { text } = props;
	return (
		<label>
			{text} <span style={{ color: "red" }}>*</span>
		</label>
	);
};
//#endregion
