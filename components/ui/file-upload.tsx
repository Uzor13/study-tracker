'use client'

import { useState, useCallback } from 'react'
import { Upload, X, File, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onUploadComplete: (fileData: {
    url: string
    fileName: string
    fileSize: number
    fileType: string
  }) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({
  onUploadComplete,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`
    }

    const acceptedTypes = accept.split(',').map(t => t.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!acceptedTypes.includes(fileExtension)) {
      return `Invalid file type. Accepted types: ${accept}`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setUploadProgress(100)
      onUploadComplete(data)

      // Reset after successful upload
      setTimeout(() => {
        setSelectedFile(null)
        setUploadProgress(0)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      setSelectedFile(file)
      uploadFile(file)
    }
  }, [accept, maxSize])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      setSelectedFile(file)
      uploadFile(file)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="text-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading...</p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            </>
          ) : uploadProgress === 100 ? (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-sm font-medium text-green-600">Upload complete!</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your file here, or
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: {accept}
                <br />
                Maximum size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>

        {selectedFile && !isUploading && uploadProgress !== 100 && (
          <div className="mt-4 p-3 bg-secondary rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
                setError(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
