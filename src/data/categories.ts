import { procedureCategories } from "../../shared/procedures/categories.js";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

const categoryPresentation: Record<string, Pick<Category, "icon" | "href">> = {
  wohnen: { icon: "🏠", href: "#wohnen" },
  familie: { icon: "👨‍👩‍👧", href: "#familie" },
  arbeit: { icon: "💼", href: "#arbeit" },
  dokumente: { icon: "📄", href: "#dokumente" },
  finanzen: { icon: "💶", href: "#finanzen" },
  alltag: { icon: "📋", href: "#alltag" },
};

export const categories: Category[] = procedureCategories.map((category) => ({
  ...category,
  ...categoryPresentation[category.id],
}));
