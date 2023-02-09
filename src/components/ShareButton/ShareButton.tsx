import { forwardRef } from 'react';
import style from './ShareButton.module.css';

type ShareButton = {
  isDisabled?: boolean;
  label: string;
};

export const ShareButton = forwardRef<HTMLButtonElement, ShareButton>(
  ({ label, isDisabled = true, ...props }, ref) => {
    return (
      <button
        {...props}
        disabled={isDisabled}
        ref={ref}
        type="button"
        className={style.button}
      >
        {label}
      </button>
    );
  }
);
