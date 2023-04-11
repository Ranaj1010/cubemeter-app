"use client";

import ContentComponent from "@/components/content";
import HeaderComponent from "@/components/header";
import SideBarComponent from "@/components/sidebar";
import useThemeManager, { getDefaultTheme } from "@/utilities/theme-manager";
import { useState } from "react";
import { Container, CustomProvider, Divider } from "rsuite";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useThemeManager(getDefaultTheme());
	const [sideNavKey, setSideNavKey] = useState("");
	return (
		<CustomProvider theme={theme}>
			<Container>
				<SideBarComponent sideNavKey={sideNavKey} />
				<Divider
					vertical
					style={{
						height: "100vh",
						padding: 0,
						margin: 0,
					}}
				/>
				<Container
					style={{
						height: "100vh",
						overflowY: "scroll",
					}}
				>
					<HeaderComponent
						theme={theme}
						onChangeTheme={(themeData) => setTheme(themeData)}
						onChangeNavActiveKey={(value: string) => setSideNavKey(value)}
					/>
					<ContentComponent theme={theme}>{children}</ContentComponent>
				</Container>
			</Container>
		</CustomProvider>
	);
}
