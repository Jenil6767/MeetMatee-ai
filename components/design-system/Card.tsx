"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, hoverLift } from "@/lib/design-system/animations"

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  variant?: "default" | "glass" | "bordered"
  hoverable?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = "default", hoverable = true, ...props }, ref) => {
    const variants = {
      default: "bg-card text-card-foreground border border-border shadow-sm",
      glass: "glass-card text-foreground shadow-md",
      bordered: "bg-card/50 text-card-foreground border-2 border-border",
    }

    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        whileHover={hoverable ? hoverLift.whileHover : undefined}
        className={cn(
          "rounded-2xl p-6 transition-all duration-200",
          variants[variant],
          hoverable && "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = "DesignSystemCard"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
}) => {
  return (
    <Card className={cn("p-6 flex items-start justify-between", className)}>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      )}
    </Card>
  )
}
