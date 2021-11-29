import { useCallback, useState } from "react";
import "./App.css";

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}

function App() {
  const [fields, setFields] = useState<string[][]>(
    Array(7).fill(Array(2).fill(""))
  );

  const onPaste = useCallback((event) => {
    event.preventDefault();
    const origin = event.target.dataset;

    const copiedText: string = (
      event.clipboardData || (window as any).clipboardData
    ).getData("text");
    
    const pasted = copiedText
      .split("\n").filter(r => r)
      .map((row: string) => row.trim().split(/\s+/g));

    setFields((rows) => {
      return rows.map((r, i) => r.map((c, j) => {
        const [ci, cj] = [ i - +origin.i, j - +origin.j ];
        if (ci >=0 && cj >= 0) {
          return (pasted[ci] && pasted[ci][cj]) || c;
        }
        return c;
      }));
    });
  }, []);

  const onChange = useCallback((event) => {
    const regex = /^text(\d+)_(\d+)/g;
    const [, i, j] = regex.exec(event.target.name) || [];
    setFields((state) => {
      let clone = [...state.map((r) => [...r])];
      clone[+i][+j] = event.target.value;
      return clone;
    });
  }, []);

  return (
    <div className="App">
      <form className="Form" onPaste={onPaste} onChange={onChange}>
        {fields.map((row, i) =>
          row.map((value, j) => (
            <input
              key={`${i}${j}`}
              type="text"
              name={`text${i}_${j}`}
              data-i={i}
              data-j={j}
              value={value}
            />
          ))
        )}
      </form>
    </div>
  );
}

export default App;
