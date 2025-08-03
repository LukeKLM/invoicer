// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
        toCamelCase(value),
      ])
    );
  }
  return obj;
};

const _camelToSnake = (str: string) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        _camelToSnake(key),
        camelToSnake(value)
      ])
    );
  }
  return obj;
};
