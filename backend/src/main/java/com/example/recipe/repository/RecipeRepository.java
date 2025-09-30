package com.example.recipe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.recipe.entity.RecipeEntity;

public interface RecipeRepository extends MongoRepository<RecipeEntity, String> {
}
