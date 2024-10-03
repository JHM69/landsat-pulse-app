"use client";
import { useEffect, useState } from "react"; 
import { Modal } from "@/components/ui/modal"; 
import ObservationFrom from "../forms/observations";

interface OrderCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ObservationLayout: React.FC<OrderCreateProps> = ({
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
      title="Observation List"
      description="Add or Remove Observation Stocks"
      isOpen={isOpen}
      onClose={onClose}
    >
       <ObservationFrom initialData={null} />

    </Modal>
  );
};
