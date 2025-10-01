import { useState, useEffect } from 'react';
import './App.css';
import RecipeForm from './RecipeForm';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = '/api/recipes';

  const fetchRecipes = () => {
    setIsLoading(true);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSaveRecipe = (recipeToSave) => {
    const isUpdating = !!editingRecipe;
    const url = isUpdating ? `${apiUrl}/${editingRecipe.id}` : apiUrl;
    const method = isUpdating ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeToSave),
    })
    .then(response => response.json())
    .then(() => {
      fetchRecipes();
      setEditingRecipe(null);
    })
    .catch(error => console.error("Error saving recipe:", error));
  };

  const handleDeleteRecipe = (recipeId) => {
    fetch(`${apiUrl}/${recipeId}`, { method: 'DELETE' })
    .then(response => { if (response.ok) { fetchRecipes(); } })
    .catch(error => console.error("Error deleting recipe:", error));
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const term = searchTerm.toLowerCase();
    return (
      (recipe.title && recipe.title.toLowerCase().includes(term)) ||
      (recipe.description && recipe.description.toLowerCase().includes(term)) ||
      (recipe.categories && recipe.categories.some(category => category.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cookbook</h1>
        <p>Deine persönliche Rezeptdatenbank</p>
      </header>
      <main>
        <RecipeForm
          onSave={handleSaveRecipe}
          recipeToEdit={editingRecipe}
          onCancel={handleCancelEdit}
        />

        <div className="list-header">
          <h2>Alle Rezepte</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Suche..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="loading-indicator">Lade Rezepte...</p>
        ) : (
          <div className="recipe-list">
            {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="card-buttons">
                  <button onClick={() => handleEditRecipe(recipe)} className="edit-button" title="Bearbeiten">✏️</button>
                  <button onClick={() => handleDeleteRecipe(recipe.id)} className="delete-button" title="Löschen">&times;</button>
                </div>
                
                <h2>{recipe.title}</h2>
                <p className="recipe-description">{recipe.description}</p>
                
                {recipe.categories && recipe.categories.length > 0 && (
                  <div className="recipe-categories">
                    {recipe.categories.map((cat, i) => <span key={i} className="category-tag">{cat}</span>)}
                  </div>
                )}

                <div className="recipe-details">
                  <h3>Zutaten</h3>
                  <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
                  <h3>Zubereitung</h3>
                  <ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                </div>
              </div>
            )) : <p className="no-recipes-found">Keine Rezepte gefunden.</p>}
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 - Ein Projekt von [Dein Name]</p>
      </footer>
    </div>
  );
}

export default App;

