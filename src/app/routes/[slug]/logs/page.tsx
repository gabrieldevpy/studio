"use client"
import Link from "next/link"
import React from "react"
import { ArrowLeft, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockLogs = [
  { id: '1', ip: '123.45.67.89', country: 'United States', dateTime: '2024-07-29 10:00:00 UTC', redirectedTo: 'real' as const },
  { id: '2', ip: '98.76.54.32', country: 'Canada', dateTime: '2024-07-29 10:01:15 UTC', redirectedTo: 'fake' as const },
  { id: '3', ip: '203.0.113.55', country: 'Australia', dateTime: '2024-07-29 10:02:30 UTC', redirectedTo: 'real' as const },
  { id: '4', ip: '198.51.100.12', country: 'Germany', dateTime: '2024-07-29 10:03:45 UTC', redirectedTo: 'real' as const },
  { id: '5', ip: '8.8.8.8', country: 'United States', dateTime: '2024-07-29 10:05:00 UTC', redirectedTo: 'fake' as const },
  { id: '6', ip: '1.1.1.1', country: 'Australia', dateTime: '2024-07-29 10:06:15 UTC', redirectedTo: 'fake' as const },
  { id: '7', ip: '123.45.67.90', country: 'United States', dateTime: '2024-07-29 10:07:30 UTC', redirectedTo: 'real' as const },
]

export default function LogsPage({ params }: { params: { slug: string } }) {
  const [search, setSearch] = React.useState("")

  const filteredLogs = mockLogs.filter(log => log.ip.includes(search))

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Access Logs
          </h1>
          <p className="text-muted-foreground text-sm">Showing logs for route: <span className="font-code text-foreground">{params.slug}</span></p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Latest 100 Accesses</CardTitle>
          <CardDescription>
            Here are the most recent visitors to your cloaked link.
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by IP address..." 
                className="w-full pl-8 sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Redirected To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium font-code">{log.ip}</TableCell>
                  <TableCell>{log.country}</TableCell>
                  <TableCell>{log.dateTime}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={log.redirectedTo === 'real' ? 'default' : 'destructive'} className={log.redirectedTo === 'real' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>
                      {log.redirectedTo}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
