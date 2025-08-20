/**
 * Utility function untuk menggabungkan class names
 * Menghilangkan class yang undefined atau falsy
 */
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Utility function untuk conditional classes
 */
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass: string = ""
): string => {
  return condition ? trueClass : falseClass;
};
