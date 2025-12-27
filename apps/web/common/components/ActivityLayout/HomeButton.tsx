import { useFlow } from "@/stackflow";
import { Home } from "lucide-react";
import { cn } from "@repo/ui";
import { useStack } from "@stackflow/react";

interface HomeButtonProps {
    className?: string;
    disabled?: boolean;
}

export function HomeButton({ className, disabled }: HomeButtonProps) {
    const { pop, replace } = useFlow();
    const stack = useStack();


    const resetToHome = () => {
        replace("Dashboard", {}, { animate: false });
    };


    return (
        <button
            onClick={resetToHome}
            disabled={disabled}
            className={cn(
                "p-1 -mr-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
            <Home className="w-6 h-6" strokeWidth={1.5} />
        </button>
    );
}
