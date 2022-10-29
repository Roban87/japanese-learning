import * as React from 'react';
import { readFile } from 'fs/promises';
import './main.stye.scss';

export const MainScreen: React.FC = () => {
  const [dictionary, setDictionary] = React.useState({});

  const getDictionary = async () => {
    const csv = await readFile('../assets/szoszedet.csv', { encoding: 'utf-8' });
    setDictionary(csv);
  };

  React.useEffect(() => {
    getDictionary();
  }, []);
  
  return <div className="MainScreen">
    <h1>Nihon-Go</h1>
    <p>{JSON.stringify(dictionary)}</p>
  </div>
}