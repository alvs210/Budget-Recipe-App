let appState = {
    ingredientInput: [],
    selectedDiet: [],
    selectedIntol: [],
    minPrice: 0,
    maxPrice: 100,
    recipeArray: {}
}
class storedRecipe {
    constructor(id, data) {
        this.id = id
        this.data = data
        this.instructions = [];
     }
}


let ingredientField = document.querySelector(".ingredient-field")
let ingredientList = document.querySelector("#ingredient-list")
let lastResults = []

const saved = localStorage.getItem("appState")
if (saved) Object.assign(appState, JSON.parse(saved))

function restoreFilters() {
        // restore diet buttons
        document.querySelectorAll(".diet-filter-btn").forEach(btn => {
            btn.classList.toggle(
                "active",
                appState.selectedDiet.includes(btn.dataset.value)
            )
        })
    
        // restore intolerance buttons
        document.querySelectorAll(".intol-filter-btn").forEach(btn => {
            btn.classList.toggle(
                "active",
                appState.selectedIntol.includes(btn.dataset.value)
            )
        })
    }


window.addEventListener("DOMContentLoaded", () => {
        ingredientField = document.querySelector(".ingredient-field")
        ingredientList = document.querySelector("#ingredient-list")
    
        if (window.location.pathname.includes("index.html")) {
            const savedResults = localStorage.getItem('lastResults')
        if (savedResults) {
            lastResults = JSON.parse(savedResults)
            renderRecipes(lastResults)
        }
        renderApp()
        }
    })



// let ingredientInput = []; 

// const lastResults = document.querySelector()

function updateStateAndSave() {
    localStorage.setItem("appState", JSON.stringify(appState))
}

function handleFilterBtn(btn, selectedArray) {
    if (btn.classList.contains('active')) {
        btn.classList.remove('active')
        selectedArray.splice(selectedArray.indexOf(btn.dataset.value), 1)
    } else {
        btn.classList.add('active')
        selectedArray.push(btn.dataset.value)
    }
}

document.querySelectorAll('.diet-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleFilterBtn(btn, appState.selectedDiet)
        updateStateAndSave()
    })
})

document.querySelectorAll('.intol-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleFilterBtn(btn, appState.selectedIntol)
        updateStateAndSave()
    })
})

document.getElementById('add-btn')?.addEventListener('click', () => {
    const field = ingredientField
    const value = field.value.trim()
    if (value === '') return
    const values = value.split(',').map(v => v.trim()).filter(v => v !== '')
    values.forEach(v => {
        if (!appState.ingredientInput.includes(v)) {
            appState.ingredientInput.push(v)
            updateStateAndSave()}
        
    })
    field.value = ''
    renderIngredientList()
})

ingredientField?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('add-btn').click()
});

document.getElementById('search-btn')?.addEventListener('click', async () => {
    console.log('search clicked')
    if (appState.ingredientInput.length === 0) return
    const items = appState.ingredientInput.join(',')
    // const number = document.getElementById('result-limit').value
    const data = await getRecipes(items, appState.selectedIntol.join(','), appState.selectedDiet.join(','), 20)
    console.log(data)
    lastResults = data
    localStorage.setItem('lastResults', JSON.stringify(data))
    document.getElementById('sort-select').value = 'recommended'
    renderRecipes(data);
})


function filterByPrice() {
    const min = parseFloat(document.querySelector('.min-input').value) || 0;
    const max = parseFloat(document.querySelector('.max-input').value) || Infinity;

    const filtered = lastResults.filter(recipe => {
        if (!recipe.pricePerServing) return false;

        const price = recipe.pricePerServing / 100; // cents -> dollars

        return price >= min && price <= max;
    });

    renderRecipes(filtered);
    return
}


// Script.js
const rangevalue = document.querySelector(".slider .price-slider");
const rangeInputvalue = document.querySelectorAll(".range-input input");

// Set the price gap
let priceGap = 1;

// Adding event listeners to price input elements
const priceInputvalue = document.querySelectorAll(".price-input input");
for (let i = 0; i < priceInputvalue.length; i++) {
    priceInputvalue[i].addEventListener("input", e => {

        // Parse min and max values of the range input
        let minp = parseInt(priceInputvalue[0].value);
        let maxp = parseInt(priceInputvalue[1].value);
        let diff = maxp - minp

        if (minp < 0) {
            alert("minimum price cannot be less than 0");
            priceInputvalue[0].value = 0;
            minp = 0;
        }

        // Validate the input values
        if (maxp > 100) {
            alert("maximum price cannot be greater than 100");
            priceInputvalue[1].value = 100;
            maxp = 100;
        }

        if (minp > maxp - priceGap) {
            priceInputvalue[0].value = maxp - priceGap;
            minp = maxp - priceGap;

            if (minp < 0) {
                priceInputvalue[0].value = 0;
                minp = 0;
            }
        }

        // Check if the price gap is met and max price is within the range
        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
            if (e.target.className === "min-input") {
                rangeInputvalue[0].value = minp;
                let value1 = rangeInputvalue[0].max;
                rangevalue.style.left = `${(minp / value1) * 100}%`;
            }
            else {
                rangeInputvalue[1].value = maxp;
                let value2 = rangeInputvalue[1].max;
                rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
                filterByPrice(); // <-- add this
            }
        }
    });

    // Add event listeners to range input elements
    for (let i = 0; i < rangeInputvalue.length; i++) {
        rangeInputvalue[i].addEventListener("input", e => {
            let minVal = parseInt(rangeInputvalue[0].value);
            let maxVal = parseInt(rangeInputvalue[1].value);

            let diff = maxVal - minVal
            
            // Check if the price gap is exceeded
            if (diff < priceGap) {
            
                // Check if the input is the min range input
                if (e.target.className === "min-price-display") {
                    rangeInputvalue[0].value = maxVal - priceGap;
                }
                else {
                    rangeInputvalue[1].value = minVal + priceGap;
                }
            }
            else {
            
                // Update price inputs and range progress
                priceInputvalue[0].value = minVal;
                priceInputvalue[1].value = maxVal;
                rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
                rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            }
        });
    }
}



// async function init() {
//     const ions = await getRecipeInstructions();
//     renderRecipe(instructions);
// }

// async function init2() {
//     const widgetHtml = await getRecipePrice();
//     parsePriceBreakdown(widgetHtml);
// }


// // init();

// init2();

function sortAndRender() {
    const sort = document.getElementById('sort-select').value
    let sorted = [...lastResults]

    if (sort === 'price-asc') sorted.sort((a, b) => a.pricePerServing - b.pricePerServing)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.pricePerServing - a.pricePerServing)
    else if (sort === 'time-asc') sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes)
    else if (sort === 'time-desc') sorted.sort((a, b) => b.readyInMinutes - a.readyInMinutes)

    renderRecipes(sorted)
}

document.getElementById('sort-select')?.addEventListener('change', sortAndRender)

async function loadRecipe() {
    const params = new URLSearchParams(window.location.search)
    const recipeId = params.get('id')

    console.log("Recipe ID:", recipeId)
    const currentRecipe = await getRecipeDetails(recipeId)
    console.log(currentRecipe)
    const data = await getRecipeInstructions(currentRecipe)
    renderRecipeInstructions(currentRecipe)
    const widgetHtml = await getRecipePriceWidget(currentRecipe);
    // const htmlToWidget = parsePriceBreakdown(widgetHtml);
    renderPriceWidget(widgetHtml)
}

if (window.location.pathname.includes('recipe.html')) {
    loadRecipe()
}