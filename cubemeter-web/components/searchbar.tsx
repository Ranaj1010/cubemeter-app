import SearchIcon from "@rsuite/icons/Search";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import { AutoComplete, Input, InputGroup } from "rsuite";
import { ISearchProp } from "./header";

interface ISearchBarComponentProps {
	onChangeNavActiveKey: (sideNavKey: string) => void;
	data: ISearchProp[];
}

export const SearchBarComponent = (props: ISearchBarComponentProps) => {
	const { onChangeNavActiveKey, data } = props;
	const [searchQuery, setSearchQuery] = useState("");
	const searcBarStyle: CSSProperties = {
		width: 400,
	};

	const router = useRouter();

	const onHandleSearch = (value: any) => {
		var foundLinkFromSearch = data.find((query) => query.name === value);
		if (foundLinkFromSearch) {
			router.push(foundLinkFromSearch.link);
			setSearchQuery("");
			onChangeNavActiveKey(foundLinkFromSearch.sideNavKey);
			return;
		}

		setSearchQuery(value);
	};

	const searchDataMap = data.map((e: ISearchProp) => e.name);

	return (
		<InputGroup inside size="lg" style={searcBarStyle}>
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<AutoComplete value={searchQuery} data={searchDataMap} onChange={onHandleSearch} size="lg" placeholder="Search" />
		</InputGroup>
	);
};

//#region Table Search
interface ITableSearchBarComponentProps {
	onHandleSearch: (searchQuery: string) => void;
	searchQuery: string;
	placeholder: string;
	disable?: boolean;
}

export const TableSearchBarComponent = (props: ITableSearchBarComponentProps) => {
	const { onHandleSearch, searchQuery, placeholder, disable } = props;
	const searcBarStyle: CSSProperties = {
		width: 300,
	};

	return (
		<InputGroup inside style={searcBarStyle}>
			<Input value={searchQuery} disabled={disable} onChange={onHandleSearch} placeholder={placeholder} />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup>
	);
};
