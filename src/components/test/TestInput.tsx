import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

// 问题：在异步调用setState时，原生的input会出现光标位置不正确的问题
function TestOriginInput() {
  const [value, setValue] = useState('123');
  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          const { value } = e.target;
          setTimeout(() => {
            setValue(value);
          });
        }}
      />
    </div>
  );
}

// 通过自己封装的Input，可以解决这个问题
type InputProps = React.ComponentProps<'input'>;
function Input(props: InputProps) {
  const { value, ...rest } = props;
  const [selfValue, setSelfValue] = useState(props.value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = ref.current;
    if (!input) {
      return;
    }

    if (value !== selfValue) {
      setSelfValue(value);
      input.value = value as string;
    }
  }, [selfValue, value]);

  return <input ref={ref} defaultValue={value} {...rest} />;
}

function TestWrapperedInput() {
  const [value, setValue] = useState('123');
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => {
          const { value } = e.target;
          setTimeout(() => {
            setValue(value);
          });
        }}
      />
    </div>
  );
}

// material中的TextField也可以正常处理
function TestMaterialInput() {
  const [value, setValue] = useState('123');
  return (
    <div>
      <TextField
        content={value}
        onChange={(e) => {
          const { value } = e.target;
          setTimeout(() => {
            setValue(value);
          });
        }}
      />
    </div>
  );
}

// 测试Input在异步调用setState时，能否正常处理
export function TestInput() {
  return (
    <div>
      <div>
        <h2>测试Input在异步调用setState时，能否正常处理</h2>
        <p>操作方式：在内容的中间输入字符，观察光标是否正确</p>
      </div>
      <div>
        <h3>原生的input</h3>
      </div>
      <div>
        <TestOriginInput />
      </div>
      <div>
        <h3>自己封装的Input</h3>
      </div>
      <div>
        <TestWrapperedInput />
      </div>
      <div>
        <h3>material中的TextInput</h3>
      </div>
      <div>
        <TestMaterialInput />
      </div>
    </div>
  );
}
