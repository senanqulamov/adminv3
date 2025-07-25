"use client"

import type React from "react"
import { useState } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

type SortDirection = "asc" | "desc" | null

interface SortableTableProps {
  headers: Array<{
    key: string
    label: string
    sortable?: boolean
  }>
  data: Array<Record<string, any>>
  renderRow: (item: any, index: number) => React.ReactNode
  className?: string
}

export function SortableTable({ headers, data, renderRow, className = "" }: SortableTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortKey(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0

    const aValue = a[sortKey]
    const bValue = b[sortKey]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="h-4 w-4 opacity-50" />
    if (sortDirection === "asc") return <ChevronUp className="h-4 w-4" />
    if (sortDirection === "desc") return <ChevronDown className="h-4 w-4" />
    return <ChevronsUpDown className="h-4 w-4 opacity-50" />
  }

  return (
    <div className={`rounded-2xl border border-[#2a2a2a] overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-[#171717]/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${
                  header.sortable !== false ? "cursor-pointer hover:bg-[#252525]/70 select-none" : ""
                }`}
                onClick={() => header.sortable !== false && handleSort(header.key)}
              >
                <div className="flex items-center space-x-2">
                  <span>{header.label}</span>
                  {header.sortable !== false && getSortIcon(header.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">{sortedData.map((item, index) => renderRow(item, index))}</tbody>
      </table>
    </div>
  )
}
