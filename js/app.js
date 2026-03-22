/**
 * app.js
 * Handles all DOM interaction: reading inputs, validation, rendering results.
 */

// ── Element references ────────────────────────────────────────────────────────
const form             = document.getElementById('calculator-form');
const macroTotalEl     = document.getElementById('macro-total');
const macroErrorEl     = document.getElementById('macro-error');
const resultsEl        = document.getElementById('results');
const goalEl           = document.getElementById('goal');
const adjustmentFieldEl = document.getElementById('adjustment-field');

// ── Show/hide adjustment field based on goal ──────────────────────────────────
function toggleAdjustmentField() {
  adjustmentFieldEl.hidden = goalEl.value === 'maintain';
}

goalEl.addEventListener('change', toggleAdjustmentField);

// ── Live macro-total counter ──────────────────────────────────────────────────
['carbs-perc', 'protein-perc', 'fat-perc'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateMacroTotal);
});

function updateMacroTotal() {
  const total = getMacroPcts().sum;
  macroTotalEl.textContent = total;

  const isValid = total === 100;
  macroTotalEl.parentElement.classList.toggle('valid',   isValid);
  macroTotalEl.parentElement.classList.toggle('invalid', !isValid);
  macroErrorEl.textContent = isValid ? '' : 'Percentages must add up to exactly 100%';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getNum(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function getMacroPcts() {
  const c = getNum('carbs-perc');
  const p = getNum('protein-perc');
  const f = getNum('fat-perc');
  return { carbs: c, protein: p, fat: f, sum: Math.round(c + p + f) };
}

/**
 * Validate a numeric input and set its error message.
 * Returns true if valid.
 */
function validateField(id, min, max, label) {
  const el    = document.getElementById(id);
  const errEl = document.getElementById(id + '-error');
  const val   = parseFloat(el.value);

  let error = '';
  if (isNaN(val))      error = `${label} is required`;
  else if (val < min)  error = `${label} must be at least ${min}`;
  else if (val > max)  error = `${label} must be at most ${max}`;

  el.classList.toggle('invalid', !!error);
  if (errEl) errEl.textContent = error;
  return !error;
}

// ── Form submission ───────────────────────────────────────────────────────────
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validate individual fields
  const fieldsValid = [
    validateField('height', 100, 250, 'Height'),
    validateField('weight',  50, 700, 'Weight'),
    validateField('age',     10, 120, 'Age'),
  ].every(Boolean);

  // Validate macro percentages
  const pcts       = getMacroPcts();
  const macrosValid = pcts.sum === 100;
  macroErrorEl.textContent = macrosValid ? '' : 'Percentages must add up to exactly 100%';

  if (!fieldsValid || !macrosValid) return;

  // Run calculation
  const goal           = goalEl.value;
  const adjustmentVal  = document.getElementById('adjustment').value;
  const calorieAdjustment = goal === 'maintain' ? 0 : (adjustmentVal === 'slow' ? 500 : 1000);

  const result = calculate({
    heightCm:           getNum('height'),
    weightLbs:          getNum('weight'),
    age:                getNum('age'),
    gender:             document.getElementById('gender').value,
    activityMultiplier: parseFloat(document.getElementById('activity').value),
    goal,
    calorieAdjustment,
    proteinPct:         pcts.protein / 100,
    carbsPct:           pcts.carbs   / 100,
    fatPct:             pcts.fat     / 100,
  });

  renderResults(result);
});

// ── Render results ────────────────────────────────────────────────────────────
function renderResults({ tdee, macros, bmr }) {
  document.getElementById('result-calories').textContent = tdee.toLocaleString();

  document.getElementById('result-protein-g').textContent    = macros.protein.g;
  document.getElementById('result-protein-kcal').textContent = `${macros.protein.kcal} kcal`;

  document.getElementById('result-carbs-g').textContent      = macros.carbs.g;
  document.getElementById('result-carbs-kcal').textContent   = `${macros.carbs.kcal} kcal`;

  document.getElementById('result-fat-g').textContent        = macros.fat.g;
  document.getElementById('result-fat-kcal').textContent     = `${macros.fat.kcal} kcal`;

  const goal           = document.getElementById('goal').value;
  const adjustmentVal  = document.getElementById('adjustment').value;
  const calLabel       = adjustmentVal === 'slow' ? '500' : '1,000';
  const lbLabel        = adjustmentVal === 'slow' ? '1 lb' : '2 lbs';
  const noteMap = {
    lose:     `Based on a ${calLabel} calorie/day deficit (${lbLabel} per week).`,
    gain:     `Based on a ${calLabel} calorie/day surplus (${lbLabel} per week).`,
    maintain: `Your maintenance calories are approximately ${tdee.toLocaleString()} kcal/day.`,
  };
  document.getElementById('result-note').textContent = noteMap[goal];

  // Show results with animation
  resultsEl.hidden = false;
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Init ──────────────────────────────────────────────────────────────────────
updateMacroTotal();       // set initial macro total state
toggleAdjustmentField();  // set initial adjustment visibility
