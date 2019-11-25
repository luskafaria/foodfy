/*=== RECIPE PAGE ===*/

const recipesList = document.querySelectorAll(".recipe");

for (var i = 0, len = recipesList.length; i < len; i++) {

  (function (index) {
    recipesList[i].onclick = function () {
      window.location.href = `/recipe/${index}`;
    }
  })(i);
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