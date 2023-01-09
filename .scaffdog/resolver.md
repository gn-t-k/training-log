---
name: 'resolver'
root: 'src'
output: 'libs/trpc/server/resolvers'
ignore: ['src']
questions:
  name: 'Please enter resolver name'
---

# `{{ inputs.name | kebab }}-resolver/{{ inputs.name | kebab }}-resolver.ts`

```ts

type {{ inputs.name | pascal}}Resolver = (deps: Deps) => (props: Props) => Promise<>
export type Deps = {
}
export type Props = {
}
export const {{ inputs.name | camel}}Resolver: {{ inputs.name | pascal}}Resolver = (deps) => async (props) => {
}
```

# `{{ inputs.name | kebab }}-resolver/{{ inputs.name | kebab }}-resolver.test.ts`

```ts
import { Deps, Props, {{ inputs.name | camel }}Resolver } from "./{{ inputs.name | kebab }}-resolver";

describe("{{ inputs.name | camel }}Resolver", () => {
  test.todo("テスト", async () => {
    const deps: Deps = {
    }
    const props: Props = {
    }

    await {{ inputs.name | camel }}Resolver(deps)(props)
  });
});
```
