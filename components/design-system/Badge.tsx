"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline"
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-border",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    outline: "border border-border text-foreground bg-background",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
