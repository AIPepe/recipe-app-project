package com.example.recipe;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.recipe.api.model.Recipe;
import com.example.recipe.api.model.RecipeCreate;
import com.example.recipe.entity.RecipeEntity;
import com.example.recipe.repository.RecipeRepository;

@Service
public class RecipeService {

    private final RecipeRepository repository;

    public RecipeService(RecipeRepository repository) {
        this.repository = repository;
    }

    // Entity -> DTO
    private Recipe toDto(RecipeEntity entity) {
        Recipe dto = new Recipe();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setIngredients(entity.getIngredients());
        dto.setSteps(entity.getSteps());
        dto.setCategories(entity.getCategories());
        return dto;
    }

    // CreateDTO -> Entity
    private RecipeEntity toEntity(RecipeCreate create) {
        RecipeEntity entity = new RecipeEntity();
        entity.setTitle(create.getTitle());
        entity.setDescription(create.getDescription());
        entity.setIngredients(create.getIngredients());
        entity.setSteps(create.getSteps());
        entity.setCategories(create.getCategories());
        return entity;
    }

    public List<Recipe> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<Recipe> findById(String id) {
        return repository.findById(id).map(this::toDto);
    }

    public Recipe create(RecipeCreate create) {
        RecipeEntity saved = repository.save(toEntity(create));
        return toDto(saved);
    }

    public Optional<Recipe> update(String id, RecipeCreate update) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(update.getTitle());
            existing.setDescription(update.getDescription());
            existing.setIngredients(update.getIngredients());
            existing.setSteps(update.getSteps());
            existing.setCategories(update.getCategories());
            return toDto(repository.save(existing));
        });
    }

    public boolean delete(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
