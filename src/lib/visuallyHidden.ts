import type * as React from 'react';

export const visuallyHidden: React.CSSProperties = {
  clip: 'rect(0, 0, 0, 0)',
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0,
  border: 0,
  padding: 0,
  margin: -1,
  width: 1,
  height: 1
};
