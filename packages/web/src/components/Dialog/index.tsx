import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

const dialogRoot = document.getElementById('dialogs');

export function Dialog({ children }: PropsWithChildren<unknown>) {
  if (!dialogRoot) {
    throw new Error('Dialog root not found.');
  }

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ backgroundColor: 'white' }}>{children}</div>
    </div>,
    dialogRoot
  );
}
