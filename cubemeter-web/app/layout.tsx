"use client";

import useThemeManager, { getDefaultTheme } from "@/utilities/theme-manager";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [theme] = useThemeManager(getDefaultTheme());

	return (
		<html lang="en">
			<body style={{ maxHeight: "100%" }}>
				<CustomProvider theme={theme}>{children}</CustomProvider>
			</body>
		</html>
	);
}
