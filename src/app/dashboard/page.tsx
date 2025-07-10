"use client"
import Link from "next/link"
import { Plus, MoreHorizontal, AlertTriangle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockRoutes = [
  { id: '1', slug: 'promo-abc', realUrl: 'https://real-product.com/offer', fakeUrl: 'https://google.com', status: 'active', emergency: false, clicks: 1204, realClicks: 980, fakeClicks: 224 },
  { id: '2', slug: 'campaign-xyz', realUrl: 'https://another-real-one.com/page', fakeUrl: 'https://bing.com', status: 'active', emergency: true, clicks: 873, realClicks: 650, fakeClicks: 223 },
  { id: '3', slug: 'lander-v2', realUrl: 'https://my-affiliate-link.com/product', fakeUrl: 'https://duckduckgo.com', status: 'inactive', emergency: false, clicks: 0, realClicks: 0, fakeClicks: 0 },
  { id: '4', slug: 'facebook-ad-1', realUrl: 'https://secret-landing-page.io/special', fakeUrl: 'https://yahoo.com', status: 'active', emergency: false, clicks: 5432, realClicks: 4987, fakeClicks: 445 },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your cloaked routes.</p>
        </div>
        <Button asChild>
          <Link href="/routes/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Route
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Routes</CardTitle>
          <CardDescription>Manage your routes and see their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Real URL</TableHead>
                <TableHead>Fake URL</TableHead>
                <TableHead className="text-center">Emergency Mode</TableHead>
                <TableHead className="text-right">Total Clicks</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <Badge variant={route.status === 'active' ? 'default' : 'secondary'} className={route.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>{route.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium font-code">/{route.slug}</TableCell>
                  <TableCell>
                    <a href={route.realUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs block">{route.realUrl}</a>
                  </TableCell>
                  <TableCell>
                    <a href={route.fakeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs block">{route.fakeUrl}</a>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={route.emergency} aria-label="Emergency Mode" className="data-[state=checked]:bg-destructive" />
                  </TableCell>
                  <TableCell className="text-right">{route.clicks.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/routes/${route.slug}/logs`}>View Logs</Link></DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
