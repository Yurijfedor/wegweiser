import { useState } from "react";

import { Header, Footer } from "../../components/layout";
import {
  Hero,
  Categories,
  CitySelector,
  HowItWorks,
} from "../../components/home";
import { ProcedureCatalog } from "../../components/procedures";
import { ProcedureAssistant } from "../../components/assistant";

import "./HomePage.css";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);

    document.getElementById("procedure-catalog")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />

      <main>
        <Hero />

        <HowItWorks />

        <ProcedureAssistant />

        <CitySelector />

        <Categories onCategorySelect={handleCategorySelect} />

        <ProcedureCatalog selectedCategory={selectedCategory} />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
