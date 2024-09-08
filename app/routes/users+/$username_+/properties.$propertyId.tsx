import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
// import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	console.log('params', params)
	const property = await prisma.property.findUnique({
		where: { id: params.propertyId },
	})
	return json({ property })
}

export default function PropertyRoute() {
	const data = useLoaderData<typeof loader>()
	console.log('data', data)
	return (
		<div>
			<h1>{data.property?.name}</h1>
			<p>{data.property?.address}</p>
		</div>
	)
}
