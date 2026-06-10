'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search } from 'lucide-react';
import { useCategoryStore, Category } from '@/store/categoryStore';
import { CategoryListItem } from '@/components/categories/CategoryListItem';
import { CategoryModal } from '@/components/categories/CategoryModal';

export default function CategoriesPage() {
  const t = useTranslations('Categories');
  const { categories, reorderCategories } = useCategoryStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Sort categories by order, then filter by search
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const filteredCategories = sortedCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires data
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      reorderCategories(draggedId, id);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-on-surface mb-2">
            {t('title')}
          </h1>
          <p className="text-on-surface-variant font-body-md">
            {t('desc')}
          </p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-tertiary text-black px-6 py-3 rounded-full font-semibold hover:bg-[#FBE09A] transition-all shadow-[0_0_20px_rgba(239,191,101,0.2)] active:scale-95"
        >
          <Plus size={20} strokeWidth={2} />
          {t('addSource')}
        </button>
      </div>

      <div className="mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" strokeWidth={1.5} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories by name..."
          className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-sky-blue/50 transition-colors"
        />
      </div>

      <div className="bg-black/10 rounded-3xl p-2 md:p-4 border border-white/5">
        <div className="space-y-3" onDragOver={(e) => e.preventDefault()}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <CategoryListItem 
                key={category.id} 
                category={category} 
                onEdit={handleEdit}
                isDragged={draggedId === category.id}
                isDragOver={dragOverId === category.id}
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDrop={(e) => handleDrop(e, category.id)}
                onDragEnd={handleDragEnd}
              />
            ))
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              No data available.
            </div>
          )}
        </div>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
      />
    </div>
  );
}
