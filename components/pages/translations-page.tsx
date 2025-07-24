"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Languages, Globe, FileText, Zap } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLoader } from "@/components/ui/loading-spinner"

const statsCards = [
  { title: "Total Keys", count: "1,247", icon: FileText, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  {
    title: "Languages",
    count: "8",
    icon: Languages,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  { title: "Translated", count: "89%", icon: Globe, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { title: "Auto-Generated", count: "456", icon: Zap, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
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

export function TranslationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Translations</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition"
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto Translate
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Translation
          </Button>
        </div>
      </div>

      <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white tracking-tight">Translation Management</h2>
          <div className="flex items-center space-x-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48 bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-[#171717] border-[#2a2a2a] text-white rounded-2xl w-80 h-12 smooth-transition focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, index) => (
            <Card
              key={card.title}
              className="bg-[#171717] border-[#2a2a2a] rounded-3xl p-6 hover:bg-[#252525] smooth-transition shadow-lg hover:shadow-xl animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2 tracking-tight">{card.count}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-[#2a2a2a] overflow-hidden bg-[#171717]/50">
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a2a2a] hover:bg-[#252525]/50">
                <TableHead className="text-gray-400 font-semibold tracking-wide py-4">Key</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">English</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Spanish</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">French</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {translations.map((translation, index) => (
                <TableRow
                  key={translation.id}
                  className="border-[#2a2a2a] hover:bg-[#252525]/50 smooth-transition animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-semibold text-white font-mono text-sm py-4">{translation.key}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">{translation.en}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">{translation.es}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">{translation.fr || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-xl px-3 py-1 border ${
                        translation.status === "Complete"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {translation.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
