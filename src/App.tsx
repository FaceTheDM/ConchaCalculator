/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, 
  Utensils, 
  Plus, 
  Trash2, 
  Edit2,
  Save, 
  ChevronRight, 
  LayoutDashboard, 
  Package, 
  DollarSign,
  Search,
  ArrowLeft,
  X,
  StickyNote,
  FileText,
  Settings,
  Moon,
  Sun,
  Flower,
  AlertTriangle,
  Download,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Types
export type Unit = 'g' | 'oz' | 'fl oz' | 'each' | 'kg' | 'lb' | 'ml' | 'l' | 'tbsp' | 'tsp';

export interface Ingredient {
  id: string;
  name: string;
  purchasePrice: number;
  purchaseQuantity: number;
  purchaseUnit: Unit;
  pricePerUnit: number; // Price per base unit (g, oz, fl oz, each)
}

export interface RecipeIngredient {
  ingredientId: string;
  amount: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  yield: number;
  ingredients: RecipeIngredient[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const UNIT_LABELS: Record<Unit, string> = {
  g: 'Grams (g)',
  oz: 'Ounces (oz)',
  'fl oz': 'Fluid Ounces (fl oz)',
  each: 'Each (count)',
  kg: 'Kilograms (kg)',
  lb: 'Pounds (lb)',
  ml: 'Milliliters (ml)',
  l: 'Liters (l)',
  tbsp: 'Tablespoons (tbsp)',
  tsp: 'Teaspoons (tsp)',
};

// Helper for unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', name: 'Eggs', purchasePrice: 2.72, purchaseQuantity: 12, purchaseUnit: 'each', pricePerUnit: 0.2266666667 },
  { id: 'ing-2', name: 'Milk', purchasePrice: 2.81, purchaseQuantity: 128, purchaseUnit: 'fl oz', pricePerUnit: 0.021953125 },
  { id: 'ing-3', name: 'Flour', purchasePrice: 2.19, purchaseQuantity: 2268, purchaseUnit: 'g', pricePerUnit: 0.0009656084656 },
  { id: 'ing-4', name: 'Sugar', purchasePrice: 3.29, purchaseQuantity: 1814.4, purchaseUnit: 'g', pricePerUnit: 0.001813271605 },
  { id: 'ing-5', name: 'Yeast', purchasePrice: 1.19, purchaseQuantity: 14.175, purchaseUnit: 'g', pricePerUnit: 0.08395061728 },
  { id: 'ing-6', name: 'Flavoring Caramel', purchasePrice: 7.00, purchaseQuantity: 16, purchaseUnit: 'tbsp', pricePerUnit: 0.4375 },
  { id: 'ing-7', name: 'Flavoring Strawberry', purchasePrice: 7.00, purchaseQuantity: 16, purchaseUnit: 'tbsp', pricePerUnit: 0.4375 },
  { id: 'ing-8', name: 'Cocoa Powder', purchasePrice: 4.12, purchaseQuantity: 226.8, purchaseUnit: 'g', pricePerUnit: 0.01816578483 },
  { id: 'ing-9', name: 'Butter', purchasePrice: 3.99, purchaseQuantity: 32, purchaseUnit: 'tbsp', pricePerUnit: 0.1246875 },
  { id: 'ing-10', name: 'Shortening', purchasePrice: 12.75, purchaseQuantity: 1927.8, purchaseUnit: 'g', pricePerUnit: 0.006613756614 },
  { id: 'ing-11', name: 'Choco Chips', purchasePrice: 4.99, purchaseQuantity: 340.2, purchaseUnit: 'g', pricePerUnit: 0.01466784245 },
  { id: 'ing-12', name: 'White Choco Chips', purchasePrice: 4.99, purchaseQuantity: 340.2, purchaseUnit: 'g', pricePerUnit: 0.01466784245 },
  { id: 'ing-13', name: 'Butterscotch Chips', purchasePrice: 3.39, purchaseQuantity: 340.2, purchaseUnit: 'g', pricePerUnit: 0.009964726631 },
  { id: 'ing-14', name: 'Powdered Sugar', purchasePrice: 1.99, purchaseQuantity: 907.2, purchaseUnit: 'g', pricePerUnit: 0.00219356261 },
  { id: 'ing-15', name: 'Strawberry Extract', purchasePrice: 4.99, purchaseQuantity: 4, purchaseUnit: 'tbsp', pricePerUnit: 1.2475 },
  { id: 'ing-16', name: 'Brown Sugar', purchasePrice: 1.99, purchaseQuantity: 907.2, purchaseUnit: 'g', pricePerUnit: 0.00219356261 },
  { id: 'ing-17', name: 'Limes', purchasePrice: 0.35, purchaseQuantity: 3, purchaseUnit: 'each', pricePerUnit: 0.1166666667 },
  { id: 'ing-18', name: 'Lemons', purchasePrice: 3.89, purchaseQuantity: 8, purchaseUnit: 'each', pricePerUnit: 0.48625 },
  { id: 'ing-19', name: 'Strawberries', purchasePrice: 6.59, purchaseQuantity: 1360.8, purchaseUnit: 'g', pricePerUnit: 0.004842739565 },
  { id: 'ing-20', name: 'Agave', purchasePrice: 4.29, purchaseQuantity: 47, purchaseUnit: 'tbsp', pricePerUnit: 0.09127659574 },
  { id: 'ing-21', name: 'Mint', purchasePrice: 1.59, purchaseQuantity: 1, purchaseUnit: 'each', pricePerUnit: 1.59 },
  { id: 'ing-22', name: 'Potassium Sorbate', purchasePrice: 22.00, purchaseQuantity: 5, purchaseUnit: 'g', pricePerUnit: 4.4 },
  { id: 'ing-23', name: 'Packaging', purchasePrice: 63.00, purchaseQuantity: 500, purchaseUnit: 'each', pricePerUnit: 0.126 },
  { id: 'ing-24', name: 'Labels', purchasePrice: 10.00, purchaseQuantity: 500, purchaseUnit: 'each', pricePerUnit: 0.02 }
];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Strawberry Concha',
    yield: 12,
    ingredients: [
      { ingredientId: 'ing-1', amount: 3, unit: 'each' },
      { ingredientId: 'ing-3', amount: 740, unit: 'g' },
      { ingredientId: 'ing-4', amount: 100, unit: 'g' },
      { ingredientId: 'ing-5', amount: 9, unit: 'g' },
      { ingredientId: 'ing-9', amount: 20, unit: 'tbsp' },
      { ingredientId: 'ing-14', amount: 240, unit: 'g' },
      { ingredientId: 'ing-11', amount: 12, unit: 'g' },
      { ingredientId: 'ing-15', amount: 2, unit: 'tbsp' }
    ]
  },
  {
    id: 'rec-2',
    name: 'Triple Chocolate Concha',
    yield: 11,
    ingredients: [
      { ingredientId: 'ing-1', amount: 3, unit: 'each' },
      { ingredientId: 'ing-3', amount: 480, unit: 'g' },
      { ingredientId: 'ing-4', amount: 150, unit: 'g' },
      { ingredientId: 'ing-5', amount: 7, unit: 'g' },
      { ingredientId: 'ing-6', amount: 2, unit: 'tbsp' },
      { ingredientId: 'ing-2', amount: 8.1, unit: 'fl oz' },
      { ingredientId: 'ing-9', amount: 10, unit: 'tbsp' },
      { ingredientId: 'ing-10', amount: 226, unit: 'g' },
      { ingredientId: 'ing-14', amount: 240, unit: 'g' },
      { ingredientId: 'ing-11', amount: 12, unit: 'g' },
      { ingredientId: 'ing-8', amount: 2, unit: 'tbsp' }
    ]
  },
  {
    id: 'rec-3',
    name: 'Cinnamon Rolls',
    yield: 12,
    ingredients: [
      { ingredientId: 'ing-1', amount: 2, unit: 'each' },
      { ingredientId: 'ing-3', amount: 500, unit: 'g' },
      { ingredientId: 'ing-4', amount: 100, unit: 'g' },
      { ingredientId: 'ing-5', amount: 7, unit: 'g' },
      { ingredientId: 'ing-2', amount: 8, unit: 'fl oz' },
      { ingredientId: 'ing-9', amount: 8, unit: 'tbsp' },
      { ingredientId: 'ing-16', amount: 150, unit: 'g' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ingredients' | 'recipes' | 'future-recipes'>('dashboard');
  
  // State with localStorage initializers
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('baker_ingredients');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return INITIAL_INGREDIENTS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('baker_recipes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return INITIAL_RECIPES;
  });

  const [futureRecipes, setFutureRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('baker_future_recipes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('baker_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('baker_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isSakuraMode, setIsSakuraMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('baker_sakura_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    const saved = localStorage.getItem('baker_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed[0].id;
    }
    return null;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingRecipe, setIsEditingRecipe] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isEditingFutureRecipe, setIsEditingFutureRecipe] = useState<string | null>(null);
  const [selectedFutureRecipeId, setSelectedFutureRecipeId] = useState<string | null>(null);
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'ingredient' | 'recipe' | 'futureRecipe' | 'note';
    id: string;
    name: string;
  }>({ isOpen: false, type: 'note', id: '', name: '' });

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isSakuraMode) {
      root.classList.add('sakura');
    } else {
      root.classList.remove('sakura');
    }
  }, [isSakuraMode]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('baker_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('baker_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('baker_future_recipes', JSON.stringify(futureRecipes));
  }, [futureRecipes]);

  useEffect(() => {
    localStorage.setItem('baker_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('baker_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('baker_sakura_mode', JSON.stringify(isSakuraMode));
  }, [isSakuraMode]);

  const addNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    setDeleteConfirmation({
      isOpen: true,
      type: 'note',
      id,
      name: note?.title || 'Untitled Note'
    });
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirmation;
    
    if (type === 'ingredient') {
      setIngredients(ingredients.filter(i => i.id !== id));
    } else if (type === 'recipe') {
      setRecipes(recipes.filter(r => r.id !== id));
    } else if (type === 'futureRecipe') {
      setFutureRecipes(futureRecipes.filter(r => r.id !== id));
    } else if (type === 'note') {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
    }
    
    setDeleteConfirmation({ ...deleteConfirmation, isOpen: false });
  };

  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'pricePerUnit'>) => {
    const pricePerUnit = ingredient.purchasePrice / ingredient.purchaseQuantity;
    const newIngredient: Ingredient = {
      ...ingredient,
      id: generateId(),
      pricePerUnit,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const deleteIngredient = (id: string) => {
    const ing = ingredients.find(i => i.id === id);
    setDeleteConfirmation({
      isOpen: true,
      type: 'ingredient',
      id,
      name: ing?.name || 'Ingredient'
    });
  };

  const updateIngredient = (id: string, updatedData: Omit<Ingredient, 'id' | 'pricePerUnit'>) => {
    const pricePerUnit = updatedData.purchasePrice / updatedData.purchaseQuantity;
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...updatedData, id, pricePerUnit } : ing
    ));
    setEditingIngredientId(null);
  };

  const updateRecipe = (id: string, updatedData: Omit<Recipe, 'id'>) => {
    setRecipes(recipes.map(r => r.id === id ? { ...updatedData, id } : r));
    setIsEditingRecipe(null);
    setSelectedRecipeId(id); // Go back to details
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    if (isEditingRecipe && isEditingRecipe !== 'new') {
      updateRecipe(isEditingRecipe, recipe);
      return;
    }
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
    };
    setRecipes([...recipes, newRecipe]);
    setIsEditingRecipe(null);
  };

  const deleteRecipe = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    setDeleteConfirmation({
      isOpen: true,
      type: 'recipe',
      id,
      name: recipe?.name || 'Recipe'
    });
  };

  const updateFutureRecipe = (id: string, updatedData: Omit<Recipe, 'id'>) => {
    setFutureRecipes(futureRecipes.map(r => r.id === id ? { ...updatedData, id } : r));
    setIsEditingFutureRecipe(null);
    setSelectedFutureRecipeId(id);
  };

  const addFutureRecipe = (recipe: Omit<Recipe, 'id'>) => {
    if (isEditingFutureRecipe && isEditingFutureRecipe !== 'new') {
      updateFutureRecipe(isEditingFutureRecipe, recipe);
      return;
    }
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
    };
    setFutureRecipes([...futureRecipes, newRecipe]);
    setIsEditingFutureRecipe(null);
  };

  const deleteFutureRecipe = (id: string) => {
    const recipe = futureRecipes.find(r => r.id === id);
    setDeleteConfirmation({
      isOpen: true,
      type: 'futureRecipe',
      id,
      name: recipe?.name || 'Future Recipe'
    });
  };

  const calculateRecipeCost = (recipe: Recipe) => {
    return recipe.ingredients.reduce((total, ri) => {
      const ingredient = ingredients.find(i => i.id === ri.ingredientId);
      if (!ingredient) return total;
      
      // Simple unit matching for now. 
      // In a real app we'd handle conversions (g to kg etc)
      // For this demo, we assume the user picks the unit they bought it in.
      return total + (ingredient.pricePerUnit * ri.amount);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-brand-light transition-colors duration-300">
      {/* Sidebar / Nav */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <nav className="w-full md:w-64 bg-card border-r border-line p-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Baker's</h1>
              <p className="text-xs text-ink-muted uppercase tracking-widest font-semibold">Executive</p>
              <p className="text-[10px] text-brand-dark mt-1 font-bold animate-pulse">Backup Information Regularly</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setIsEditingRecipe(null); setIsEditingFutureRecipe(null); }}
              icon={<LayoutDashboard size={20} />}
              label="Overview"
            />
            <NavButton 
              active={activeTab === 'ingredients'} 
              onClick={() => { setActiveTab('ingredients'); setIsEditingRecipe(null); setIsEditingFutureRecipe(null); }}
              icon={<Package size={20} />}
              label="Ingredients"
            />
            <NavButton 
              active={activeTab === 'recipes'} 
              onClick={() => { setActiveTab('recipes'); setIsEditingRecipe(null); setIsEditingFutureRecipe(null); }}
              icon={<Utensils size={20} />}
              label="Recipes"
            />
            <NavButton 
              active={activeTab === 'future-recipes'} 
              onClick={() => { setActiveTab('future-recipes'); setIsEditingRecipe(null); setIsEditingFutureRecipe(null); }}
              icon={<ChefHat size={20} />}
              label="Future Recipes"
            />
          </div>

          <div className="mt-auto p-4 bg-bg rounded-2xl border border-line">
            <p className="text-xs text-ink-muted mb-1">Total Ingredients</p>
            <p className="text-xl font-bold">{ingredients.length}</p>
            <div className="h-px bg-line my-3" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-ink-muted uppercase font-bold mb-1">Active</p>
                <p className="text-lg font-bold">{recipes.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted uppercase font-bold mb-1">Future</p>
                <p className="text-lg font-bold">{futureRecipes.length}</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header>
                  <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                  <p className="text-ink-muted mt-1">Quick look at your bakery's performance.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    label="Most Expensive Recipe" 
                    value={recipes.length > 0 ? recipes.reduce((prev, current) => (calculateRecipeCost(prev) > calculateRecipeCost(current)) ? prev : current).name : 'N/A'}
                    subValue={recipes.length > 0 ? `$${calculateRecipeCost(recipes.reduce((prev, current) => (calculateRecipeCost(prev) > calculateRecipeCost(current)) ? prev : current)).toFixed(2)}` : ''}
                  />
                  <StatCard 
                    label="Avg. Cost per Item" 
                    value={recipes.length > 0 ? `$${(recipes.reduce((acc, r) => acc + (calculateRecipeCost(r) / r.yield), 0) / recipes.length).toFixed(2)}` : '$0.00'}
                  />
                  <StatCard 
                    label="Ingredient Count" 
                    value={ingredients.length.toString()}
                  />
                </div>

                <div className="bg-card rounded-3xl border border-line p-8 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-ink">Recent Recipes</h3>
                  <div className="space-y-4">
                    {recipes.slice(0, 5).map(recipe => (
                      <div key={recipe.id} className="flex items-center justify-between p-4 rounded-2xl bg-bg border border-line">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm border border-line">
                            <Utensils size={20} className="text-brand" />
                          </div>
                          <div>
                            <p className="font-bold text-ink">{recipe.name}</p>
                            <p className="text-xs text-ink-muted">Yields {recipe.yield} units</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand">${(calculateRecipeCost(recipe) / recipe.yield).toFixed(2)}</p>
                          <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">Per Unit</p>
                        </div>
                      </div>
                    ))}
                    {recipes.length === 0 && <p className="text-ink-muted text-center py-8 italic">No recipes created yet.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div 
                key="ingredients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ingredients Inventory</h2>
                    <p className="text-ink-muted mt-1">Manage your raw materials and their costs.</p>
                  </div>
                  <IngredientForm 
                    onAdd={addIngredient} 
                    onUpdate={updateIngredient}
                    editingIngredient={ingredients.find(i => i.id === editingIngredientId)}
                    onCancelEdit={() => setEditingIngredientId(null)}
                  />
                </header>

                <div className="bg-card rounded-3xl border border-line overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg border-bottom border-line">
                        <th className="p-4 pl-8 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Ingredient</th>
                        <th className="p-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Purchase Price</th>
                        <th className="p-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Quantity</th>
                        <th className="p-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Unit Cost</th>
                        <th className="p-4 pr-8 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map(ing => (
                        <tr key={ing.id} className="border-b border-line hover:bg-bg/50 transition-colors">
                          <td className="p-4 pl-8 font-bold text-ink">{ing.name}</td>
                          <td className="p-4 text-ink-muted">${ing.purchasePrice.toFixed(2)}</td>
                          <td className="p-4 text-ink-muted">{ing.purchaseQuantity} {ing.purchaseUnit}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold">
                              ${ing.pricePerUnit.toFixed(4)} / {ing.purchaseUnit}
                            </span>
                          </td>
                          <td className="p-4 pr-8 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingIngredientId(ing.id)}
                                className="p-2 text-ink-muted hover:text-brand transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => deleteIngredient(ing.id)}
                                className="p-2 text-ink-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {ingredients.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-ink-muted italic">
                            No ingredients added yet. Start by adding your first item.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'recipes' && (
              <motion.div 
                key="recipes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {selectedRecipeId && !isEditingRecipe ? (
                  <RecipeDetails 
                    recipe={recipes.find(r => r.id === selectedRecipeId)!}
                    ingredients={ingredients}
                    calculateRecipeCost={calculateRecipeCost}
                    onBack={() => setSelectedRecipeId(null)}
                    onEdit={() => setIsEditingRecipe(selectedRecipeId)}
                    onDelete={deleteRecipe}
                  />
                ) : !isEditingRecipe ? (
                  <>
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight">Recipe Book</h2>
                        <p className="text-ink-muted mt-1">Create and analyze your product costs.</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingRecipe('new')}
                        className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-95"
                      >
                        <Plus size={20} />
                        New Recipe
                      </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recipes.map(recipe => {
                        const totalCost = calculateRecipeCost(recipe);
                        const costPerUnit = totalCost / recipe.yield;
                        return (
                          <div 
                            key={recipe.id} 
                            onClick={() => setSelectedRecipeId(recipe.id)}
                            className="bg-card rounded-3xl border border-line p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                                  <Utensils size={28} />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-ink">{recipe.name}</h3>
                                  <p className="text-sm text-ink-muted">Yields {recipe.yield} units</p>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                                className="p-2 text-ink-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="p-4 bg-bg rounded-2xl border border-line">
                                <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">Total Batch Cost</p>
                                <p className="text-2xl font-bold text-ink">${totalCost.toFixed(2)}</p>
                              </div>
                              <div className="p-4 bg-brand/10 rounded-2xl border border-brand/20">
                                <p className="text-[10px] uppercase tracking-wider text-brand font-bold mb-1">Cost Per Unit</p>
                                <p className="text-2xl font-bold text-brand">${costPerUnit.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold px-1">Ingredients Breakdown</p>
                              {recipe.ingredients.slice(0, 3).map((ri, idx) => {
                                const ing = ingredients.find(i => i.id === ri.ingredientId);
                                return (
                                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-line last:border-0">
                                    <span className="text-ink">{ri.amount} {ri.unit} {ing?.name || 'Unknown'}</span>
                                    <span className="font-medium text-ink">${(ri.amount * (ing?.pricePerUnit || 0)).toFixed(2)}</span>
                                  </div>
                                );
                              })}
                              {recipe.ingredients.length > 3 && (
                                <p className="text-xs text-ink-muted italic">+{recipe.ingredients.length - 3} more ingredients</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {recipes.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-card rounded-3xl border border-dashed border-line">
                          <Utensils size={48} className="mx-auto text-ink-muted mb-4" />
                          <p className="text-ink-muted italic">Your recipe book is empty. Create your first recipe to see the cost breakdown.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <RecipeEditor 
                    ingredients={ingredients} 
                    onSave={addRecipe} 
                    onCancel={() => setIsEditingRecipe(null)} 
                    recipe={isEditingRecipe !== 'new' ? recipes.find(r => r.id === isEditingRecipe) : undefined}
                  />
                )}
              </motion.div>
            )}
            {activeTab === 'future-recipes' && (
              <motion.div 
                key="future-recipes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {selectedFutureRecipeId && !isEditingFutureRecipe ? (
                  <RecipeDetails 
                    recipe={futureRecipes.find(r => r.id === selectedFutureRecipeId)!}
                    ingredients={ingredients}
                    calculateRecipeCost={calculateRecipeCost}
                    onBack={() => setSelectedFutureRecipeId(null)}
                    onEdit={() => setIsEditingFutureRecipe(selectedFutureRecipeId)}
                    onDelete={deleteFutureRecipe}
                  />
                ) : !isEditingFutureRecipe ? (
                  <>
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight">Future Recipes</h2>
                        <p className="text-ink-muted mt-1">Experimental recipes for future menu items.</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingFutureRecipe('new')}
                        className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-95"
                      >
                        <Plus size={20} />
                        New Future Recipe
                      </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {futureRecipes.map(recipe => {
                        const totalCost = calculateRecipeCost(recipe);
                        const costPerUnit = totalCost / recipe.yield;
                        return (
                          <div 
                            key={recipe.id} 
                            onClick={() => setSelectedFutureRecipeId(recipe.id)}
                            className="bg-card rounded-3xl border border-line p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-bg rounded-2xl flex items-center justify-center text-ink-muted">
                                  <ChefHat size={28} />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-ink">{recipe.name}</h3>
                                  <p className="text-sm text-ink-muted">Yields {recipe.yield} units</p>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteFutureRecipe(recipe.id); }}
                                className="p-2 text-ink-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="p-4 bg-bg rounded-2xl border border-line">
                                <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">Est. Batch Cost</p>
                                <p className="text-2xl font-bold text-ink">${totalCost.toFixed(2)}</p>
                              </div>
                              <div className="p-4 bg-bg rounded-2xl border border-line">
                                <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">Est. Cost Per Unit</p>
                                <p className="text-2xl font-bold text-ink">${costPerUnit.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold px-1">Ingredients Breakdown</p>
                              {recipe.ingredients.slice(0, 3).map((ri, idx) => {
                                const ing = ingredients.find(i => i.id === ri.ingredientId);
                                return (
                                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-line last:border-0">
                                    <span className="text-ink">{ri.amount} {ri.unit} {ing?.name || 'Unknown'}</span>
                                    <span className="font-medium text-ink">${(ri.amount * (ing?.pricePerUnit || 0)).toFixed(2)}</span>
                                  </div>
                                );
                              })}
                              {recipe.ingredients.length > 3 && (
                                <p className="text-xs text-ink-muted italic">+{recipe.ingredients.length - 3} more ingredients</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {futureRecipes.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-card rounded-3xl border border-dashed border-line">
                          <ChefHat size={48} className="mx-auto text-ink-muted mb-4" />
                          <p className="text-ink-muted italic">No future recipes yet. Start experimenting with new ideas!</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <RecipeEditor 
                    ingredients={ingredients} 
                    onSave={addFutureRecipe} 
                    onCancel={() => setIsEditingFutureRecipe(null)} 
                    recipe={isEditingFutureRecipe !== 'new' ? futureRecipes.find(r => r.id === isEditingFutureRecipe) : undefined}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-8 left-8 flex items-center gap-2 bg-card text-ink border border-line px-6 py-4 rounded-2xl font-bold shadow-2xl hover:bg-bg transition-all active:scale-95 z-40"
      >
        <Settings size={20} className="text-ink-muted" />
        <span>Settings</span>
      </button>

      {/* Floating Notes Button */}
      <button
        onClick={() => setIsNotesOpen(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2 bg-card text-ink border border-line px-6 py-4 rounded-2xl font-bold shadow-2xl hover:bg-bg transition-all active:scale-95 z-40"
      >
        <StickyNote size={20} className="text-brand" />
        <span>Notes 📝</span>
      </button>

      {/* Notes Popup */}
      <AnimatePresence>
        {isNotesOpen && (
          <NotesPopup
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            onClose={() => setIsNotesOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Settings Popup */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsPopup
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isSakuraMode={isSakuraMode}
            setIsSakuraMode={setIsSakuraMode}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <ConfirmationModal
            title={`Delete ${deleteConfirmation.type === 'note' ? 'Note' : deleteConfirmation.type === 'ingredient' ? 'Ingredient' : 'Recipe'}`}
            message={`Are you sure you want to delete "${deleteConfirmation.name}"? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
        active 
          ? 'bg-brand-light text-brand shadow-sm' 
          : 'text-ink-muted hover:text-ink hover:bg-bg'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />}
    </button>
  );
}

function StatCard({ label, value, subValue }: { label: string, value: string, subValue?: string }) {
  return (
    <div className="bg-card p-6 rounded-3xl border border-line shadow-sm">
      <p className="text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-2">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-ink">{value}</p>
      {subValue && <p className="text-sm text-brand font-bold mt-1">{subValue}</p>}
    </div>
  );
}

function NotesPopup({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote, 
  onClose 
}: {
  notes: Note[],
  selectedNoteId: string | null,
  onSelectNote: (id: string) => void,
  onAddNote: () => void,
  onUpdateNote: (id: string, updates: Partial<Note>) => void,
  onDeleteNote: (id: string) => void,
  onClose: () => void
}) {
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-4xl h-[600px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-line flex justify-between items-center bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
              <StickyNote size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-ink">Baker's Notebook</h2>
              <p className="text-xs text-ink-muted">Keep track of ideas and observations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg rounded-xl transition-colors text-ink-muted"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-line flex flex-col bg-bg/30">
            <div className="p-4">
              <button
                onClick={onAddNote}
                className="w-full flex items-center justify-center gap-2 bg-card border border-line py-3 rounded-xl font-bold text-sm hover:border-brand/20 hover:text-brand transition-all shadow-sm active:scale-95 text-ink"
              >
                <Plus size={16} />
                New Note
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all group ${
                    selectedNoteId === note.id
                      ? 'bg-brand/10 text-brand shadow-sm'
                      : 'hover:bg-bg text-ink'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className={selectedNoteId === note.id ? 'text-brand' : 'text-ink-muted'} />
                    <span className="font-bold text-sm truncate">{note.title || 'Untitled Note'}</span>
                  </div>
                  <p className="text-[10px] opacity-60 truncate text-ink-muted">
                    {note.content.substring(0, 40) || 'No content...'}
                  </p>
                </button>
              ))}
              {notes.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-xs text-ink-muted italic">No notes yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col bg-card">
            {selectedNote ? (
              <div className="flex-1 flex flex-col p-8">
                <div className="flex justify-between items-start mb-6">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => onUpdateNote(selectedNote.id, { title: e.target.value })}
                    placeholder="Note Title"
                    className="text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-ink-muted/30 text-ink"
                  />
                  <button
                    onClick={() => onDeleteNote(selectedNote.id)}
                    className="p-2 text-ink-muted hover:text-red-500 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => onUpdateNote(selectedNote.id, { content: e.target.value })}
                  placeholder="Start writing your thoughts here..."
                  className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 resize-none text-ink leading-relaxed placeholder:text-ink-muted/30"
                />
                <div className="mt-4 pt-4 border-t border-line flex justify-between items-center text-[10px] text-ink-muted font-medium uppercase tracking-widest">
                  <span>Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}</span>
                  <span>{selectedNote.content.length} characters</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-ink-muted p-12 text-center">
                <StickyNote size={64} className="mb-4 opacity-20" />
                <p className="font-medium">Select a note to view or edit</p>
                <p className="text-sm mt-1 opacity-60">Your ideas are safe here.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingsPopup({ 
  isDarkMode, 
  setIsDarkMode, 
  isSakuraMode, 
  setIsSakuraMode, 
  onClose 
}: {
  isDarkMode: boolean,
  setIsDarkMode: (v: boolean) => void,
  isSakuraMode: boolean,
  setIsSakuraMode: (v: boolean) => void,
  onClose: () => void
}) {
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This will delete all your custom ingredients, recipes, and notes.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExport = () => {
    if (!confirm('Are you sure you want to export all your data as a JSON file?')) return;

    const data = {
      baker_ingredients: localStorage.getItem('baker_ingredients'),
      baker_recipes: localStorage.getItem('baker_recipes'),
      baker_future_recipes: localStorage.getItem('baker_future_recipes'),
      baker_notes: localStorage.getItem('baker_notes'),
      baker_dark_mode: localStorage.getItem('baker_dark_mode'),
      baker_sakura_mode: localStorage.getItem('baker_sakura_mode'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bakers_executive_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to upload this backup? Uploading will remove the sites current data and replace it with the backup content.')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation
        const keys = ['baker_ingredients', 'baker_recipes', 'baker_future_recipes', 'baker_notes'];
        const hasRequiredKeys = keys.some(key => data[key] !== undefined);

        if (!hasRequiredKeys) {
          alert('Invalid backup file. Could not find bakery data.');
          return;
        }

        // Restore data
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith('baker_') && value !== null) {
            localStorage.setItem(key, value as string);
          }
        });

        alert('Data restored successfully! The application will now reload.');
        window.location.reload();
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-line flex justify-between items-center bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Settings</h2>
              <p className="text-xs text-ink-muted">Customize your experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg rounded-xl transition-colors text-ink-muted"
          >
            <X size={24} />
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-line">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-brand text-bg' : 'bg-bg text-ink-muted border border-line'}`}>
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <p className="font-bold text-sm text-ink">Dark Mode</p>
                <p className="text-[10px] text-ink-muted">Easier on the eyes at night</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-brand' : 'bg-line'}`}
            >
              <motion.div 
                animate={{ x: isDarkMode ? 24 : 4 }}
                className="absolute top-1 left-0 w-4 h-4 bg-card rounded-full shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-line">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isSakuraMode ? 'bg-brand text-bg' : 'bg-bg text-ink-muted border border-line'}`}>
                <Flower size={18} />
              </div>
              <div>
                <p className="font-bold text-sm text-ink">Sakura Mode</p>
                <p className="text-[10px] text-ink-muted">Pink and cute aesthetic</p>
              </div>
            </div>
            <button
              onClick={() => setIsSakuraMode(!isSakuraMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isSakuraMode ? 'bg-brand' : 'bg-line'}`}
            >
              <motion.div 
                animate={{ x: isSakuraMode ? 24 : 4 }}
                className="absolute top-1 left-0 w-4 h-4 bg-card rounded-full shadow-sm"
              />
            </button>
          </div>

          {(isDarkMode && isSakuraMode) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-brand/5 border border-brand/20 rounded-2xl text-center"
            >
              <p className="text-xs font-bold text-brand">✨ Dark Sakura Mode Active ✨</p>
              <p className="text-[10px] text-ink-muted mt-1">The perfect blend of mystery and cuteness.</p>
            </motion.div>
          )}

          <div className="space-y-3 pt-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-ink-muted px-1">Data Management</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-3 bg-bg border border-line rounded-2xl hover:bg-brand/5 hover:border-brand/30 transition-all group"
              >
                <Download size={16} className="text-ink-muted group-hover:text-brand" />
                <span className="text-xs font-bold">Export JSON</span>
              </button>
              
              <label className="flex items-center justify-center gap-2 p-3 bg-bg border border-line rounded-2xl hover:bg-brand/5 hover:border-brand/30 transition-all group cursor-pointer">
                <Upload size={16} className="text-ink-muted group-hover:text-brand" />
                <span className="text-xs font-bold">Upload JSON</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport} 
                  className="hidden" 
                />
              </label>
            </div>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-2xl hover:bg-red-500/10 hover:border-red-500/40 transition-all group"
            >
              <Trash2 size={16} className="text-red-500/60 group-hover:text-red-500" />
              <span className="text-xs font-bold text-red-500/80 group-hover:text-red-500">Reset All App Data</span>
            </button>
            <p className="text-[10px] text-ink-muted text-center mt-2">Uploading will remove the sites current data.</p>
          </div>
        </div>

        <footer className="p-6 bg-bg/30 border-t border-line text-center">
          <p className="text-[10px] text-ink-muted uppercase tracking-widest font-bold">Baker's Executive v1.0</p>
        </footer>
      </motion.div>
    </motion.div>
  );
}

function ConfirmationModal({ 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: { 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-ink">{title}</h2>
        <p className="text-ink-muted text-sm mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
          >
            Yes, Delete it
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-bg text-ink-muted py-4 rounded-2xl font-bold hover:bg-line transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IngredientForm({ onAdd, onUpdate, editingIngredient, onCancelEdit }: { 
  onAdd: (ing: Omit<Ingredient, 'id' | 'pricePerUnit'>) => void,
  onUpdate: (id: string, ing: Omit<Ingredient, 'id' | 'pricePerUnit'>) => void,
  editingIngredient?: Ingredient,
  onCancelEdit: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState<Unit>('g');

  useEffect(() => {
    if (editingIngredient) {
      setName(editingIngredient.name);
      setPrice(editingIngredient.purchasePrice.toString());
      setQty(editingIngredient.purchaseQuantity.toString());
      setUnit(editingIngredient.purchaseUnit);
      setIsOpen(true);
    }
  }, [editingIngredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !qty) return;
    
    const data = {
      name,
      purchasePrice: parseFloat(price),
      purchaseQuantity: parseFloat(qty),
      purchaseUnit: unit,
    };

    if (editingIngredient) {
      onUpdate(editingIngredient.id, data);
    } else {
      onAdd(data);
    }
    
    reset();
  };

  const reset = () => {
    setName('');
    setPrice('');
    setQty('');
    setUnit('g');
    setIsOpen(false);
    onCancelEdit();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-95"
      >
        <Plus size={20} />
        Add Ingredient
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={reset}
              className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-4 w-80 bg-card rounded-3xl shadow-2xl border border-line p-6 z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-ink">{editingIngredient ? 'Edit Ingredient' : 'New Ingredient'}</h3>
                <button onClick={reset} className="p-1 hover:bg-bg rounded-full transition-colors">
                  <X size={20} className="text-ink-muted" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                    placeholder="e.g. Flour"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Quantity</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={qty}
                      onChange={e => setQty(e.target.value)}
                      className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                      placeholder="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Unit</label>
                  <select 
                    value={unit}
                    onChange={e => setUnit(e.target.value as Unit)}
                    className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink"
                  >
                    {Object.entries(UNIT_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-3 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all"
                >
                  {editingIngredient ? 'Update Ingredient' : 'Save Ingredient'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeDetails({ recipe, ingredients, calculateRecipeCost, onBack, onEdit, onDelete }: { 
  recipe: Recipe, 
  ingredients: Ingredient[], 
  calculateRecipeCost: (r: Recipe) => number,
  onBack: () => void,
  onEdit: () => void,
  onDelete: (id: string) => void
}) {
  const totalCost = calculateRecipeCost(recipe);
  const costPerUnit = totalCost / recipe.yield;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-bg rounded-xl transition-colors text-ink">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink">{recipe.name}</h2>
            <p className="text-ink-muted mt-1">Detailed cost and ingredient breakdown.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onEdit()}
            className="flex items-center gap-2 px-6 py-3 bg-bg text-ink rounded-2xl font-bold hover:bg-line transition-all border border-line"
          >
            <Edit2 size={18} />
            Edit Recipe
          </button>
          <button 
            onClick={() => { onDelete(recipe.id); onBack(); }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-3xl border border-line p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-ink">Ingredients List</h3>
            <div className="space-y-4">
              {recipe.ingredients.map((ri, idx) => {
                const ing = ingredients.find(i => i.id === ri.ingredientId);
                const cost = ri.amount * (ing?.pricePerUnit || 0);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-bg border border-line">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-line shadow-sm">
                        <Package size={18} className="text-ink-muted" />
                      </div>
                      <div>
                        <p className="font-bold text-ink">{ing?.name || 'Unknown Ingredient'}</p>
                        <p className="text-xs text-ink-muted">{ri.amount} {ri.unit} @ ${ing?.pricePerUnit.toFixed(4)}/{ri.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ink">${cost.toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">Total Cost</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-3xl border border-line p-8 shadow-sm sticky top-6">
            <h3 className="text-xl font-bold mb-6 text-ink">Recipe Economics</h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-brand/10 rounded-2xl border border-brand/20">
                <p className="text-[11px] uppercase tracking-widest font-bold text-brand mb-2">Cost Per Unit</p>
                <p className="text-4xl font-bold text-brand tracking-tight">${costPerUnit.toFixed(2)}</p>
                <p className="text-xs text-brand font-medium mt-2">Based on {recipe.yield} units</p>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-sm font-medium">Batch Yield</span>
                  <span className="font-bold text-ink">{recipe.yield} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-sm font-medium">Total Batch Cost</span>
                  <span className="font-bold text-ink">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-sm font-medium">Ingredients Count</span>
                  <span className="font-bold text-ink">{recipe.ingredients.length}</span>
                </div>
              </div>

              <div className="h-px bg-line my-2" />

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-ink-muted px-2">Pricing Suggestion (30% Margin)</p>
                <div className="p-4 bg-bg rounded-2xl border border-line">
                  <p className="text-2xl font-bold text-ink">${(costPerUnit / 0.7).toFixed(2)}</p>
                  <p className="text-xs text-ink-muted">Suggested Retail Price</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecipeEditor({ 
  ingredients, 
  onSave, 
  onCancel,
  recipe 
}: { 
  ingredients: Ingredient[], 
  onSave: (r: Omit<Recipe, 'id'>) => void, 
  onCancel: () => void,
  recipe?: Recipe
}) {
  const [name, setName] = useState(recipe?.name || '');
  const [yieldAmount, setYieldAmount] = useState(recipe?.yield.toString() || '12');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    recipe?.ingredients || [{ ingredientId: '', amount: 0, unit: 'g' }]
  );

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setYieldAmount(recipe.yield.toString());
      setRecipeIngredients(recipe.ingredients);
    }
  }, [recipe]);

  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: '', amount: 0, unit: 'g' }]);
  };

  const removeIngredientRow = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const updateIngredientRow = (index: number, field: keyof RecipeIngredient, value: any) => {
    const newRows = [...recipeIngredients];
    newRows[index] = { ...newRows[index], [field]: value };
    
    // Auto-update unit to match ingredient's purchase unit for simplicity
    if (field === 'ingredientId') {
      const ing = ingredients.find(i => i.id === value);
      if (ing) {
        newRows[index].unit = ing.purchaseUnit;
      }
    }
    
    setRecipeIngredients(newRows);
  };

  const totalCost = useMemo(() => {
    return recipeIngredients.reduce((total, ri) => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (!ing) return total;
      return total + (ing.pricePerUnit * ri.amount);
    }, 0);
  }, [recipeIngredients, ingredients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || recipeIngredients.some(ri => !ri.ingredientId)) return;
    onSave({
      name,
      yield: parseInt(yieldAmount),
      ingredients: recipeIngredients,
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-bg rounded-xl transition-colors text-ink">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <p className="text-ink-muted mt-1">
            {recipe ? 'Update your ingredients and costs.' : 'Define your ingredients and calculate costs.'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-3xl border border-line p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Recipe Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-bg border border-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                  placeholder="e.g. Signature Cinnamon Rolls"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Yield (How many items?)</label>
                <input 
                  type="number" 
                  value={yieldAmount}
                  onChange={e => setYieldAmount(e.target.value)}
                  className="w-full bg-bg border border-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                  placeholder="12"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-ink">Ingredients</h3>
                <button 
                  type="button"
                  onClick={addIngredientRow}
                  className="text-brand font-bold text-sm flex items-center gap-1 hover:text-brand-hover"
                >
                  <Plus size={16} /> Add Row
                </button>
              </div>

              <div className="space-y-3">
                {recipeIngredients.map((ri, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Ingredient</label>
                      <select 
                        value={ri.ingredientId}
                        onChange={e => updateIngredientRow(index, 'ingredientId', e.target.value)}
                        className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink"
                      >
                        <option value="">Select Ingredient</option>
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Amount</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={ri.amount}
                        onChange={e => updateIngredientRow(index, 'amount', parseFloat(e.target.value))}
                        className="w-full bg-bg border border-line rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-ink placeholder:text-ink-muted/30"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">Unit</label>
                      <div className="w-full bg-bg border border-line rounded-xl px-4 py-2 text-ink-muted text-sm font-medium">
                        {ri.unit}
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeIngredientRow(index)}
                      className="p-2 text-ink-muted hover:text-red-500 transition-colors mb-0.5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-3xl border border-line p-8 shadow-sm sticky top-6">
            <h3 className="text-xl font-bold mb-6 text-ink">Cost Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">Total Batch Cost</span>
                <span className="text-xl font-bold text-ink">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">Yield</span>
                <span className="text-xl font-bold text-ink">{yieldAmount} units</span>
              </div>
              <div className="h-px bg-line my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-ink">Cost Per Unit</span>
                <span className="text-2xl font-bold text-brand">
                  ${(totalCost / (parseInt(yieldAmount) || 1)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleSubmit}
                className="w-full bg-brand text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Recipe
              </button>
              <button 
                onClick={onCancel}
                className="w-full bg-bg text-ink-muted py-4 rounded-2xl font-bold hover:bg-line transition-all border border-line"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
