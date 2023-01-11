---
name: 'prisma'
root: 'src'
output: 'libs/prisma'
ignore: ['src']
questions:
  operation:
    message: 'query or command'
    choices:
      - 'query'
      - 'command'
  name:
    message: 'Please enter operation name'
---

# `{{if inputs.operation == 'query'}}queries{{end}}{{if inputs.operation == 'command'}}commands{{end}}/{{ inputs.name | kebab}}-{{inputs.operation}}.ts`

```ts
import prisma from "../client";

export type {{inputs.name | pascal}}{{inputs.operation | pascal}} = (props: {
}) => Promise<>
export const {{inputs.name | camel}}{{inputs.operation | pascal}}: {{inputs.name | pascal}}{{inputs.operation | pascal}} = async (props) => {
}
```
