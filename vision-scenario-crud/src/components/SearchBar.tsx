"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <Input
        type="text"
        placeholder="Search by Summary, Narrative, or Curated Words..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight flex-grow"
      />
      <Button type="submit" className="bg-purple-dark hover:bg-purple-highlight text-white font-medium shadow-md">
        Search
      </Button>
    </form>
  )
}
