
export function isString(val: unknown): boolean {
  if((typeof val) === 'string') {
    return true;
  }
  return false;
}

export function isNumber(val: unknown): boolean {
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

export function isNull(val: unknown): boolean {
  if(val === null) {
    return true;
  }
  return false;
}

export function isUndefined(val: unknown): boolean {
  return val === undefined;
}
