import * as React from "react"
import Link from "next/link"
import { Button } from "./button"
import { Section } from "./section"

interface HeroProps {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    image?: React.ReactNode
}

export function Hero({ title, subtitle, ctaText, ctaLink, image }: HeroProps) {
    return (
        <Section className="pt-20 md:pt-32 pb-16 md:pb-24">
            <div className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl/none">
                        {title}
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {subtitle}
                    </p>
                </div>
                <div className="space-x-4">
                    <Button asChild size="lg" className="h-12 px-8 text-base">
                        <Link href={ctaLink}>{ctaText}</Link>
                    </Button>
                </div>
                {image && (
                    <div className="w-full max-w-5xl mt-12 overflow-hidden rounded-xl border bg-muted/50 shadow-xl lg:mt-20">
                        {image}
                    </div>
                )}
            </div>
        </Section>
    )
}
