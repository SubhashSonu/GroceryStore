import React from "react";
import { recipes } from "../assets/dummyData"; // Update path if needed
import { recipePageStyles } from "../assets/dummyStyles";

const RecipePage = () => {
  return (
    <div className={recipePageStyles.page}>
      <h1 className={recipePageStyles.header}>Delicious Recipes</h1>

      {recipes.map((recipe) => (
        <div key={recipe.id} className={recipePageStyles.recipeCard}>
          <img
            src={recipe.image}
            alt={recipe.name}
            className={recipePageStyles.recipeImage}
          />
          <h2 className={recipePageStyles.recipeTitle}>{recipe.name}</h2>

          <h3 className={recipePageStyles.sectionTitle}>Ingredients:</h3>
          <ul className={recipePageStyles.ingredientList}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>

          <h3 className={recipePageStyles.sectionTitle}>Steps:</h3>
          <ol className={recipePageStyles.stepList}>
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default RecipePage;
