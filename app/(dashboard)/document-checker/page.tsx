import { DocumentAnalyzer } from '@/components/DocumentAnalyzer'

export default function DocumentCheckerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Document Checker</h1>
        <p className="text-muted-foreground">
          Get instant AI-powered feedback on your visa application documents
        </p>
      </div>

      <DocumentAnalyzer />
    </div>
  )
}
