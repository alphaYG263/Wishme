import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Edit, Trash2 } from "lucide-react";

type WishStatus = "Draft" | "Scheduled" | "Active" | "Expired";

interface WishCardProps {
  personName: string;
  template: string;
  status: WishStatus;
  date: string;
  imageUrl: string;
  onDelete?: () => void;
}

const statusColors = {
  Draft: "bg-muted text-muted-foreground",
  Scheduled: "bg-secondary text-secondary-foreground",
  Active: "bg-primary text-primary-foreground",
  Expired: "bg-destructive/20 text-destructive",
};

const WishCard = ({ personName, template, status, date, imageUrl }: WishCardProps) => {
  return (
    <Card className="rounded-3xl overflow-hidden card-lifted border-0 bg-card">
      {/* Template Preview */}
      <div className="h-48 gradient-hero flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-primary/30 animate-float" />
          <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-secondary/30 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-accent/30 animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <p className="text-4xl font-bold text-white/90 z-10">{personName.charAt(0)}</p>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{personName}</h3>
          <p className="text-sm text-muted-foreground">{template}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`rounded-xl ${statusColors[status]}`}>
            {status}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-2">
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WishCard;
