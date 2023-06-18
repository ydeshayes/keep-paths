# Keep paths

Small library that take an object and an array of paths and return a new object containing only those paths.

### Importing library

```javascript
import keepPaths from 'keep-paths'
```

## Usage

```typescript
import keepPaths from 'keep-paths'

const source = {
    foo: {
        bar: {
            key: 'value',
            key2: 'value2'
        }
    },
    other: {
        key1: 'value'
    }
};
const obj = keepPaths(source, ['foo.bar.key']);
console.log(obj);
```

Print:
```js
 {
    foo: {
        bar: {
            key: 'value'
        }
    }
}
```
