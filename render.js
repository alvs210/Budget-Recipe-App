async function renderRecipes(recipes) {
    const grid = document.getElementById('recipe-grid')
    const placeholder = document.getElementById('placeholder-text')
    
    placeholder.style.display = 'none'
    grid.innerHTML = ''
    document.getElementById('placeholder-text').style.display = 'none'

    if (!recipes || recipes.length === 0) {
        document.getElementById('placeholder-text').style.display = 'block'
        document.getElementById('placeholder-text').textContent = 'No recipes found. Try different ingredients.'
        return
    }

    recipes.forEach(recipe => {
        const missingCost = recipe.pricePerServing
        
        const card = document.createElement('div')
        card.classList.add('recipe-card')
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h3>${recipe.title}</h3>
            <p>${recipe.readyInMinutes} mins</p>
            <p>$${(recipe.pricePerServing / 100).toFixed(2)} per serving</p>
            `
        card.addEventListener('click', async () => {
            window.location.href = `recipe.html?id=${recipe.id}`
            
        })
        grid.appendChild(card)

    })
}


function renderIngredientList() {
    const placeholder = document.getElementById('placeholder-text1')
    
    placeholder.style.display = 'none'
    // grid.innerHTML = ''
    document.getElementById('placeholder-text1').style.display = 'none'

    ingredientList.innerHTML = '';
    appState.ingredientInput.forEach((item, index) => {
        let li = document.createElement('li')
        li.textContent = item
        const removeBtn = document.createElement('button')
        removeBtn.textContent = '✕'
        removeBtn.addEventListener('click', () => {
            appState.ingredientInput.splice(index, 1)
            renderIngredientList()
        })
        li.appendChild(removeBtn)
        ingredientList.appendChild(li)
    })
}

//renders stuff and sends over to recipe.HTML

async function renderRecipeInstructions(recipe) {

    const div = document.querySelector('.detail-instructions');
    document.querySelector('.detail-title').textContent = recipe.title
    document.querySelector('.detail-image').src = recipe.image
    // const params = new URLSearchParams(window.location.search)
    // const recipeId = params.get('id');
    const haveList = document.getElementById('have-list')
    const needList = document.getElementById('need-list')
    const equipmentList = document.getElementById('equipment-list')
    let missingCost = 0

    if (!haveList || !needList || !equipmentList) return

    const recipeIngredients = new Set()
    const recipeEquipment = new Set()
    console.log(recipe.instructions)
    recipe.instructions.forEach(section => {
        section.steps.forEach(step => {
            step.ingredients?.forEach(i => recipeIngredients.add(i.name))
            step.equipment?.forEach(e => recipeEquipment.add(e.name))
        })
    })

    const userSet = new Set(
        appState.ingredientInput.map(i => i.toLowerCase())
    )

    haveList.innerHTML = ''
    needList.innerHTML = ''
    equipmentList.innerHTML = ''

    recipeIngredients.forEach(ing => {
        const li = document.createElement('li')

        if (userSet.has(ing.toLowerCase())) {
            li.textContent = ing
            li.classList.add('have')
            haveList.appendChild(li)
        } else {
            li.textContent = ing
            li.classList.add('need')
            needList.appendChild(li)
            // missingCost += 
            // console.log(ing.price.split(" ")[0])
        }
    })

    recipeEquipment.forEach(eq => {
        const li = document.createElement('li')
        li.textContent = eq
        equipmentList.appendChild(li)
    })

    if (div) {
        div.innerHTML = ''
        recipe.instructions.forEach(section => {
            if (section.name) {
                const h3 = document.createElement('h3')
                h3.textContent = section.name
                div.appendChild(h3)
            }
            const ol = document.createElement('ol')
            section.steps.forEach(step => {
                const li = document.createElement('li')
                li.textContent = step.step
                ol.appendChild(li)
            })
            div.appendChild(ol)
        })
    }
    // console.log(missingCost)
    // document.querySelector('.missing-cost').textContent = `Estimated missing ingredients cost: $${(missingCost / 100).toFixed(2)}`


    
}


function renderPriceWidget(html) {
    console.log('rendered')
    const container = document.querySelector('.price-widget');
    container.innerHTML = html
    container.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");

        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }

        document.body.appendChild(newScript);
        oldScript.remove();
});
}

function renderFilters() {
    document.querySelectorAll(".diet-filter-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            appState.selectedDiet.includes(btn.dataset.value)
        )
    })

    document.querySelectorAll(".intol-filter-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            appState.selectedIntol.includes(btn.dataset.value)
        )
    })
}

function renderApp() {
    renderIngredientList()
    renderFilters()
}
