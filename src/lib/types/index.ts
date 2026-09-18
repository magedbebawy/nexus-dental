export * from "./database.types";

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  badge?: string | number;
}
