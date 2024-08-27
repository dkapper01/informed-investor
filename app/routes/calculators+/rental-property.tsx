import { useState } from 'react'

export default function RentalProperty() {
	const [monthlyRent, setMonthlyRent] = useState(0)
	const [mortgage, setMortgage] = useState(0)
	const [taxes, setTaxes] = useState(0)
	const [insurance, setInsurance] = useState(0)
	const [maintenance, setMaintenance] = useState(0)

	const monthlyExpenses = mortgage + taxes + insurance + maintenance
	const monthlyCashFlow = monthlyRent - monthlyExpenses
	const annualCashFlow = monthlyCashFlow * 12

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div className="px-4 py-8 sm:px-0">
				<div className="border-b border-gray-200 pb-5">
					<h3 className="text-2xl font-semibold leading-6 text-gray-900">
						Rental Property Calculator
					</h3>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input
						label="Monthly Rent"
						value={monthlyRent}
						onChange={setMonthlyRent}
					/>
					<Input
						label="Monthly Mortgage"
						value={mortgage}
						onChange={setMortgage}
					/>
					<Input label="Monthly Taxes" value={taxes} onChange={setTaxes} />
					<Input
						label="Monthly Insurance"
						value={insurance}
						onChange={setInsurance}
					/>
					<Input
						label="Monthly Maintenance"
						value={maintenance}
						onChange={setMaintenance}
					/>
				</div>

				<div className="mt-8 border-t border-gray-200 pt-8">
					<h2 className="text-base font-semibold leading-6 text-gray-900">
						Results
					</h2>
					<dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">
								Monthly Cash Flow
							</dt>
							<dd className="mt-1 text-sm text-gray-900">
								${monthlyCashFlow.toFixed(2)}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">
								Annual Cash Flow
							</dt>
							<dd className="mt-1 text-sm text-gray-900">
								${annualCashFlow.toFixed(2)}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	)
}

function Input({
	label,
	value,
	onChange,
}: {
	label: string
	value: number
	onChange: (value: number) => void
}) {
	return (
		<div>
			<label
				htmlFor={label}
				className="block text-sm font-medium leading-6 text-gray-900"
			>
				{label}
			</label>
			<div className="mt-2">
				<input
					type="number"
					name={label}
					id={label}
					value={value}
					onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
	)
}
