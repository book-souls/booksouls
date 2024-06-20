// app/components/ConsoleText.tsx
import React, { useEffect } from 'react';

interface ConsoleTextProps {
  words: string[];
  id: string;
  colors?: string[];
  className?: string;
}

const ConsoleText: React.FC<ConsoleTextProps> = ({ words, id, colors = ['#fff'], className }) => {
  useEffect(() => {
    let visible = true;
    const con = document.getElementById('console');
    let letterCount = 0;
    let x = 1;
    let waiting = false;
    const target = document.getElementById(id);
    if (target) {
      target.setAttribute('style', 'color:' + colors[0]);
    }

    const intervalId = window.setInterval(() => {
      if (letterCount === words[0].length && !waiting) {
        waiting = true;
        window.setTimeout(() => {
          waiting = false;
          letterCount = 0; // Reset to start over with initial text
          clearInterval(intervalId); // Stop the animation once complete
        }, 1000);
      } else if (!waiting) {
        if (target) {
          target.innerHTML = words[0].substring(0, letterCount).replace(/\n/g, '<br>');
        }
        letterCount += x;
      }
    }, 120);

    const underscoreIntervalId = window.setInterval(() => {
      if (visible) {
        if (con) {
          con.classList.add('invisible');
        }
        visible = false;
      } else {
        if (con) {
          con.classList.remove('invisible');
        }
        visible = true;
      }
    }, 400);

    return () => {
      clearInterval(intervalId);
      clearInterval(underscoreIntervalId);
    };
  }, [words, id, colors]);

  return (
    <div className={`inline-block ${className}`}>
      <span id={id}></span>
      <span id="console" className="inline-block">_</span>
    </div>
  );
};

export default ConsoleText;
