import React from 'react'

export const TableLoading = ({ colSpan }: { colSpan: number }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-20">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </td>
    </tr>
  )
}
