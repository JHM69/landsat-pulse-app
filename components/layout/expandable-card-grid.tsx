import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize } from 'lucide-react';

const ExpandableCard = ({ children, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed inset-4 z-50 bg-background shadow-lg rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 flex justify-end">
            <Button variant="ghost" size="icon" onClick={toggleExpand}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-grow overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={toggleExpand}
      >
        <Maximize className="h-4 w-4" />
      </Button>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const ExpandableCardGrid = ({ items }) => {
  return (
    <div className="grid mt-3 gap-3 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
      {items.map((item, index) => (
        <ExpandableCard key={index} className={`col-span-${item.colSpan || 4}`}>
          {item.content}
        </ExpandableCard>
      ))}
    </div>
  );
};

export default ExpandableCardGrid;