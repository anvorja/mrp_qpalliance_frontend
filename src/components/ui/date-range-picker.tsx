// src/components/ui/date-range-picker.tsx
"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChangeAction: (range: DateRange | undefined) => void;
  align?: "start" | "center" | "end";
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChangeAction,
  align = "end",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formattedDateRange = React.useMemo(() => {
    const from = dateRange.from
      ? dateRange.from.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';
    const to = dateRange.to
      ? dateRange.to.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

    if (from && to) {
      return `${from} - ${to}`;
    }
    return "Seleccionar período";
  }, [dateRange.from, dateRange.to]);

  // Función para aplicar un rango predefinido
  const applyPredefinedRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    onDateRangeChangeAction({ from, to });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-auto justify-start text-sm font-normal",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDateRange}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="border-b p-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPredefinedRange(7)}
          >
            7 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPredefinedRange(30)}
          >
            30 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPredefinedRange(90)}
          >
            90 días
          </Button>
        </div>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChangeAction}
          numberOfMonths={2}
          initialFocus
        />
        <div className="p-3 border-t flex justify-end">
          <Button 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}