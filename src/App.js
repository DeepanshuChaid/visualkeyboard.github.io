import { useEffect, useState, useRef } from 'react';
import Key from './Key';

function App() {
  const [pressedKeys, setPressedKeys] = useState([]);
  const [typedText, setTypedText] = useState('');
  const timers = useRef(new Map());

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (event.repeat) return;

      // Add to pressedKeys for key highlight
      setPressedKeys((prev) => {
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      });

      // Add to typed text if key is a printable character or space
      if (
        key.length === 1 || // printable chars
        key === ' ' ||      // space
        key === 'Enter' ||  // enter key as newline
        key === 'Backspace' // handle backspace separately
      ) {
        setTypedText((prev) => {
          if (key === 'Backspace') {
            return prev.slice(0, -1); // remove last character
          } else if (key === 'Enter') {
            return prev + '\n'; // newline
          } else {
            return prev + key;
          }
        });
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key;

      if (timers.current.has(key)) {
        clearTimeout(timers.current.get(key));
      }

      const timer = setTimeout(() => {
        setPressedKeys((prev) => prev.filter((k) => k !== key));
        timers.current.delete(key);
      }, 100);

      timers.current.set(key, timer);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);
  
  

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Key pressedKeys={pressedKeys} />
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', fontSize: '18px', minHeight: '50px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#fafafa' }}>
        <p>{typedText || 'Start typing...'}</p>
      </div>
      
      
      
      
    </div>
    
    
  );
}

export default App;
