import cs from "@/i18n/locales/cs.json";

type Dict = { [key: string]: string | Dict };

const resolve = (obj: Dict, path: string): string | undefined => {
  const parts = path.split(".");
  let current: string | Dict | undefined = obj;
  for (const p of parts) {
    if (current && typeof current === "object" && p in current) {
      current = (current as Dict)[p];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
};

export const t = (key: string): string => {
  const value = resolve(cs as Dict, key);
  return value ?? key;
};

export const useLanguage = () => {
  return {
    t,
    currentLanguage: "cs" as const,
    isCzech: true,
    isEnglish: false,
  };
};
