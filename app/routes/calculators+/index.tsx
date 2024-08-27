import { Link } from '@remix-run/react'

const listOfCalculators = [
	{ name: 'Morgage Loan', path: 'morgage-loan' },
	{ name: 'Rental Property', path: 'rental-property' },
	// { name: 'BRRRR', path: 'brrrr' },
	// { name: 'Fix and Flip', path: 'fix-and-flip' },
	{ name: 'Rehab Cost Estimate', path: 'rehab-cost-estimate' },
]
export default function Calculators() {
	return (
		<div className="mx-auto max-w-2xl p-6">
			<h1 className="mb-6 text-3xl font-bold">Calculators</h1>
			<ul className="space-y-3">
				{listOfCalculators.map((calculator) => (
					<li key={calculator.name}>
						<Link
							to={calculator.path}
							className="block rounded bg-blue-100 px-4 py-3 font-semibold text-blue-800 transition duration-300 ease-in-out hover:bg-blue-200"
						>
							{calculator.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
