'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Category, useCategoryStore } from '@/store/categoryStore';
import { GripVertical, PenLine, Trash2 } from 'lucide-react';

interface CategoryListItemProps {
  category: Category;
  onEdit: (cat: Category) => void;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function CategoryListItem({ 
  category, 
  onEdit, 
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}: CategoryListItemProps) {
  const t = useTranslations('Categories');
  const { toggleCategoryStatus, deleteCategory } = useCategoryStore();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`relative group flex items-center p-4 bg-primary/20 backdrop-blur-md border rounded-2xl transition-all ${
        isDragged ? 'opacity-40 border-tertiary scale-95' : 
        isDragOver ? 'border-tertiary shadow-[0_0_15px_rgba(239,191,101,0.3)] -translate-y-1' : 
        'border-secondary/30 hover:border-secondary/60'
      }`}
    >
      {/* Drag Handle */}
      <div 
        className="text-on-surface-variant hover:text-white mr-3 cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical size={20} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-semibold text-on-surface truncate flex items-center gap-2">
          {category.name}
          {category.isFacebook && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">FB</span>
          )}
        </h3>
        <p className="text-sm text-on-surface-variant truncate mt-0.5">
          {category.url || 'No URL'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => toggleCategoryStatus(category.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            category.isActive ? 'bg-sky-blue' : 'bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              category.isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <button 
          onClick={() => onEdit(category)}
          className="text-on-surface-variant hover:text-tertiary p-1.5 transition-colors"
        >
          <PenLine size={18} strokeWidth={1.5} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowConfirm(true)}
            className="text-on-surface-variant hover:text-red-400 p-1.5 transition-colors"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
          
          {showConfirm && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
              />
              <div className="absolute right-0 bottom-full mb-3 w-52 p-4 bg-primary/80 backdrop-blur-2xl border border-secondary/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[15px] text-white mb-4 font-semibold tracking-tight">{t('deleteConfirm')}</p>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-secondary/50 text-on-surface-variant hover:text-white hover:bg-secondary/30 transition-all active:scale-95"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      deleteCategory(category.id); 
                      setShowConfirm(false); 
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#DA8593]/20 text-[#DA8593] border border-[#DA8593]/40 hover:bg-[#DA8593]/40 hover:shadow-[0_0_15px_rgba(218,133,147,0.3)] transition-all active:scale-95"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
