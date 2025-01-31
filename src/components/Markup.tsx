import React from 'react';
import { useAppState } from '../states/AppState';

const Markup: React.FC = () => {
  const markup = useAppState((state) => state.markup?.etterSokefelt);

  if (!markup) return null;
  return <div dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export default Markup;
