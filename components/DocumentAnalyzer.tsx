'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  FileCheck
} from 'lucide-react'

interface DocumentAnalysis {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  grammar: string[]
  clarity: string[]
}

export function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState('')
  const [documentType, setDocumentType] = useState<'sop' | 'cv' | 'letter'>('sop')
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError('Please enter your document text')
      return
    }

    if (documentText.length < 50) {
      setError('Document must be at least 50 characters')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, documentType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze document')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze document')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-orange-100'
    return 'bg-red-100'
  }

  const documentTypes = [
    { value: 'sop', label: 'Statement of Purpose', icon: FileText },
    { value: 'cv', label: 'CV/Resume', icon: FileCheck },
    { value: 'letter', label: 'Reference Letter', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Document Analyzer
          </CardTitle>
          <CardDescription>
            Get instant AI-powered feedback on your visa application documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {documentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setDocumentType(type.value as 'sop' | 'cv' | 'letter')}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      documentType === type.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Document Text Input */}
          <div className="space-y-2">
            <Label htmlFor="document">Paste Your Document</Label>
            <Textarea
              id="document"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder={`Paste your ${documentType === 'sop' ? 'Statement of Purpose' : documentType === 'cv' ? 'CV/Resume' : 'Letter'} here...\n\nMinimum 50 characters, maximum 10,000 characters.`}
              className="min-h-[200px] font-mono text-sm"
              maxLength={10000}
            />
            <p className="text-xs text-muted-foreground">
              {documentText.length} / 10,000 characters
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !documentText.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Score Card */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Overall Score</h3>
                  <p className="text-sm text-muted-foreground">
                    AI assessment of your document
                  </p>
                </div>
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${getScoreBgColor(
                    analysis.score
                  )}`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    analysis.score >= 80
                      ? 'bg-green-500'
                      : analysis.score >= 60
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  } transition-all`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Overall Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.feedback}</p>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
                <CardDescription>What you did well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {analysis.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Suggestions to strengthen your document</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Grammar Issues */}
          {analysis.grammar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Grammar & Language
                </CardTitle>
                <CardDescription>Language quality feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.grammar.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Clarity Issues */}
          {analysis.clarity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Clarity & Structure
                </CardTitle>
                <CardDescription>Content clarity feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.clarity.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Ready to improve?</h4>
                  <p className="text-sm text-muted-foreground">
                    Make the suggested changes and analyze again
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Analyze Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
