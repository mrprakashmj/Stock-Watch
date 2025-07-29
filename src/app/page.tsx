'use client';

import { useState, useEffect } from 'react';
import type { StockItem } from '@/types';
import AddItemForm from '@/components/add-item-form';
import InventoryTable from '@/components/inventory-table';
import UpdateItemDialog from '@/components/update-item-dialog';
import StatsCards from '@/components/stats-cards';
import { LogOut, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { logout } from '@/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';


const initialStock: StockItem[] = [
  { id: '1', name: 'Organic Cotton T-Shirt', description: '100% organic cotton, white', quantity: 50, price: 25.00 },
  { id: '2', name: 'Recycled Paper Notebook', description: 'A5 size, 100 pages, lined', quantity: 120, price: 8.50 },
  { id: '3', name: 'Bamboo Toothbrush', description: 'Biodegradable handle, soft bristles', quantity: 200, price: 3.00 },
  { id: '4', name: 'Stainless Steel Water Bottle', description: '500ml, insulated', quantity: 75, price: 18.00 },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  useEffect(() => {
    // Here you would typically fetch data from your backend
    // For now, we'll use the initialStock data if the user is logged in.
    if (user) {
      setStockItems(initialStock);
    } else {
      setStockItems([]);
    }
  }, [user]);

  const handleAddItem = (newItem: Omit<StockItem, 'id' | 'description'> & { description?: string }) => {
    if (!user) {
      toast({ title: 'Please log in', description: 'You need to be logged in to add items.', variant: 'destructive' });
      return;
    }
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

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-bold">StockWatch</h1>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                   <span className="sr-only">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Skeleton className="h-96 w-full lg:col-span-1" />
                <Skeleton className="h-96 w-full lg:col-span-2" />
              </div>
            </div>
        ) : user ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 font-headline text-2xl font-bold">Welcome to StockWatch</h2>
            <p className="mt-2 text-muted-foreground">Please log in or create an account to manage your inventory.</p>
            <div className="mt-6 flex gap-4">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
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
