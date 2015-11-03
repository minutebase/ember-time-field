export default function pad(val) {
  const str = String(val);
  if (str.length === 1) {
    return `0${str}`;
  } else {
    return str;
  }
}