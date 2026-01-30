import { AlertCircle } from 'lucide-react'
import React from 'react'

export const Error = ({ error }: { error: string }) => {
  return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
      <AlertCircle className="shrink-0" />
      <p className="text-sm font-bold">Lỗi kết nối: {error}</p>
    </div>
  )
}
