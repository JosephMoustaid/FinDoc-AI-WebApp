"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  Briefcase,
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
  financialData?: any // Store the complete financial data from API
}

interface FinancialSummary {
  totalRevenue: string
  netIncome: string
  operatingCashFlow: string
  totalAssets: string
  revenueGrowth: string
  companyName: string
  keyMetrics: Array<{ name: string; value: string; description: string }>
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
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenue: "N/A",
    netIncome: "N/A", 
    operatingCashFlow: "N/A",
    totalAssets: "N/A",
    revenueGrowth: "N/A",
    companyName: "No document uploaded",
    keyMetrics: [],
    alerts: [
      { type: "info", message: "Upload a financial document to see detailed analysis" },
    ],
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to handle document selection and fetch its financial data
  const handleDocumentSelect = async (document: Document) => {
    if (document.status !== "completed") return
    
    setSelectedDocumentId(document.id)
    
    try {
      // If we have stored financial data for this document, use it
      if (document.financialData) {
        updateFinancialSummaryFromData(document.financialData)
        
        // Add a system message indicating document switch
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: `Now viewing financial data for: **${document.name}**\n\nI've updated the financial summary with data from this document. You can ask me questions about this specific document's financial information.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, systemMessage])
      } else {
        // Fall back to general overview if no stored data
        await fetchFinancialOverview()
        
        // Add a system message indicating document switch
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: `Now viewing financial data for: **${document.name}**\n\nI've updated the financial summary with the latest financial data. You can ask me questions about this specific document's financial information.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, systemMessage])
      }
      
    } catch (error) {
      console.error('Failed to load document financial data:', error)
      
      // Show error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `Sorry, I couldn't load the financial data for ${document.name}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  // Helper function to update financial summary from API data
  const updateFinancialSummaryFromData = (overview: any) => {
    // Extract key metrics from API data
    const keyMetrics: Array<{ name: string; value: string; description: string }> = []
    if (overview.key_metrics) {
      const metrics = overview.key_metrics
      if (metrics.eps) {
        keyMetrics.push({
          name: "EPS",
          value: metrics.eps,
          description: "Earnings Per Share"
        })
      }
      if (metrics.pe_ratio && metrics.pe_ratio !== "not available") {
        keyMetrics.push({
          name: "P/E Ratio",
          value: metrics.pe_ratio,
          description: "Price to Earnings Ratio"
        })
      }
      if (metrics.debt_to_equity && metrics.debt_to_equity !== "not available") {
        keyMetrics.push({
          name: "Debt to Equity",
          value: metrics.debt_to_equity,
          description: "Debt to Equity Ratio"
        })
      }
      if (metrics.roe && metrics.roe !== "not available") {
        keyMetrics.push({
          name: "ROE",
          value: metrics.roe,
          description: "Return on Equity"
        })
      }
    }
    
    // Add additional financial position metrics
    if (overview.financial_position) {
      const position = overview.financial_position
      if (position.cash_position) {
        keyMetrics.push({
          name: "Cash Position",
          value: position.cash_position,
          description: "Available Cash"
        })
      }
      if (position.shareholders_equity) {
        keyMetrics.push({
          name: "Shareholders' Equity",
          value: position.shareholders_equity,
          description: "Total Equity"
        })
      }
    }
    
    // Update financial summary with API data
    setFinancialSummary({
      totalRevenue: overview.revenue_data?.total_revenue || "N/A",
      netIncome: overview.profitability?.net_income || "N/A",
      operatingCashFlow: overview.cash_flow?.operating_cash_flow || "N/A",
      totalAssets: overview.financial_position?.total_assets || "N/A",
      revenueGrowth: overview.revenue_data?.revenue_growth || "N/A",
      companyName: overview.company_info?.name || "Company",
      keyMetrics: keyMetrics,
      alerts: [
        ...(overview.risks_and_outlook?.key_risks ? [{ type: "warning" as const, message: `Key Risks: ${overview.risks_and_outlook.key_risks}` }] : []),
        ...(overview.risks_and_outlook?.guidance ? [{ type: "info" as const, message: `Guidance: ${overview.risks_and_outlook.guidance}` }] : []),
        ...(overview.risks_and_outlook?.market_conditions ? [{ type: "info" as const, message: `Market: ${overview.risks_and_outlook.market_conditions}` }] : []),
      ].slice(0, 3) // Keep only first 3 alerts
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to fetch financial overview from API
  const fetchFinancialOverview = async () => {
    try {
      const response = await fetch('http://localhost:5000/company-overview')
      if (response.ok) {
        const data = await response.json()
        // Update financial summary with real data if available
        if (data.financial_overview) {
          const overview = data.financial_overview
          
          // Extract key metrics from API data
          const keyMetrics: Array<{ name: string; value: string; description: string }> = []
          if (overview.key_metrics) {
            const metrics = overview.key_metrics
            if (metrics.eps) {
              keyMetrics.push({
                name: "EPS",
                value: metrics.eps,
                description: "Earnings Per Share"
              })
            }
            if (metrics.pe_ratio && metrics.pe_ratio !== "not available") {
              keyMetrics.push({
                name: "P/E Ratio",
                value: metrics.pe_ratio,
                description: "Price to Earnings Ratio"
              })
            }
            if (metrics.debt_to_equity && metrics.debt_to_equity !== "not available") {
              keyMetrics.push({
                name: "Debt to Equity",
                value: metrics.debt_to_equity,
                description: "Debt to Equity Ratio"
              })
            }
            if (metrics.roe && metrics.roe !== "not available") {
              keyMetrics.push({
                name: "ROE",
                value: metrics.roe,
                description: "Return on Equity"
              })
            }
          }
          
          // Add additional financial position metrics
          if (overview.financial_position) {
            const position = overview.financial_position
            if (position.cash_position) {
              keyMetrics.push({
                name: "Cash Position",
                value: position.cash_position,
                description: "Available Cash"
              })
            }
            if (position.shareholders_equity) {
              keyMetrics.push({
                name: "Shareholders' Equity",
                value: position.shareholders_equity,
                description: "Total Equity"
              })
            }
          }
          
          // Update financial summary with API data
          setFinancialSummary({
            totalRevenue: overview.revenue_data?.total_revenue || "N/A",
            netIncome: overview.profitability?.net_income || "N/A",
            operatingCashFlow: overview.cash_flow?.operating_cash_flow || "N/A",
            totalAssets: overview.financial_position?.total_assets || "N/A",
            revenueGrowth: overview.revenue_data?.revenue_growth || "N/A",
            companyName: overview.company_info?.name || "Company",
            keyMetrics: keyMetrics,
            alerts: [
              ...(overview.risks_and_outlook?.key_risks ? [{ type: "warning" as const, message: `Key Risks: ${overview.risks_and_outlook.key_risks}` }] : []),
              ...(overview.risks_and_outlook?.guidance ? [{ type: "info" as const, message: `Guidance: ${overview.risks_and_outlook.guidance}` }] : []),
              ...(overview.risks_and_outlook?.market_conditions ? [{ type: "info" as const, message: `Market: ${overview.risks_and_outlook.market_conditions}` }] : []),
            ].slice(0, 3) // Keep only first 3 alerts
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch financial overview:', error)
    }
  }

  // Function to format AI response text for better readability
  const formatAIResponse = (text: string): string => {
    if (!text) return text

    // Split the text into sections based on common patterns
    let formatted = text
      // Add line breaks before numbered lists
      .replace(/(\d+\.\s\*\*[^*]+\*\*)/g, '\n\n$1')
      // Add line breaks before section headers with **
      .replace(/(\*\*[^*]+:\*\*)/g, '\n\n$1')
      // Add line breaks before bullet points
      .replace(/(\d+\.\s)/g, '\n$1')
      // Add spacing around key takeaways
      .replace(/(Key Takeaways:)/g, '\n\n**$1**')
      // Add spacing around conclusions
      .replace(/(Overall,|In conclusion,)/g, '\n\n$1')
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim()

    return formatted
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = inputMessage
    setInputMessage("")

    try {
      // Call the API for Q&A
      const response = await fetch(`http://localhost:5000/financial-qa?q=${encodeURIComponent(currentQuestion)}`)
      
      if (!response.ok) {
        throw new Error('Failed to get response from API')
      }

      const result = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: formatAIResponse(result.answer) || "I apologize, but I couldn't process your question at the moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      
    } catch (error) {
      console.error('Q&A error:', error)
      
      // Fallback to simulated response if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(currentQuestion),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(async (file) => {
      // Only allow PDF files
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are supported')
        return
      }

      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: "processing",
        uploadedAt: new Date(),
      }

      setDocuments((prev) => [...prev, newDoc])
      setIsProcessing(true)
      setProcessingProgress(0)

      try {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', file)

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        // Upload to API
        const response = await fetch('http://localhost:5000/upload-pdf', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const result = await response.json()
        setProcessingProgress(100)

        // Update document status with actual data
        const completedDoc = {
          ...newDoc,
          status: "completed" as const,
          insights: {
            totalAmount: result.financial_data?.revenue_data?.total_revenue || 0,
            category: result.financial_data?.company_info?.sector || "Financial Document",
            riskLevel: "low" as const,
          },
          financialData: result.financial_data // Store the complete financial data
        }
        
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === newDoc.id ? completedDoc : doc,
          ),
        )

        // Auto-select the newly uploaded document and update financial summary
        setSelectedDocumentId(newDoc.id)
        if (result.financial_data) {
          updateFinancialSummaryFromData(result.financial_data)
        }

        // Add AI message about successful processing
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: `Successfully processed ${file.name}! I've extracted financial data${result.financial_data?.company_info?.name ? ` for ${result.financial_data.company_info.name}` : ''}. You can now ask me questions about this document.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])

        // Fetch updated financial overview
        await fetchFinancialOverview()

      } catch (error) {
        console.error('Upload error:', error)
        
        // Update document status to error
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === newDoc.id
              ? { ...doc, status: "error" }
              : doc,
          ),
        )

        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: `Sorry, I encountered an error processing ${file.name}. Please make sure the API server is running and try again.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsProcessing(false)
        setProcessingProgress(0)
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Function to handle PDF report generation
  const handleGeneratePDF = async () => {
    if (!financialSummary.companyName || financialSummary.companyName === "No document uploaded") {
      alert("Please upload a financial document first to generate a PDF report.")
      return
    }

    try {
      setIsProcessing(true)
      
      // Add AI message indicating PDF generation started
      const startMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `🔄 Generating comprehensive PDF report for ${financialSummary.companyName}... This may take a moment as I analyze the data and create charts.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, startMessage])

      // Call the PDF generation endpoint
      const response = await fetch(`http://localhost:5000/generate-pdf-report?company=${encodeURIComponent(financialSummary.companyName)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to generate PDF report: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.status === "PDF report generated successfully") {
        // Add success message
        const successMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `✅ **PDF Report Generated Successfully!**\n\n📊 **Company:** ${result.company}\n🏷️ **Symbol:** ${result.symbol}\n📄 **File:** ${result.pdf_filename}\n⏰ **Generated:** ${new Date(result.generation_time).toLocaleString()}\n\nYour comprehensive financial analysis report has been created and is ready for download!`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, successMessage])

        // Trigger download
        const downloadUrl = `http://localhost:5000/download-pdf/${result.pdf_filename}`
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = result.pdf_filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
      } else {
        throw new Error("PDF generation was not successful")
      }

    } catch (error) {
      console.error('PDF generation error:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `❌ Sorry, I encountered an error while generating the PDF report: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the API server is running and try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Suggested questions for the Q&A chat
  const baseSuggestedQuestions = [
    "What is the company's current financial health?",
    "How has revenue grown over the recent periods?",
    "What are the main risk factors mentioned?",
    "What is the company's cash flow situation?",
    "How profitable is the company compared to industry peers?",
    "What are the key financial ratios and what do they indicate?",
    "What is the company's debt-to-equity ratio?",
    "Are there any upcoming challenges or opportunities?",
    "How strong is the company's market position?",
    "What guidance has the company provided for future periods?"
  ]

  const noDocumentQuestions = [
    "How do I upload a financial document?",
    "What types of financial documents can you analyze?",
    "What insights can you provide from financial reports?",
    "Can you explain different financial ratios?",
    "How do you analyze company performance?",
    "What should I look for in a financial statement?"
  ]

  // Get appropriate questions based on whether document is uploaded
  const suggestedQuestions = financialSummary.companyName !== "No document uploaded" 
    ? baseSuggestedQuestions 
    : noDocumentQuestions

  // Function to handle suggested question clicks
  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
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
                <Card 
                  key={doc.id} 
                  className={`p-3 transition-all cursor-pointer ${
                    selectedDocumentId === doc.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 hover:shadow-lg' 
                      : 'hover:shadow-md hover:bg-gray-50'
                  } ${doc.status === "completed" ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleDocumentSelect(doc)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedDocumentId === doc.id ? 'bg-blue-200' : 'bg-blue-100'
                    }`}>
                      <FileText className={`w-4 h-4 ${
                        selectedDocumentId === doc.id ? 'text-blue-700' : 'text-blue-600'
                      }`} />
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
              <Card className="flex flex-col h-[calc(100vh-200px)]">
                <CardHeader className="pb-3 flex-shrink-0">
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
                <Separator className="flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-4">
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
                          <div className="text-sm whitespace-pre-line">
                            {message.content.split('\n').map((line, index) => {
                              // Handle bold text formatting
                              if (line.includes('**')) {
                                const parts = line.split(/(\*\*[^*]+\*\*)/g)
                                return (
                                  <p key={index} className={index === 0 ? "" : "mt-2"}>
                                    {parts.map((part, partIndex) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return (
                                          <strong key={partIndex} className="font-semibold">
                                            {part.slice(2, -2)}
                                          </strong>
                                        )
                                      }
                                      return part
                                    })}
                                  </p>
                                )
                              }
                              // Handle numbered lists and bullet points
                              else if (line.match(/^\d+\.\s/) || line.startsWith('- ')) {
                                return (
                                  <p key={index} className="mt-1 ml-2">
                                    {line}
                                  </p>
                                )
                              }
                              // Regular paragraphs
                              else if (line.trim()) {
                                return (
                                  <p key={index} className={index === 0 ? "" : "mt-2"}>
                                    {line}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </div>
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
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                </div>
                <Separator className="flex-shrink-0" />
                
                {/* Suggested Questions */}
                {inputMessage === "" && (
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      {financialSummary.companyName !== "No document uploaded" 
                        ? "Ask about your document:" 
                        : "Get started with these questions:"
                      }
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.slice(0, 3).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200 hover:shadow-sm"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedQuestions.slice(3, 6).map((question, index) => (
                        <Button
                          key={index + 3}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200 hover:shadow-sm"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                    {suggestedQuestions.length > 6 && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          Show more questions...
                        </summary>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestedQuestions.slice(6).map((question, index) => (
                            <Button
                              key={index + 6}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200 hover:shadow-sm"
                              onClick={() => handleSuggestedQuestion(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
                
                <div className="p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        financialSummary.companyName !== "No document uploaded"
                          ? `Ask me about ${financialSummary.companyName}'s financial data...`
                          : "Upload a document and ask me about finances, analysis, or insights..."
                      }
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {financialSummary.totalRevenue}
                      </div>
                      <p className="text-xs text-muted-foreground">{financialSummary.revenueGrowth}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {financialSummary.netIncome}
                      </div>
                      <p className="text-xs text-muted-foreground">Profitability</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Operating Cash Flow</CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {financialSummary.operatingCashFlow}
                      </div>
                      <p className="text-xs text-muted-foreground">Operations</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                      <Briefcase className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {financialSummary.totalAssets}
                      </div>
                      <p className="text-xs text-muted-foreground">Balance Sheet</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Financial Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Financial Metrics</CardTitle>
                    <CardDescription>Important financial ratios and performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financialSummary.keyMetrics.length > 0 ? (
                        financialSummary.keyMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                              <div>
                                <span className="font-medium">{metric.name}</span>
                                <div className="text-sm text-gray-500">{metric.description}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{metric.value}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No key metrics data available
                        </div>
                      )}
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
                      <Button 
                        variant="outline" 
                        onClick={handleGeneratePDF}
                        disabled={isProcessing || financialSummary.companyName === "No document uploaded"}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isProcessing ? "Generating..." : "Export PDF Report"}
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
