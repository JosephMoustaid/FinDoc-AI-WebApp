"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Users, DollarSign, Briefcase, Search, Filter, Download, Upload, FileText } from 'lucide-react'

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
  const [companySearch, setCompanySearch] = useState("")
  const [companyData, setCompanyData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [financialOverview, setFinancialOverview] = useState<any>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [overviewError, setOverviewError] = useState<string | null>(null)

  const filteredJobs = jobDemandData.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || selectedCategory === "technology")
  )

  // Fetch financial overview on component mount
  useEffect(() => {
    fetchFinancialOverview()
  }, [])

  // Fetch company data from backend
  const fetchCompanyData = async (name: string) => {
    setLoading(true)
    setError(null)
    setCompanyData(null)
    try {
      const res = await fetch(`http://localhost:5000/api/company?company=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error("Company not found")
      const data = await res.json()
      setCompanyData(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch financial overview from uploaded documents
  const fetchFinancialOverview = async () => {
    setOverviewLoading(true)
    setOverviewError(null)
    setFinancialOverview(null)
    try {
      const res = await fetch('http://localhost:5000/company-overview')
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("No financial documents uploaded yet")
        }
        throw new Error("Failed to fetch financial overview")
      }
      const data = await res.json()
      setFinancialOverview(data)
    } catch (e: any) {
      setOverviewError(e.message)
    } finally {
      setOverviewLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights into financial data and company analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" onClick={fetchFinancialOverview} disabled={overviewLoading}>
              <FileText className="w-4 h-4 mr-2" />
              {overviewLoading ? "Refreshing..." : "Refresh Financial Data"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Company Search */}
        <Card>
          <CardHeader>
            <CardTitle>Company Lookup</CardTitle>
            <CardDescription>
              Search for a company to view its financial and business information.
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Enter company name (e.g. Samsung)"
                value={companySearch}
                onChange={e => setCompanySearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && companySearch.trim()) {
                    fetchCompanyData(companySearch.trim())
                  }
                }}
                className="max-w-xs"
              />
              <Button
                onClick={() => companySearch.trim() && fetchCompanyData(companySearch.trim())}
                disabled={loading || !companySearch.trim()}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}
            {loading && (
              <div className="text-blue-500 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                Loading company information...
              </div>
            )}
            {companyData && (
              <div className="space-y-6">
                {/* Company Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {companyData.longName}
                        <span className="ml-3 text-lg text-gray-500 font-normal">({companyData.symbol})</span>
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">{companyData.sector}</Badge>
                        <Badge variant="outline">{companyData.industry}</Badge>
                      </div>
                    </div>
                    {companyData.regularMarketPrice !== "N/A" && (
                      <div className="text-right">
                        <div className="text-3xl font-bold">${companyData.regularMarketPrice}</div>
                        {companyData.regularMarketChangePercent !== "N/A" && (
                          <div className={`flex items-center justify-end gap-1 ${
                            parseFloat(companyData.regularMarketChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {parseFloat(companyData.regularMarketChangePercent) >= 0 ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            {parseFloat(companyData.regularMarketChangePercent).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Description */}
                {companyData.description !== "N/A" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">About the Company</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{companyData.description}</p>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Market Cap */}
                  {companyData.marketCap !== "N/A" && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Market Cap</p>
                            <p className="text-xl font-bold">${(companyData.marketCap / 1e9).toFixed(2)}B</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* P/E Ratio */}
                  {companyData.trailingPE !== "N/A" && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">P/E Ratio</p>
                            <p className="text-xl font-bold">{parseFloat(companyData.trailingPE).toFixed(2)}</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Beta */}
                  {companyData.beta !== "N/A" && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Beta (Volatility)</p>
                            <p className="text-xl font-bold">{parseFloat(companyData.beta).toFixed(2)}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            parseFloat(companyData.beta) > 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {parseFloat(companyData.beta) > 1 ? '↑' : '↓'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Detailed Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Sector</TableCell>
                            <TableCell>{companyData.sector}</TableCell>
                            <TableCell className="font-medium">Industry</TableCell>
                            <TableCell>{companyData.industry}</TableCell>
                          </TableRow>
                          {companyData.website !== "N/A" && (
                            <TableRow>
                              <TableCell className="font-medium">Website</TableCell>
                              <TableCell colSpan={3}>
                                <a 
                                  href={companyData.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {companyData.website}
                                </a>
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell className="font-medium">Market Cap</TableCell>
                            <TableCell>
                              {companyData.marketCap !== "N/A" 
                                ? `$${(companyData.marketCap / 1e9).toFixed(2)}B` 
                                : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">Current Price</TableCell>
                            <TableCell>
                              {companyData.regularMarketPrice !== "N/A" 
                                ? `$${companyData.regularMarketPrice}` 
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Price Change %</TableCell>
                            <TableCell>
                              {companyData.regularMarketChangePercent !== "N/A" ? (
                                <span className={parseFloat(companyData.regularMarketChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {parseFloat(companyData.regularMarketChangePercent).toFixed(2)}%
                                </span>
                              ) : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">Trailing P/E</TableCell>
                            <TableCell>
                              {companyData.trailingPE !== "N/A" 
                                ? parseFloat(companyData.trailingPE).toFixed(2) 
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Forward P/E</TableCell>
                            <TableCell>
                              {companyData.forwardPE !== "N/A" 
                                ? parseFloat(companyData.forwardPE).toFixed(2) 
                                : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">Beta</TableCell>
                            <TableCell>
                              {companyData.beta !== "N/A" ? (
                                <span className={parseFloat(companyData.beta) > 1 ? 'text-red-600' : 'text-green-600'}>
                                  {parseFloat(companyData.beta).toFixed(2)}
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({parseFloat(companyData.beta) > 1 ? 'High Risk' : 'Low Risk'})
                                  </span>
                                </span>
                              ) : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Dividend Yield</TableCell>
                            <TableCell>
                              {companyData.dividendYield !== "N/A" 
                                ? `${(parseFloat(companyData.dividendYield) * 100).toFixed(2)}%` 
                                : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">Profit Margins</TableCell>
                            <TableCell>
                              {companyData.profitMargins !== "N/A" 
                                ? `${(parseFloat(companyData.profitMargins) * 100).toFixed(2)}%` 
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Revenue Growth</TableCell>
                            <TableCell>
                              {companyData.revenueGrowth !== "N/A" ? (
                                <span className={parseFloat(companyData.revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {(parseFloat(companyData.revenueGrowth) * 100).toFixed(2)}%
                                </span>
                              ) : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">Earnings Growth</TableCell>
                            <TableCell>
                              {companyData.earningsGrowth !== "N/A" ? (
                                <span className={parseFloat(companyData.earningsGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {(parseFloat(companyData.earningsGrowth) * 100).toFixed(2)}%
                                </span>
                              ) : "N/A"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Overview from Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Document Analysis</CardTitle>
            <CardDescription>
              View financial data extracted from uploaded PDF documents. Upload a financial document through the AI agent to see analysis here.
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={fetchFinancialOverview}
                disabled={overviewLoading}
                size="sm"
              >
                {overviewLoading ? "Loading..." : "Refresh Financial Data"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {overviewError && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <strong>Error:</strong> {overviewError}
              </div>
            )}
            {overviewLoading && (
              <div className="text-blue-500 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                Loading financial overview...
              </div>
            )}
            {financialOverview && financialOverview.financial_overview && (
              <div className="space-y-6">
                {/* Company Information */}
                {financialOverview.summary.has_company_info && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {financialOverview.financial_overview.company_info?.name && (
                        <div>
                          <p className="text-sm text-gray-600">Company Name</p>
                          <p className="font-medium">{financialOverview.financial_overview.company_info.name}</p>
                        </div>
                      )}
                      {financialOverview.financial_overview.company_info?.sector && (
                        <div>
                          <p className="text-sm text-gray-600">Sector</p>
                          <p className="font-medium">{financialOverview.financial_overview.company_info.sector}</p>
                        </div>
                      )}
                      {financialOverview.financial_overview.company_info?.fiscal_year && (
                        <div>
                          <p className="text-sm text-gray-600">Fiscal Year</p>
                          <p className="font-medium">{financialOverview.financial_overview.company_info.fiscal_year}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Financial Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Revenue */}
                  {financialOverview.summary.has_revenue_data && financialOverview.financial_overview.revenue_data?.total_revenue && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.revenue_data.total_revenue}</p>
                            {financialOverview.financial_overview.revenue_data?.revenue_growth && (
                              <p className="text-xs text-gray-500 mt-1">{financialOverview.financial_overview.revenue_data.revenue_growth}</p>
                            )}
                          </div>
                          <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Net Income */}
                  {financialOverview.summary.has_profitability && financialOverview.financial_overview.profitability?.net_income && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Net Income</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.profitability.net_income}</p>
                            {financialOverview.financial_overview.profitability?.profit_margins && (
                              <p className="text-xs text-gray-500 mt-1">Margins: {financialOverview.financial_overview.profitability.profit_margins}</p>
                            )}
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Operating Cash Flow */}
                  {financialOverview.summary.has_cash_flow && financialOverview.financial_overview.cash_flow?.operating_cash_flow && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Operating Cash Flow</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.cash_flow.operating_cash_flow}</p>
                            {financialOverview.financial_overview.cash_flow?.free_cash_flow && (
                              <p className="text-xs text-gray-500 mt-1">Free CF: {financialOverview.financial_overview.cash_flow.free_cash_flow}</p>
                            )}
                          </div>
                          <FileText className="w-8 h-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Total Assets */}
                  {financialOverview.summary.has_financial_position && financialOverview.financial_overview.financial_position?.total_assets && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Assets</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.financial_position.total_assets}</p>
                            {financialOverview.financial_overview.financial_position?.cash_position && (
                              <p className="text-xs text-gray-500 mt-1">Cash: {financialOverview.financial_overview.financial_position.cash_position}</p>
                            )}
                          </div>
                          <Briefcase className="w-8 h-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Shareholders Equity */}
                  {financialOverview.summary.has_financial_position && financialOverview.financial_overview.financial_position?.shareholders_equity && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Shareholders Equity</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.financial_position.shareholders_equity}</p>
                            {financialOverview.financial_overview.financial_position?.total_liabilities && (
                              <p className="text-xs text-gray-500 mt-1">Liabilities: {financialOverview.financial_overview.financial_position.total_liabilities}</p>
                            )}
                          </div>
                          <Users className="w-8 h-8 text-indigo-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* EPS */}
                  {financialOverview.summary.has_key_metrics && financialOverview.financial_overview.key_metrics?.eps && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Earnings Per Share</p>
                            <p className="text-xl font-bold">{financialOverview.financial_overview.key_metrics.eps}</p>
                            {financialOverview.financial_overview.key_metrics?.pe_ratio && financialOverview.financial_overview.key_metrics.pe_ratio !== "not available" && (
                              <p className="text-xs text-gray-500 mt-1">P/E: {financialOverview.financial_overview.key_metrics.pe_ratio}</p>
                            )}
                          </div>
                          <TrendingUp className="w-8 h-8 text-cyan-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Detailed Financial Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          {/* Revenue Section */}
                          {financialOverview.summary.has_revenue_data && (
                            <>
                              <TableRow>
                                <TableCell className="font-medium" colSpan={4}>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Revenue Information
                                  </div>
                                </TableCell>
                              </TableRow>
                              {financialOverview.financial_overview.revenue_data?.total_revenue && (
                                <TableRow>
                                  <TableCell className="font-medium">Total Revenue</TableCell>
                                  <TableCell>{financialOverview.financial_overview.revenue_data.total_revenue}</TableCell>
                                  <TableCell className="font-medium">Revenue Growth</TableCell>
                                  <TableCell>{financialOverview.financial_overview.revenue_data?.revenue_growth || "N/A"}</TableCell>
                                </TableRow>
                              )}
                            </>
                          )}

                          {/* Profitability Section */}
                          {financialOverview.summary.has_profitability && (
                            <>
                              <TableRow>
                                <TableCell className="font-medium" colSpan={4}>
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Profitability
                                  </div>
                                </TableCell>
                              </TableRow>
                              {financialOverview.financial_overview.profitability?.gross_profit && (
                                <TableRow>
                                  <TableCell className="font-medium">Gross Profit</TableCell>
                                  <TableCell>{financialOverview.financial_overview.profitability.gross_profit}</TableCell>
                                  <TableCell className="font-medium">Operating Profit</TableCell>
                                  <TableCell>{financialOverview.financial_overview.profitability?.operating_profit || "N/A"}</TableCell>
                                </TableRow>
                              )}
                              {financialOverview.financial_overview.profitability?.net_income && (
                                <TableRow>
                                  <TableCell className="font-medium">Net Income</TableCell>
                                  <TableCell>{financialOverview.financial_overview.profitability.net_income}</TableCell>
                                  <TableCell className="font-medium">Profit Margins</TableCell>
                                  <TableCell>{financialOverview.financial_overview.profitability?.profit_margins || "N/A"}</TableCell>
                                </TableRow>
                              )}
                            </>
                          )}

                          {/* Cash Flow Section */}
                          {financialOverview.summary.has_cash_flow && (
                            <>
                              <TableRow>
                                <TableCell className="font-medium" colSpan={4}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Cash Flow
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Operating Cash Flow</TableCell>
                                <TableCell>{financialOverview.financial_overview.cash_flow?.operating_cash_flow || "N/A"}</TableCell>
                                <TableCell className="font-medium">Free Cash Flow</TableCell>
                                <TableCell>{financialOverview.financial_overview.cash_flow?.free_cash_flow || "N/A"}</TableCell>
                              </TableRow>
                              {financialOverview.financial_overview.cash_flow?.capex && (
                                <TableRow>
                                  <TableCell className="font-medium">Capital Expenditures</TableCell>
                                  <TableCell>{financialOverview.financial_overview.cash_flow.capex}</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              )}
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Risks and Outlook */}
                {financialOverview.summary.has_risks_outlook && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Risks and Outlook</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {financialOverview.financial_overview.risks_and_outlook?.key_risks && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-1">Key Risks</h4>
                          <p className="text-red-700 text-sm">{financialOverview.financial_overview.risks_and_outlook.key_risks}</p>
                        </div>
                      )}
                      {financialOverview.financial_overview.risks_and_outlook?.guidance && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-1">Forward Guidance</h4>
                          <p className="text-blue-700 text-sm">{financialOverview.financial_overview.risks_and_outlook.guidance}</p>
                        </div>
                      )}
                      {financialOverview.financial_overview.risks_and_outlook?.market_conditions && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-1">Market Conditions</h4>
                          <p className="text-gray-700 text-sm">{financialOverview.financial_overview.risks_and_outlook.market_conditions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            {!financialOverview && !overviewError && !overviewLoading && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No financial documents uploaded yet.</p>
                <p className="text-sm">Upload a PDF through the AI Financial Agent to see analysis here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "Loading..." : 
                 financialOverview?.financial_overview?.revenue_data?.total_revenue || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {overviewLoading ? "..." : 
                 financialOverview?.financial_overview?.revenue_data?.revenue_growth || "No growth data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "Loading..." : 
                 financialOverview?.financial_overview?.profitability?.net_income || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {overviewLoading ? "..." : 
                 financialOverview?.financial_overview?.profitability?.profit_margins || "No margin data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "Loading..." : 
                 financialOverview?.financial_overview?.financial_position?.total_assets || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <Users className="w-3 h-3 mr-1 text-blue-500" />
                {overviewLoading ? "..." : 
                 financialOverview?.financial_overview?.financial_position?.shareholders_equity ? 
                  `Equity: ${financialOverview.financial_overview.financial_position.shareholders_equity}` : 
                  "No equity data"
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "Loading..." : 
                 financialOverview?.financial_overview?.cash_flow?.operating_cash_flow || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {overviewLoading ? "..." : 
                 financialOverview?.financial_overview?.cash_flow?.free_cash_flow ? 
                  `Free CF: ${financialOverview.financial_overview.cash_flow.free_cash_flow}` : 
                  "No free cash flow data"
                }
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
