import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { BlockStack, Card, DataTable, EmptyState, Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";

export const loader = async ({ request }) => {
  	const auth = await authenticate.admin(request);
  	const shop = auth.session.shop;
  	const wishlistData =
		(await prisma.wishlist.findMany({
			where: {
				shop: 'https://' + shop,
			},
			orderBy: {
				id: "asc",
			},
		})) || [];

	const wishlistArray = wishlistData.map((item) => {
		const createdAt = formatDistanceToNow(item?.createdAt, { addSuffix: true });
		return [item.customerName ?? item.customerId, item.productName ?? item.productId, createdAt];
	}) ?? [];

	return Response.json(wishlistArray ?? []);
};

export const action = async ({ request }) => {};

export default function Index() {
	const wishlistData = useLoaderData() || [];

	return (
		<Page>
			<TitleBar title="Wishlist Overview" />
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							{wishlistData.length > 0 ? (
								<DataTable columnContentTypes={[ 'text', 'text', 'text']} headings={[ 'Customer Name', 'Product Name', 'Created At']}
									rows={wishlistData}/>
							) : (
								<EmptyState
									heading="Manage your wishlist products here"
									image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
								>
									<p>You don't have any products in your wishlist yet.</p>
								</EmptyState>
							)}
						</Card>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</Page>
	)
}
