'use client';

import { useState } from 'react';
import type { StockItem } from '@/types';
import AddItemForm from '@/components/add-item-form';
import InventoryTable from '@/components/inventory-table';
import UpdateItemDialog from '@/components/update-item-dialog';
import StatsCards from '@/components/stats-cards';
import { Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';


const initialStock: StockItem[] = [
  { id: '1', name: 'Organic Cotton T-Shirt', description: '100% organic cotton, white', quantity: 50, price: 25.00 },
  { id: '2', name: 'Recycled Paper Notebook', description: 'A5 size, 100 pages, lined', quantity: 120, price: 8.50 },
  { id: '3', name: 'Bamboo Toothbrush', description: 'Biodegradable handle, soft bristles', quantity: 200, price: 3.00 },
  { id: '4', name: 'Stainless Steel Water Bottle', description: '500ml, insulated', quantity: 75, price: 18.00 },
];

export default function Home() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStock);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const handleAddItem = (newItem: Omit<StockItem, 'id' | 'description'> & { description?: string }) => {
    const item: StockItem = {
      ...newItem,
      description: newItem.description || '',
      id: (stockItems.length + 1).toString() + new Date().getTime(),
    };
    setStockItems((prev) => [item, ...prev]);
    toast({
      title: 'Success!',
      description: `"${item.name}" has been added to the inventory.`,
    });
  };

  const handleUpdateClick = (item: StockItem) => {
    setSelectedItem(item);
    setUpdateDialogOpen(true);
  };

  const handleUpdateItem = (itemId: string, newQuantity: number) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    setUpdateDialogOpen(false);
    toast({
        title: 'Update Successful!',
        description: `${selectedItem?.name} quantity has been updated to ${newQuantity}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-bold">StockWatch</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-bold mb-4">Inventory Overview</h2>
          <StatsCards items={stockItems} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AddItemForm onAddItem={handleAddItem} />
          </div>
          <div className="lg:col-span-2">
            <InventoryTable items={stockItems} onUpdateClick={handleUpdateClick} />
          </div>
        </div>
      </main>

      {selectedItem && (
        <UpdateItemDialog
          isOpen={isUpdateDialogOpen}
          setIsOpen={setUpdateDialogOpen}
          item={selectedItem}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
}
