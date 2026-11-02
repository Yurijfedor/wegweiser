import { categories } from "../../../data/categories";
import CategoryCard from "./CategoryCard";

import "./Categories.css";

const Categories = () => {
  return (
    <section className="categories" id="themen">
      <div className="categories__container">
        <div className="categories__header">
          <span className="categories__eyebrow">
            WOBEI KÖNNEN WIR DIR HELFEN?
          </span>

          <h2 className="categories__title">Was möchtest du erledigen?</h2>

          <p className="categories__description">
            Wähle dein Anliegen und erhalte eine übersichtliche Anleitung mit
            den passenden Dokumenten, Formularen und nächsten Schritten.
          </p>
        </div>

        <div className="categories__grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
