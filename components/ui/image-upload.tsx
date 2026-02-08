'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from './button'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images are allowed.')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (response.status === 401) {
        toast.error('Session expired. Please login again.')
        // Clear session and redirect
        document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        window.location.href = '/login'
        return
      }

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload image')
        setPreview(null)
        return
      }

      const data = await response.json()
      onChange(data.url) // Store the base URL (without SAS token)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-pink-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClick}
              disabled={disabled || isUploading}
              className="bg-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="bg-white"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full h-48 border-2 border-dashed border-pink-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-pink-400 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-pink-400" />
              <span className="text-sm text-gray-600">Click to upload image</span>
              <span className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF, WEBP</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
