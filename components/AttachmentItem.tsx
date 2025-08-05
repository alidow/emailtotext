"use client"

import { useState } from "react"
import { Download, FileText, Image, FileSpreadsheet, FileArchive, File, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AttachmentItemProps {
  attachment: {
    id: string
    filename: string
    content_type: string
    size_bytes: number
    storage_path: string
    thumbnail_path?: string | null
  }
}

export function AttachmentItem({ attachment }: AttachmentItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get file icon based on content type
  const getFileIcon = () => {
    if (attachment.content_type.startsWith('image/')) return Image
    if (attachment.content_type.includes('pdf')) return FileText
    if (attachment.content_type.includes('spreadsheet') || attachment.content_type.includes('excel')) return FileSpreadsheet
    if (attachment.content_type.includes('zip') || attachment.content_type.includes('archive')) return FileArchive
    return File
  }

  const Icon = getFileIcon()
  const isImage = attachment.content_type.startsWith('image/')
  const isPDF = attachment.content_type.includes('pdf')
  const canPreview = isImage || isPDF

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/attachments/${attachment.id}/download`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePreview = async () => {
    if (!canPreview) return
    
    try {
      const response = await fetch(`/api/attachments/${attachment.id}/preview`)
      if (!response.ok) throw new Error('Preview failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPreviewUrl(url)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error('Preview error:', error)
    }
  }

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* Thumbnail or Icon */}
          <div className="flex-shrink-0">
            {isImage && attachment.thumbnail_path ? (
              <div 
                className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handlePreview}
              >
                <img
                  src={`/api/attachments/${attachment.id}/thumbnail`}
                  alt={attachment.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if thumbnail fails
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    `
                  }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate pr-2" title={attachment.filename}>
              {attachment.filename}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(attachment.size_bytes)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                disabled={isDownloading}
                className="h-8 w-8 p-0"
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 w-8 p-0"
              title="Download"
            >
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{attachment.filename}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[calc(90vh-120px)]">
            {isImage && previewUrl && (
              <img
                src={previewUrl}
                alt={attachment.filename}
                className="w-full h-auto"
                onLoad={() => {
                  // Clean up blob URL after image loads
                  if (previewUrl.startsWith('blob:')) {
                    setTimeout(() => URL.revokeObjectURL(previewUrl), 100)
                  }
                }}
              />
            )}
            {isPDF && previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[600px] border-0"
                title={attachment.filename}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}