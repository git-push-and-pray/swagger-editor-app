'use client';

import { useEffect, useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { useTranslations } from 'next-intl';

import Button from './Button';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionName?: string;
}

const Modal = ({
  isOpen,
  title,
  message,
  onClose,
  onAction,
  actionName,
}: ModalProps): JSX.Element | null => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isBackdropClick = useRef(false);
  const t = useTranslations('Modal');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    isBackdropClick.current = e.target === dialogRef.current;
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (isBackdropClick.current && e.target === dialogRef.current) {
      onClose();
    }
    isBackdropClick.current = false;
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="alertdialog"
      className="bg-bg backdrop:bg-bg/80 border-border fixed inset-0 m-auto w-full max-w-96 rounded-xl border shadow-xl backdrop:backdrop-blur-sm lg:max-w-md"
    >
      <div className="flex flex-col items-stretch px-6">
        <header className="flex items-center justify-between py-4">
          <h2 className="text-text-primary font-serif text-lg font-semibold capitalize">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary cursor-pointer text-center transition duration-300"
            aria-label={t('closeAriaLabel')}
          >
            <Icon name="close" size="m" />
          </button>
        </header>
        <main className="border-border text-text-secondary border-y py-6 text-left text-sm leading-5 font-normal">
          {message}
        </main>
        <footer className="flex justify-end gap-3 py-4">
          <Button name={t('cancelButton')} btnVersion="secondary" btnSize="sm" onClick={onClose} />
          {onAction && actionName && (
            <Button name={actionName} btnVersion="destructive" btnSize="sm" onClick={onAction} />
          )}
        </footer>
      </div>
    </dialog>
  );
};

export default Modal;
