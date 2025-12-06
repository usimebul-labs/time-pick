import * as React from "react"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}
