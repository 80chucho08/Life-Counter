import { useEffect, useState } from 'react';
import './FlipCard.css';

function FlipCard({ label, value }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setIsFlipping(false);
        setPrevValue(value);
      }, 600); // Duración de la animación

      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  const formattedValue = value.toString().padStart(2, '0');
  const formattedPrev = prevValue.toString().padStart(2, '0');

  return (
    <div className="flip-card">
      <div className="label">{label}</div>
      <div className="flip">
        <div className="top">{formattedValue}</div>
        <div className={`bottom ${isFlipping ? 'flip-animate' : ''}`}>
          <span className="next">{formattedValue}</span>
          <span className="prev">{formattedPrev}</span>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
