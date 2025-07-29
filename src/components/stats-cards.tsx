'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, IndianRupee } from 'lucide-react';
import type { StockItem } from '@/types';

interface StatsCardsProps {
  items: StockItem[];
}

export default function StatsCards({ items }: StatsCardsProps) {
  const { totalItems, totalValue } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { totalItems, totalValue };
  }, [items]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock Units</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total number of items in inventory</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalValue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
          </div>
          <p className="text-xs text-muted-foreground">Estimated value of all inventory</p>
        </CardContent>
      </Card>
    </div>
  );
}
