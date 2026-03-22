/**
 * calculator.js
 * Pure calculation logic — no DOM access here.
 * Easy to unit-test or reuse on other pages.
 */

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation.
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {'male'|'female'} gender
 * @returns {number} BMR in kcal/day
 */
function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * Calculate Total Daily Energy Expenditure.
 * @param {number} bmr
 * @param {number} activityMultiplier  e.g. 1.2, 1.375, …
 * @param {'maintain'|'lose'|'gain'} goal
 * @param {number} calorieAdjustment  500 (1 lb/week) or 1000 (2 lbs/week)
 * @returns {number} TDEE in kcal/day (rounded)
 */
function calcTDEE(bmr, activityMultiplier, goal, calorieAdjustment) {
  let tdee = bmr * activityMultiplier;
  if (goal === 'lose') tdee -= calorieAdjustment;
  if (goal === 'gain') tdee += calorieAdjustment;
  return Math.round(tdee);
}

/**
 * Break TDEE into macro targets.
 * @param {number} tdee
 * @param {number} proteinPct  0–1
 * @param {number} carbsPct    0–1
 * @param {number} fatPct      0–1
 * @returns {{ protein: {g, kcal}, carbs: {g, kcal}, fat: {g, kcal} }}
 */
function calcMacros(tdee, proteinPct, carbsPct, fatPct) {
  const proteinKcal = Math.round(tdee * proteinPct);
  const carbsKcal   = Math.round(tdee * carbsPct);
  const fatKcal     = Math.round(tdee * fatPct);

  return {
    protein: { kcal: proteinKcal, g: Math.round(proteinKcal / 4) },
    carbs:   { kcal: carbsKcal,   g: Math.round(carbsKcal   / 4) },
    fat:     { kcal: fatKcal,     g: Math.round(fatKcal     / 9) },
  };
}

/**
 * Main entry point — takes raw form values, returns results.
 * @param {{
 *   heightCm: number,
 *   weightLbs: number,
 *   age: number,
 *   gender: 'male'|'female',
 *   activityMultiplier: number,
 *   goal: 'maintain'|'lose'|'gain',
 *   calorieAdjustment: number,
 *   proteinPct: number,
 *   carbsPct: number,
 *   fatPct: number
 * }} params
 * @returns {{ tdee: number, macros: object, bmr: number }}
 */
function calculate(params) {
  const weightKg = params.weightLbs * 0.453592;
  const bmr      = calcBMR(weightKg, params.heightCm, params.age, params.gender);
  const tdee     = calcTDEE(bmr, params.activityMultiplier, params.goal, params.calorieAdjustment);
  const macros   = calcMacros(tdee, params.proteinPct, params.carbsPct, params.fatPct);
  return { bmr: Math.round(bmr), tdee, macros };
}
