import React from 'react';

import './index.scss';

export const PostTitle = ({ title, date }) => (
  <h1 className="post-title">
    {title} <span className="post-date">{date}</span>
  </h1>
);
