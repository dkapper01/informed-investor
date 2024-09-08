'use client'
import { format, addYears, differenceInMonths } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
	DollarSign,
	// Calendar,
	Percent,
	CreditCard,
	PiggyBank,
	TrendingUp,
	CalendarClock,
	// Plus,
	Home,
	Calculator,
	Edit,
	// Info,
	ArrowRight,
	Coins,
	BarChart3,
	Clock,
	// Target,
	Banknote,
	Landmark,
	DollarSignIcon,
	PercentIcon,
	CalendarIcon,
	TrendingDownIcon,
} from 'lucide-react'
import { useState } from 'react'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
} from 'recharts'
import { Button } from '../../components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Progress } from '../../components/ui/progress'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select'
import { Slider } from '../../components/ui/slider'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../components/ui/tabs'

// Define the type for the results object
type Results = {
	monthlyPayment: string
	totalPayment: string
	totalInterest: string
	payoffDate: string
	principalPercentage: string
	interestPercentage: string
	principalAmount: string
	interestAmount: string
	monthsSaved: number
	interestSaved: string
} | null

export default function Component() {
	const [loanAmount, setLoanAmount] = useState('200000')
	const [interestRate, setInterestRate] = useState('3.5')
	const [loanTerm, setLoanTerm] = useState('30')
	const [extraPayment, setExtraPayment] = useState('0')
	const [extraPaymentFrequency, setExtraPaymentFrequency] = useState('monthly')
	const [extraPaymentStartDate, setExtraPaymentStartDate] = useState(
		format(new Date(), 'yyyy-MM-dd'),
	)
	const [results, setResults] = useState<Results | null>(null)
	const [graphData, setGraphData] = useState<
		Array<{ year: number; balance: string; cumulativeInterest: string }>
	>([])
	const [showResults, setShowResults] = useState(false)
	const [showExtraPayments, setShowExtraPayments] = useState(false)
	const [isLoanDetailsExpanded, setIsLoanDetailsExpanded] = useState(true)

	const calculateMortgage = () => {
		const principal = parseFloat(loanAmount)
		const rate = parseFloat(interestRate) / 100 / 12
		const term = parseInt(loanTerm) * 12
		const extra = parseFloat(extraPayment)
		const startDate = new Date(extraPaymentStartDate)

		const monthlyPayment =
			(principal * rate * Math.pow(1 + rate, term)) /
			(Math.pow(1 + rate, term) - 1)
		let totalPayment = monthlyPayment * term
		let totalInterest = totalPayment - principal

		const payoffDate = new Date()
		payoffDate.setMonth(payoffDate.getMonth() + term)

		// Calculate with extra payments
		if (extra > 0) {
			let balance = principal
			let actualPayments = 0
			let actualInterest = 0
			const currentDate = new Date()
			while (balance > 0 && actualPayments < term) {
				const interestPayment = balance * rate
				let principalPayment = monthlyPayment - interestPayment

				if (currentDate >= startDate) {
					switch (extraPaymentFrequency) {
						case 'monthly':
							principalPayment += extra
							break
						case 'quarterly':
							if (actualPayments % 3 === 0) principalPayment += extra
							break
						case 'annually':
							if (actualPayments % 12 === 0) principalPayment += extra
							break
					}
				}

				principalPayment = Math.min(balance, principalPayment)
				balance -= principalPayment
				actualInterest += interestPayment
				actualPayments++
				currentDate.setMonth(currentDate.getMonth() + 1)
			}
			totalPayment =
				monthlyPayment * actualPayments +
				extra *
					Math.floor(
						actualPayments /
							(extraPaymentFrequency === 'monthly'
								? 1
								: extraPaymentFrequency === 'quarterly'
									? 3
									: 12),
					)
			totalInterest = actualInterest
			payoffDate.setMonth(payoffDate.getMonth() - term + actualPayments)
		}

		const principalPercentage = ((principal / totalPayment) * 100).toFixed(2)
		const interestPercentage = ((totalInterest / totalPayment) * 100).toFixed(2)

		const originalPayoffDate = addYears(new Date(), parseInt(loanTerm))
		const monthsSaved = differenceInMonths(originalPayoffDate, payoffDate)

		setResults({
			monthlyPayment: monthlyPayment.toFixed(2),
			totalPayment: totalPayment.toFixed(2),
			totalInterest: totalInterest.toFixed(2),
			payoffDate: payoffDate.toLocaleDateString(),
			principalPercentage,
			interestPercentage,
			principalAmount: principal.toFixed(2),
			interestAmount: totalInterest.toFixed(2),
			monthsSaved,
			interestSaved: (monthlyPayment * term - totalPayment).toFixed(2),
		})

		// Calculate graph data
		const graphData = []
		let balance = principal
		let cumulativeInterest = 0
		const currentDate = new Date()
		for (let year = 0; year <= parseInt(loanTerm); year++) {
			graphData.push({
				year,
				balance: balance.toFixed(2),
				cumulativeInterest: cumulativeInterest.toFixed(2),
			})
			for (let month = 0; month < 12; month++) {
				const interestPayment = balance * rate
				let principalPayment = monthlyPayment - interestPayment

				if (currentDate >= startDate) {
					switch (extraPaymentFrequency) {
						case 'monthly':
							principalPayment += extra
							break
						case 'quarterly':
							if ((year * 12 + month) % 3 === 0) principalPayment += extra
							break
						case 'annually':
							if (month === 0) principalPayment += extra
							break
					}
				}

				principalPayment = Math.min(balance, principalPayment)
				balance -= principalPayment
				cumulativeInterest += interestPayment
				if (balance <= 0) break
				currentDate.setMonth(currentDate.getMonth() + 1)
			}
			if (balance <= 0) break
		}
		setGraphData(graphData)

		setShowResults(true)
		setShowExtraPayments(true)
		setIsLoanDetailsExpanded(false)
	}

	const formatNumber = (num: number): string => {
		return num.toLocaleString('en-US')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 md:p-8">
			<Card className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-white/90 shadow-2xl backdrop-blur-sm">
				<CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
					<CardTitle className="flex items-center text-3xl font-bold">
						<Home className="mr-2 h-8 w-8" />
						Mortgage Payoff Calculator
					</CardTitle>
					<CardDescription className="text-blue-100">
						Plan your mortgage journey and explore payment options
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div className="space-y-6">
							<AnimatePresence>
								{isLoanDetailsExpanded ? (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
									>
										<Card>
											<CardHeader>
												<CardTitle className="text-lg font-semibold">
													Loan Details
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div>
													<Label htmlFor="loanAmount">Loan Amount</Label>
													<div className="relative mt-1">
														<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
														<Input
															id="loanAmount"
															type="number"
															value={loanAmount}
															onChange={(e) => setLoanAmount(e.target.value)}
															className="pl-10"
														/>
													</div>
												</div>
												<div>
													<Label htmlFor="interestRate">
														Interest Rate (%)
													</Label>
													<div className="relative mt-1">
														<Percent className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
														<Input
															id="interestRate"
															type="number"
															step="0.1"
															value={interestRate}
															onChange={(e) => setInterestRate(e.target.value)}
															className="pl-10"
														/>
													</div>
												</div>
												<div>
													<Label htmlFor="loanTerm">Loan Term (Years)</Label>
													<Select value={loanTerm} onValueChange={setLoanTerm}>
														<SelectTrigger id="loanTerm">
															<SelectValue placeholder="Select loan term" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="15">15 years</SelectItem>
															<SelectItem value="20">20 years</SelectItem>
															<SelectItem value="30">30 years</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<Button
													onClick={calculateMortgage}
													className="w-full bg-blue-500 text-white hover:bg-blue-600"
												>
													<Calculator className="mr-2 h-4 w-4" />
													Calculate
												</Button>
											</CardContent>
										</Card>
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
									>
										<Card>
											<CardContent className="p-4">
												<div className="flex items-center justify-between">
													<div>
														<p className="text-sm font-medium text-gray-500">
															Loan Amount
														</p>
														<p className="text-lg font-bold">
															${formatNumber(parseFloat(loanAmount))}
														</p>
													</div>
													<div>
														<p className="text-sm font-medium text-gray-500">
															Interest Rate
														</p>
														<p className="text-lg font-bold">{interestRate}%</p>
													</div>
													<div>
														<p className="text-sm font-medium text-gray-500">
															Loan Term
														</p>
														<p className="text-lg font-bold">
															{loanTerm} years
														</p>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setIsLoanDetailsExpanded(true)}
													>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</Button>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								)}
							</AnimatePresence>

							{showExtraPayments && (
								<AnimatePresence>
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
									>
										<Card>
											<CardHeader>
												<CardTitle className="text-lg font-semibold">
													Extra Payments
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div>
													<Label htmlFor="extraPayment">
														Extra Payment Amount
													</Label>
													<div className="relative mt-1">
														<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
														<Input
															id="extraPayment"
															type="number"
															value={extraPayment}
															onChange={(e) => setExtraPayment(e.target.value)}
															className="pl-10"
														/>
													</div>
												</div>
												<div>
													<Label htmlFor="extraPaymentSlider">
														Adjust Extra Payment
													</Label>
													<Slider
														id="extraPaymentSlider"
														min={0}
														max={1000}
														step={50}
														value={[parseFloat(extraPayment)]}
														onValueChange={(value) =>
															setExtraPayment(value?.[0]?.toString() ?? '0')
														}
														className="mt-2"
													/>
												</div>
												<div>
													<Label htmlFor="extraPaymentFrequency">
														Extra Payment Frequency
													</Label>
													<Select
														value={extraPaymentFrequency}
														onValueChange={setExtraPaymentFrequency}
													>
														<SelectTrigger id="extraPaymentFrequency">
															<SelectValue placeholder="Select frequency" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="monthly">Monthly</SelectItem>
															<SelectItem value="quarterly">
																Quarterly
															</SelectItem>
															<SelectItem value="annually">Annually</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label htmlFor="extraPaymentStartDate">
														Extra Payment Start Date
													</Label>
													<Input
														id="extraPaymentStartDate"
														type="date"
														value={extraPaymentStartDate}
														onChange={(e) =>
															setExtraPaymentStartDate(e.target.value)
														}
														className="mt-1"
													/>
												</div>
												<Button onClick={calculateMortgage} className="w-full">
													<Calculator className="mr-2 h-4 w-4" />
													Recalculate
												</Button>
											</CardContent>
										</Card>
									</motion.div>
								</AnimatePresence>
							)}
						</div>
						<div className="space-y-6">
							{showResults && results ? (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="space-y-6"
								>
									<Card>
										<CardHeader>
											<CardTitle className="text-xl font-semibold">
												Mortgage Summary
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Tabs defaultValue="overview" className="w-full">
												<TabsList className="grid w-full grid-cols-3">
													<TabsTrigger value="overview">Overview</TabsTrigger>
													<TabsTrigger value="savings">Savings</TabsTrigger>
													<TabsTrigger value="details">Details</TabsTrigger>
												</TabsList>
												<TabsContent value="overview" className="space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<div className="col-span-2 flex items-center justify-between rounded-lg bg-blue-50 p-4">
															<div className="flex items-center">
																<Home className="mr-3 h-8 w-8 text-blue-600" />
																<div>
																	<p className="text-sm font-medium text-gray-500">
																		Loan Amount
																	</p>
																	<p className="text-2xl font-bold text-gray-900">
																		${formatNumber(parseFloat(loanAmount))}
																	</p>
																</div>
															</div>
															<div>
																<p className="text-sm font-medium text-gray-500">
																	Interest Rate
																</p>
																<p className="text-2xl font-bold text-gray-900">
																	{interestRate}%
																</p>
															</div>
														</div>
														<div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4">
															<CreditCard className="mb-2 h-6 w-6 text-green-600" />
															<p className="text-sm font-medium text-gray-500">
																Monthly Payment
															</p>
															<p className="text-2xl font-bold text-green-600">
																${results.monthlyPayment}
															</p>
														</div>
														<div className="flex flex-col items-center justify-center rounded-lg bg-purple-50 p-4">
															<CalendarClock className="mb-2 h-6 w-6 text-purple-600" />
															<p className="text-sm font-medium text-gray-500">
																Payoff Date
															</p>
															<p className="text-2xl font-bold text-purple-600">
																{results.payoffDate}
															</p>
														</div>
														<div className="flex flex-col items-center justify-center rounded-lg bg-indigo-50 p-4">
															<PiggyBank className="mb-2 h-6 w-6 text-indigo-600" />
															<p className="text-sm font-medium text-gray-500">
																Total Payment
															</p>
															<p className="text-2xl font-bold text-indigo-600">
																${results.totalPayment}
															</p>
														</div>
														<div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-4">
															<TrendingUp className="mb-2 h-6 w-6 text-red-600" />
															<p className="text-sm font-medium text-gray-500">
																Total Interest
															</p>
															<p className="text-2xl font-bold text-red-600">
																${results.totalInterest}
															</p>
														</div>
													</div>
												</TabsContent>
												<TabsContent value="savings" className="space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4">
															<Clock className="mb-2 h-6 w-6 text-green-600" />
															<p className="text-sm font-medium text-gray-500">
																Time Saved
															</p>
															<p className="text-2xl font-bold text-green-600">
																{results.monthsSaved} months
															</p>
														</div>
														<div className="flex flex-col items-center justify-center rounded-lg bg-indigo-50 p-4">
															<Coins className="mb-2 h-6 w-6 text-indigo-600" />
															<p className="text-sm font-medium text-gray-500">
																Interest Saved
															</p>
															<p className="text-2xl font-bold text-indigo-600">
																$
																{formatNumber(
																	parseFloat(results.interestSaved),
																)}
															</p>
														</div>
													</div>
													<div className="rounded-lg bg-blue-50 p-4">
														<h4 className="mb-2 text-sm font-semibold text-blue-700">
															Savings Impact
														</h4>
														<p className="text-sm text-blue-600">
															By making extra payments, you could pay off your
															mortgage {results.monthsSaved} months early and
															save $
															{formatNumber(parseFloat(results.interestSaved))}{' '}
															in interest!
														</p>
													</div>
												</TabsContent>
												<TabsContent value="details" className="space-y-4">
													<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
														<Card>
															<CardHeader>
																<CardTitle className="flex items-center text-lg font-semibold">
																	<Banknote className="mr-2 h-5 w-5 text-blue-500" />
																	Loan Details
																</CardTitle>
															</CardHeader>
															<CardContent className="space-y-2">
																<div className="flex justify-between">
																	<span className="font-medium">
																		Loan Amount:
																	</span>
																	<span>
																		${formatNumber(parseFloat(loanAmount))}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Interest Rate:
																	</span>
																	<span>{interestRate}%</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Loan Term:
																	</span>
																	<span>{loanTerm} years</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Monthly Payment:
																	</span>
																	<span>${results.monthlyPayment}</span>
																</div>
															</CardContent>
														</Card>
														<Card>
															<CardHeader>
																<CardTitle className="flex items-center text-lg font-semibold">
																	<Landmark className="mr-2 h-5 w-5 text-green-500" />
																	Payment Breakdown
																</CardTitle>
															</CardHeader>
															<CardContent className="space-y-2">
																<div className="flex justify-between">
																	<span className="font-medium">
																		Total Principal:
																	</span>
																	<span>
																		$
																		{formatNumber(
																			parseFloat(results.principalAmount),
																		)}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Total Interest:
																	</span>
																	<span>
																		$
																		{formatNumber(
																			parseFloat(results.interestAmount),
																		)}
																	</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Total Payment:
																	</span>
																	<span>${results.totalPayment}</span>
																</div>
																<div className="flex justify-between">
																	<span className="font-medium">
																		Payoff Date:
																	</span>
																	<span>{results.payoffDate}</span>
																</div>
															</CardContent>
														</Card>
													</div>
													<Card>
														<CardHeader>
															<CardTitle className="flex items-center text-lg font-semibold">
																<BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
																Payment Allocation
															</CardTitle>
														</CardHeader>
														<CardContent>
															<div className="space-y-2">
																<div className="flex items-center justify-between">
																	<span className="text-sm font-medium">
																		Principal
																	</span>
																	<span className="text-sm font-medium">
																		{results.principalPercentage}%
																	</span>
																</div>
																<Progress
																	value={parseFloat(
																		results.principalPercentage,
																	)}
																	className="h-2"
																/>
																<div className="flex items-center justify-between">
																	<span className="text-sm font-medium">
																		Interest
																	</span>
																	<span className="text-sm font-medium">
																		{results.interestPercentage}%
																	</span>
																</div>
																<Progress
																	value={parseFloat(results.interestPercentage)}
																	className="h-2"
																/>
															</div>
														</CardContent>
													</Card>
												</TabsContent>
											</Tabs>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-xl font-semibold">
												Payment Breakdown
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Tabs defaultValue="overview" className="w-full">
												<TabsList className="grid w-full grid-cols-3">
													<TabsTrigger value="overview">Overview</TabsTrigger>
													<TabsTrigger value="charts">Charts</TabsTrigger>
													<TabsTrigger value="details">Details</TabsTrigger>
												</TabsList>
												<TabsContent value="overview" className="space-y-4">
													<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
														<div className="rounded-lg bg-blue-50 p-4">
															<h4 className="mb-2 text-sm font-semibold text-blue-700">
																Principal
															</h4>
															<p className="text-2xl font-bold text-blue-600">
																$
																{formatNumber(
																	parseFloat(results.principalAmount),
																)}
															</p>
															<p className="text-sm text-blue-500">
																{results.principalPercentage}% of total payment
															</p>
														</div>
														<div className="rounded-lg bg-purple-50 p-4">
															<h4 className="mb-2 text-sm font-semibold text-purple-700">
																Interest
															</h4>
															<p className="text-2xl font-bold text-purple-600">
																$
																{formatNumber(
																	parseFloat(results.interestAmount),
																)}
															</p>
															<p className="text-sm text-purple-500">
																{results.interestPercentage}% of total payment
															</p>
														</div>
													</div>
													<div>
														<h4 className="mb-2 text-sm font-semibold">
															Payment Distribution
														</h4>
														<div className="relative pt-1">
															<div className="mb-2 flex items-center justify-between">
																<div>
																	<span className="inline-block rounded-full bg-blue-200 px-2 py-1 text-xs font-semibold uppercase text-blue-600">
																		Principal
																	</span>
																</div>
																<div className="text-right">
																	<span className="inline-block text-xs font-semibold text-blue-600">
																		{results.principalPercentage}%
																	</span>
																</div>
															</div>
															<div className="mb-4 flex h-6 overflow-hidden rounded-full bg-gray-200 text-xs">
																<div
																	style={{
																		width: `${results.principalPercentage}%`,
																	}}
																	className="flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none transition-all duration-500 ease-in-out"
																>
																	<span className="text-xs font-bold">
																		{results.principalPercentage}%
																	</span>
																</div>
																<div
																	style={{
																		width: `${results.interestPercentage}%`,
																	}}
																	className="flex flex-col justify-center whitespace-nowrap bg-purple-500 text-center text-white shadow-none transition-all duration-500 ease-in-out"
																>
																	<span className="text-xs font-bold">
																		{results.interestPercentage}%
																	</span>
																</div>
															</div>
															<div className="mb-2 flex items-center justify-between">
																<div>
																	<span className="inline-block rounded-full bg-purple-200 px-2 py-1 text-xs font-semibold uppercase text-purple-600">
																		Interest
																	</span>
																</div>
																<div className="text-right">
																	<span className="inline-block text-xs font-semibold text-purple-600">
																		{results.interestPercentage}%
																	</span>
																</div>
															</div>
														</div>
													</div>
												</TabsContent>
												<TabsContent value="charts" className="space-y-4">
													<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
														<div>
															<h4 className="mb-2 text-sm font-semibold">
																Payment Distribution
															</h4>
															<ResponsiveContainer width="100%" height={200}>
																<PieChart>
																	<Pie
																		data={[
																			{
																				name: 'Principal',
																				value: parseFloat(
																					results.principalAmount,
																				),
																			},
																			{
																				name: 'Interest',
																				value: parseFloat(
																					results.interestAmount,
																				),
																			},
																		]}
																		cx="50%"
																		cy="50%"
																		innerRadius={60}
																		outerRadius={80}
																		fill="#8884d8"
																		paddingAngle={5}
																		dataKey="value"
																	>
																		<Cell fill="#3b82f6" />
																		<Cell fill="#8b5cf6" />
																	</Pie>
																	<Tooltip
																		formatter={(value: any) =>
																			`$${formatNumber(value.toFixed(2))}`
																		}
																	/>
																	<Legend />
																</PieChart>
															</ResponsiveContainer>
														</div>
														<div>
															<h4 className="mb-2 text-sm font-semibold">
																Payment Comparison
															</h4>
															<ResponsiveContainer width="100%" height={200}>
																<BarChart
																	data={[
																		{
																			name: 'Principal',
																			value: parseFloat(
																				results.principalAmount,
																			),
																		},
																		{
																			name: 'Interest',
																			value: parseFloat(results.interestAmount),
																		},
																	]}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="name" />
																	<YAxis />
																	<Tooltip
																		formatter={(value: number) =>
																			`$${formatNumber(value)}`
																		}
																	/>
																	<Bar dataKey="value" fill="#8884d8">
																		<Cell fill="#3b82f6" />
																		<Cell fill="#8b5cf6" />
																	</Bar>
																</BarChart>
															</ResponsiveContainer>
														</div>
													</div>
												</TabsContent>
												<TabsContent value="details" className="space-y-4">
													<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
														<Card>
															<CardHeader>
																<CardTitle className="text-lg font-semibold">
																	Loan Overview
																</CardTitle>
															</CardHeader>
															<CardContent className="space-y-2">
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<DollarSignIcon className="mr-2 h-4 w-4 text-blue-500" />
																		Loan Amount
																	</span>
																	<span className="font-semibold">
																		${formatNumber(parseFloat(loanAmount))}
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<PercentIcon className="mr-2 h-4 w-4 text-green-500" />
																		Interest Rate
																	</span>
																	<span className="font-semibold">
																		{interestRate}%
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
																		Loan Term
																	</span>
																	<span className="font-semibold">
																		{loanTerm} years
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<CreditCard className="mr-2 h-4 w-4 text-indigo-500" />
																		Monthly Payment
																	</span>
																	<span className="font-semibold">
																		${results.monthlyPayment}
																	</span>
																</div>
															</CardContent>
														</Card>
														<Card>
															<CardHeader>
																<CardTitle className="text-lg font-semibold">
																	Payment Breakdown
																</CardTitle>
															</CardHeader>
															<CardContent className="space-y-2">
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<Landmark className="mr-2 h-4 w-4 text-blue-500" />
																		Total Principal
																	</span>
																	<span className="font-semibold">
																		$
																		{formatNumber(
																			parseFloat(results.principalAmount),
																		)}
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<TrendingUp className="mr-2 h-4 w-4 text-red-500" />
																		Total Interest
																	</span>
																	<span className="font-semibold">
																		$
																		{formatNumber(
																			parseFloat(results.interestAmount),
																		)}
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<PiggyBank className="mr-2 h-4 w-4 text-green-500" />
																		Total Payment
																	</span>
																	<span className="font-semibold">
																		${results.totalPayment}
																	</span>
																</div>
																<div className="flex items-center justify-between">
																	<span className="flex items-center">
																		<CalendarClock className="mr-2 h-4 w-4 text-purple-500" />
																		Payoff Date
																	</span>
																	<span className="font-semibold">
																		{results.payoffDate}
																	</span>
																</div>
															</CardContent>
														</Card>
													</div>
													<Card>
														<CardHeader>
															<CardTitle className="text-lg font-semibold">
																Loan Insights
															</CardTitle>
														</CardHeader>
														<CardContent className="space-y-2">
															<div className="flex items-center">
																<TrendingDownIcon className="mr-2 h-5 w-5 text-green-500" />
																<p className="text-sm">
																	You'll pay off your mortgage{' '}
																	{results.monthsSaved} months earlier than
																	scheduled.
																</p>
															</div>
															<div className="flex items-center">
																<Coins className="mr-2 h-5 w-5 text-yellow-500" />
																<p className="text-sm">
																	Your extra payments will save you $
																	{formatNumber(
																		parseFloat(results.interestSaved),
																	)}{' '}
																	in interest.
																</p>
															</div>
														</CardContent>
													</Card>
												</TabsContent>
											</Tabs>
										</CardContent>
									</Card>
								</motion.div>
							) : (
								<Card className="h-full">
									<CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
										<div className="mb-4 rounded-full bg-blue-100 p-3">
											<Calculator className="h-12 w-12 text-blue-500" />
										</div>
										<h3 className="mb-2 text-2xl font-semibold">
											Ready to Calculate
										</h3>
										<p className="mb-6 text-gray-600">
											Enter your loan details on the left and click Calculate to
											see your mortgage breakdown.
										</p>
										<div className="flex items-center text-sm text-blue-600">
											<ArrowRight className="mr-2 h-4 w-4" />
											<span>Results will appear here</span>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
					{showResults && graphData.length > 0 && (
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Loan Balance and Interest Over Time
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<LineChart
										data={graphData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="year"
											label={{
												value: 'Years',
												position: 'insideBottom',
												offset: -5,
											}}
										/>
										<YAxis
											tickFormatter={(value) => `$${formatNumber(value)}`}
										/>
										<Tooltip
											formatter={(value, name) => [
												`$${formatNumber(Number(value))}`,
												name === 'balance'
													? 'Loan Balance'
													: 'Cumulative Interest',
											]}
										/>
										<Legend />
										<Line
											type="monotone"
											dataKey="balance"
											name="Loan Balance"
											stroke="#3b82f6"
											strokeWidth={2}
											dot={false}
											activeDot={{ r: 8 }}
										/>
										<Line
											type="monotone"
											dataKey="cumulativeInterest"
											name="Cumulative Interest"
											stroke="#8b5cf6"
											strokeWidth={2}
											dot={false}
											activeDot={{ r: 8 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
