import React from 'react';

export function useIsFirstRender() {
  const flagRef = React.useRef(true);

  if (flagRef.current === true) {
    flagRef.current = false;
    return true;
  }

  return flagRef.current;
}
