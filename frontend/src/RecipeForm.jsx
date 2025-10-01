import { useState, useEffect } from 'react';

function RecipeForm({ onSave, recipeToEdit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [categories, setCategories] = useState('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDescription(recipeToEdit.description || '');
      setIngredients(recipeToEdit.ingredients.join(', '));
      setSteps(recipeToEdit.steps.join(', '));
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
    onSave(recipeData); // Die allgemeine Speicher-Funktion aus App.jsx aufrufen

    if (!recipeToEdit) {
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setCategories('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`recipe-form ${recipeToEdit ? "edit-mode" : ""}`}>
      <h2>{recipeToEdit ? 'Rezept bearbeiten' : 'Neues Rezept hinzufügen'}</h2>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        placeholder="Zutaten (mit Komma trennen)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <textarea
        placeholder="Schritte (mit Komma trennen)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        required
      />
      <textarea
        placeholder="Kategorien (mit Komma trennen)"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
      />
      <div className="form-buttons">
        <button type="submit">{recipeToEdit ? 'Änderungen speichern' : 'Rezept speichern'}</button>
        {recipeToEdit && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}

export default RecipeForm;

