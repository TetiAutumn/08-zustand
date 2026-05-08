"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useRouter } from 'next/navigation';

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {

  const router = useRouter();

  const close = () => router.back();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Закриття по кліку на backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (onClose){
        onClose();
      } else {
        close();
      }
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        {children}
      </div>
    </div>,
    document.body
  );
}
