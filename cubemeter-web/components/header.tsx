import { ThemeType } from "@/utilities/theme-manager";
import { Icon } from "@rsuite/icons";
import NoticeIcon from "@rsuite/icons/Notice";
import Image from "next/image";
import { CSSProperties } from "react";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { Avatar, Badge, Header, IconButton, Stack } from "rsuite";
import searchData from "../data/search.json";
import tempAvatar from "../public/cubemeter-temp-avatar.png";
import { SearchBarComponent } from "./searchbar";
const headerStyle: CSSProperties = {
	paddingLeft: 40,
	paddingRight: 40,
	paddingTop: 20,
	paddingBottom: 40,
};

interface IHeaderProps {
	theme: ThemeType;
	onChangeTheme: (theme: ThemeType) => void;
	onChangeNavActiveKey: (sideNavKey: string) => void;
}

interface IToolbarOptionsProps {
	theme: ThemeType;
	onChangeTheme: (theme: ThemeType) => void;
}

export interface ISearchProp {
	name: string;
	link: string;
	sideNavKey: string;
}

const ToolbarOptionsComponent = (props: IToolbarOptionsProps) => {
	const { theme, onChangeTheme } = props;
	return (
		<Stack direction="row" spacing={20} justifyContent="flex-end">
			<IconButton
				circle
				icon={<Icon as={theme === "light" ? MdOutlineNightlight : MdOutlineLightMode} style={{ fontSize: 20 }} />}
				onClick={() => onChangeTheme(theme === "dark" ? "light" : "dark")}
				size="lg"
			/>
			<Badge content={7}>
				<IconButton circle icon={<NoticeIcon />} style={{ fontSize: 20 }} size="lg" />
			</Badge>
			<Stack.Item alignSelf="center">
				<Avatar alt="avatar" size="md" circle style={{ marginTop: 5 }}>
					<Image src={tempAvatar} alt="logo" width={35} height={35} />
				</Avatar>
			</Stack.Item>
		</Stack>
	);
};

const HeaderComponent = (props: IHeaderProps) => {
	const { theme, onChangeTheme, onChangeNavActiveKey } = props;
	return (
		<Header style={headerStyle}>
			<Stack alignItems="center" direction="row" justifyContent="space-between">
				<SearchBarComponent data={searchData} onChangeNavActiveKey={onChangeNavActiveKey} />
				<ToolbarOptionsComponent theme={theme} onChangeTheme={onChangeTheme} />
			</Stack>
		</Header>
	);
};

export default HeaderComponent;
