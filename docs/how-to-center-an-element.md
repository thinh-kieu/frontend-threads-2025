---
nav:
  title: Warm up!
  order: 0
---

# Center the Minions

You have a light gray box with four minions inside. Keep minion #1 where it starts, but align minions #2, #3, and #4 together centered horizontally in the gray box. Use any layout technique you like (flex, grid, absolute positioning, etc.).

Live playground (edit the JSX and styles directly):

```jsx
import React from 'react';
import { Minion } from 'ft2025/ui/components';

const containerStyle = {
  position: 'relative',
  width: 'auto',
  height: 'auto',
  background: '#f1f1f1',
  border: '1px dashed #c9c9c9',
  overflow: 'hidden',
  display: 'flex',
  padding: 10,
  gap: 10,
};

const minionStyle = {
  display: 'grid',
  placeItems: 'center',
};

const groupStyle = {
  display: 'flex',
  gap: 10,
  // TODO: Center minions 2-4 horizontally without moving minion 1.
};

export default () => {
  return (
    <div>
      <style>{`
        .guidelines::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          width: 1px;
          height: 100%;
          background: red;
          z-index: 9999;
        }
      `}</style>

      <div className="guidelines" style={containerStyle}>
        <div style={minionStyle}>
          <Minion label="#1" />
        </div>
        <div style={groupStyle}>
          <div style={minionStyle}>
            <Minion label="#2" />
          </div>
          <div style={minionStyle}>
            <Minion label="#3" />
          </div>
          <div style={minionStyle}>
            <Minion label="#4" />
          </div>
        </div>
      </div>
    </div>
  );
};
```
