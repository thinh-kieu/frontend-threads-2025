import './Minion.less';

import React from 'react';

import { img64 } from './minionImg';

type MinionProps = {
  label?: string | number;
};

export const Minion: React.FC<MinionProps> = ({ label }) => (
  <div className="minion">
    <img src={img64} />
    <span>{label ? `${label}` : 'minion'}</span>
  </div>
);
