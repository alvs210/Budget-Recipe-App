// const myKey = "f125c7ffef3644c3900b24fb2de89931"
// url = "https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2"
//const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=5&addRecipeNutrition=true&apiKey=${apiKey}`;

const myKey = process.env.myKey; 

async function getRecipes(items, intol = "", diet = "", number = 50) {
    console.log(items)
    console.log("fired getRecipes")
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${items}&ranking=2&number=${number}&intolerances=${intol}&diet=${diet}&addRecipeInformation=true&apiKey=${myKey}`
        )
        console.log(response.status)
        if (!response.ok) throw new Error(`HTTP Error! ${response.status}`)
        const data = await response.json()
        return data.results
    }
    catch (error) {
        console.log(myKey)
        console.log(error)
    }
}
//getRecipe('salmon')



async function getRecipeDetails(id, cals = false) {

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=${cals}&apiKey=${myKey}`
        )
        if (!response.ok) {
            throw new Error(`HTTP Error!${response.status}`)
        }
        const data = await response.json()
        console.log("fired")
        appState.recipeArray[id] = new storedRecipe(id, data)
        return data;
    }
    catch (error) {
        console.log(error)
    }
}

// getRecipeDetails('716429',true)

//recipe.pricePerServing // already in your data, in cents

async function getRecipePriceWidget(recipe) {
    const id = recipe.id
    console.log("fired Price Widget")
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/priceBreakdownWidget?apiKey=${myKey}`)
        if (!response.ok) throw new Error(`HTTP Error! getRecipePrice is ${response.status}`)

        const html = await response.text()
        //always put how you must process the response
        // console.log(html)
        return html
    }

    catch (error) { console.log(error)}
}

async function getRecipeInstructions(recipe) {
    // console.log(recipe)
    const id = recipe.id
    // console.log(id)
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${myKey}`,{
            
        })
            if (!response.ok) throw new Error(`HTTP Error! ${response.status}`)
            const data = await response.json();
            console.log(data)
            recipe.instructions = data
            return data;
        
    }
    catch (error) {
        console.log(error)
    }
}