'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import type { StockItem } from '@/types';

interface InventoryTableProps {
  items: StockItem[];
  onUpdateClick: (item: StockItem) => void;
}

export default function InventoryTable({ items, onUpdateClick }: InventoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Current Inventory</CardTitle>
        <CardDescription>A list of all items currently in your stock.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="font-bold">{item.name}</div>
                      {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => onUpdateClick(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Update Item</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No items in inventory. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
