"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md relative">
      <Input
        className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight pr-10"
        placeholder="Search scenarios..."
        value={searchTerm}
        onChange={handleChange}
      />
    </form>
  )
} 