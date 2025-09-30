import { useState, useEffect } from 'react';
import './App.css';
import RecipeForm from './RecipeForm';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = '/api/recipes';

  const fetchRecipes = () => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error fetching recipes:", error));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSaveRecipe = (recipeToSave) => {
    if (editingRecipe) {
      fetch(`${apiUrl}/${editingRecipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeToSave),
      })
      .then(response => response.json())
      .then(() => {
        fetchRecipes();
        setEditingRecipe(null);
      })
      .catch(error => console.error("Error updating recipe:", error));
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeToSave),
      })
      .then(response => response.json())
      .then(() => {
        fetchRecipes();
      })
      .catch(error => console.error("Error submitting recipe:", error));
    }
  };

  const handleDeleteRecipe = (recipeId) => {
    fetch(`${apiUrl}/${recipeId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        fetchRecipes();
      } else {
        console.error("Failed to delete recipe");
      }
    })
    .catch(error => console.error("Error deleting recipe:", error));
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };
  
  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const term = searchTerm.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term) ||
      (recipe.categories && recipe.categories.some(category => category.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="app-container">
      <header>
        <h1>Meine Rezeptdatenbank</h1>
      </header>
      <main>
        <RecipeForm
          onSave={handleSaveRecipe}
          recipeToEdit={editingRecipe}
          onCancel={handleCancelEdit}
        />

        <div className="search-container">
          <input
            type="text"
            placeholder="Suche nach Rezepten oder Kategorien..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="recipe-list">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="card-buttons">
                <button onClick={() => handleEditRecipe(recipe)} className="edit-button">✏️</button>
                <button onClick={() => handleDeleteRecipe(recipe.id)} className="delete-button">&times;</button>
              </div>
              
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              <div className="recipe-details">
                <h3>Zutaten</h3>
                <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
                <h3>Zubereitung</h3>
                <ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

