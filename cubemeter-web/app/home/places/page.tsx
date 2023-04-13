"use client";
import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { ModalComponent } from "@/components/modal";
import { FailedNotification, SuccessNotification } from "@/components/notifications";
import { TableSearchBarComponent } from "@/components/searchbar";
import IPlace from "@/models/place";
import ReloadIcon from "@rsuite/icons/Reload";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, IconButton, Placeholder, Stack, useToaster } from "rsuite";
import { PlaceTableComponent } from "./component";
import PlacesMachine from "./machine";

const Page = () => {
	const router = useRouter();
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [sortColumn, setSortColumn] = useState();
	const [sortType, setSortType] = useState();
	const [searchKeyword, setSearchKeyword] = useState("");
	const [current, send] = useMachine(PlacesMachine);
	const toaster = useToaster();
	const placement = "topEnd";
	const handleSortColumn = (sortColumn: any, sortType: any) => {
		setSortColumn(sortColumn);
		setSortType(sortType);
	};

	const filteredData = () => {
		const filtered: IPlace[] = current.context.data.filter((item) => {
			if (
				!item.name.includes(searchKeyword) &&
				!item.address.includes(searchKeyword) &&
				!item.serialNumber.includes(searchKeyword) &&
				!item.city.includes(searchKeyword)
			) {
				return false;
			}

			return true;
		});

		if (sortColumn && sortType) {
			return filtered.sort((a, b) => {
				let x: any = a[sortColumn];
				let y: any = b[sortColumn];

				if (typeof x === "string") {
					x = x.charCodeAt(0);
				}
				if (typeof y === "string") {
					y = y.charCodeAt(0);
				}

				if (sortType === "asc") {
					return x - y;
				} else {
					return y - x;
				}
			});
		}
		return filtered;
	};

	useEffect(() => {
		if (current.matches("delete.success")) {
			toaster.push(<SuccessNotification title="Success" message="Place has been successfully deleted." />, {
				duration: 3000,
				placement: placement,
			});
			send("FETCH");
		}
		if (current.matches("delete.failed")) {
			toaster.push(
				<FailedNotification
					title="Failed"
					message={current.context.errorMessage}
					onRetry={() => send("RETRY")}
					onCancel={() => {
						send("CANCEL");
						toaster.clear();
					}}
				/>,
				{
					placement: placement,
					duration: 50000,
				}
			);
		}
	}, [current.value]);

	const renderDeletePrompt = (
		<Stack>
			<label>
				Are you sure you want to delete this place: <b>{current.context.selectedData?.name}</b>?
			</label>
		</Stack>
	);

	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle="Places"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Places",
						active: true,
					},
				]}
			/>
			<Stack direction="row" alignItems="stretch" justifyContent="space-between">
				<Button appearance="primary" disabled={!current.matches("idle")} onClick={() => router.push("home/places/entry")}>
					Create Place
				</Button>
				<Stack direction="row" spacing={10}>
					<IconButton icon={<ReloadIcon />} onClick={() => send("FETCH")} />
					<TableSearchBarComponent
						disable={!current.matches("idle")}
						onHandleSearch={setSearchKeyword}
						searchQuery={searchKeyword}
						placeholder="Search.."
					/>
				</Stack>
			</Stack>
			{current.matches("fetchingData.fetching") && <Placeholder.Grid rows={5} columns={6} active />}
			{!current.matches("fetchingData.fetching") && (
				<PlaceTableComponent
					data={filteredData()}
					limit={limit}
					onChangeLimit={setLimit}
					page={page}
					onChangePage={setPage}
					onHandleSortColumn={handleSortColumn}
					sortColumn={sortColumn}
					sortType={sortType}
					onHandleEdit={(place: IPlace) => router.push(`/home/places/entry?id=${place.id}`)}
					onHandleDelete={(place: IPlace) => send({ type: "DELETE", place: place })}
				/>
			)}
			<ModalComponent
				title="Delete Place"
				open={current.matches("delete.prompt")}
				onCancel={() => send("CANCEL")}
				cancelText="Cancel"
				confirmText="Delete"
				onConfirm={() => send("DELETE_START")}
				size="md"
				onHandleClose={() => send("CANCEL")}
				content={renderDeletePrompt}
			/>
		</Stack>
	);
};

export default Page;
