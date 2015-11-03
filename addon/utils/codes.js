const NUM_KEYS_START = 48;
const NUM_KEYS_END   = 57;
const NUM_PAD_START  = 96;
const NUM_PAD_END    = 105;

export function isNumberCode(code) {
  return (code >= NUM_KEYS_START && code <= NUM_KEYS_END) ||
         (code >= NUM_PAD_START && code <= NUM_PAD_END);
}

export function keyCodeToNumber(code) {
  if (code >= NUM_KEYS_START && code <= NUM_KEYS_END) {
    return code - NUM_KEYS_START;
  } else if (code >= NUM_PAD_START && code <= NUM_PAD_END) {
    return code - NUM_PAD_START;
  } else {
    return null;
  }
}