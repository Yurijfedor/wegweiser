import { Header, Footer } from "../../components/layout";
import { Hero, Categories } from "../../components/home";

import "./HomePage.css";

const HomePage = () => {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categories />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
