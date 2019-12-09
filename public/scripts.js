/*=== NAV FONT-WEIGHT ===*/

const currentPage = location.pathname;
const menuItens = document.querySelectorAll(".header-nav a")

for (const item of menuItens) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active')
  }
}

/*=== RECIPE TOGGLE ===*/

const toggleButton = document.querySelectorAll('.toggle a');
const toggleContent = document.querySelectorAll('.toggle-content');



for (const button of toggleButton) {
  button.onclick = function () {
    if (button.innerHTML === 'ESCONDER') {
      button.innerHTML = 'MOSTRAR'

      const parent = button.parentElement.parentElement.querySelector('.toggle-content');
      parent.classList.add('hide')
       
    } else {
      button.innerHTML = 'ESCONDER'

      const parent = button.parentElement.parentElement.querySelector('.toggle-content');
      parent.classList.remove('hide')
      
    }

  }
}

/*===ADD NEW FIELD===*/
/*==Add Ingredient==*/
function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");
  
  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(
    true
  );

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = ""; 
  ingredients.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);

/*==Add Preparation==*/
  function addPreparation() {
    const steps = document.querySelector("#preparation");
    const fieldContainer = document.querySelectorAll(".preparation");
    
    // Realiza um clone do último passo adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(
      true
    );
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = ""; 
    steps.appendChild(newField);
  }
  
  document
    .querySelector(".add-preparation")
    .addEventListener("click", addPreparation);