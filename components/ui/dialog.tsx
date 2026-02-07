import React, { useState, useEffect } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ className = '', children, ...props }: DialogContentProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ className = '', ...props }: DialogContentProps) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props} />
}

export function DialogTitle({ className = '', ...props }: DialogContentProps) {
  return <h2 className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
}

export function DialogDescription({ className = '', ...props }: DialogContentProps) {
  return <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props} />
}
