"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    className?: string
    placeholder?: string
}

export function DatePicker({ date, setDate, className, placeholder = "날짜 선택" }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (dates: Date[]) => {
        if (dates.length > 0) {
            setDate(dates[0])
            setOpen(false)
        } else {
            setDate(undefined)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM-dd") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none" align="start">
                <div className="bg-white rounded-lg border shadow-lg overflow-hidden">
                    <Calendar
                        type="monthly"
                        selectedDates={date ? [date] : []}
                        onSelectDates={handleSelect}
                    // Ensure we can navigate freely
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
