"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

    const variants = {
      primary:
        "bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-primary/25 hover:from-[#4F46E5] hover:to-[#4338CA]",
      secondary:
        "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
      outline:
        "border border-border bg-background text-foreground hover:bg-muted hover:border-primary/30",
      ghost: "bg-transparent text-foreground hover:bg-muted",
      danger: "bg-destructive text-white shadow-md hover:bg-destructive/90",
      success: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700",
    }

    const sizes = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5 rounded-2xl",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = "DesignSystemButton"
