import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData, Link } from '@remix-run/react'
import { prisma } from '#app/utils/db.server.ts'
import { useOptionalUser } from '#app/utils/user.ts'
// import { type loader as propertiesLoader } from './properties.tsx'

// add loader
export async function loader({ params }: LoaderFunctionArgs) {
	const properties = await prisma.property.findMany({
		where: {
			ownerId: params.username,
		},
	})
	const owner = await prisma.user.findUnique({
		where: { username: params.username },
		select: { id: true, name: true, properties: true },
	})
	return json({ properties, owner })
}

export default function PropertiesIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const hasProperties = data.owner?.properties?.length ?? 0 > 0
	const isOwner = user?.id === data.owner?.id

	return (
		<div className="container pt-12">
			{hasProperties ? (
				<p className="text-body-md">Select a property</p>
			) : (
				<div className="text-center">
					<p className="mb-4 text-body-md">No properties found</p>
					{isOwner && (
						<Link to="new" className="text-blue-500 hover:underline">
							Add a property
						</Link>
					)}
				</div>
			)}
		</div>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/users+/$username_+/properties': typeof loader }
> = ({ params, matches }) => {
	const propertiesMatch = matches.find(
		(m) => m.id === 'routes/users+/$username_+/properties',
	)
	const displayName = propertiesMatch?.data?.owner?.name ?? params.username
	const propertyCount = propertiesMatch?.data?.owner?.properties?.length ?? 0
	const propertiesText = propertyCount === 1 ? 'property' : 'properties'
	return [
		{ title: `${displayName}'s Notes | Epic Notes` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${propertyCount} ${propertiesText} on Epic Notes`,
		},
	]
}
