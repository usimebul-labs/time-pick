import * as React from "react"
import { AppScreen } from "@stackflow/plugin-basic-ui";


export default function Loading() {
    return (
        <AppScreen>
            <div className="flex items-center justify-center min-h-screen h-full bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </AppScreen>
    )
}
