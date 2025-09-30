package com.example.recipe;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.api.RecipesApi;
import com.example.recipe.api.model.Recipe;
import com.example.recipe.api.model.RecipeCreate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class RecipesController implements RecipesApi {

    private final RecipeService service;

    public RecipesController(RecipeService service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<List<Recipe>> recipesGet() {
        return ResponseEntity.ok(service.findAll());
    }

    @Override
    public ResponseEntity<Recipe> recipesIdGet(String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Recipe> recipesPost(RecipeCreate recipeCreate) {
        System.out.println("--- ANFRAGE ERHALTEN: recipesPost wurde aufgerufen! ---");
        Recipe created = service.create(recipeCreate);
        return ResponseEntity
                .created(URI.create("/recipes/" + created.getId()))
                .body(created);
    }

    @Override
    public ResponseEntity<Recipe> recipesIdPut(String id, RecipeCreate recipeCreate) {
        return service.update(id, recipeCreate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> recipesIdDelete(String id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
