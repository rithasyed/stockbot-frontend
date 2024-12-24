"use client";

import Header from '@/components/header';
import TickerScores from '@/components/ticker-scores';
import { IndexScore } from '@/components/ticker-scores/types';
import { useState, useEffect } from 'react'; 
import { Loader } from "@/components/ui";

export default function TickerScoresPage() {
  const [scores, setScores] = useState<IndexScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStoredTickerScores();
  }, []);

  const fetchStoredTickerScores = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stored-ticker-scores');
      if (!response.ok) {
        throw new Error('Failed to fetch stored ticker scores');
      }
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error fetching stored ticker scores:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ticker-scores');
      if (!response.ok) {
        throw new Error('Failed to fetch new ticker scores');
      }
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error fetching new ticker scores:', error);
    }
    setLoading(false);
  };

  if (loading && scores.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Header isHeader={true} scores={scores} onSubmit={() => {}} />
      <div className="ml-4">
        <TickerScores 
          scores={scores} 
          onRefresh={handleRefresh}
          isLoading={loading}
        />
      </div>
    </>
  );
}