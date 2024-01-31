import { Box, Typography } from "@mui/material";

// 测试props中带有parent信息的情况

interface Schema<T> {
  fileds?: Record<keyof T, Schema<T[keyof T]>>;
}

interface Props<T, TParent> {
  index: string | number;
  value: T;
  schema: Schema<T>;
  parent?: Props<TParent, unknown>;
}

function Any<T, TParent>(props: Props<T, TParent>) {
  const { index, value, schema, parent } = props;
  const { fileds } = schema;
  if (!fileds) {
    return (
      <Typography>{`${index} = ${value} parent=${parent?.index}`}</Typography>
    );
  }

  return (
    <Typography variant="h6">
      {index}
      <Box marginLeft={2}>
        {Object.entries(fileds).map(([key, v]) => {
          return (
            <Any
              key={key}
              index={key}
              value={value[key as keyof T]}
              schema={fileds[key as keyof T]}
              parent={props}
            />
          );
        })}
      </Box>
    </Typography>
  );
}

interface Student {
  name: string;
  age: number;
}

interface Class {
  name: string;
  student: Student;
}

const classSchema: Schema<Class> = {
  fileds: {
    name: {},
    student: {
      fileds: {
        name: {},
        age: {},
      },
    },
  },
};

const classData: Class = {
  name: "class1",
  student: {
    name: "student1",
    age: 10,
  },
};

export function TestSchema() {
  return <Any index="class" value={classData} schema={classSchema} />;
}
