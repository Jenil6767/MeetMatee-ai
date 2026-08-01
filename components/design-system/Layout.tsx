"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: "default" | "small" | "wide"
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = "default",
  className,
  ...props
}) => {
  const sizes = {
    small: "max-w-3xl", // 768px
    default: "max-w-7xl", // 1280px
    wide: "max-w-[1400px]",
  }

  return (
    <div
      className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export const Section: React.FC<SectionProps> = ({
  children,
  size = "md",
  className,
  ...props
}) => {
  const paddingSizes = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24", // ~120px desktop / ~80px mobile
    lg: "py-20 md:py-32",
  }

  return (
    <section
      className={cn("relative overflow-hidden bg-background text-foreground", paddingSizes[size], className)}
      {...props}
    >
      {children}
    </section>
  )
}
