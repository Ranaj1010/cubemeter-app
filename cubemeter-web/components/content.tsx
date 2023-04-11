import { ThemeType } from "@/utilities/theme-manager";
import { CSSProperties } from "react";
import { Content } from "rsuite";

interface IContentProps {
	children: React.ReactNode;
	theme: ThemeType;
}

const ContentComponent = (props: IContentProps) => {
	const { children, theme } = props;
	const contentStyle: CSSProperties = {
		paddingLeft: 40,
		paddingRight: 40,
		paddingTop: 0,
		paddingBottom: 80,
	};
	return <Content style={contentStyle}>{children}</Content>;
};

export default ContentComponent;
