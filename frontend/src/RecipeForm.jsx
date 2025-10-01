import { useState, useEffect } from 'react';

function RecipeForm({ onSave, recipeToEdit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [categories, setCategories] = useState('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title || '');
      setDescription(recipeToEdit.description || '');
      setIngredients(recipeToEdit.ingredients ? recipeToEdit.ingredients.join(', ') : '');
      setSteps(recipeToEdit.steps ? recipeToEdit.steps.join(', ') : '');
      setCategories(recipeToEdit.categories ? recipeToEdit.categories.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setIngredients('');
      setSteps('');
      setCategories('');
    }
  }, [recipeToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipeData = {
      title,
      description,
      ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item),
      steps: steps.split(',').map(item => item.trim()).filter(item => item),
      categories: categories.split(',').map(item => item.trim()).filter(item => item),
    };
    onSave(recipeData);

    if (!recipeToEdit) {
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setCategories('');
    }
  };

  return (
    <div className={`form-container ${recipeToEdit ? "edit-mode" : ""}`}>
      <form onSubmit={handleSubmit} className="recipe-form">
        <h2>{recipeToEdit ? 'Rezept bearbeiten' : 'Neues Rezept hinzufügen'}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            type="text"
            placeholder="z.B. Spaghetti Carbonara"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Beschreibung</label>
          <textarea
            id="description"
            placeholder="Eine kurze Beschreibung des Gerichts"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Zutaten</label>
          <textarea
            id="ingredients"
            placeholder="Zutat 1, Zutat 2, Zutat 3, ..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="steps">Zubereitungsschritte</label>
          <textarea
            id="steps"
            placeholder="Schritt 1, Schritt 2, Schritt 3, ..."
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categories">Kategorien</label>
          <input
            id="categories"
            type="text"
            placeholder="z.B. Italienisch, Pasta, Schnell"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="button-primary">{recipeToEdit ? 'Änderungen speichern' : 'Rezept hinzufügen'}</button>
          {recipeToEdit && (
            <button type="button" onClick={onCancel} className="button-secondary">
              Abbrechen
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;

