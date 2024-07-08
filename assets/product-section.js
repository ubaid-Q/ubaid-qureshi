document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.custom-dropdown');
  const selected = dropdown.querySelector('.dropdown-selected');
  const arrow = dropdown.querySelector('.down-arrow');
  const optionsContainer = dropdown.querySelector('.dropdown-options');

  let selectedColor = null;
  let selectedSize = null;
  let selectedVariantId = null;
  const softWinterJacketVariantId = '8544113099002'; // Soft winter jacket variant ID

  selected.addEventListener('click', () => {
    optionsContainer.classList.toggle('show');
  });

  arrow.addEventListener('click', () => {
    optionsContainer.classList.toggle('show');
  });

  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      optionsContainer.classList.remove('show');
    }
  });

  document.querySelectorAll('.open-popup').forEach(function(button) {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      const product = productsData[productId];

      if (product) {
        document.getElementById('popup-product-image').src = product.image;
        document.getElementById('popup-product-title').textContent = product.title;
        document.getElementById('popup-product-title').setAttribute('data-product-id', productId);
        document.getElementById('popup-product-price').textContent = product.price;
        document.getElementById('popup-product-description').innerHTML = product.description;

        const sizeOptions = new Set(product.variants.map(variant => variant.option1));
        optionsContainer.innerHTML = '';
        sizeOptions.forEach(size => {
          const option = document.createElement('div');
          option.classList.add('dropdown-option');
          option.textContent = size;
          optionsContainer.appendChild(option);

          option.addEventListener('click', () => {
            selected.textContent = size;
            selectedSize = size.toLowerCase(); // Normalize the size input
            optionsContainer.classList.remove('show');
            updateSelectedVariantId(productId);
          });

          option.addEventListener('mouseover', () => {
            option.style.backgroundColor = '#000';
            option.style.color = '#fff';
          });

          option.addEventListener('mouseout', () => {
            option.style.backgroundColor = '';
            option.style.color = '';
          });
        });

        document.getElementById('pop-up-container').style.display = 'block';
        document.getElementById('product-popup').style.display = 'block';
      }
    });
  });

  document.querySelector('.close-popup').addEventListener('click', function() {
    document.getElementById('pop-up-container').style.display = 'none';
    document.getElementById('product-popup').style.display = 'none';
  });

  document.getElementById('pop-up-container').addEventListener('click', function() {
    document.getElementById('pop-up-container').style.display = 'none';
    document.getElementById('product-popup').style.display = 'none';
  });

  window.selectColor = function(color) {
    const whiteBox = document.getElementById('white-box');
    const blackBox = document.getElementById('black-box');
    const whiteLine = document.getElementById('white-line');
    const blackLine = document.getElementById('black-line');

    if (color === 'white') {
      selectedColor = 'White'; // Set selected color
      whiteBox.style.backgroundColor = 'black';
      whiteBox.style.color = 'white';
      whiteLine.style.backgroundColor = 'white';
      blackBox.style.backgroundColor = 'white';
      blackBox.style.color = 'black';
      blackLine.style.backgroundColor = 'black';
    } else if (color === 'black') {
      selectedColor = 'Black'; // Set selected color
      blackBox.style.backgroundColor = 'black';
      blackBox.style.color = 'white';
      blackLine.style.backgroundColor = 'black';
      whiteBox.style.backgroundColor = 'white';
      whiteBox.style.color = 'black';
      whiteLine.style.backgroundColor = 'white';
    }
    const productId = document.getElementById('popup-product-title').getAttribute('data-product-id');
    updateSelectedVariantId(productId);
  };

  function updateSelectedVariantId(productId) {
    if (selectedSize && selectedColor) {
      const product = productsData[productId];
      const selectedVariant = product.variants.find(variant => variant.option1.toLowerCase() === selectedSize && variant.option2 === selectedColor);
      if (selectedVariant) {
        selectedVariantId = selectedVariant.id;
      }
    }
  }

  function addSoftWinterJacket(formData) {
    // console.log("Selected Size: " + selectedSize);
    // console.log("Selected Color: " + selectedColor);
    if (selectedSize.trim().toLowerCase() === 'M' && selectedColor.trim().toLowerCase() === 'Black') {
      // console.log("Adding soft winter jacket to the cart");
      formData.items.push({
        id: softWinterJacketVariantId,
        quantity: 1
      });
    } else {
      // console.log("Conditions not met for adding soft winter jacket");
    }
  }

  document.getElementById('add-to-cart').addEventListener('click', function() {
    const productId = document.getElementById('popup-product-title').getAttribute('data-product-id');

    if (selectedSize && selectedColor && selectedVariantId) {
      const formData = {
        items: [{
          id: selectedVariantId,
          quantity: 1
        }]
      };

      addSoftWinterJacket(formData);
      console.log("Form data before fetch: ", formData);

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        document.getElementById('atc-notification').style.display = 'block';
        setTimeout(() => {
          document.getElementById('atc-notification').style.display = 'none';
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert('Please select a size and color.');
    }
  });
});
