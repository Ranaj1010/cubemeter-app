"use client";

import useSideNavManager from "@/utilities/sidenav-manager";
import { Icon } from "@rsuite/icons";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import PeoplesIcon from "@rsuite/icons/Peoples";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import { MdOutlineElectricMeter, MdOutlineLocationOn } from "react-icons/md";
import { Divider, Footer, Nav, Navbar, Sidebar, Sidenav, Stack } from "rsuite";
import searchData from "../data/search.json";
import logo from "../public/cubemeter-temp-logo.png";
const headerStyles = {
	padding: 10,
	marginTop: 15,
	fontSize: 16,
	color: " #fff",
};

interface ISidebarProps {
	sideNavKey: string;
}

const SideBarComponent = (props: ISidebarProps) => {
	const { sideNavKey } = props;
	const [activeKey, setActiveKey] = useSideNavManager();
	const [openKeys, setOpenKeys] = useState(["overview"]);
	const [expanded, setExpand] = useState(true);
	const router = useRouter();
	const pathName = usePathname();

	useEffect(() => {
		let foundLinkFromSearch = searchData.find((query) => query.link === pathName);
		if (foundLinkFromSearch) {
			router.push(foundLinkFromSearch.link);
			setActiveKey(foundLinkFromSearch.sideNavKey);
		}
	}, [pathName]);

	const handleSetActive = (eventKey: any, event: SyntheticEvent<Element, Event>) => {
		setActiveKey(eventKey);
	};

	return (
		<Sidebar style={{ display: "flex", flexDirection: "column" }} width={expanded ? 260 : 56} collapsible>
			<Sidenav openKeys={openKeys} expanded={expanded} onOpenChange={setOpenKeys} defaultOpenKeys={openKeys} appearance="subtle">
				<SideNavHeader expanded={expanded} />
				<Sidenav.Body>
					<Nav onSelect={handleSetActive} activeKey={activeKey} vertical>
						<Nav.Menu eventKey="overview" icon={<DashboardIcon />} title="Overview" collapsible expanded>
							<Nav.Item eventKey="dashboard" onClick={() => router.push("/home/dashboard")}>
								Dashboard
							</Nav.Item>
						</Nav.Menu>
						<Nav.Item eventKey="meters" icon={<Icon as={MdOutlineElectricMeter} />} onClick={() => router.push("/home/meters")}>
							Meters
						</Nav.Item>
						<Nav.Item eventKey="tenants" icon={<PeoplesIcon />} onClick={() => router.push("/home/tenants")}>
							Tenants
						</Nav.Item>
						<Nav.Item eventKey="places" icon={<Icon as={MdOutlineLocationOn} />} onClick={() => router.push("/home/places")}>
							Places
						</Nav.Item>
					</Nav>
				</Sidenav.Body>
			</Sidenav>
			<SideNavFooter expanded={expanded} setExpand={setExpand} />
		</Sidebar>
	);
};

interface ISideNavHeader {
	expanded: boolean;
}
const SideNavHeader = (props: ISideNavHeader) => {
	const { expanded } = props;
	return (
		<Sidenav.Header style={{ marginBottom: 40 }}>
			<Stack direction="row" justifyContent="flex-start" alignItems="center" style={headerStyles}>
				<Image src={logo} alt="logo" width={35} height={35} />
				{expanded && (
					<h3
						style={{
							color: "#3498FF",
							marginLeft: 10,
						}}
					>
						cubemeter
					</h3>
				)}
			</Stack>
		</Sidenav.Header>
	);
};

interface ISideNavFooter {
	expanded: boolean;
	setExpand: (value: boolean) => void;
}

const SideNavFooter = (props: ISideNavFooter) => {
	const { expanded, setExpand } = props;
	return (
		<div style={{ marginTop: "auto" }}>
			<Divider style={{ padding: 0, margin: 0 }} />
			<Footer>
				<NavToggle expand={expanded} onChange={() => setExpand(!expanded)} />
			</Footer>
		</div>
	);
};

const NavToggle = ({ expand = false, onChange = () => {} }) => {
	return (
		<Navbar appearance="subtle">
			<Nav pullRight>
				<Nav.Item onClick={onChange} style={{ width: 56, textAlign: "center" }}>
					{expand ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />}
				</Nav.Item>
			</Nav>
		</Navbar>
	);
};

export default SideBarComponent;
