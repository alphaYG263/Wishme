import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

interface StepDateProps {
  data: { date: string; time: string };
  onUpdate: (data: Partial<{ date: string; time: string }>) => void;
}

const StepDate = ({ data, onUpdate }: StepDateProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Set Birthday Date</h2>
        <p className="text-muted-foreground">
          Choose when the birthday wish should be revealed
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <Label className="text-base mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Select Date
          </Label>
          <div className="flex justify-center bg-muted/30 rounded-2xl p-4">
            <Calendar
              mode="single"
              selected={data.date ? new Date(data.date) : undefined}
              onSelect={(date) => onUpdate({ date: date?.toISOString() || "" })}
              className="pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
          </div>
        </div>

        {/* Time & Preview */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="time" className="text-base mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Unlock Time
            </Label>
            <Input
              id="time"
              type="time"
              value={data.time}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className="rounded-2xl h-14 text-lg"
            />
            <p className="text-sm text-muted-foreground mt-2">
              The wish will be revealed at midnight by default
            </p>
          </div>

          {/* Waiting Preview */}
          <div className="p-6 rounded-2xl gradient-hero border-2 border-border">
            <h4 className="font-semibold mb-3">Waiting Screen Preview</h4>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 text-center space-y-4">
              <div className="text-4xl animate-float">🎁</div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  A surprise arrives on
                </p>
                <p className="text-lg font-semibold text-primary">
                  {data.date
                    ? new Date(data.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select a date"}
                </p>
                {data.time && (
                  <p className="text-sm text-muted-foreground mt-1">
                    at {data.time}
                  </p>
                )}
              </div>
              <div className="flex justify-center gap-2 text-2xl font-mono font-bold">
                <div className="bg-muted px-3 py-2 rounded-lg">00</div>
                <div>:</div>
                <div className="bg-muted px-3 py-2 rounded-lg">00</div>
                <div>:</div>
                <div className="bg-muted px-3 py-2 rounded-lg">00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDate;
