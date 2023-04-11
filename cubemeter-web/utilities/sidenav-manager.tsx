import { useEffect, useState } from "react";

const localStorageName = "activeKey";

export const getDefaultActiveKey = (): string => localStorage.getItem(localStorageName) as string;

const setDefaultActiveKey = (value: string) => localStorage.setItem(localStorageName, value);

const useSideNavManager = (key: string) => {
	const [activeKey, setActiveKey] = useState(key);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setActiveKey(getDefaultActiveKey);
		}
	}, []);

	const changeActiveKey = (value: string) => {
		setDefaultActiveKey(value);
		setActiveKey(value);
	};

	return [activeKey, changeActiveKey] as const;
};

export default useSideNavManager;
