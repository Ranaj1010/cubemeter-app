"use client";

import { useEffect, useState } from "react";

const localStorageName = "theme";
export type ThemeType = "dark" | "light" | "high-contrast";

export const getDefaultTheme = (): ThemeType => {
	return typeof window !== "undefined" ? (localStorage.getItem(localStorageName) as ThemeType) : "light";
};

const setDefaultTheme = (value: ThemeType) => localStorage.setItem(localStorageName, value);

const useThemeManager = (themeType: ThemeType) => {
	const [theme, setTheme] = useState<ThemeType>(themeType);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setTheme(getDefaultTheme());
		}
	}, []);

	const changeTheme = (value: ThemeType) => {
		setDefaultTheme(value);
		setTheme(value);
	};

	return [theme, changeTheme] as const;
};

export default useThemeManager;
