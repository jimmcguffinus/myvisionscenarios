"use client"

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Scenario } from "../types/scenario"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ScenarioListProps {
  scenarios: Scenario[]
  onSelectScenario: (scenario: Scenario) => void
  onDelete: (id: string) => void
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onSelectScenario, onDelete }) => {
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

  return (
    <div className="scenario-list p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search scenarios..."
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('ID')}
              >
                ID {sortField === 'ID' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('Summary')}
              >
                Summary {sortField === 'Summary' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('DangerRanking')}
              >
                Danger Ranking {sortField === 'DangerRanking' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScenarios.map((scenario) => (
              <tr key={scenario.ID} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 dark:text-gray-300">{scenario.ID}</td>
                <td className="px-4 py-2 dark:text-gray-300">{scenario.Summary}</td>
                <td className="px-4 py-2 dark:text-gray-300">{scenario.DangerRanking}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <Link
                    to={`/edit/${scenario.ID}`}
                    className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/print/${scenario.ID}`}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700"
                  >
                    Print
                  </Link>
                  <Link
                    to={`/ai-explain/${scenario.ID}`}
                    className="bg-forest-500 text-white px-3 py-1 rounded-md hover:bg-forest-600"
                  >
                    AI Explain
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this scenario?')) {
                        onDelete(scenario.ID);
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <Link
          to="/new"
          className="bg-forest-500 text-white px-4 py-2 rounded-md hover:bg-forest-600"
        >
          Create New Scenario
        </Link>
      </div>
    </div>
  );
};

export default ScenarioList; 