"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Send,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Sparkles,
  Brain,
  Shield,
  Zap,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  attachments?: string[]
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  status: "processing" | "completed" | "error"
  uploadedAt: Date
  insights?: {
    totalAmount: number
    category: string
    riskLevel: "low" | "medium" | "high"
  }
}

interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  monthlyTrend: number
  topCategories: Array<{ name: string; amount: number; percentage: number }>
  alerts: Array<{ type: "warning" | "info" | "success"; message: string }>
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Financial Agent. I can analyze your financial documents, provide detailed summaries, and help you understand your financial position. Upload your documents or ask me any financial questions!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Bank Statement - January 2024.pdf",
      type: "pdf",
      size: "2.4 MB",
      status: "completed",
      uploadedAt: new Date(),
      insights: {
        totalAmount: 15420.5,
        category: "Bank Statement",
        riskLevel: "low",
      },
    },
    {
      id: "2",
      name: "Investment Portfolio Q4.xlsx",
      type: "excel",
      size: "1.8 MB",
      status: "processing",
      uploadedAt: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const financialSummary: FinancialSummary = {
    totalIncome: 8750.0,
    totalExpenses: 6420.3,
    netCashFlow: 2329.7,
    monthlyTrend: 12.5,
    topCategories: [
      { name: "Housing", amount: 2100, percentage: 32.7 },
      { name: "Food & Dining", amount: 890, percentage: 13.9 },
      { name: "Transportation", amount: 650, percentage: 10.1 },
      { name: "Utilities", amount: 420, percentage: 6.5 },
      { name: "Entertainment", amount: 380, percentage: 5.9 },
    ],
    alerts: [
      { type: "warning", message: "Spending on dining out increased 23% this month" },
      { type: "success", message: "You're on track to meet your savings goal" },
      { type: "info", message: "Consider reviewing your subscription services" },
    ],
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Based on your financial documents, I can see that your cash flow is healthy. Your monthly income of $8,750 exceeds your expenses by $2,329.70, which is excellent for building savings.",
      "I've analyzed your spending patterns and noticed that dining expenses have increased significantly. Would you like me to suggest some budget optimization strategies?",
      "Your investment portfolio shows strong diversification. The Q4 performance indicates a 12.5% growth, which is above market average. Shall I provide a detailed breakdown?",
      "I notice some recurring subscription charges that might be worth reviewing. I can help you identify potential savings opportunities across your monthly expenses.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: "processing",
        uploadedAt: new Date(),
      }

      setDocuments((prev) => [...prev, newDoc])

      // Simulate processing
      setIsProcessing(true)
      setProcessingProgress(0)

      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsProcessing(false)
            // Update document status
            setDocuments((docs) =>
              docs.map((doc) =>
                doc.id === newDoc.id
                  ? {
                      ...doc,
                      status: "completed",
                      insights: {
                        totalAmount: Math.random() * 10000,
                        category: "Financial Document",
                        riskLevel: "low" as const,
                      },
                    }
                  : doc,
              ),
            )
            return 100
          }
          return prev + 10
        })
      }, 200)
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinanceAI Agent</h1>
              <p className="text-sm text-gray-600">Your intelligent financial advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Document Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">Document Library</h2>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {isProcessing && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {doc.status === "completed" && (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">Analyzed</span>
                          </>
                        )}
                        {doc.status === "processing" && (
                          <>
                            <Clock className="w-3 h-3 text-yellow-500 animate-spin" />
                            <span className="text-xs text-yellow-600">Processing</span>
                          </>
                        )}
                      </div>
                      {doc.insights && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div>Amount: {formatCurrency(doc.insights.totalAmount)}</div>
                          <Badge
                            variant="outline"
                            className={`mt-1 text-xs ${
                              doc.insights.riskLevel === "low"
                                ? "border-green-200 text-green-700"
                                : doc.insights.riskLevel === "medium"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-red-200 text-red-700"
                            }`}
                          >
                            {doc.insights.riskLevel} risk
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Financial Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col m-6 mt-4">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI Financial Agent</CardTitle>
                      <CardDescription>Ask me anything about your finances</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "ai" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.type === "user" && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about your finances, upload documents, or request analysis..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 m-6 mt-4">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(financialSummary.totalIncome)}
                      </div>
                      <p className="text-xs text-muted-foreground">+{financialSummary.monthlyTrend}% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(financialSummary.totalExpenses)}
                      </div>
                      <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(financialSummary.netCashFlow)}
                      </div>
                      <p className="text-xs text-muted-foreground">Healthy cash flow</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Spending Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Spending Categories</CardTitle>
                    <CardDescription>Your largest expense categories this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financialSummary.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(category.amount)}</div>
                            <div className="text-sm text-gray-500">{category.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts & Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Insights & Alerts</CardTitle>
                    <CardDescription>Personalized recommendations based on your financial data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialSummary.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            alert.type === "warning"
                              ? "bg-yellow-50 border border-yellow-200"
                              : alert.type === "success"
                                ? "bg-green-50 border border-green-200"
                                : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          {alert.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                          {alert.type === "success" && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                          {alert.type === "info" && <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />}
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Export & Reports</CardTitle>
                    <CardDescription>Download detailed financial reports and analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF Report
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
