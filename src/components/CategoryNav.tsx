
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { menuCategories } from '@/data/menuData';
import { useIsMobile } from '@/hooks/use-mobile';

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const navRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      const categories = menuCategories.map(cat => cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      
      for (const categoryId of categories) {
        const element = document.getElementById(categoryId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on screen size
          const threshold = isMobile ? 120 : 200;
          if (rect.top <= threshold && rect.bottom >= threshold) {
            setActiveCategory(categoryId);
            // Scroll active button into view in the nav bar
            scrollActiveButtonIntoView(categoryId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once to set initial active category
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Function to scroll active button into view in the nav bar
  const scrollActiveButtonIntoView = (categoryId: string) => {
    if (navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-category="${categoryId}"]`);
      if (activeButton) {
        const scrollLeft = activeButton.getBoundingClientRect().left 
          - navRef.current.getBoundingClientRect().left 
          - navRef.current.offsetWidth/2 
          + (activeButton as HTMLElement).offsetWidth/2;
        
        navRef.current.scrollLeft += scrollLeft;
      }
    }
  };

  // Function to scroll to selected category with offset
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      // Calculate the offset for fixed header
      const headerOffset = isMobile ? 110 : 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-background shadow-sm">
      <ScrollArea className="max-w-full">
        <div 
          ref={navRef}
          className="flex py-1 sm:py-2 px-2 sm:px-4 overflow-x-auto gap-1 sm:gap-2 scrollbar-hide"
        >
          {menuCategories.map((category) => {
            const categoryId = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return (
              <Button
                key={category.id}
                data-category={categoryId}
                variant={activeCategory === categoryId ? "default" : "ghost"}
                size={isMobile ? "sm" : "default"}
                className="whitespace-nowrap text-xs sm:text-sm"
                onClick={() => scrollToCategory(categoryId)}
              >
                {category.displayName}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryNav;
