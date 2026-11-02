import "./CategoryCard.css";

import type { Category } from "../../../data/categories";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <a
      href={category.href}
      className="category-card"
      aria-label={`${category.title}: ${category.description}`}
    >
      <div className="category-card__icon" aria-hidden="true">
        {category.icon}
      </div>

      <div className="category-card__content">
        <h3 className="category-card__title">{category.title}</h3>

        <p className="category-card__description">{category.description}</p>
      </div>

      <span className="category-card__arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
};

export default CategoryCard;
