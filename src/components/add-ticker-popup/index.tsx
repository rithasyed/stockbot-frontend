import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface AddTickerDialogProps {
  onAdd: () => Promise<void>;
}

interface FormData {
  ticker: string;
  categoryId: string;
}

interface ApiResponse {
  status_code?: number;
  detail?: string;
  headers?: any;
}

const formatErrorMessage = (message: string): string => {
  if (message.includes('already exists in database')) {
    return 'Ticker already exists';
  }
  return message;
};

const AddTickerDialog: React.FC<AddTickerDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formErrors, setFormErrors] = useState<{ categoryId?: string }>({});
  const [formData, setFormData] = useState<FormData>({
    ticker: '',
    categoryId: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/ticker-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const validateForm = (): boolean => {
    const errors: { categoryId?: string } = {};
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/single-ticker-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: formData.ticker,
          categoryId: parseInt(formData.categoryId)
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.status_code === 400 || data.detail) {
        throw new Error(data.detail || 'An error occurred');
      }

      toast({
        title: "Success",
        description: `Ticker ${formData.ticker} added successfully`,
      });
      
      await onAdd();
      setOpen(false);
      setFormData({ ticker: '', categoryId: '' });
      setFormErrors({});
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? formatErrorMessage(error.message) : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Ticker</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Ticker</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="ticker">Ticker Symbol</label>
                <Input
                  id="ticker"
                  placeholder="Enter ticker symbol"
                  value={formData.ticker}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ticker: e.target.value.toUpperCase()
                  }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="flex gap-1">
                  Category
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value: string) => {
                    setFormData(prev => ({
                      ...prev,
                      categoryId: value
                    }));
                    setFormErrors(prev => ({
                      ...prev,
                      categoryId: undefined
                    }));
                  }}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className={formErrors.categoryId ? "border-red-500" : ""}>
                    <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.categoryId && (
                  <span className="text-sm text-red-500">{formErrors.categoryId}</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setFormErrors({});
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingCategories}>
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default AddTickerDialog;