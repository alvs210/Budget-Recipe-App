//renders stuff and sends over to recipe.HTML


// function renderRecipe(instructions) {
//     const div = document.getElementById('detail-instructions');

//     let html = '';

//     instructions.forEach(section => {

//         if (section.name) {
//             html += `<h3>${section.name}</h3>`;
//         }

//         html += '<ol>';

//         section.steps.forEach(step => {
//             html += `<li>${step.step}</li>`;
//         });

//         html += '</ol>';
//     });

//     div.innerHTML = html;
// }


// function parsePriceBreakdown(html) {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");

//     const seen = new Set();

//     return [...doc.querySelectorAll("[data-name]")]
//         .map(item => ({
//             name: item.dataset.name,
//             amount: item.dataset.amount,
//             price: item.dataset.price
//         }))
//         .filter(item => {
//             if (seen.has(item.name)) return false;
//             seen.add(item.name);
//             return true;
//         });
// }

// function renderPriceWidget(mapy) {
//     console.log('rendered widget')
//     const container = document;

//     const card = document.createElement('div')
//     card.classList.add('recipe-parts')
//     return

// }