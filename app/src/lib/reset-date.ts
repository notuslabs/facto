export function resetDate(date: Date) {
  return new Date(date.setHours(0, 0, 0, 0));
}
