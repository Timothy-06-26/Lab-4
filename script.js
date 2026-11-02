// Website Information

//prices: 1 = $, 2 = $$, 3 = $$$   size: snack / light / big

const dishes = [
{name: "Pancakes",   emoji: "🥞", veg:true, price: 1, size: "big", meals:["breakfast"]},
{ name: "Breakfast burrito", emoji: "🌯", veg: false, price: 2, size: "big",   meals: ["breakfast"] },
{ name: "Bacon and eggs",   emoji: "🥓", veg: false, price: 2, size: "big",   meals: ["breakfast"] },
{ name: "Cereal", emoji: "🥣", veg: true,  price: 1, size: "snack", meals: ["breakfast", "latenight"] },

{ name: "Chicken caesar wrap", emoji: "🌯", veg: false, price: 1, size: "light", meals: ["lunch"] },
{ name: "Grilled cheese", emoji: "🧀", veg: true,  price: 1, size: "light", meals: ["lunch", "latenight"] },
{ name: "Tacos", emoji: "🌮", veg: false, price: 1, size: "big",   meals: ["lunch", "dinner", "latenight"] },
{ name: "Burger and fries",    emoji: "🍔", veg: false, price: 2, size: "big",   meals: ["lunch", "dinner"] },

{ name: "Margherita pizza",  emoji: "🍕", veg: true,  price: 2, size: "big",   meals: ["lunch", "dinner", "latenight"] },
{ name: "Steak dinner", emoji: "🥩", veg: false, price: 3, size: "big",   meals: ["dinner"] },
{ name: "French fries", emoji: "🍟", veg: true,  price: 1, size: "snack", meals: ["lunch", "dinner", "latenight"] },
{ name: "Ice cream", emoji: "🍦", veg: true,  price: 1, size: "snack", meals: ["dinner", "latenight"] }
];

// What the page remembers between clicks

const state = {
    current: null, //Current dish
    skipped: [], // names of dish skipped
    eaten: 0, // how many suggestions were accepted
    history: [] // accepted dishes
};

const $ = id => document.getElementById(id);

//Meal time from dropdown or even from real-life clock if set to auto

function getMeal() {
    if ($("meal").value !== "auto") return $("meal").value;
    const hour = new Date().getHours();
    if (hour < 11) return "breakfast";
    if (hour < 15) return "lunch";
    if (hour < 21) return "dinner";
    return "latenight";
}

function show(css, emoji, title, details, canChoose) {
    $("result").className = css;
    $("result").style.display = "block";
    $("emoji").textContent = emoji;
    $("dishName").textContent = title;
    $("details").textContent = details;
    $("yesBtn").hidden = !canChoose;
    $("skipBtn").hidden = !canChoose;
}

function suggest() {
  const meal = getMeal();
  const matches = dishes.filter(d =>
    d.meals.includes(meal) &&
    ($("size").value === "any" || d.size === $("size").value) &&
    ($("diet").value === "any" || d.veg) &&
    d.price <= Number($("budget").value) &&
    !state.skipped.includes(d.name)
  );

  // Conditional logic: 4 possible outcomes
  if (state.skipped.length >= 3) {
    state.skipped = [];
    state.current = null;
    show("fatigue", "👎🏽" ,"Maybe you are not actually hungry", "You said no three times. Just get a pizza.", false);
  } else if (matches.length === 0 && state.skipped.length > 0) {
    state.current = null;
    show("empty","😒", "Well thats everything", "You skipped everything that fits. Change a filter.", false);
  } else if (matches.length === 0) {
    state.current = null;
    show("nomatch","🤔",  "You are very picky", "Try a bigger budget or a different size.", false);
  } else {
    state.current = matches[Math.floor(Math.random() * matches.length)];
    const d = state.current;
    show("dish", d.emoji, d.name, "$".repeat(d.price) + " · " + d.size + " · " + (d.veg ? "vegetarian" : "contains meat"), true);
  }
}

//For buttons
$("findBtn").addEventListener("click", () => {
  state.skipped = [];
  suggest();
});

$("skipBtn").addEventListener("click", () => {
  state.skipped.push(state.current.name);
  suggest();
});

$("yesBtn").addEventListener("click", () => {
  state.eaten++;
  show("dish", "😋", "Enjoy your " + state.current.name + "!", "Press Find my food for another idea.", false);
  $("stats").textContent = "Last meal you chose: " + state.current.name;
  updateText();
});

$("meal").addEventListener("change", updateText);
updateText();

