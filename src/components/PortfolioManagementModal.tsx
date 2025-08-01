import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2 } from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  totalFollowers: number;
  engagementRate: number;
}

interface PortfolioManagementModalProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onSave: (portfolio: Portfolio) => void;
  onDelete: (portfolioId: string) => void;
  onManageIntegrations: (portfolioId: string) => void;
}

export function PortfolioManagementModal({
  portfolio,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onManageIntegrations
}: PortfolioManagementModalProps) {
  const [name, setName] = useState(portfolio.name);
  const [description, setDescription] = useState(portfolio.description);

  const handleSave = () => {
    onSave({
      ...portfolio,
      name,
      description
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) {
      onDelete(portfolio.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Portfolio</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Portfolio Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter portfolio name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter portfolio description"
              rows={3}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Portfolio Actions</h4>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onManageIntegrations(portfolio.id)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Integrations
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Portfolio
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}