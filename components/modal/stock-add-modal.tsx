"use client";
import { useEffect, useState } from "react"; 
import { Modal } from "@/components/ui/modal"; 
import { StockAddForm } from "../forms/stock-add-form";

interface StockAddProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const StockAdd: React.FC<StockAddProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal 
      title="Add a stock symbol"
      description=""
      isOpen={isOpen}
      onClose={onClose}
    >
       <StockAddForm onClose={onClose} />

    </Modal>
  );
};
