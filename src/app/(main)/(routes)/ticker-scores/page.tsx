"use client";

import Header from '@/components/header';
import TickerScores from '@/components/ticker-scores';
import { IndexScore } from '@/components/ticker-scores/types';
import { useState, useEffect } from 'react'; 
import { Loader } from "@/components/ui";

export default function TickerScoresPage() {
  const [scores, setScores] = useState<IndexScore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTickerScores = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ticker-scores');
        if (!response.ok) {
          throw new Error('Failed to fetch ticker scores');
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Error fetching ticker scores:', error);
      }
      setLoading(false);
    };

    fetchTickerScores();
  }, []);

  return (
    <>
    {loading && <Loader />}
    <Header isHeader={true} scores={scores} onSubmit={() => {}}/>
    <div className="ml-8 ">
        <TickerScores scores={scores} />
    </div>
    </>
  );
}