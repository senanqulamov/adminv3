"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Languages, Globe, FileText, Zap, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AnalyticsModal } from "@/components/modals/analytics-modal"

const statsCards = [
	{
		title: "Total Keys",
		count: "1,247",
		icon: FileText,
		color: "bg-[#3c4438] text-white border-[#98a891]", // changed from blue/primary
		type: "translations" as const,
	},
	{
		title: "Languages",
		count: "8",
		icon: Languages,
		color: "bg-[#98a891] text-[#3c4438] border-[#3c4438]", // changed green
		type: "translations" as const,
	},
	{
		title: "Translated",
		count: "89%",
		icon: Globe,
		color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
		type: "translations" as const,
	},
	{
		title: "Auto-Generated",
		count: "456",
		icon: Zap,
		color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
		type: "translations" as const,
	},
]

const translations = [
	{
		id: 1,
		key: "welcome.title",
		en: "Welcome to our platform",
		es: "Bienvenido a nuestra plataforma",
		fr: "Bienvenue sur notre plateforme",
		status: "Complete",
	},
	{ id: 2, key: "nav.dashboard", en: "Dashboard", es: "Panel de control", fr: "Tableau de bord", status: "Complete" },
	{ id: 3, key: "button.save", en: "Save", es: "Guardar", fr: "", status: "Incomplete" },
	{
		id: 4,
		key: "error.required",
		en: "This field is required",
		es: "Este campo es obligatorio",
		fr: "Ce champ est requis",
		status: "Complete",
	},
]

interface TranslationsPageProps {
	isLoading?: boolean
}

export function TranslationsPage({ isLoading: externalLoading = false }: TranslationsPageProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedLanguage, setSelectedLanguage] = useState("all")
	const [isLoading, setIsLoading] = useState(true)
	const [selectedAnalytics, setSelectedAnalytics] = useState<{
		isOpen: boolean
		type: "users" | "orders" | "translations" | "audit"
		title: string
	}>({ isOpen: false, type: "translations", title: "" })

	useEffect(() => {
		if (externalLoading) {
			setIsLoading(true)
			const timer = setTimeout(() => {
				setIsLoading(false)
			}, 1000)
			return () => clearTimeout(timer)
		} else {
			const timer = setTimeout(() => {
				setIsLoading(false)
			}, 600)
			return () => clearTimeout(timer)
		}
	}, [externalLoading])

	const handleCardClick = (type: "users" | "orders" | "translations" | "audit", title: string) => {
		setSelectedAnalytics({ isOpen: true, type, title })
	}

	if (isLoading || externalLoading) {
		return (
			<div className="tab-loader flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	return (
		<>
			<div className="space-y-8 animate-slide-up">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-foreground tracking-tight no-select">Translations</h1>
					<div className="flex space-x-3">
						<Button
							variant="outline"
							className="border-border text-foreground hover:bg-accent rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition no-select"
						>
							<Zap className="h-4 w-4 mr-2" />
							Auto Translate
						</Button>
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl no-select">
							<Plus className="h-4 w-4 mr-2" />
							Add Translation
						</Button>
					</div>
				</div>

				<Card className="bg-card-light border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-xl font-semibold text-foreground tracking-tight no-select">Translation Management</h2>
						<div className="flex items-center space-x-4">
							<Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
								<SelectTrigger className="w-48 bg-background border-border text-foreground rounded-2xl h-12">
									<SelectValue placeholder="Language" />
								</SelectTrigger>
								<SelectContent className="bg-card border-border rounded-2xl">
									<SelectItem value="all">All Languages</SelectItem>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="es">Spanish</SelectItem>
									<SelectItem value="fr">French</SelectItem>
								</SelectContent>
							</Select>
							<div className="relative">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search translations..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-12 bg-background border-border text-foreground rounded-2xl w-80 h-12 smooth-transition focus:border-primary/50"
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
						{statsCards.map((card, index) => (
							<Card
								key={card.title}
								className="bg-card-main border-border rounded-3xl p-6 hover:bg-accent smooth-transition shadow-lg hover:shadow-xl animate-scale-in cursor-pointer no-select"
								style={{ animationDelay: `${index * 100}ms` }}
								onClick={() => handleCardClick(card.type, card.title)}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm font-medium tracking-wide">{card.title}</p>
										<p className="text-3xl font-bold text-foreground mt-2 tracking-tight">{card.count}</p>
									</div>
									<div className={`p-4 rounded-2xl border ${card.color}`}>
										<card.icon className="h-6 w-6" />
									</div>
								</div>
							</Card>
						))}
					</div>

					<div className="rounded-3xl border border-border overflow-hidden bg-background/50">
						<Table>
							<TableHeader>
								<TableRow className="border-border hover:bg-accent/50">
									<TableHead className="text-muted-foreground font-semibold tracking-wide py-4 no-select">
										Key
									</TableHead>
									<TableHead className="text-muted-foreground font-semibold tracking-wide no-select">English</TableHead>
									<TableHead className="text-muted-foreground font-semibold tracking-wide no-select">Spanish</TableHead>
									<TableHead className="text-muted-foreground font-semibold tracking-wide no-select">French</TableHead>
									<TableHead className="text-muted-foreground font-semibold tracking-wide no-select">Status</TableHead>
									<TableHead className="text-muted-foreground font-semibold tracking-wide w-12 no-select"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{translations.map((translation, index) => (
									<TableRow
										key={translation.id}
										className="border-border hover:bg-accent/50 smooth-transition animate-fade-in"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										<TableCell className="font-semibold text-foreground font-mono text-sm py-4 allow-select">
											{translation.key}
										</TableCell>
										<TableCell className="text-muted-foreground max-w-xs truncate allow-select">
											{translation.en}
										</TableCell>
										<TableCell className="text-muted-foreground max-w-xs truncate allow-select">
											{translation.es}
										</TableCell>
										<TableCell className="text-muted-foreground max-w-xs truncate allow-select">
											{translation.fr || "-"}
										</TableCell>
										<TableCell className="no-select">
											<Badge
												variant="secondary"
												className={`rounded-xl px-3 py-1 border ${
													translation.status === "Complete"
														? "bg-[#98a891] text-[#3c4438] border-[#3c4438]"
														: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
												}`}
											>
												{translation.status}
											</Badge>
										</TableCell>
										<TableCell className="no-select">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="bg-card border-border rounded-2xl shadow-2xl" align="end">
													<DropdownMenuItem className="text-foreground hover:bg-accent rounded-xl">
														View Details
													</DropdownMenuItem>
													<DropdownMenuItem className="text-foreground hover:bg-accent rounded-xl">
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem className="text-red-400 hover:bg-accent rounded-xl">
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Card>
			</div>

			<AnalyticsModal
				isOpen={selectedAnalytics.isOpen}
				onClose={() => setSelectedAnalytics({ ...selectedAnalytics, isOpen: false })}
				type={selectedAnalytics.type}
				title={selectedAnalytics.title}
			/>
		</>
	)
}
