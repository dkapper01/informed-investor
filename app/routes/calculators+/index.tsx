import { Link } from '@remix-run/react'

const listOfCalculators = [
	{ name: 'Morgage Loan', path: 'morgage-loan' },
	{ name: 'Rental Property', path: 'rental-property' },
	{ name: 'BRRRR', path: 'brrrr' },
	{ name: 'Fix and Flip', path: 'fix-and-flip' },
]
export default function Calculators() {
	return (
		<div>
			Calculators
			<ul>
				{listOfCalculators.map((calculator) => (
					<li key={calculator.name}>
						<Link to={calculator.path}>{calculator.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
