
import React from 'react';
import { MenuItem } from '@/types';
import MenuItemCard from './MenuItemCard';

interface CategorySectionProps {
  categoryName: string;
  items: MenuItem[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categoryName, items }) => {
  if (items.length === 0) return null;

  return (
    <div id={categoryName.toLowerCase().replace(' ', '-')} className="mb-8">
      <div className="mb-4">
        <h2 className="category-label">{categoryName}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
