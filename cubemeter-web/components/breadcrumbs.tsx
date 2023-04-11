import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { Breadcrumb, BreadcrumbItemProps, Stack } from "rsuite";

interface IBreadcrumProps {
	currentTitle: string;
	breadCrumbs: BreadcrumbItemProps[];
}

const NavLink = forwardRef((props: any, ref) => {
	const { href, as, children, ...rest } = props;
	return (
		<Link legacyBehavior href={href} as={as}>
			<a ref={ref} {...rest}>
				{children}
			</a>
		</Link>
	);
});

NavLink.displayName = "navLink";

export const BreadCrumbComponent = (props: IBreadcrumProps) => {
	const { currentTitle, breadCrumbs } = props;
	const router = useRouter();
	return (
		<Stack alignItems="flex-start" direction="column" justifyContent="center">
			<h2>{currentTitle}</h2>
			<Breadcrumb>
				{breadCrumbs.map((breadCrumbProp) => (
					<Breadcrumb.Item key={breadCrumbProp.title} as={NavLink} href={breadCrumbProp.href} active={breadCrumbProp.active}>
						{breadCrumbProp.title}
					</Breadcrumb.Item>
				))}
			</Breadcrumb>
		</Stack>
	);
};
