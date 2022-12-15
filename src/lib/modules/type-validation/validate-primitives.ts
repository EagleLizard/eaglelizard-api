
export function isString(val: unknown): val is string {
  if((typeof val) === 'string') {
    return true;
  }
  return false;
}

export function isNumber(val: unknown): val is number {
  if((typeof val) === 'number') {
    return true;
  }
  return false;
}

export function isObject(val: unknown): boolean {
  if(
    ((typeof val) === 'object')
    && !isNull(val)
  ) {
    return true;
  }
  return false;
}

export function isNull(val: unknown): val is null {
  if(val === null) {
    return true;
  }
  return false;
}

export function isUndefined(val: unknown): val is undefined {
  return val === undefined;
}

export function isBoolean(val: unknown): val is boolean {
  return (typeof val) === 'boolean';
}

export function isStringArray(val: unknown): val is string[] {
  return (
    Array.isArray(val)
    && val.every(isString)
  );
}
