import { useState, useEffect } from 'react'
import { Dumbbell, ChefHat, Activity, User, Settings, ArrowRight, LogOut, Lock, Crown, ShoppingBag, Check, X, Eye, EyeOff } from 'lucide-react'

// Types
interface AuthUser {
  email: string
  username: string
  password: string
  isPremium: boolean
  isAdmin: boolean
  profile: UserProfile
}

interface UserProfile {
  name: string
  age: number
  gender: string
  weight: number
  height: number
  goal: string
  fitnessLevel: string
  workoutDays: number
  sessionDuration: number
  injuries: string[]
}

// Admin credentials (hardcoded - not stored in localStorage)
const ADMIN_CREDENTIALS = {
  email: 'michael.j.reed218@gmail.com',
  password: '$@BIne1988',
  username: 'Quickfit_admin'
}

// Supplement Database with Amazon affiliate links (replace YOUR_AFFILIATE_ID with actual affiliate tag)
const supplements: Record<string, { name: string; description: string; benefit: string; price: string; link: string; badge?: string }[]> = {
  'weight-loss': [
    { name: 'Green Tea Extract 500mg', description: 'Natural fat burner with EGCG antioxidants', benefit: 'Boosts metabolism & fat oxidation', price: '$14.99', link: 'https://www.amazon.com/dp/B00BSN8T5G?tag=YOUR_AFFILIATE_ID-20', badge: 'Best Seller' },
    { name: 'L-Carnitine 1000mg', description: 'Amino acid that helps convert fat into energy', benefit: 'Enhances fat metabolism during workouts', price: '$12.49', link: 'https://www.amazon.com/dp/B00E6MQW1K?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Conjugated Linoleic Acid (CLA)', description: 'Naturally occurring fatty acid for fat loss', benefit: 'Reduces body fat percentage', price: '$16.99', link: 'https://www.amazon.com/dp/B0018K5Q8C?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Apple Cider Vinegar Capsules', description: '500mg with Mother for metabolic support', benefit: 'Supports digestion & blood sugar control', price: '$11.99', link: 'https://www.amazon.com/dp/B07XRXCDGR?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Garcinia Cambogia Extract', description: 'Hydroxycitric acid (HCA) for appetite control', benefit: 'May reduce hunger & block fat production', price: '$13.99', link: 'https://www.amazon.com/dp/B00BPGTP8K?tag=YOUR_AFFILIATE_ID-20' },
  ],
  'muscle-building': [
    { name: 'Whey Protein Isolate 5lbs', description: '25g protein per serving, fast-absorbing', benefit: 'Post-workout muscle recovery & growth', price: '$49.99', link: 'https://www.amazon.com/dp/B00JSQ4X1K?tag=YOUR_AFFILIATE_ID-20', badge: 'Best Value' },
    { name: 'Creatine Monohydrate 5lbs', description: '5g pure creatine per serving, unflavored', benefit: 'Increases strength & muscle volume', price: '$24.99', link: 'https://www.amazon.com/dp/B002DY6E8K?tag=YOUR_AFFILIATE_ID-20', badge: 'Lab Tested' },
    { name: 'BCAA 2:1:1 Ratio 300g', description: 'Branched-chain amino acids for recovery', benefit: 'Reduces muscle soreness & supports growth', price: '$19.99', link: 'https://www.amazon.com/dp/B00DN66DQA?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Pre-Workout Nitric Oxide Booster', description: 'Citrulline malate & beta-alanine formula', benefit: 'Enhanced blood flow & energy for lifts', price: '$29.99', link: 'https://www.amazon.com/dp/B002DGVUIY?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Casein Protein 2lbs', description: 'Slow-digesting protein for overnight recovery', benefit: 'Continuous muscle repair while you sleep', price: '$34.99', link: 'https://www.amazon.com/dp/B0015QQO8K?tag=YOUR_AFFILIATE_ID-20' },
  ],
  'general-health': [
    { name: 'Multivitamin Complete', description: '23 essential vitamins & minerals', benefit: 'Fills nutritional gaps in your diet', price: '$18.99', link: 'https://www.amazon.com/dp/B0019QDJGA?tag=YOUR_AFFILIATE_ID-20', badge: 'Doctor Recommended' },
    { name: 'Omega-3 Fish Oil 1800mg', description: 'EPA & DHA for heart & brain health', benefit: 'Anti-inflammatory & cognitive support', price: '$16.49', link: 'https://www.amazon.com/dp/B00BPGTIKQ?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Vitamin D3 5000 IU', description: 'Colecalciferol for bone & immune health', benefit: 'Supports testosterone & mood', price: '$9.99', link: 'https://www.amazon.com/dp/B00DN66F8K?tag=YOUR_AFFILIATE_ID-20', badge: 'Essential' },
    { name: 'Magnesium Glycinate', description: 'Highly absorbable form of magnesium', benefit: 'Better sleep, recovery & muscle function', price: '$14.99', link: 'https://www.amazon.com/dp/B00BSN8T5G?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Probiotics 50 Billion CFU', description: '10 probiotic strains for gut health', benefit: 'Improved digestion & immune function', price: '$21.99', link: 'https://www.amazon.com/dp/B00E8O3DNI?tag=YOUR_AFFILIATE_ID-20' },
  ],
  'flexibility': [
    { name: 'Collagen Peptides Powder', description: 'Type I & III collagen for connective tissue', benefit: 'Supports joints, tendons & flexibility', price: '$26.99', link: 'https://www.amazon.com/dp/B06WVK6D6X?tag=YOUR_AFFILIATE_ID-20', badge: 'Joint Health' },
    { name: 'Ashwagandha KSM-66', description: 'Adaptogenic herb for stress & recovery', benefit: 'Reduces cortisol, improves mobility', price: '$22.99', link: 'https://www.amazon.com/dp/B00NUGZ3H6?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Turmeric Curcumin 2000mg', description: 'High-absorption with black pepper extract', benefit: 'Natural anti-inflammatory for sore muscles', price: '$17.99', link: 'https://www.amazon.com/dp/B00BNEKN8C?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Glucosamine & Chondroitin', description: 'Joint lubricant & cartilage support', benefit: 'Maintains joint mobility & comfort', price: '$19.99', link: 'https://www.amazon.com/dp/B000BWQ5NY?tag=YOUR_AFFILIATE_ID-20' },
    { name: 'Magnesium Oil Spray', description: 'Topical magnesium for muscle relaxation', benefit: 'Direct relief for tight muscles & cramps', price: '$12.99', link: 'https://www.amazon.com/dp/B01N4HVZME?tag=YOUR_AFFILIATE_ID-20' },
  ]
}

// Exercise Database
const exercises: Record<string, any> = {
  'push-ups': { name: 'Push-ups', category: 'strength', difficulty: 'beginner', targetMuscles: ['chest', 'shoulders', 'triceps'], caloriesPerMinute: 8 },
  'bodyweight-squats': { name: 'Bodyweight Squats', category: 'strength', difficulty: 'beginner', targetMuscles: ['quadriceps', 'glutes'], caloriesPerMinute: 6 },
  'plank': { name: 'Plank', category: 'strength', difficulty: 'beginner', targetMuscles: ['core'], caloriesPerMinute: 5 },
  'lunges': { name: 'Lunges', category: 'strength', difficulty: 'intermediate', targetMuscles: ['quadriceps', 'glutes'], caloriesPerMinute: 7 },
  'jumping-jacks': { name: 'Jumping Jacks', category: 'cardio', difficulty: 'beginner', targetMuscles: ['full body'], caloriesPerMinute: 10 },
  'mountain-climbers': { name: 'Mountain Climbers', category: 'cardio', difficulty: 'intermediate', targetMuscles: ['core', 'legs'], caloriesPerMinute: 12 },
  'burpees': { name: 'Burpees', category: 'cardio', difficulty: 'advanced', targetMuscles: ['full body'], caloriesPerMinute: 15 },
  'high-knees': { name: 'High Knees', category: 'cardio', difficulty: 'beginner', targetMuscles: ['legs', 'core'], caloriesPerMinute: 11 },
  'glute-bridges': { name: 'Glute Bridges', category: 'strength', difficulty: 'beginner', targetMuscles: ['glutes', 'hamstrings'], caloriesPerMinute: 5 },
  'deadlifts': { name: 'Deadlifts', category: 'strength', difficulty: 'intermediate', targetMuscles: ['back', 'glutes', 'hamstrings'], caloriesPerMinute: 9 },
  'pull-ups': { name: 'Pull-ups', category: 'strength', difficulty: 'advanced', targetMuscles: ['back', 'biceps'], caloriesPerMinute: 8 },
  'dips': { name: 'Dips', category: 'strength', difficulty: 'intermediate', targetMuscles: ['triceps', 'chest'], caloriesPerMinute: 7 },
  'bicycle-crunches': { name: 'Bicycle Crunches', category: 'strength', difficulty: 'beginner', targetMuscles: ['core', 'obliques'], caloriesPerMinute: 6 },
  'box-jumps': { name: 'Box Jumps', category: 'cardio', difficulty: 'advanced', targetMuscles: ['legs', 'explosive power'], caloriesPerMinute: 14 },
  // Flexibility/Stretching Exercises
  'hamstring-stretch': { name: 'Standing Hamstring Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['hamstrings'], caloriesPerMinute: 3 },
  'quadriceps-stretch': { name: 'Standing Quadriceps Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['quadriceps'], caloriesPerMinute: 3 },
  'calf-stretch': { name: 'Wall Calf Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['calves'], caloriesPerMinute: 3 },
  'hip-flexor-stretch': { name: 'Hip Flexor Stretch (Lunging)', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['hip flexors'], caloriesPerMinute: 3 },
  'figure-four-stretch': { name: 'Figure Four Glute Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['glutes', 'piriformis'], caloriesPerMinute: 3 },
  'cat-cow-stretch': { name: 'Cat-Cow Spinal Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['spine', 'back'], caloriesPerMinute: 4 },
  'childs-pose': { name: "Child's Pose", category: 'flexibility', difficulty: 'beginner', targetMuscles: ['lower back', 'hips'], caloriesPerMinute: 3 },
  'seated-spinal-twist': { name: 'Seated Spinal Twist', category: 'flexibility', difficulty: 'intermediate', targetMuscles: ['spine', 'obliques'], caloriesPerMinute: 3 },
  'pigeon-pose': { name: 'Pigeon Pose', category: 'flexibility', difficulty: 'intermediate', targetMuscles: ['glutes', 'hip flexors'], caloriesPerMinute: 3 },
  'triceps-stretch': { name: 'Overhead Triceps Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['triceps'], caloriesPerMinute: 2 },
  'shoulder-cross-body': { name: 'Cross-Body Shoulder Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['shoulders'], caloriesPerMinute: 2 },
  'chest-doorway-stretch': { name: 'Doorway Chest Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['chest', 'shoulders'], caloriesPerMinute: 2 },
  'lat-stretch': { name: 'Lat Stretch (Doorway)', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['lats', 'back'], caloriesPerMinute: 3 },
  'butterfly-stretch': { name: 'Butterfly Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['inner thighs', 'groin'], caloriesPerMinute: 3 },
  'neck-stretch': { name: 'Neck Side Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['neck'], caloriesPerMinute: 2 },
  'wrist-flexor-stretch': { name: 'Wrist Flexor Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['forearms', 'wrists'], caloriesPerMinute: 2 },
  'downward-dog': { name: 'Downward Dog Stretch', category: 'flexibility', difficulty: 'intermediate', targetMuscles: ['hamstrings', 'calves', 'shoulders'], caloriesPerMinute: 4 },
  'cobra-stretch': { name: 'Cobra Stretch', category: 'flexibility', difficulty: 'beginner', targetMuscles: ['abdomen', 'spine'], caloriesPerMinute: 3 },
  'thread-needle-stretch': { name: 'Thread the Needle Stretch', category: 'flexibility', difficulty: 'intermediate', targetMuscles: ['upper back', 'shoulders'], caloriesPerMinute: 3 },
  '90-90-stretch': { name: '90/90 Hip Stretch', category: 'flexibility', difficulty: 'advanced', targetMuscles: ['hips', 'glutes'], caloriesPerMinute: 4 },
}

// Detailed Meal Database - 7 unique meals per category, no repetition
const meals: Record<string, Record<string, { name: string; calories: number; protein: number; carbs: number; fat: number; fiber: number; prepTime: number; ingredients: string[]; instructions: string }>> = {
  'weight-loss': {
    breakfast1: { name: 'Veggie Egg White Omelette with Feta', calories: 220, protein: 28, carbs: 8, fat: 10, fiber: 3, prepTime: 12, ingredients: ['6 egg whites', '1/4 cup spinach', '1/4 cup mushrooms', '2 tbsp feta cheese', '1/4 bell pepper diced', 'Salt & pepper to taste', 'Cooking spray'], instructions: 'Whisk egg whites with salt and pepper. Sauté veggies in non-stick pan 3 min. Add egg whites, cook until set. Top with feta, fold and serve.' },
    breakfast2: { name: 'Greek Yogurt Parfait with Berries', calories: 240, protein: 22, carbs: 32, fat: 4, fiber: 5, prepTime: 5, ingredients: ['1 cup plain Greek yogurt (0% fat)', '1/2 cup mixed berries', '2 tbsp sliced almonds', '1 tbsp chia seeds', 'Stevia to taste'], instructions: 'Layer yogurt in a glass or bowl. Add berries, almonds, and chia seeds. Drizzle with stevia.' },
    breakfast3: { name: 'Avocado Toast with Poached Eggs', calories: 310, protein: 18, carbs: 24, fat: 18, fiber: 8, prepTime: 15, ingredients: ['1 slice Ezekiel bread', '1/2 ripe avocado', '2 eggs poached', 'Red pepper flakes', 'Salt & pepper', 'Lemon juice'], instructions: 'Toast bread. Mash avocado with lemon juice, salt, pepper. Spread on toast. Top with poached eggs and red pepper flakes.' },
    breakfast4: { name: 'Overnight Protein Oats', calories: 280, protein: 25, carbs: 35, fat: 6, fiber: 6, prepTime: 5, ingredients: ['1/2 cup rolled oats', '1 scoop vanilla protein powder', '1/2 cup unsweetened almond milk', '1/4 cup fresh blueberries', 'Cinnamon'], instructions: 'Mix oats, protein powder, and almond milk in a jar. Refrigerate overnight. Top with blueberries and cinnamon before eating.' },
    breakfast5: { name: 'Smoked Salmon & Cream Cheese Wrap', calories: 290, protein: 24, carbs: 22, fat: 12, fiber: 3, prepTime: 7, ingredients: ['2 oz smoked salmon', '2 tbsp light cream cheese', '1 whole wheat tortilla', 'Capers', 'Red onion slices', 'Fresh dill'], instructions: 'Spread cream cheese on tortilla. Layer smoked salmon, capers, red onion, and dill. Roll tightly and slice in half.' },
    breakfast6: { name: 'Chia Seed Pudding with Mango', calories: 260, protein: 10, carbs: 38, fat: 9, fiber: 10, prepTime: 5, ingredients: ['3 tbsp chia seeds', '1 cup coconut milk', '1/2 mango diced', '1 tbsp shredded coconut', 'Lime juice'], instructions: 'Mix chia seeds and coconut milk, refrigerate 4+ hours. Top with mango, coconut, and lime juice.' },
    breakfast7: { name: 'Cottage Cheese & Pineapple Bowl', calories: 200, protein: 22, carbs: 20, fat: 3, fiber: 2, prepTime: 3, ingredients: ['1 cup low-fat cottage cheese', '1/2 cup fresh pineapple chunks', '2 tbsp walnuts', 'Cinnamon'], instructions: 'Scoop cottage cheese into bowl. Top with pineapple and walnuts. Sprinkle cinnamon on top.' },
    lunch1: { name: 'Grilled Chicken Caesar Salad', calories: 340, protein: 38, carbs: 12, fat: 16, fiber: 4, prepTime: 18, ingredients: ['5oz grilled chicken breast', '2 cups romaine lettuce', '2 tbsp Greek yogurt Caesar dressing', '2 tbsp parmesan shaved', 'Whole grain croutons'], instructions: 'Grill chicken with light seasoning 6-7 min per side. Chop romaine, slice chicken. Toss with dressing, parmesan, and croutons.' },
    lunch2: { name: 'Turkey & Hummus Veggie Wrap', calories: 320, protein: 26, carbs: 34, fat: 10, fiber: 7, prepTime: 8, ingredients: ['4oz sliced turkey breast', '3 tbsp hummus', '1 whole wheat wrap', 'Cucumber slices', 'Shredded carrots', 'Spinach'], instructions: 'Spread hummus on wrap. Layer turkey, cucumber, carrots, and spinach. Roll tightly and slice diagonally.' },
    lunch3: { name: 'Quinoa & Black Bean Bowl', calories: 360, protein: 14, carbs: 58, fat: 9, fiber: 14, prepTime: 20, ingredients: ['1/2 cup cooked quinoa', '1/2 cup black beans', '1/2 cup corn kernels', '1/2 cup diced tomatoes', '1/4 avocado', 'Lime cilantro dressing'], instructions: 'Combine quinoa, beans, corn, tomatoes in bowl. Dice avocado and add on top. Drizzle with lime cilantro dressing.' },
    lunch4: { name: 'Asian Salmon Salad Bowl', calories: 380, protein: 32, carbs: 18, fat: 20, fiber: 5, prepTime: 20, ingredients: ['5oz salmon fillet', '2 cups mixed greens', '1/2 edamame pods', '1/4 cup shredded purple cabbage', 'Sesame ginger dressing', 'Sesame seeds'], instructions: 'Pan-sear salmon 4 min each side. Arrange greens, cabbage, edamame in bowl. Flake salmon on top. Drizzle dressing and sprinkle sesame seeds.' },
    lunch5: { name: 'Stuffed Bell Peppers with Lean Ground Turkey', calories: 340, protein: 30, carbs: 28, fat: 12, fiber: 6, prepTime: 30, ingredients: ['2 bell peppers', '4oz ground turkey', '1/2 cup cauliflower rice', '1/4 cup diced tomatoes', 'Italian seasoning', 'Mozzarella string cheese'], instructions: 'Cut pepper tops, remove seeds. Brown turkey with seasonings. Mix with cauliflower rice and tomatoes. Stuff peppers, top with cheese. Bake 20 min at 375°F.' },
    lunch6: { name: 'Mediterranean Chickpea Salad', calories: 310, protein: 12, carbs: 45, fat: 10, fiber: 12, prepTime: 12, ingredients: ['1 can chickpeas drained', '1/2 cup cucumber diced', '1/4 cup red onion', 'Cherry tomatoes halved', 'Kalamata olives', 'Lemon herb vinaigrette'], instructions: 'Combine chickpeas, cucumber, onion, tomatoes, olives in bowl. Toss with lemon herb vinaigrette. Serve chilled.' },
    lunch7: { name: 'Shrimp & Avocado Lettuce Wraps', calories: 280, protein: 28, carbs: 12, fat: 14, fiber: 5, prepTime: 15, ingredients: ['6oz cooked shrimp chopped', '1/2 avocado diced', '2 tbsp lime juice', 'Cilantro', 'Butter lettuce leaves', 'Jalapeño slices'], instructions: 'Mix shrimp with avocado, lime juice, cilantro. Spoon mixture into lettuce leaves. Top with jalapeño slices.' },
    dinner1: { name: 'Baked Herb-Crusted Cod with Asparagus', calories: 320, protein: 38, carbs: 14, fat: 12, fiber: 4, prepTime: 25, ingredients: ['6oz cod fillet', '2 tbsp almond flour', 'Fresh dill', 'Lemon zest', '1 cup asparagus', 'Olive oil drizzle'], instructions: 'Mix almond flour with dill and lemon zest. Coat cod, place on baking sheet with asparagus. Drizzle olive oil. Bake at 400°F for 15-18 min.' },
    dinner2: { name: 'Grilled Chicken Breast with Roasted Broccoli', calories: 350, protein: 42, carbs: 16, fat: 14, fiber: 6, prepTime: 28, ingredients: ['6oz chicken breast', '2 cups broccoli florets', '2 tsp olive oil', 'Garlic powder', 'Paprika', 'Lemon wedge'], instructions: 'Season chicken with garlic powder and paprika. Grill 6-7 min per side. Toss broccoli with olive oil and roast at 425°F for 12 min.' },
    dinner3: { name: 'Turkey Meatballs with Zucchini Noodles', calories: 330, protein: 34, carbs: 18, fat: 14, fiber: 4, prepTime: 30, ingredients: ['4oz ground turkey', '1/4 cup breadcrumbs', '1 egg white', 'Italian herbs', '2 medium zucchini spiralized', 'Marinara sauce (low sugar)'], instructions: 'Mix turkey, breadcrumbs, egg white, herbs. Form into 5 meatballs. Bake at 400°F for 18 min. Serve over zucchini noodles with marinara.' },
    dinner4: { name: 'Salmon Patties with Sweet Potato Mash', calories: 380, protein: 30, carbs: 32, fat: 16, fiber: 5, prepTime: 30, ingredients: ['5oz canned salmon', '1 egg', 'Almond flour coating', '1 medium sweet potato', 'Greek yogurt', 'Chives'], instructions: 'Mix salmon with egg, form patties, coat with almond flour. Pan-fry 4 min each side. Microwave sweet potato, mash with Greek yogurt and chives.' },
    dinner5: { name: 'Shakshuka with Spinach', calories: 290, protein: 24, carbs: 20, fat: 14, fiber: 6, prepTime: 22, ingredients: ['3 eggs', '1/2 cup crushed tomatoes', '1 cup spinach', 'Onion & garlic', 'Cumin & paprika', 'Feta cheese crumble'], instructions: 'Sauté onion and garlic, add tomatoes and spices. Simmer 5 min. Create wells, crack eggs into sauce. Cover and cook 8 min. Top with spinach and feta.' },
    dinner6: { name: 'Lemon Garlic Shrimp with Cauliflower Rice', calories: 310, protein: 32, carbs: 14, fat: 14, fiber: 4, prepTime: 18, ingredients: ['6oz large shrimp', '2 cups cauliflower rice', '3 cloves garlic', 'Lemon juice', 'White wine (optional)', 'Fresh parsley'], instructions: 'Sauté shrimp with garlic and lemon juice 3-4 min. Cook cauliflower rice 5 min. Serve shrimp over rice, garnish with parsley.' },
    dinner7: { name: 'Chicken Stir-Fry with Mixed Vegetables', calories: 340, protein: 36, carbs: 24, fat: 12, fiber: 6, prepTime: 20, ingredients: ['5oz chicken breast strips', '1 cup broccoli florets', '1/2 cup snap peas', 'Shiitake mushrooms', 'Low-sodium soy sauce', 'Ginger & garlic'], instructions: 'Stir-fry chicken in non-stick pan 5 min. Add vegetables, ginger, garlic, cook 5 more min. Add soy sauce, toss to combine.' },
    snack1: { name: 'Apple Slices with Almond Butter', calories: 180, protein: 4, carbs: 22, fat: 10, fiber: 4, prepTime: 2, ingredients: ['1 medium apple', '1 tbsp natural almond butter'], instructions: 'Slice apple, serve with almond butter for dipping.' },
    snack2: { name: 'Celery Sticks with Cream Cheese', calories: 120, protein: 3, carbs: 8, fat: 9, fiber: 2, prepTime: 2, ingredients: ['4 celery stalks', '2 tbsp light cream cheese', 'Everything bagel seasoning'], instructions: 'Spread cream cheese on celery sticks. Sprinkle with seasoning.' },
    snack3: { name: 'Hard-Boiled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0, prepTime: 12, ingredients: ['2 large eggs', 'Salt & pepper', 'Paprika'], instructions: 'Boil eggs 10-12 min. Peel, season with salt, pepper, and paprika.' },
    snack4: { name: 'Cucumber & Cream Cheese Bites', calories: 100, protein: 4, carbs: 6, fat: 7, fiber: 1, prepTime: 5, ingredients: ['1 cucumber', '3 tbsp light cream cheese', 'Dill weed', 'Everything seasoning'], instructions: 'Slice cucumber into thick rounds. Top with cream cheese, dill, and everything seasoning.' },
    snack5: { name: 'Mixed Berry Smoothie', calories: 150, protein: 5, carbs: 30, fat: 2, fiber: 5, prepTime: 4, ingredients: ['1/2 cup mixed frozen berries', '1/2 cup unsweetened almond milk', '1/2 banana', 'Ice'], instructions: 'Blend all ingredients until smooth.' },
    snack6: { name: 'Roasted Chickpeas', calories: 160, protein: 7, carbs: 24, fat: 5, fiber: 7, prepTime: 25, ingredients: ['1 can chickpeas drained', 'Olive oil spray', 'Smoked paprika', 'Garlic powder', 'Sea salt'], instructions: 'Pat chickpeas very dry. Toss with oil and seasonings. Roast at 400°F for 25-30 min until crispy, shaking halfway.' },
    snack7: { name: 'Turkey & Cheese Roll-Ups', calories: 130, protein: 14, carbs: 2, fat: 8, fiber: 0, prepTime: 3, ingredients: ['3oz sliced turkey breast', '1oz swiss cheese', 'Dijon mustard'], instructions: 'Lay out turkey slices, spread light dijon mustard. Roll up with cheese slice. Slice in half if desired.' },
  },
  'muscle-building': {
    breakfast1: { name: 'Triple Egg Omelette with Bacon & Cheese', calories: 520, protein: 42, carbs: 8, fat: 36, fiber: 2, prepTime: 15, ingredients: ['3 whole eggs', '2 strips turkey bacon', '2oz cheddar cheese', '1/4 cup mushrooms', 'Cooking spray'], instructions: 'Cook bacon until crispy, crumble. Whisk eggs, pour into non-stick pan. Add cheese, bacon, mushrooms. Fold and serve.' },
    breakfast2: { name: 'Protein Pancakes with Banana', calories: 480, protein: 38, carbs: 55, fat: 12, fiber: 4, prepTime: 20, ingredients: ['1 cup pancake mix', '1 scoop vanilla protein powder', '1 egg', '1/2 cup milk', '1 banana sliced', 'Maple syrup'], instructions: 'Mix pancake mix, protein powder, egg, milk. Cook pancakes on griddle. Top with banana slices and light maple syrup.' },
    breakfast3: { name: 'Greek Yogurt Power Bowl', calories: 440, protein: 36, carbs: 48, fat: 10, fiber: 6, prepTime: 5, ingredients: ['1.5 cups Greek yogurt', '1/2 cup granola', '1 banana', '2 tbsp peanut butter', 'Honey drizzle', 'Chia seeds'], instructions: 'Scoop yogurt into bowl. Top with granola, banana, peanut butter drizzle, honey, and chia seeds.' },
    breakfast4: { name: 'Breakfast Burrito with Steak', calories: 580, protein: 45, carbs: 40, fat: 28, fiber: 5, prepTime: 22, ingredients: ['4oz grilled sirloin strips', '2 eggs scrambled', '2 oz cheese', '1 large tortilla', 'Salsa', 'Avocado'], instructions: 'Grill steak with fajita seasoning. Scramble eggs, warm tortilla. Fill with steak, eggs, cheese, salsa, and avocado.' },
    breakfast5: { name: 'Overnight Oats with Peanut Butter', calories: 450, protein: 28, carbs: 52, fat: 16, fiber: 8, prepTime: 5, ingredients: ['1 cup rolled oats', '1 scoop chocolate protein powder', '1 cup whole milk', '2 tbsp peanut butter', '1 banana', 'Cacao nibs'], instructions: 'Mix oats, protein powder, milk, and peanut butter. Refrigerate overnight. Top with banana and cacao nibs.' },
    breakfast6: { name: 'French Toast with Protein Topping', calories: 490, protein: 35, carbs: 52, fat: 16, fiber: 4, prepTime: 15, ingredients: ['2 thick slices brioche bread', '2 eggs', 'Cinnamon', 'Vanilla extract', 'Whipped cottage cheese topping', 'Fresh berries'], instructions: 'Mix eggs with cinnamon and vanilla. Dip bread, cook on griddle until golden. Serve with whipped cottage cheese and berries.' },
    breakfast7: { name: 'Breakfast Sausage & Egg Muffins', calories: 420, protein: 38, carbs: 12, fat: 26, fiber: 2, prepTime: 25, ingredients: ['4 eggs', '4oz pork breakfast sausage', '2oz cheese', 'Bell peppers', 'Onion', 'Cooking spray'], instructions: 'Brown sausage with peppers and onion. Divide into muffin tin, top with egg and cheese. Bake at 350°F for 18 min.' },
    lunch1: { name: 'Mass Gainer Chicken Rice Bowl', calories: 620, protein: 48, carbs: 72, fat: 14, fiber: 4, prepTime: 25, ingredients: ['6oz grilled chicken breast', '1 cup jasmine rice', '1/2 cup black beans', 'Corn kernels', 'Cheese sauce', 'Green onions'], instructions: 'Grill chicken with taco seasoning. Cook rice. Combine rice with beans, corn. Top with sliced chicken, cheese sauce, and green onions.' },
    lunch2: { name: 'Beef & Broccoli with Rice', calories: 580, protein: 44, carbs: 56, fat: 18, fiber: 4, prepTime: 25, ingredients: ['6oz flank steak', '2 cups broccoli florets', '1.5 cups white rice', 'Soy ginger sauce', 'Sesame seeds', 'Garlic'], instructions: 'Slice steak thin, stir-fry with garlic 3 min. Add broccoli, cook 4 min. Add sauce, toss. Serve over rice, sprinkle sesame seeds.' },
    lunch3: { name: 'Tuna Pasta Power Salad', calories: 540, protein: 42, carbs: 58, fat: 14, fiber: 6, prepTime: 18, ingredients: ['5oz canned tuna', '2oz pasta (cooked)', 'Cherry tomatoes', 'Olives', 'Mozzarella balls', 'Italian dressing'], instructions: 'Cook pasta al dente, cool. Drain tuna. Combine pasta, tuna, tomatoes, olives, mozzarella. Toss with Italian dressing.' },
    lunch4: { name: 'Pulled Pork Sandwich on Brioche', calories: 620, protein: 46, carbs: 54, fat: 24, fiber: 3, prepTime: 15, ingredients: ['6oz pulled pork', 'Brioche bun', 'Barbecue sauce', 'Coleslaw mix', 'Pickle slices'], instructions: 'Warm pulled pork with BBQ sauce. Toast brioche bun. Layer pork on bun, top with coleslaw and pickles.' },
    lunch5: { name: 'Philly Cheesesteak Stuffed Peppers', calories: 560, protein: 40, carbs: 32, fat: 30, fiber: 5, prepTime: 35, ingredients: ['4oz ribeye steak', '2 bell peppers', '2oz provolone cheese', 'Sautéed onions', 'Mushrooms', 'Garlic aioli'], instructions: 'Slice pepper and remove seeds. Sauté onions, mushrooms, and steak. Stuff peppers with mixture, top with provolone. Bake at 375°F for 20 min.' },
    lunch6: { name: 'Salmon Poke Bowl', calories: 540, protein: 38, carbs: 52, fat: 20, fiber: 4, prepTime: 15, ingredients: ['5oz sushi-grade salmon', '1 cup sushi rice', '1/4 avocado', 'Edamame', 'Cucumber', 'Soy sauce & sriracha'], instructions: 'Cube salmon into bite-sized pieces. Cook sushi rice. Assemble bowl with rice, salmon, avocado, edamame, cucumber. Drizzle with soy sauce and sriracha.' },
    lunch7: { name: 'Grilled Chicken Quesadilla', calories: 580, protein: 44, carbs: 38, fat: 28, fiber: 5, prepTime: 18, ingredients: ['5oz grilled chicken', '2 large flour tortillas', '3oz pepper jack cheese', 'Black beans', 'Sautéed peppers', 'Sour cream & salsa'], instructions: 'Layer tortilla with cheese, chicken, beans, peppers. Top with second tortilla. Grill 3 min per side. Serve with sour cream and salsa.' },
    dinner1: { name: 'NY Strip Steak with Sweet Potato', calories: 620, protein: 48, carbs: 42, fat: 28, fiber: 5, prepTime: 25, ingredients: ['8oz NY strip steak', '1 large sweet potato', '2 tbsp butter', 'Garlic butter', 'Seasoning salt', 'Green beans'], instructions: 'Season steak, grill 4-5 min per side for medium. Microwave sweet potato with butter. Grill green beans with garlic. Rest steak 5 min before slicing.' },
    dinner2: { name: 'Chicken Thighs with Rice & Peas', calories: 580, protein: 46, carbs: 48, fat: 22, fiber: 6, prepTime: 35, ingredients: ['6oz chicken thighs (bone-in)', '1.5 cups brown rice', '1 cup peas', 'Onion', 'Chicken broth', 'Thyme'], instructions: 'Season chicken thighs, bake at 400°F for 35 min until internal temp 165°F. Cook rice in chicken broth with onion and thyme. Mix in peas before serving.' },
    dinner3: { name: 'Salmon with Quinoa and Asparagus', calories: 560, protein: 44, carbs: 38, fat: 26, fiber: 6, prepTime: 28, ingredients: ['6oz salmon fillet', '1/2 cup quinoa', '1 bunch asparagus', 'Lemon dill sauce', 'Olive oil', 'Capers'], instructions: 'Cook quinoa according to package. Pan-sear salmon 4 min per side. Roast asparagus with olive oil at 425°F for 10 min. Serve with lemon dill sauce and capers.' },
    dinner4: { name: 'Beef Lasagna with Ricotta', calories: 640, protein: 42, carbs: 52, fat: 28, fiber: 4, prepTime: 45, ingredients: ['4oz ground beef', 'Lasagna noodles', 'Ricotta cheese', 'Marinara sauce', 'Mozzarella', 'Italian seasoning'], instructions: 'Brown beef with seasonings. Layer noodles, ricotta, beef, marinara, mozzarella in baking dish. Repeat layers. Bake at 375°F for 30 min.' },
    dinner5: { name: 'Grilled Pork Chops with Mac & Cheese', calories: 680, protein: 44, carbs: 62, fat: 28, fiber: 3, prepTime: 30, ingredients: ['6oz pork chop', '2oz pasta', '2oz cheddar cheese', '1/4 cup milk', 'Breadcrumbs', 'Garlic'], instructions: 'Grill pork chop 4-5 min per side. Cook pasta, make cheese sauce with milk and cheddar. Top pork with garlic butter. Serve with mac and cheese.' },
    dinner6: { name: 'Shrimp Fried Rice with Egg', calories: 520, protein: 36, carbs: 56, fat: 16, fiber: 4, prepTime: 20, ingredients: ['6oz shrimp', '2 cups day-old rice', '2 eggs', 'Peas & carrots', 'Soy sauce', 'Sesame oil'], instructions: 'Stir-fry shrimp 2 min, set aside. Scramble eggs, set aside. Stir-fry rice with veggies, add shrimp, eggs, soy sauce, and sesame oil.' },
    dinner7: { name: 'Ribeye Tacos with Guacamole', calories: 600, protein: 42, carbs: 40, fat: 28, fiber: 8, prepTime: 25, ingredients: ['5oz ribeye steak', '2 corn tortillas', '1/2 avocado', 'Lime', 'Cilantro', 'Diced onion & tomato', 'Cotija cheese'], instructions: 'Slice ribeye thin, season with taco spices, grill 2 min. Warm tortillas. Mash avocado with lime and cilantro. Assemble tacos with steak, guacamole, onions, tomatoes, and cotija cheese.' },
    snack1: { name: 'Protein Shake with Banana & Peanut Butter', calories: 340, protein: 32, carbs: 38, fat: 10, fiber: 4, prepTime: 3, ingredients: ['2 scoops protein powder', '1 banana', '1 tbsp peanut butter', '1 cup whole milk', 'Ice'], instructions: 'Blend all ingredients until smooth.' },
    snack2: { name: 'Greek Yogurt with Honey & Walnuts', calories: 280, protein: 22, carbs: 30, fat: 8, fiber: 2, prepTime: 2, ingredients: ['1 cup Greek yogurt', '2 tbsp honey', '2 tbsp walnuts', 'Cinnamon'], instructions: 'Scoop yogurt, drizzle honey, add walnuts, sprinkle cinnamon.' },
    snack3: { name: 'Cheese & Turkey Roll-Ups (4)', calories: 220, protein: 24, carbs: 4, fat: 12, fiber: 0, prepTime: 3, ingredients: ['4oz sliced turkey', '3oz swiss cheese'], instructions: 'Lay out turkey slices, top with cheese, roll up tightly.' },
    snack4: { name: 'Chocolate Protein Bar', calories: 280, protein: 25, carbs: 28, fat: 9, fiber: 4, prepTime: 0, ingredients: ['1 store-bought protein bar'], instructions: 'Grab and go - look for one with at least 20g protein.' },
    snack5: { name: 'Cottage Cheese & Crackers', calories: 260, protein: 22, carbs: 24, fat: 8, fiber: 2, prepTime: 3, ingredients: ['1 cup cottage cheese', 'Whole grain crackers', 'Everything seasoning'], instructions: 'Serve cottage cheese with crackers, sprinkle with everything seasoning.' },
    snack6: { name: 'Rice Cakes with Avocado & Tuna', calories: 300, protein: 26, carbs: 28, fat: 10, fiber: 4, prepTime: 5, ingredients: ['2 rice cakes', '3oz canned tuna', '1/2 avocado', 'Salt & pepper', 'Lemon juice'], instructions: 'Mash tuna with avocado, lemon, salt, pepper. Spread on rice cakes.' },
    snack7: { name: 'Beef Jerky Pack', calories: 180, protein: 24, carbs: 8, fat: 6, fiber: 0, prepTime: 0, ingredients: ['1 oz beef jerky'], instructions: 'High-protein portable snack. Look for low-sugar options.' },
  },
  'general-health': {
    breakfast1: { name: 'Mediterranean Breakfast Plate', calories: 380, protein: 16, carbs: 42, fat: 18, fiber: 8, prepTime: 10, ingredients: ['2 eggs poached', '1/2 cup hummus', 'Whole grain pita', 'Cherry tomatoes', 'Cucumber', 'Kalamata olives', 'Olive oil drizzle'], instructions: 'Warm pita, arrange eggs, hummus, veggies, and olives on plate. Drizzle with olive oil.' },
    breakfast2: { name: 'Acai Bowl with Granola', calories: 360, protein: 8, carbs: 58, fat: 14, fiber: 10, prepTime: 8, ingredients: ['1 acai packet frozen', '1/2 banana', '1/2 cup granola', '1/4 cup coconut flakes', 'Blueberries', 'Honey drizzle'], instructions: 'Blend acai with banana until thick. Pour into bowl, top with granola, coconut, blueberries, and honey.' },
    breakfast3: { name: 'Whole Grain Toast with Eggs & Avocado', calories: 340, protein: 16, carbs: 32, fat: 18, fiber: 8, prepTime: 12, ingredients: ['2 slices whole grain bread', '2 eggs fried', '1/2 avocado', 'Microgreens', 'Salt, pepper, chili flakes'], instructions: 'Toast bread. Fry eggs to preference. Mash avocado on toast, top with eggs, microgreens, and seasonings.' },
    breakfast4: { name: 'Baked oatmeal with Apple & Cinnamon', calories: 320, protein: 10, carbs: 54, fat: 8, fiber: 8, prepTime: 25, ingredients: ['1 cup rolled oats', '1 apple diced', '1 cup oat milk', 'Maple syrup', 'Cinnamon', 'Walnuts'], instructions: 'Mix oats, apple, milk, syrup, cinnamon. Pour into baking dish, top with walnuts. Bake at 375°F for 20 min.' },
    breakfast5: { name: 'Smoothie Bowl with Flax Seeds', calories: 340, protein: 12, carbs: 48, fat: 14, fiber: 9, prepTime: 6, ingredients: ['1 frozen banana', '1 cup spinach', '1/2 cup frozen mango', '2 tbsp flax seeds', 'Almond milk', 'Coconut flakes'], instructions: 'Blend banana, spinach, mango with splash of milk until thick. Top with flax seeds and coconut.' },
    breakfast6: { name: 'Egg Muffins with Veggies', calories: 280, protein: 20, carbs: 8, fat: 18, fiber: 2, prepTime: 25, ingredients: ['4 eggs', 'Spinach', 'Bell peppers', 'Onion', 'Feta cheese', 'Herbs'], instructions: 'Whisk eggs with veggies and feta, pour into muffin tin. Bake at 350°F for 18-20 min until set.' },
    breakfast7: { name: 'Banana Oatmeal with Almonds', calories: 350, protein: 12, carbs: 52, fat: 12, fiber: 8, prepTime: 10, ingredients: ['1 cup cooked oatmeal', '1 banana sliced', '2 tbsp sliced almonds', 'Cinnamon', 'Brown sugar', 'Milk'], instructions: 'Cook oatmeal with milk, top with banana, almonds, cinnamon, and brown sugar.' },
    lunch1: { name: 'Rainbow Buddha Bowl', calories: 420, protein: 14, carbs: 56, fat: 16, fiber: 12, prepTime: 18, ingredients: ['1/2 cup quinoa', '1/2 cup chickpeas', 'Shredded purple cabbage', 'Carrots', 'Edamame', 'Tahini dressing'], instructions: 'Cook quinoa. Arrange all veggies in bowl, top with quinoa and chickpeas. Drizzle with tahini dressing.' },
    lunch2: { name: 'Niçoise Salad with Tuna', calories: 390, protein: 28, carbs: 24, fat: 18, fiber: 6, prepTime: 15, ingredients: ['5oz tuna canned', '2 cups mixed greens', 'Green beans', 'Potatoes', 'Egg quarters', 'Olives', 'Vinaigrette'], instructions: 'Arrange greens on plate. Top with flaked tuna, trimmed green beans, boiled potatoes, egg, and olives. Drizzle with vinaigrette.' },
    lunch3: { name: 'Black Bean Soup with Crusty Bread', calories: 360, protein: 14, carbs: 58, fat: 8, fiber: 16, prepTime: 25, ingredients: ['1 can black beans', 'Onion & garlic', 'Cumin & chili powder', 'Vegetable broth', 'Sour cream', 'Crusty bread'], instructions: 'Sauté onion and garlic, add beans, spices, and broth. Simmer 15 min. Blend half for creamy texture. Serve with sour cream and bread.' },
    lunch4: { name: 'Caprese Sandwich on Focaccia', calories: 400, protein: 18, carbs: 42, fat: 18, fiber: 4, prepTime: 8, ingredients: ['Focaccia bread', 'Fresh mozzarella', 'Tomato slices', 'Fresh basil', 'Balsamic glaze', 'Olive oil'], instructions: 'Slice focaccia, layer mozzarella and tomatoes. Add basil leaves, drizzle with olive oil and balsamic glaze.' },
    lunch5: { name: 'Falafel Pita with Tzatziki', calories: 440, protein: 16, carbs: 54, fat: 18, fiber: 10, prepTime: 20, ingredients: ['4 falafel patties', 'Whole wheat pita', 'Cucumber', 'Tomato', 'Tzatziki sauce', 'Red onion'], instructions: 'Bake or pan-fry falafel until crispy. Warm pita, fill with falafel, veggies, and tzatziki sauce.' },
    lunch6: { name: 'Minestrone Soup with Pesto', calories: 340, protein: 12, carbs: 48, fiber: 10, fat: 12, prepTime: 30, ingredients: ['Kidney beans', 'Pasta', 'Zucchini', 'Carrots', 'Celery', 'Tomatoes', 'Pesto swirl'], instructions: 'Sauté veggies, add broth and tomatoes, simmer 15 min. Add pasta and beans, cook until pasta done. Swirl in pesto before serving.' },
    lunch7: { name: 'Avocado Chicken Salad Lettuce Wraps', calories: 360, protein: 28, carbs: 14, fat: 22, fiber: 6, prepTime: 12, ingredients: ['4oz chicken breast', '1/2 avocado', 'Greek yogurt', 'Celery', 'Almonds', 'Butter lettuce'], instructions: 'Shred chicken, mix with mashed avocado, yogurt, celery, almonds. Season and scoop into lettuce leaves.' },
    dinner1: { name: 'Herb-Crusted Salmon with Roasted Vegetables', calories: 420, protein: 34, carbs: 24, fat: 22, fiber: 6, prepTime: 30, ingredients: ['5oz salmon fillet', 'Dijon mustard', 'Breadcrumbs & herbs', 'Brussels sprouts', 'Butternut squash', 'Lemon'], instructions: 'Coat salmon with mustard and herb crust. Roast veggies at 400°F for 20 min. Bake salmon on top for final 12 min.' },
    dinner2: { name: 'Chicken Tikka Masala with Basmati Rice', calories: 480, protein: 36, carbs: 48, fat: 14, fiber: 4, prepTime: 35, ingredients: ['5oz chicken thighs', 'Tikka masala sauce', 'Coconut milk', 'Basmati rice', 'Frozen peas', 'Naan bread'], instructions: 'Marinate chicken in tikka spices, cook in pan. Add sauce and coconut milk, simmer 15 min. Serve over rice with peas and naan.' },
    dinner3: { name: 'Whole Wheat Pasta Primavera', calories: 440, protein: 16, carbs: 68, fat: 12, fiber: 10, prepTime: 25, ingredients: ['2oz whole wheat pasta', 'Zucchini', 'Bell peppers', 'Cherry tomatoes', 'Olive oil', 'Parmesan', 'Basil'], instructions: 'Cook pasta al dente. Sauté veggies in olive oil, add garlic. Toss with pasta, top with parmesan and fresh basil.' },
    dinner4: { name: 'Baked Chicken with Sweet Potato & Kale', calories: 400, protein: 34, carbs: 36, fat: 12, fiber: 6, prepTime: 35, ingredients: ['5oz chicken breast', '1 sweet potato', '2 cups kale', 'Olive oil', 'Smoked paprika', 'Garlic'], instructions: 'Season chicken with paprika and garlic. Cube sweet potato, toss with oil. Bake chicken and sweet potato at 400°F for 25 min. Sauté kale until wilted.' },
    dinner5: { name: 'White Fish Tacos with Mango Salsa', calories: 380, protein: 28, carbs: 38, fat: 14, fiber: 4, prepTime: 20, ingredients: ['5oz white fish', 'Corn tortillas', '1 mango diced', 'Red onion', 'Cilantro', 'Lime', 'Chipotle mayo'], instructions: 'Season fish, bake or pan-sear 3 min per side. Make salsa with mango, onion, cilantro, lime. Serve in tortillas with chipotle mayo.' },
    dinner6: { name: 'Vegetable Stir-Fry with Tofu & Brown Rice', calories: 380, protein: 18, carbs: 48, fat: 14, fiber: 8, prepTime: 22, ingredients: ['7oz firm tofu', 'Broccoli', 'Snow peas', 'Carrots', 'Brown rice', 'Teriyaki sauce', 'Sesame seeds'], instructions: 'Press and cube tofu, stir-fry until crispy. Add veggies, cook 5 min. Add teriyaki sauce, serve over brown rice with sesame seeds.' },
    dinner7: { name: 'Lamb Kofta with Tabbouleh & Pita', calories: 460, protein: 28, carbs: 34, fat: 24, fiber: 6, prepTime: 30, ingredients: ['5oz ground lamb', 'Cumin & coriander', 'Bulgur wheat', 'Parsley & mint', 'Tomatoes', 'Pita bread', 'Tzatziki'], instructions: 'Mix lamb with spices, form onto skewers. Grill 4 min per side. Prepare tabbouleh with bulgur, parsley, mint, tomatoes. Serve with warm pita and tzatziki.' },
    snack1: { name: 'Handful of Almonds & Dried Apricots', calories: 220, protein: 6, carbs: 22, fat: 14, fiber: 4, prepTime: 0, ingredients: ['1/4 cup almonds', '1/4 cup dried apricots'], instructions: 'Portion into snack bag for on-the-go energy.' },
    snack2: { name: 'Hummus & Veggie Sticks', calories: 180, protein: 6, carbs: 22, fat: 8, fiber: 5, prepTime: 5, ingredients: ['3 tbsp hummus', 'Carrot sticks', 'Celery', 'Bell pepper strips', 'Cucumber slices'], instructions: 'Arrange veggie sticks around hummus dip.' },
    snack3: { name: 'Dark Chocolate & Strawberries', calories: 190, protein: 3, carbs: 24, fat: 11, fiber: 4, prepTime: 2, ingredients: ['1oz dark chocolate (70%+)', '1 cup fresh strawberries'], instructions: 'Melt chocolate slightly, dip strawberries, or just enjoy together.' },
    snack4: { name: 'Edamame with Sea Salt', calories: 160, protein: 14, carbs: 14, fat: 6, fiber: 8, prepTime: 5, ingredients: ['1 cup edamame pods', 'Sea salt'], instructions: 'Steam or microwave edamame, sprinkle with sea salt.' },
    snack5: { name: 'Apple Slices with Sunflower Seed Butter', calories: 200, protein: 5, carbs: 24, fat: 11, fiber: 4, prepTime: 3, ingredients: ['1 medium apple', '1 tbsp sunflower seed butter'], instructions: 'Slice apple, serve with sunflower seed butter for dipping.' },
    snack6: { name: 'Trail Mix with Dark Chocolate Chips', calories: 240, protein: 6, carbs: 26, fat: 14, fiber: 4, prepTime: 0, ingredients: ['2 tbsp cashews', '2 tbsp raisins', '1 tbsp dark chocolate chips', '1 tbsp pumpkin seeds'], instructions: 'Mix all ingredients in small container.' },
    snack7: { name: 'Caprese Skewers', calories: 150, protein: 8, carbs: 6, fat: 11, fiber: 1, prepTime: 5, ingredients: ['4 cherry tomatoes', '4 mozzarella balls', 'Fresh basil leaf', 'Balsamic glaze', 'Salt & pepper'], instructions: 'Thread tomato, mozzarella, basil on toothpick. Drizzle with balsamic glaze, season.' },
  },
  'flexibility': {
    breakfast1: { name: 'Anti-Inflammatory Turmeric Smoothie', calories: 280, protein: 10, carbs: 42, fat: 10, fiber: 6, prepTime: 5, ingredients: ['1 cup coconut milk', '1/2 banana', '1 tsp turmeric powder', '1/2 tsp ginger', '1 tbsp honey', 'Ice'], instructions: 'Blend all ingredients until smooth. The turmeric and ginger reduce inflammation for better mobility.' },
    breakfast2: { name: 'Bone Broth Oatmeal with Berries', calories: 320, protein: 12, carbs: 44, fat: 10, fiber: 7, prepTime: 10, ingredients: ['1 cup bone broth (warmed)', '1/2 cup oats', 'Mixed berries', 'Collagen peptides', 'Cinnamon'], instructions: 'Warm bone broth, stir in oats, cook 5 min. Top with berries, collagen peptides, and cinnamon.' },
    breakfast3: { name: 'Omega-3 Scrambled Eggs with Smoked Salmon', calories: 380, protein: 28, carbs: 8, fat: 26, fiber: 2, prepTime: 12, ingredients: ['3 eggs', '2oz smoked salmon', 'Capers', 'Red onion', 'Cream cheese', 'Everything bagel seasoning'], instructions: 'Scramble eggs gently with cream cheese. Serve topped with smoked salmon, capers, red onion, and everything seasoning.' },
    breakfast4: { name: 'Chia Pudding with Tart Cherry Compote', calories: 300, protein: 10, carbs: 38, fat: 14, fiber: 12, prepTime: 5, ingredients: ['3 tbsp chia seeds', '1 cup oat milk', '1/4 cup tart cherry juice', 'Frozen cherries', 'Vanilla extract', 'Almonds'], instructions: 'Mix chia seeds with oat milk and vanilla, refrigerate overnight. Warm cherries with juice for compote, top pudding.' },
    breakfast5: { name: 'Avocado Toast with Hemp Seeds', calories: 340, protein: 12, carbs: 32, fat: 20, fiber: 10, prepTime: 8, ingredients: ['Sourdough bread', '1 avocado', 'Hemp seeds', 'Flax seeds', 'Lemon juice', 'Himalayan salt', 'Microgreens'], instructions: 'Toast sourdough. Mash avocado with lemon and salt. Top with hemp seeds, flax, and microgreens.' },
    breakfast6: { name: 'Ginger Honey Tea with Whole Grain Toast', calories: 260, protein: 8, carbs: 38, fat: 8, fiber: 5, prepTime: 10, ingredients: ['Fresh ginger root', 'Honey', 'Lemon', '2 slices whole grain bread', 'Almond butter'], instructions: 'Slice ginger, steep in hot water 5 min. Add honey and lemon. Toast bread, spread with almond butter.' },
    breakfast7: { name: 'Parsley & Feta Egg White Omelette', calories: 240, protein: 26, carbs: 8, fat: 12, fiber: 2, prepTime: 12, ingredients: ['4 egg whites', 'Fresh parsley', '2 tbsp feta cheese', 'Sautéed spinach', 'Dill', 'Cherry tomatoes'], instructions: 'Whisk egg whites with parsley and dill. Cook in non-stick pan. Top with spinach, feta, and tomatoes.' },
    lunch1: { name: 'Ginger Miso Soup with Tofu', calories: 260, protein: 16, carbs: 24, fat: 12, fiber: 4, prepTime: 15, ingredients: ['White miso paste', 'Silken tofu', 'Wakame seaweed', 'Fresh ginger', 'Green onions', 'Dashi broth'], instructions: 'Heat dashi broth, whisk in miso (do not boil). Add tofu cubes, ginger, wakame. Top with green onions.' },
    lunch2: { name: 'Salmon & Avocado Bowl with Seaweed', calories: 380, protein: 30, carbs: 22, fat: 20, fiber: 6, prepTime: 12, ingredients: ['4oz baked salmon', '1/2 avocado', 'Sushi rice', 'Seaweed salad', 'Cucumber', 'Pickled ginger', 'Sesame seeds'], instructions: 'Flake salmon over rice with avocado. Add seaweed salad, cucumber, pickled ginger. Sprinkle sesame seeds.' },
    lunch3: { name: 'Walnut & Blue Cheese Pear Salad', calories: 320, protein: 10, carbs: 28, fat: 20, fiber: 7, prepTime: 10, ingredients: ['Mixed greens', '1 pear sliced', '2 tbsp walnuts', 'Blue cheese crumbles', 'Balsamic vinaigrette', 'Dried cranberries'], instructions: 'Arrange greens, top with pear, walnuts, blue cheese, cranberries. Drizzle with balsamic vinaigrette.' },
    lunch4: { name: 'Turmeric Chicken Lettuce Wraps', calories: 300, protein: 28, carbs: 16, fat: 14, fiber: 3, prepTime: 18, ingredients: ['4oz ground chicken', 'Turmeric & cumin', 'Butter lettuce', 'Tzatziki sauce', 'Cucumber', 'Red onion'], instructions: 'Brown chicken with turmeric and cumin. Spoon into lettuce cups, top with tzatziki, cucumber, and red onion.' },
    lunch5: { name: 'Coconut Curry Lentil Soup', calories: 340, protein: 14, carbs: 44, fat: 14, fiber: 16, prepTime: 25, ingredients: ['Red lentils', 'Coconut milk', 'Curry powder & turmeric', 'Spinach', 'Ginger & garlic', 'Vegetable broth'], instructions: 'Sauté onion, garlic, ginger with spices. Add lentils and broth, simmer 15 min. Stir in coconut milk, add spinach until wilted.' },
    lunch6: { name: 'Mediterranean Grain Bowl with Olives', calories: 360, protein: 12, carbs: 42, fat: 18, fiber: 8, prepTime: 15, ingredients: ['1/2 cup farro', 'Kalamata olives', 'Sun-dried tomatoes', 'Artichoke hearts', 'Tahini dressing', 'Cucumber'], instructions: 'Cook farro according to package. Arrange in bowl with olives, tomatoes, artichokes, cucumber. Drizzle with tahini.' },
    lunch7: { name: 'Sardines on Whole Grain Crackers', calories: 320, protein: 24, carbs: 22, fat: 16, fiber: 4, prepTime: 5, ingredients: ['Can of sardines in olive oil', 'Whole grain crackers', 'Lemon wedge', 'Mustard', 'Fresh dill', 'Capers'], instructions: 'Arrange sardines on crackers, squeeze lemon, add mustard, dill, and capers.' },
    dinner1: { name: 'Baked Salmon with Ginger & Bok Choy', calories: 380, protein: 36, carbs: 16, fat: 20, fiber: 4, prepTime: 25, ingredients: ['5oz salmon fillet', 'Fresh ginger', 'Soy sauce', '2 baby bok choy', 'Garlic', 'Sesame oil', 'Brown rice'], instructions: 'Marinate salmon in ginger, soy, garlic. Bake at 400°F for 12 min. Sauté bok choy in sesame oil. Serve with brown rice.' },
    dinner2: { name: 'Roasted Root Vegetables with Turmeric Chicken', calories: 360, protein: 30, carbs: 32, fat: 14, fiber: 8, prepTime: 35, ingredients: ['5oz chicken breast', 'Sweet potato', 'Carrots', 'Beets', 'Turmeric spice', 'Rosemary', 'Olive oil'], instructions: 'Cube vegetables, toss with oil and rosemary, roast at 400°F for 25 min. Add seasoned chicken breast for last 20 min.' },
    dinner3: { name: 'Deviled Eggs with Salmon (Omega-3 Boost)', calories: 320, protein: 24, carbs: 6, fat: 22, fiber: 1, prepTime: 20, ingredients: ['4 eggs', '2oz smoked salmon', 'Greek yogurt', 'Dijon mustard', 'Paprika', 'Chives'], instructions: 'Boil eggs 10 min, halve, remove yolks. Mix yolks with yogurt, mustard, diced salmon. Pipe back into whites, top with paprika and chives.' },
    dinner4: { name: 'Vegetarian Pho with Extra Bok Choy', calories: 340, protein: 14, carbs: 48, fat: 10, fiber: 6, prepTime: 30, ingredients: ['Rice noodles', 'Vegetable broth', 'Star anise & cinnamon', 'Bok choy', 'Bean sprouts', 'Fresh basil', 'Lime & chili'], instructions: 'Simmer broth with spices 20 min. Cook rice noodles. Divide noodles into bowls, ladle broth, add bok choy and bean sprouts. Top with basil, lime, chili.' },
    dinner5: { name: 'Garlic Shrimp with Kale & Sweet Potato', calories: 350, protein: 28, carbs: 30, fat: 14, fiber: 6, prepTime: 25, ingredients: ['5oz shrimp', 'Kale leaves', '1 small sweet potato', 'Garlic butter', 'White wine', 'Lemon'], instructions: 'Roast cubed sweet potato 20 min. Sauté kale with garlic until wilted. Add shrimp, garlic butter, wine, cook 3 min. Serve together.' },
    dinner6: { name: 'Miso-Glazed Cod with Soba Noodles', calories: 330, protein: 32, carbs: 34, fat: 8, fiber: 4, prepTime: 25, ingredients: ['5oz cod fillet', 'White miso glaze', 'Soba noodles', 'Edamame', 'Scallions', 'Sesame seeds'], instructions: 'Glaze cod with miso, bake at 400°F for 12 min. Cook soba noodles, toss with edamame and scallions. Serve fish on noodles, sprinkle sesame seeds.' },
    dinner7: { name: 'Stuffed Delicata Squash with Quinoa & Mushrooms', calories: 360, protein: 12, carbs: 44, fat: 16, fiber: 7, prepTime: 35, ingredients: ['1 delicata squash', 'Cooked quinoa', 'Mushrooms', 'Shallot', 'Thyme', 'Parmesan', 'Walnuts'], instructions: 'Halve squash, remove seeds, roast cut-side down 20 min. Sauté mushrooms and shallot with thyme. Fill squash with quinoa mixture, top with parmesan and walnuts, bake 10 more min.' },
    snack1: { name: 'Tart Cherry Juice with Magnesium', calories: 140, protein: 2, carbs: 32, fat: 1, fiber: 2, prepTime: 1, ingredients: ['1 cup tart cherry juice', '1 tsp magnesium powder'], instructions: 'Mix and drink. Tart cherries reduce muscle soreness, magnesium aids flexibility.' },
    snack2: { name: 'Golden Milk Latte', calories: 160, protein: 4, carbs: 24, fat: 6, fiber: 2, prepTime: 5, ingredients: ['1 cup oat milk', '1 tsp turmeric', '1/2 tsp ginger', 'Honey', 'Black pepper (enhances absorption)'], instructions: 'Heat milk, whisk in turmeric, ginger, pepper. Sweeten with honey. Anti-inflammatory before bed.' },
    snack3: { name: 'Walnut & Date Energy Balls', calories: 200, protein: 5, carbs: 28, fat: 10, fiber: 4, prepTime: 10, ingredients: ['6 dates pitted', '1/2 cup walnuts', '2 tbsp cacao powder', '1 tbsp chia seeds', 'Sea salt'], instructions: 'Blend all in food processor, form into 6 balls. Roll in extra cacao or coconut. Refrigerate 30 min.' },
    snack4: { name: 'Celery with Tahini & Sesame Seeds', calories: 150, protein: 4, carbs: 14, fat: 10, fiber: 4, prepTime: 3, ingredients: ['4 celery stalks', '2 tbsp tahini', 'Sesame seeds', 'Lemon juice'], instructions: 'Spread tahini on celery sticks, sprinkle with sesame seeds and lemon juice.' },
    snack5: { name: 'Frozen Grapes with Dark Chocolate', calories: 170, protein: 3, carbs: 26, fat: 8, fiber: 3, prepTime: 5, ingredients: ['1 cup frozen grapes', '1oz dark chocolate', 'Sea salt'], instructions: 'Freeze grapes ahead of time. Melt chocolate, dip grapes, place on parchment, sprinkle salt. Freeze 10 min to set.' },
    snack6: { name: 'Rosemary Roasted Chickpeas', calories: 180, protein: 7, carbs: 26, fat: 6, fiber: 8, prepTime: 30, ingredients: ['Can chickpeas drained', 'Olive oil spray', 'Fresh rosemary', 'Garlic powder', 'Smoked paprika', 'Sea salt'], instructions: 'Pat chickpeas very dry. Toss with oil and seasonings. Roast at 400°F for 30 min until crispy, shaking halfway.' },
    snack7: { name: 'Kiwi Slices with Coconut Cream', calories: 150, protein: 3, carbs: 24, fiber: 5, fat: 6, prepTime: 3, ingredients: ['2 kiwis sliced', '2 tbsp coconut cream', 'Shredded coconut', 'Lime zest'], instructions: 'Arrange kiwi slices, dollop with coconut cream, sprinkle coconut and lime zest. Kiwi contains actinidin which aids digestion.' },
  }
}

// Generate workout plan
function generateWorkoutPlan(profile: UserProfile) {
  const exercisesList = Object.keys(exercises)
  const plan = []
  const isFlexibility = profile.goal === 'flexibility'
  const focusAreas = isFlexibility
    ? ['Lower Body & Hips', 'Upper Body & Shoulders', 'Spine & Core', 'Full Body Flow', 'Recovery & Release']
    : ['Upper Body', 'Lower Body', 'Full Body', 'Cardio', 'HIIT']

  for (let day = 0; day < profile.workoutDays; day++) {
    const dayExercises = []
    const exerciseCount = isFlexibility ? Math.min(6, profile.workoutDays + 3) : Math.min(5, profile.workoutDays + 2)

    for (let i = 0; i < exerciseCount; i++) {
      let exerciseKey
      if (isFlexibility) {
        const flexExercises = exercisesList.filter(k => exercises[k].category === 'flexibility')
        exerciseKey = flexExercises[(day + i) % flexExercises.length]
      } else {
        exerciseKey = exercisesList[(day + i) % exercisesList.length]
      }

      const ex = exercises[exerciseKey]
      let sets = 3, reps = '12-15', rest = '60s'
      if (profile.fitnessLevel === 'beginner') { sets = 2; reps = '10-12' }
      if (profile.fitnessLevel === 'advanced') { sets = 4; reps = '15-20' }
      if (isFlexibility) {
        reps = profile.fitnessLevel === 'beginner' ? '20-30s' : profile.fitnessLevel === 'advanced' ? '45-60s' : '30-45s'
        rest = '15-30s'
      }

      dayExercises.push({
        name: ex.name, sets, reps, rest,
        caloriesPerMinute: ex.caloriesPerMinute,
        description: `Target: ${ex.targetMuscles.join(', ')}`
      })
    }

    plan.push({
      day: `Day ${day + 1}`,
      focus: focusAreas[day % focusAreas.length],
      duration: profile.sessionDuration,
      exercises: dayExercises
    })
  }
  return plan
}

// Generate meal plan
function generateMealPlan(goal: string) {
  const goalMeals = meals[goal] || meals['general-health']
  const times = Object.keys(goalMeals)
  // Return all meals for the goal
  return times.map(time => ({
    time: time.replace(/[0-9]/g, '').replace(/([A-Z])/g, ' $1').trim(),
    ...goalMeals[time]
  }))
}

// Calculate BMI
function calculateBMI(weight: number, height: number) {
  const heightM = height * 0.0254
  const weightKg = weight * 0.453592
  return (weightKg / (heightM * heightM)).toFixed(1)
}

// Local storage helpers
const USERS_KEY = 'quickfit_users'
const SESSION_KEY = 'quickfit_session'

function getStoredUsers(): Record<string, AuthUser> {
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : {}
}

function saveUsers(users: Record<string, AuthUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): AuthUser | null {
  const stored = localStorage.getItem(SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

function saveSession(user: AuthUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
}

export default function App() {
  const [authView, setAuthView] = useState<'landing' | 'signup' | 'login' | 'app'>('landing')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    name: '', age: 30, gender: 'male', weight: 150, height: 70,
    goal: 'general-health', fitnessLevel: 'beginner', workoutDays: 3, sessionDuration: 30, injuries: []
  })

  // Signup state
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupError, setSignupError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // App state
  const [view, setView] = useState<'dashboard' | 'workout' | 'meals' | 'supplements' | 'profile' | 'settings'>('dashboard')
  const [step, setStep] = useState(1)
  const [setupComplete, setSetupComplete] = useState(false)

  // Premium modal
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  // Load session on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      setCurrentUser(session)
      setProfile(session.profile)
      setAuthView('app')
      if (session.profile.name) setSetupComplete(true)
    }
  }, [])

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleInjury = (injury: string) => {
    setProfile(prev => ({
      ...prev,
      injuries: prev.injuries.includes(injury)
        ? prev.injuries.filter(i => i !== injury)
        : [...prev.injuries, injury]
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return profile.name && profile.age && profile.weight && profile.height
      case 2: return profile.goal && profile.fitnessLevel
      case 3: return profile.workoutDays && profile.sessionDuration
      default: return true
    }
  }

  const handleSignup = () => {
    setSignupError('')
    if (!signupEmail || !signupPassword || !signupUsername) {
      setSignupError('All fields are required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      setSignupError('Please enter a valid email address')
      return
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters')
      return
    }
    if (signupUsername.length < 3) {
      setSignupError('Username must be at least 3 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(signupUsername)) {
      setSignupError('Username can only contain letters, numbers, and underscores')
      return
    }

    const users = getStoredUsers()

    // Check if email already exists
    if (Object.values(users).some(u => u.email === signupEmail) || signupEmail === ADMIN_CREDENTIALS.email) {
      setSignupError('An account with this email already exists')
      return
    }

    // Check if username is taken
    if (Object.values(users).some(u => u.username.toLowerCase() === signupUsername.toLowerCase()) || signupUsername.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
      setSignupError('Username is already taken. Please select a different username.')
      return
    }

    // Create user
    const newUser: AuthUser = {
      email: signupEmail,
      username: signupUsername,
      password: signupPassword,
      isPremium: false,
      isAdmin: false,
      profile: { ...profile }
    }

    users[signupEmail] = newUser
    saveUsers(users)
    saveSession(newUser)
    setCurrentUser(newUser)
    setAuthView('app')
  }

  const handleLogin = () => {
    setLoginError('')
    const users = getStoredUsers()

    // Check admin credentials first
    if (loginEmail === ADMIN_CREDENTIALS.email && loginPassword === ADMIN_CREDENTIALS.password) {
      const adminUser: AuthUser = {
        email: ADMIN_CREDENTIALS.email,
        username: ADMIN_CREDENTIALS.username,
        password: ADMIN_CREDENTIALS.password,
        isPremium: true,
        isAdmin: true,
        profile: { ...profile }
      }
      saveSession(adminUser)
      setCurrentUser(adminUser)
      setAuthView('app')
      return
    }

    const user = users[loginEmail]
    if (!user) {
      setLoginError('No account found with this email')
      return
    }
    if (user.password !== loginPassword) {
      setLoginError('Incorrect password')
      return
    }

    saveSession(user)
    setCurrentUser(user)
    setProfile(user.profile)
    setAuthView('app')
    if (user.profile.name) setSetupComplete(true)
  }

  const handleLogout = () => {
    saveSession(null)
    setCurrentUser(null)
    setAuthView('landing')
    setLoginEmail('')
    setLoginPassword('')
    setSignupEmail('')
    setSignupPassword('')
    setSignupUsername('')
    setProfile({
      name: '', age: 30, gender: 'male', weight: 150, height: 70,
      goal: 'general-health', fitnessLevel: 'beginner', workoutDays: 3, sessionDuration: 30, injuries: []
    })
    setSetupComplete(false)
    setStep(1)
    setView('dashboard')
  }

  const handleProfileComplete = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, profile: { ...profile } }
      const users = getStoredUsers()
      if (users[currentUser.email]) {
        users[currentUser.email] = updatedUser
        saveUsers(users)
      }
      saveSession(updatedUser)
      setCurrentUser(updatedUser)
    }
    setSetupComplete(true)
  }

  const enablePremium = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, isPremium: true }
      const users = getStoredUsers()
      if (users[currentUser.email]) {
        users[currentUser.email] = updatedUser
        saveUsers(users)
      }
      saveSession(updatedUser)
      setCurrentUser(updatedUser)
      setShowPremiumModal(false)
    }
  }

  const workoutPlan = generateWorkoutPlan(profile)
  const mealPlan = generateMealPlan(profile.goal)
  const bmi = calculateBMI(profile.weight, profile.height)

  // ===== LANDING / AUTH VIEW =====
  if (authView !== 'app') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-16 mt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuickFit
                </h1>
                <p className="text-xs text-gray-400">quickfit.tech</p>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Your Personal Fitness<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey Starts Here</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered workout plans, personalized meal plans, supplement recommendations, and flexible stretching routines — all tailored to your goals.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setAuthView('signup')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setAuthView('login')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-blue-500 hover:text-blue-600"
              >
                Log In
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Dumbbell, title: 'Custom Workouts', desc: 'Personalized plans for any fitness goal' },
              { icon: ChefHat, title: 'Meal Planning', desc: 'Detailed recipes with macros & instructions' },
              { icon: Activity, title: 'Supplement Guides', desc: 'Affiliate-linked products for your goals' },
              { icon: Crown, title: 'Premium Features', desc: '$5.99/mo for exclusive content' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <Icon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>

          {/* Auth Forms */}
          <div className="max-w-md mx-auto">
            {authView === 'signup' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Create Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" value={signupUsername} onChange={e => setSignupUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Choose a unique username" />
                    <p className="text-xs text-gray-500 mt-1">Letters, numbers, underscores only. Must be unique.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                        placeholder="At least 6 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {signupError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{signupError}</p>
                    </div>
                  )}
                  <button onClick={handleSignup}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold">
                    Create Account
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account? <button onClick={() => setAuthView('login')} className="text-blue-600 font-medium">Log In</button>
                </p>

                {/* Premium Banner */}
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-900">Unlock Premium for $5.99/month</p>
                      <p className="text-xs text-amber-700">Access all features, unlimited plans, and exclusive content</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {authView === 'login' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Welcome Back</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                        placeholder="Your password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{loginError}</p>
                    </div>
                  )}
                  <button onClick={handleLogin}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold">
                    Log In
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account? <button onClick={() => setAuthView('signup')} className="text-blue-600 font-medium">Sign Up Free</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ===== SETUP VIEW (profile creation) =====
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-4">
              <Dumbbell className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuickFit
            </h1>
            <p className="text-xs text-gray-400 mt-1">quickfit.tech</p>
            <p className="text-gray-600 mt-2">Welcome, {currentUser?.username}! Let's personalize your experience.</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round(step / 4 * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: `${step / 4 * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Tell Us About Yourself</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" value={profile.name} onChange={e => updateProfile('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input type="number" value={profile.age} onChange={e => updateProfile('age', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select value={profile.gender} onChange={e => updateProfile('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                    <input type="number" value={profile.height} onChange={e => updateProfile('height', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 70 inches" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                    <input type="number" value={profile.weight} onChange={e => updateProfile('weight', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 165 lbs" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">What is Your Fitness Goal?</h2>
                <div className="space-y-4">
                  {[
                    { value: 'weight-loss', label: 'Weight Loss', desc: 'Burn fat and get lean' },
                    { value: 'muscle-building', label: 'Build Muscle', desc: 'Gain strength and mass' },
                    { value: 'general-health', label: 'General Health', desc: 'Stay fit and healthy' },
                    { value: 'flexibility', label: 'Flexibility & Stretching', desc: 'Improve mobility with 20+ stretches' }
                  ].map(option => (
                    <button key={option.value} onClick={() => updateProfile('goal', option.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${profile.goal === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Fitness Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <button key={level} onClick={() => updateProfile('fitnessLevel', level)}
                        className={`p-3 rounded-lg border-2 capitalize transition-colors ${profile.fitnessLevel === level ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-300'}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Schedule</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Workout Days Per Week</label>
                  <div className="grid grid-cols-7 gap-2">
                    {[1,2,3,4,5,6,7].map(d => (
                      <button key={d} onClick={() => updateProfile('workoutDays', d)}
                        className={`p-3 rounded-lg border-2 transition-colors ${profile.workoutDays === d ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 hover:border-blue-300'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Session Duration (minutes)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[30, 45, 60, 90].map(d => (
                      <button key={d} onClick={() => updateProfile('sessionDuration', d)}
                        className={`p-3 rounded-lg border-2 transition-colors ${profile.sessionDuration === d ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 hover:border-blue-300'}`}>
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Injury History</h2>
                <p className="text-gray-600">Select any areas with current or past injuries (optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Lower Back', 'Knee', 'Shoulder', 'Hip', 'Ankle', 'Wrist', 'Neck', 'Elbow'].map(injury => (
                    <button key={injury} onClick={() => toggleInjury(injury)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${profile.injuries.includes(injury) ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-red-300'}`}>
                      {injury}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Back
              </button>
              <button onClick={() => { if (step === 4) handleProfileComplete(); else setStep(s => s + 1) }}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2">
                <span>{step === 4 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== MAIN APP =====
  const goalSupplements = supplements[profile.goal] || supplements['general-health']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuickFit
                </h1>
                <p className="text-xs text-gray-400">quickfit.tech</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {currentUser?.isPremium && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Crown className="h-3 w-3" /> PREMIUM
                </span>
              )}
              {currentUser?.isAdmin && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  ADMIN
                </span>
              )}
              <span className="text-gray-600 text-sm hidden sm:block">@{currentUser?.username}</span>
              <button onClick={() => setView('profile')} className="p-2 text-gray-600 hover:text-blue-600">
                <User className="h-5 w-5" />
              </button>
              <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Activity },
              { key: 'workout', label: 'Workouts', icon: Dumbbell },
              { key: 'meals', label: 'Meals', icon: ChefHat },
              { key: 'supplements', label: 'Supplements', icon: ShoppingBag },
              { key: 'profile', label: 'Profile', icon: User },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setView(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${view === key ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Premium Banner (non-premium only) */}
        {!currentUser?.isPremium && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-white" />
              <div>
                <p className="font-bold text-white">Unlock Premium for $5.99/month</p>
                <p className="text-sm text-amber-100">Access all supplements, unlimited meal plans, and exclusive content</p>
              </div>
            </div>
            <button onClick={() => setShowPremiumModal(true)}
              className="px-4 py-2 bg-white text-amber-600 rounded-lg font-bold text-sm hover:bg-amber-50 shrink-0">
              Go Premium
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="text-sm text-gray-600">BMI</div>
                <div className="text-2xl font-bold text-gray-900">{bmi}</div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="text-sm text-gray-600">Weekly Workouts</div>
                <div className="text-2xl font-bold text-gray-900">{profile.workoutDays}</div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="text-sm text-gray-600">Session Length</div>
                <div className="text-2xl font-bold text-gray-900">{profile.sessionDuration} min</div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="text-sm text-gray-600">Goal</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{profile.goal.replace('-', ' ')}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Your Personalized Plans</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-5">
                  <div className="flex items-center mb-3">
                    <Dumbbell className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="font-semibold">Workout Plan</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{profile.workoutDays} days/week · {profile.sessionDuration} min/session · {profile.fitnessLevel}</p>
                  <button onClick={() => setView('workout')} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Full Plan →
                  </button>
                </div>
                <div className="border rounded-lg p-5">
                  <div className="flex items-center mb-3">
                    <ChefHat className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-semibold">Meal Plan</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Customized for {profile.goal.replace('-', ' ')} — {mealPlan.length} meals available</p>
                  <button onClick={() => setView('meals')} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Full Plan →
                  </button>
                </div>
              </div>
            </div>

            {goalSupplements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold">Recommended Supplements</h2>
                  </div>
                  {!currentUser?.isPremium && <Lock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {goalSupplements.slice(0, 5).map((supp, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${!currentUser?.isPremium ? 'opacity-70' : ''}`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-bold text-gray-700">{supp.name}</span>
                        {supp.badge && <span className="text-xs bg-amber-100 text-amber-700 px-1 rounded">{supp.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{supp.description}</p>
                      {currentUser?.isPremium ? (
                        <a href={supp.link} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-medium hover:underline block truncate">
                          View on Amazon →
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Premium to view</p>
                      )}
                    </div>
                  ))}
                </div>
                {!currentUser?.isPremium && (
                  <button onClick={() => setShowPremiumModal(true)}
                    className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold text-sm">
                    Unlock All Supplements — $5.99/mo
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* WORKOUT */}
        {view === 'workout' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Workout Plan</h2>
            {workoutPlan.map((day, idx) => (
              <div key={idx} className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{day.day} — {day.focus}</h3>
                    <span className="text-sm opacity-90">{day.duration} min</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {day.exercises.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{ex.name}</div>
                        <div className="text-xs text-gray-500">{ex.description}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-sm font-bold">{ex.sets} × {ex.reps}</div>
                        <div className="text-xs text-gray-400">{ex.rest} rest</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEALS */}
        {view === 'meals' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold capitalize">Meal Plan — {profile.goal.replace('-', ' ')}</h2>
            <p className="text-gray-600 text-sm">{mealPlan.length} detailed meals with ingredients, macros, and step-by-step instructions</p>
            <div className="space-y-4">
              {mealPlan.map((meal, idx) => (
                <div key={idx} className="bg-white border rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">{meal.time}</div>
                        <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{meal.calories}</div>
                        <div className="text-xs text-gray-500">calories</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">Protein: {meal.protein}g</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">Carbs: {meal.carbs}g</span>
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium">Fat: {meal.fat}g</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">Fiber: {meal.fiber}g</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Prep: {meal.prepTime} min</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Ingredients:</h4>
                      <p className="text-sm text-gray-700 mb-3">{meal.ingredients.join(' · ')}</p>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Instructions:</h4>
                      <p className="text-sm text-gray-700">{meal.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPLEMENTS */}
        {view === 'supplements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Supplement Recommendations</h2>
                <p className="text-gray-600 text-sm">Curated supplements for your {profile.goal.replace('-', ' ')} goal</p>
              </div>
              {!currentUser?.isPremium && (
                <div className="flex items-center gap-2 text-amber-600">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">Premium Only</span>
                </div>
              )}
            </div>

            {!currentUser?.isPremium ? (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
                <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-900 mb-2">Unlock Supplement Guides</h3>
                <p className="text-amber-700 mb-4">Get detailed supplement info with direct Amazon affiliate links — only $5.99/month</p>
                <button onClick={() => setShowPremiumModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">
                  Get Premium — $5.99/mo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goalSupplements.map((supp, i) => (
                  <div key={i} className="bg-white border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{supp.name}</h3>
                      {supp.badge && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{supp.badge}</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{supp.description}</p>
                    <p className="text-sm text-green-700 font-medium mb-3">✓ {supp.benefit}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{supp.price}</span>
                      <a href={supp.link} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                        View on Amazon →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {view === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Your Profile</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{profile.name}</span></div>
                <div><span className="text-gray-500">Age:</span> <span className="font-medium">{profile.age}</span></div>
                <div><span className="text-gray-500">Height:</span> <span className="font-medium">{profile.height} inches</span></div>
                <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{profile.weight} lbs</span></div>
                <div><span className="text-gray-500">Goal:</span> <span className="font-medium capitalize">{profile.goal.replace('-', ' ')}</span></div>
                <div><span className="text-gray-500">Fitness Level:</span> <span className="font-medium capitalize">{profile.fitnessLevel}</span></div>
                <div><span className="text-gray-500">Workouts:</span> <span className="font-medium">{profile.workoutDays}/week</span></div>
                <div><span className="text-gray-500">Session:</span> <span className="font-medium">{profile.sessionDuration} min</span></div>
              </div>
              <div className="mt-4">
                <button onClick={() => { setStep(1); setSetupComplete(false); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Account</h2>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500">Username:</span> <span className="font-medium">@{currentUser?.username}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{currentUser?.email}</span></div>
                <div><span className="text-gray-500">Status:</span>
                  {currentUser?.isAdmin ? <span className="font-medium text-purple-600 ml-1">Admin</span>
                    : currentUser?.isPremium ? <span className="font-medium text-amber-600 ml-1">Premium</span>
                    : <span className="font-medium text-gray-600 ml-1">Free</span>}
                </div>
              </div>
              {!currentUser?.isPremium && (
                <button onClick={() => setShowPremiumModal(true)}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold">
                  Upgrade to Premium — $5.99/mo
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full inline-block mb-4">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">QuickFit Premium</h3>
              <p className="text-gray-600 mb-6">Unlock all features for your fitness journey</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <ul className="space-y-2 text-sm">
                  {['Full supplement database with Amazon links', 'Unlimited detailed meal plans', 'All workout plan variations', 'Priority support', 'Exclusive flexibility content'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-extrabold text-gray-900">$5.99<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-xs text-gray-500 mt-1">Cancel anytime</p>
              </div>

              {currentUser?.isAdmin ? (
                <button onClick={enablePremium}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold mb-3">
                  Activate Admin Premium (Free)
                </button>
              ) : (
                <button onClick={() => alert('Payment integration coming soon!')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold mb-3">
                  Subscribe Now
                </button>
              )}
              <button onClick={() => setShowPremiumModal(false)} className="text-gray-500 text-sm">Maybe later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
