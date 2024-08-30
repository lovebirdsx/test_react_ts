import { useState } from 'react';

function MultiInputEditor() {
  const [inputs, setInputs] = useState<string[]>(['', '', '']);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => {
      const newInputs = prev.map((input, i) => (i === index || selectedIndices.includes(i) ? value : input));
      return newInputs;
    });
  };

  const handleSelectInput = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div>
          <input
            key={index}
            value={input}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onClick={() => handleSelectInput(index)}
            style={{
              backgroundColor: selectedIndices.includes(index) ? '#e0e0e0' : 'white',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function TestMultiEdit() {
  return (
    <div>
      <div>
        <h2>多选编辑</h2>
        <p>选中多个输入框，输入内容会同步</p>
      </div>
      <MultiInputEditor />
    </div>
  );
}
