"use client"

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Scenario } from "../types/scenario"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ScenarioListProps {
  scenarios: Scenario[]
  onSelectScenario?: (scenario: Scenario) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onSelectScenario, onDelete, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Scenario>('ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Scenario) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredScenarios = scenarios
    .filter(scenario => {
      const searchRegex = new RegExp(searchTerm, 'i');
      return (
        searchRegex.test(scenario.ID) ||
        searchRegex.test(scenario.Summary) ||
        searchRegex.test(scenario.Narrative) ||
        searchRegex.test(String(scenario.DangerRanking))
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const getDangerColor = (ranking: number) => {
    if (ranking >= 8) return "bg-red-600 hover:bg-red-700"
    if (ranking >= 5) return "bg-orange-500 hover:bg-orange-600"
    if (ranking >= 3) return "bg-yellow-500 hover:bg-yellow-600"
    return "bg-green-600 hover:bg-green-700"
  }

  const getDangerRowClass = (ranking: number) => {
    if (ranking >= 8) return "border-red-900/20 bg-red-950/10"
    if (ranking >= 5) return "border-orange-900/20 bg-orange-950/10"
    if (ranking >= 3) return "border-yellow-900/20 bg-yellow-950/10"
    return ""
  }

  const getDangerIcon = (ranking: number) => {
    if (ranking >= 8) return <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
    if (ranking >= 5) return <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
    return null
  }

  const getDrvBadge = (drv: number) => {
    if (drv > 0) {
      return <Badge className="bg-green-700 hover:bg-green-800">Y</Badge>
    } else {
      return <Badge className="bg-gray-700 hover:bg-gray-800">N</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-black rounded-lg border border-purple-dark/30 shadow-xl">
        <div className="h-12 w-12 text-purple-accent animate-spin mb-4" />
        <p className="text-purple-light">Loading scenarios...</p>
      </div>
    )
  }

  return (
    <div className="bg-black rounded-lg shadow-xl overflow-hidden border border-purple-dark/30">
      {scenarios.length === 0 ? (
        <div className="p-8 text-center text-purple-muted">No scenarios found. Try adjusting your search criteria.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="border-b border-purple-dark/30">
                <TableHead className="text-purple-accent font-bold">ID</TableHead>
                <TableHead className="text-purple-accent font-bold">Summary</TableHead>
                <TableHead className="text-purple-accent font-bold">Danger</TableHead>
                <TableHead className="text-purple-accent font-bold">DRV</TableHead>
                <TableHead className="text-purple-accent font-bold">Impact</TableHead>
                <TableHead className="text-purple-accent font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow
                  key={scenario.ID}
                  className={`border-b border-gray-800 hover:bg-gray-900 cursor-pointer transition-colors ${getDangerRowClass(
                    scenario.DangerRanking,
                  )}`}
                >
                  <TableCell className="font-mono text-purple-light bg-black">{scenario.ID}</TableCell>
                  <TableCell className="text-purple-light font-medium bg-black flex items-center">
                    {getDangerIcon(scenario.DangerRanking)}
                    {scenario.Summary}
                  </TableCell>
                  <TableCell className="bg-black">
                    <Badge className={`${getDangerColor(scenario.DangerRanking)}`}>{scenario.DangerRanking}</Badge>
                  </TableCell>
                  <TableCell className="text-purple-light bg-black">{getDrvBadge(scenario.drv)}</TableCell>
                  <TableCell className="text-purple-light max-w-[200px] truncate bg-black">{scenario.Impact}</TableCell>
                  <TableCell className="bg-black">
                    <button
                      onClick={() => onDelete(scenario.ID)}
                      className="bg-purple-dark hover:bg-purple-highlight text-white px-3 py-1 rounded-md text-sm transition-colors shadow-sm"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ScenarioList; 