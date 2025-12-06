import * as React from "react"
import { cn } from "../lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean
}

export function Section({ className, container = true, children, ...props }: SectionProps) {
    return (
        <section
            className={cn("py-12 md:py-24 lg:py-32", className)}
            {...props}
        >
            {container ? (
                <div className="container px-4 md:px-6 mx-auto">
                    {children}
                </div>
            ) : (
                children
            )}
        </section>
    )
}
