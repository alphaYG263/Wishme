import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const StepDate = ({ data, onUpdate }: StepProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">

      <h2 className="text-3xl font-bold mb-2">Set Birthday Date</h2>
      <p className="text-muted-foreground mb-6">
        Choose when the birthday wish should be revealed
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-primary" /> Select Date
          </Label>

          <Calendar
            mode="single"
            selected={data.date ? new Date(data.date) : undefined}
            onSelect={(d) => onUpdate({ date: d?.toISOString() || "" })}
            disabled={(d) => d < new Date()}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary" /> Unlock Time
          </Label>

          <Input
            type="time"
            value={data.time}
            onChange={(e) => onUpdate({ time: e.target.value })}
            className="rounded-2xl h-14 text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default StepDate;
