import { useState } from 'react'

export default function MorgageLoan() {
	const [loanAmount, setLoanAmount] = useState('')
	const [loanPeriod, setLoanPeriod] = useState('')
	const [interestRate, setInterestRate] = useState('')
	const [annualTaxes, setAnnualTaxes] = useState('')
	const [annualInsurance, setAnnualInsurance] = useState('')
	const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null)

	const calculateMonthlyPayment = () => {
		const principal = parseFloat(loanAmount)
		const years = parseFloat(loanPeriod)
		const rate = parseFloat(interestRate) / 100 / 12
		const numberOfPayments = years * 12
		const taxes = parseFloat(annualTaxes) / 12
		const insurance = parseFloat(annualInsurance) / 12

		const monthlyPrincipalAndInterest =
			(principal * rate * Math.pow(1 + rate, numberOfPayments)) /
			(Math.pow(1 + rate, numberOfPayments) - 1)

		const totalMonthlyPayment = monthlyPrincipalAndInterest + taxes + insurance

		setMonthlyPayment(totalMonthlyPayment.toFixed(2))
	}

	return (
		<div className="mx-auto max-w-md border border-gray-300 p-5">
			<h2 className="mb-4 text-xl font-bold">Morgage Loan Calculator</h2>
			<div className="mb-4">
				<label className="mb-2 block">Loan Amount:</label>
				<input
					type="number"
					value={loanAmount}
					onChange={(e) => setLoanAmount(e.target.value)}
					placeholder="Enter loan amount"
					className="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<div className="mb-4">
				<label className="mb-2 block">Loan Period (years):</label>
				<input
					type="number"
					value={loanPeriod}
					onChange={(e) => setLoanPeriod(e.target.value)}
					placeholder="Enter loan period"
					className="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<div className="mb-4">
				<label className="mb-2 block">Interest Rate (%):</label>
				<input
					type="number"
					value={interestRate}
					onChange={(e) => setInterestRate(e.target.value)}
					placeholder="Enter interest rate"
					className="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<div className="mb-4">
				<label className="mb-2 block">Annual Taxes:</label>
				<input
					type="number"
					value={annualTaxes}
					onChange={(e) => setAnnualTaxes(e.target.value)}
					placeholder="Enter annual taxes"
					className="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<div className="mb-4">
				<label className="mb-2 block">Annual Insurance:</label>
				<input
					type="number"
					value={annualInsurance}
					onChange={(e) => setAnnualInsurance(e.target.value)}
					placeholder="Enter annual insurance"
					className="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<button
				onClick={calculateMonthlyPayment}
				className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
			>
				Calculate
			</button>
			{monthlyPayment !== null && (
				<div className="mt-6">
					<h3 className="text-lg font-semibold">
						Monthly Payment: ${monthlyPayment}
					</h3>
				</div>
			)}
		</div>
	)
}
