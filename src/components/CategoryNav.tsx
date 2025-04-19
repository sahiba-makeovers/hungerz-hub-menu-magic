
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { menuCategories } from '@/data/menuData';

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState('');

  // Add scroll event listener to update active category
  useEffect(() => {
    const handleScroll = () => {
      const categories = menuCategories.map(cat => cat.name);
      
      for (const category of categories) {
        const element = document.getElementById(category);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-background shadow-sm">
      <ScrollArea className="max-w-full">
        <div className="flex py-2 px-4 overflow-x-auto gap-2">
          {menuCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.name ? "default" : "ghost"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => scrollToCategory(category.name)}
            >
              {category.displayName}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryNav;
