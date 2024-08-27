import React, { useState } from 'react'

const RehabCostEstimator = () => {
	// State variables for user inputs
	const [materials, setMaterials] = useState([{ quantity: 0, costPerUnit: 0 }])
	const [labor, setLabor] = useState([{ hours: 0, hourlyRate: 0 }])
	const [contingencyPercentage, setContingencyPercentage] = useState(10)
	const [purchasePrice, setPurchasePrice] = useState(0)
	const [expectedSalePrice, setExpectedSalePrice] = useState(0)
	const [propertySquareFootage, setPropertySquareFootage] = useState(0)
	const [annualCashFlow, setAnnualCashFlow] = useState(0)

	// Functions to handle changes in input fields
	const handleMaterialChange = (
		index: number,
		field: 'quantity' | 'costPerUnit',
		value: string,
	) => {
		const newMaterials = [...materials]
		;(newMaterials[index] as { [key: string]: number })[field] =
			parseFloat(value) || 0
		setMaterials(newMaterials)
	}

	const handleLaborChange = (
		index: number,
		field: 'hours' | 'hourlyRate',
		value: string,
	) => {
		const newLabor = [...labor]
		newLabor[index]![field] = parseFloat(value) || 0
		setLabor(newLabor)
	}

	// Function to calculate total material cost
	const calculateMaterialCost = () => {
		return materials.reduce(
			(total, material) => total + material.quantity * material.costPerUnit,
			0,
		)
	}

	// Function to calculate total labor cost
	const calculateLaborCost = () => {
		return labor.reduce(
			(total, laborItem) => total + laborItem.hours * laborItem.hourlyRate,
			0,
		)
	}

	// Function to calculate contingency cost
	const calculateContingencyCost = () => {
		return (
			(calculateMaterialCost() + calculateLaborCost()) *
			(contingencyPercentage / 100)
		)
	}

	// Function to calculate total rehab cost
	const calculateTotalRehabCost = () => {
		return (
			calculateMaterialCost() +
			calculateLaborCost() +
			calculateContingencyCost()
		)
	}

	// Function to calculate cost per square foot
	const calculateCostPerSquareFoot = () => {
		return calculateTotalRehabCost() / propertySquareFootage
	}

	// Function to calculate ROI
	const calculateROI = () => {
		const totalCost = purchasePrice + calculateTotalRehabCost()
		return ((expectedSalePrice - totalCost) / totalCost) * 100
	}

	// Function to calculate payback period
	const calculatePaybackPeriod = () => {
		return calculateTotalRehabCost() / annualCashFlow
	}

	// Function to add more materials or labor inputs
	const addMaterial = () => {
		setMaterials([...materials, { quantity: 0, costPerUnit: 0 }])
	}

	const addLabor = () => {
		setLabor([...labor, { hours: 0, hourlyRate: 0 }])
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<h2 className="mb-4 text-2xl font-bold">Rehab Cost Estimator</h2>

			<h3 className="mb-2 mt-4 text-xl font-semibold">Materials</h3>
			{materials.map((material, index) => (
				<div key={index} className="mb-2 flex space-x-2">
					<div className="w-1/2">
						<label
							htmlFor={`material-quantity-${index}`}
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Quantity
						</label>
						<input
							id={`material-quantity-${index}`}
							type="number"
							value={material.quantity}
							onChange={(e) =>
								handleMaterialChange(index, 'quantity', e.target.value)
							}
							className="w-full rounded border p-2"
						/>
					</div>
					<div className="w-1/2">
						<label
							htmlFor={`material-cost-${index}`}
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Cost per Unit
						</label>
						<input
							id={`material-cost-${index}`}
							type="number"
							value={material.costPerUnit}
							onChange={(e) =>
								handleMaterialChange(index, 'costPerUnit', e.target.value)
							}
							className="w-full rounded border p-2"
						/>
					</div>
				</div>
			))}
			<button
				onClick={addMaterial}
				className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
			>
				Add Material
			</button>

			<h3 className="mb-2 mt-6 text-xl font-semibold">Labor</h3>
			{labor.map((laborItem, index) => (
				<div key={index} className="mb-2 flex space-x-2">
					<div className="w-1/2">
						<label
							htmlFor={`labor-hours-${index}`}
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Hours
						</label>
						<input
							id={`labor-hours-${index}`}
							type="number"
							value={laborItem.hours}
							onChange={(e) =>
								handleLaborChange(index, 'hours', e.target.value)
							}
							className="w-full rounded border p-2"
						/>
					</div>
					<div className="w-1/2">
						<label
							htmlFor={`labor-rate-${index}`}
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Hourly Rate
						</label>
						<input
							id={`labor-rate-${index}`}
							type="number"
							value={laborItem.hourlyRate}
							onChange={(e) =>
								handleLaborChange(index, 'hourlyRate', e.target.value)
							}
							className="w-full rounded border p-2"
						/>
					</div>
				</div>
			))}
			<button
				onClick={addLabor}
				className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
			>
				Add Labor
			</button>

			<h3 className="mb-2 mt-6 text-xl font-semibold">
				Additional Information
			</h3>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="contingency"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Contingency Percentage
					</label>
					<input
						id="contingency"
						type="number"
						value={contingencyPercentage}
						onChange={(e) =>
							setContingencyPercentage(parseFloat(e.target.value) || 0)
						}
						className="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="purchase-price"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Purchase Price
					</label>
					<input
						id="purchase-price"
						type="number"
						value={purchasePrice}
						onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
						className="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="expected-sale-price"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Expected Sale Price
					</label>
					<input
						id="expected-sale-price"
						type="number"
						value={expectedSalePrice}
						onChange={(e) =>
							setExpectedSalePrice(parseFloat(e.target.value) || 0)
						}
						className="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="property-square-footage"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Property Square Footage
					</label>
					<input
						id="property-square-footage"
						type="number"
						value={propertySquareFootage}
						onChange={(e) =>
							setPropertySquareFootage(parseFloat(e.target.value) || 0)
						}
						className="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="annual-cash-flow"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Annual Cash Flow
					</label>
					<input
						id="annual-cash-flow"
						type="number"
						value={annualCashFlow}
						onChange={(e) => setAnnualCashFlow(parseFloat(e.target.value) || 0)}
						className="w-full rounded border p-2"
					/>
				</div>
			</div>

			<h3 className="mb-2 mt-4 text-xl font-semibold">Estimates</h3>
			<div className="space-y-2">
				<p>Total Material Cost: ${calculateMaterialCost().toFixed(2)}</p>
				<p>Total Labor Cost: ${calculateLaborCost().toFixed(2)}</p>
				<p>Contingency Cost: ${calculateContingencyCost().toFixed(2)}</p>
				<p>Total Rehab Cost: ${calculateTotalRehabCost().toFixed(2)}</p>
				<p>Cost per Square Foot: ${calculateCostPerSquareFoot().toFixed(2)}</p>
				<p>ROI: {calculateROI().toFixed(2)}%</p>
				<p>Payback Period: {calculatePaybackPeriod().toFixed(2)} years</p>
			</div>
		</div>
	)
}

export default RehabCostEstimator
