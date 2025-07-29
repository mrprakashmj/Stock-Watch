'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { sanitizeStockUpdate } from '@/ai/flows/sanitize-stock-update';
import { toast } from '@/hooks/use-toast';
import type { StockItem } from '@/types';

interface UpdateItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: StockItem;
  onUpdate: (itemId: string, newQuantity: number) => void;
}

export default function UpdateItemDialog({ isOpen, setIsOpen, item, onUpdate }: UpdateItemDialogProps) {
  const [updateText, setUpdateText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSanitizeAndUpdate = async () => {
    if (!updateText.trim()) {
      toast({
        title: 'Input required',
        description: 'Please provide an update instruction.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sanitizeStockUpdate({ updateText });
      if (result.isValid) {
        const newQuantity = parseInt(result.sanitizedText.replace(/[^0-9-]/g, ''), 10);
        if (!isNaN(newQuantity)) {
          onUpdate(item.id, newQuantity);
          setUpdateText('');
        } else {
          throw new Error('AI returned a non-numeric value.');
        }
      } else {
        toast({
          title: 'Invalid Input',
          description: `Could not determine a valid quantity. Sanitized suggestion: "${result.sanitizedText}"`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to sanitize stock update:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Could not process the update. Please try again or use a simple number.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDialogChange = (open: boolean) => {
    if (!open) {
      setUpdateText('');
    }
    setIsOpen(open);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Update Quantity for {item.name}</DialogTitle>
          <DialogDescription>
            Current quantity: {item.quantity}. Enter the new total quantity or use natural language (e.g., "add 10", "set to 50").
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="update-text">Update Command</Label>
            <Textarea
              id="update-text"
              placeholder='e.g., "increase by 25" or "150"'
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              disabled={isLoading}
            />
             <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary/80" />
              Powered by GenAI for input sanitization
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDialogChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSanitizeAndUpdate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Sanitize & Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
