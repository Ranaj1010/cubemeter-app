"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { useMachine } from "@xstate/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import IMeter from "@/models/meter";
import EditIcon from "@rsuite/icons/Edit";
import DeleteIcon from "@rsuite/icons/Trash";
import { Button, Header, Panel, PanelGroup, Placeholder, Stack } from "rsuite";
import { TenantMeterGridView, TenantPropertyItem } from "./components";
import TenantDetails from "./machine";
const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	const [current, send] = useMachine(TenantDetails);

	useEffect(() => {
		if (params != null) {
			let idParams = params?.get("id");
			if (idParams) {
				send({ type: "RETRIEVE_DATA", id: idParams });
			}
		}
	}, [params]);

	return current.matches("retrieveDataById") ? (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle="Loading..."
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Tenants",
						href: "/home/tenants",
					},
					{
						title: "Loading....",
						active: true,
					},
				]}
			/>
			<Placeholder.Grid></Placeholder.Grid>
		</Stack>
	) : (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<BreadCrumbComponent
					currentTitle={current.context.payload != null ? current.context.payload.name : "Tenant not found. :("}
					breadCrumbs={[
						{
							title: "Home",
							href: "/home/dashboard",
						},
						{
							title: "Tenants",
							href: "/home/tenants",
						},
						{
							title: current.context.payload != null ? current.context.payload.name : "Tenant not found. :(",
							active: true,
						},
					]}
				/>
				<Stack spacing={10}>
					<Button startIcon={<EditIcon />} appearance="ghost">
						Edit
					</Button>
					<Button startIcon={<DeleteIcon />} appearance="ghost" color="red">
						Delete
					</Button>
				</Stack>
			</Stack>
			<PanelGroup accordion bordered>
				<Panel header="Details" defaultExpanded>
					<Stack direction="row" alignItems="center" spacing={200} justifyContent="flex-start">
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<TenantPropertyItem label="Unit Id" value={current.context.payload?.unitId.toString() ?? ""} />
							<TenantPropertyItem label="Serial Number" value={current.context.payload?.serialNumber.toString() ?? ""} />
							<TenantPropertyItem label="Gateway" value={current.context.payload?.gateway.toString() ?? ""} />
						</Stack>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<TenantPropertyItem label="Date Registered" value={current.context.payload?.dateRegistered.toString() ?? ""} />
							<TenantPropertyItem label="Place" value={current.context.payload?.place?.name.toString() ?? ""} />
							<TenantPropertyItem label="Remarks" value={current.context.payload?.remarks.toString() ?? ""} />
						</Stack>
					</Stack>
				</Panel>
			</PanelGroup>
			<Stack direction="column" spacing={30} alignItems="flex-start">
				<Header as="h3">Meters</Header>
				<Button
					appearance="primary"
					disabled={!current.matches("idle")}
					onClick={() => router.push(`home/meters/entry?tenantId=${current.context.id}`)}
				>
					Create Meter
				</Button>
				<TenantMeterGridView
					onHandleView={(meter: IMeter) => router.push(`/home/meters/details?id=${meter.id}`)}
					meters={current.context.meters}
				/>
			</Stack>
		</Stack>
	);
};

export default Page;
