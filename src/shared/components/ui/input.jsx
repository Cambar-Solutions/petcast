import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
    login: 'flex h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50 select-text'
  };

  return (
    <input
      type={type}
      className={cn(
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
