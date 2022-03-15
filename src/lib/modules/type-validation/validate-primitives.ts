
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
