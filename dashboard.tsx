"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Users, DollarSign, Briefcase, Search, Filter, Download } from 'lucide-react'

const jobDemandData = [
  { role: "Software Engineer", demand: 8500, avgSalary: 95000, growth: 15.2 },
  { role: "Data Scientist", demand: 6200, avgSalary: 110000, growth: 22.1 },
  { role: "Product Manager", demand: 4800, avgSalary: 125000, growth: 12.8 },
  { role: "UX Designer", demand: 3900, avgSalary: 85000, growth: 18.5 },
  { role: "DevOps Engineer", demand: 3600, avgSalary: 105000, growth: 25.3 },
  { role: "Cybersecurity Analyst", demand: 3200, avgSalary: 98000, growth: 31.2 },
  { role: "Cloud Architect", demand: 2800, avgSalary: 135000, growth: 28.7 },
  { role: "AI/ML Engineer", demand: 2500, avgSalary: 130000, growth: 35.4 }
]

const trendData = [
  { month: "Jan", softwareEng: 7800, dataScientist: 5400, productMgr: 4200 },
  { month: "Feb", softwareEng: 8100, dataScientist: 5600, productMgr: 4400 },
  { month: "Mar", softwareEng: 8300, dataScientist: 5800, productMgr: 4500 },
  { month: "Apr", softwareEng: 8200, dataScientist: 6000, productMgr: 4600 },
  { month: "May", softwareEng: 8400, dataScientist: 6100, productMgr: 4700 },
  { month: "Jun", softwareEng: 8500, dataScientist: 6200, productMgr: 4800 }
]

const categoryData = [
  { name: "Technology", value: 45, color: "#3b82f6" },
  { name: "Healthcare", value: 18, color: "#10b981" },
  { name: "Finance", value: 15, color: "#f59e0b" },
  { name: "Marketing", value: 12, color: "#ef4444" },
  { name: "Operations", value: 10, color: "#8b5cf6" }
]

const chartConfig = {
  demand: {
    label: "Job Demand",
    color: "hsl(var(--chart-1))",
  },
  softwareEng: {
    label: "Software Engineer",
    color: "hsl(var(--chart-1))",
  },
  dataScientist: {
    label: "Data Scientist",
    color: "hsl(var(--chart-2))",
  },
  productMgr: {
    label: "Product Manager",
    color: "hsl(var(--chart-3))",
  },
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredJobs = jobDemandData.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || selectedCategory === "technology")
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Market Analytics</h1>
            <p className="text-gray-600">Real-time insights into job market trends and demand</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Job Openings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">41,500</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$108,400</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +5.7% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+21.3%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Compared to last year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="demand" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="demand">Job Demand</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="demand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Job Roles in Demand</CardTitle>
                <CardDescription>
                  Current job openings by role (last 30 days)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <BarChart data={jobDemandData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="role" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="demand" fill="var(--color-demand)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Market Trends</CardTitle>
                <CardDescription>
                  6-month trend analysis for top job roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="softwareEng" 
                      stroke="var(--color-softwareEng)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dataScientist" 
                      stroke="var(--color-dataScientist)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="productMgr" 
                      stroke="var(--color-productMgr)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Distribution by Category</CardTitle>
                  <CardDescription>
                    Percentage breakdown of job openings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Insights</CardTitle>
                  <CardDescription>
                    Key statistics by job category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{category.value}%</div>
                        <div className="text-sm text-gray-500">
                          {Math.round((category.value / 100) * 41500)} jobs
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Job Market Analysis</CardTitle>
            <CardDescription>
              Comprehensive view of job roles with demand, salary, and growth metrics
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search job roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Role</TableHead>
                  <TableHead className="text-right">Demand</TableHead>
                  <TableHead className="text-right">Avg Salary</TableHead>
                  <TableHead className="text-right">Growth Rate</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{job.role}</TableCell>
                    <TableCell className="text-right">{job.demand.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${job.avgSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {job.growth > 20 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                        )}
                        +{job.growth}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={job.growth > 25 ? "default" : job.growth > 15 ? "secondary" : "outline"}
                        className={
                          job.growth > 25 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : job.growth > 15 
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : ""
                        }
                      >
                        {job.growth > 25 ? "Hot" : job.growth > 15 ? "Growing" : "Stable"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
