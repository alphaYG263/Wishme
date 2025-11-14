import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepNameProps {
  data: { name: string };
  onUpdate: (data: { name: string }) => void;
}

const StepName = ({ data, onUpdate }: StepNameProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Who's the birthday star?</h2>
        <p className="text-muted-foreground">
          Enter the name of the person you're creating this wish for
        </p>
      </div>

      <div className="space-y-2 max-w-md">
        <Label htmlFor="name" className="text-base">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Sarah Johnson"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="rounded-2xl h-14 text-lg"
          autoFocus
        />
        <p className="text-sm text-muted-foreground">
          This name will appear throughout the birthday wish
        </p>
      </div>
    </div>
  );
};

export default StepName;
