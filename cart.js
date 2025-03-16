    document.addEventListener('DOMContentLoaded', () => {
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeSidebarButton = document.getElementById('close-cart');
        const cartButton = document.getElementById('cart-icon');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalCost = document.getElementById('cart-total');
        const sizeBoxes = document.querySelectorAll('.size-box');
        const colorBoxes = document.querySelectorAll('.color-box');

        const quantityInput = document.getElementById('quantity-input');
        const decreaseButton = document.getElementById('decrease-qty');
        const increaseButton = document.getElementById('increase-qty');

        let selectedSize = "S"; 
        let selectedColor = "Black"; 
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        
        decreaseButton.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseButton.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value) || 1;
            quantityInput.value = currentValue + 1;
        });

        quantityInput.addEventListener('input', () => {
            if (parseInt(quantityInput.value) < 1 || isNaN(quantityInput.value)) {
                quantityInput.value = 1;
            }
        });

      
        sizeBoxes.forEach((box) => {
            box.addEventListener('click', function () {
                sizeBoxes.forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                selectedSize = this.textContent;
            });
        });

        
        colorBoxes.forEach((box) => {
            box.addEventListener('click', function () {
                colorBoxes.forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                selectedColor = this.getAttribute('data-color');
            });
        });

        function openSidebar() {
            cartSidebar.classList.add('open');
            populateCartSidebar();
        }

        function closeSidebar() {
            cartSidebar.classList.remove('open');
        }

       
        function populateCartSidebar() {
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartTotalCost.textContent = '0.00';
                return;
            }

            let total = 0;

            cart.forEach((item, index) => {
                const price = parseFloat(item.price);
                const itemTotal = price * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <p><strong>${item.name}</strong></p>
                    <p>Size: <strong>${item.size}</strong></p>
                    <p>Color: <strong>${item.color}</strong></p>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            cartTotalCost.textContent = total.toFixed(2);

           
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = parseInt(event.target.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }

        
            function addToCart() {
            const productName = document.querySelector('.details h1').textContent;
            const productPrice = parseFloat(document.querySelector('.price').textContent.replace('$', ''));
            const quantity = parseInt(quantityInput.value) || 1;

            let existingItem = cart.find(item =>
                item.name === productName && item.size === selectedSize && item.color === selectedColor
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name: productName, price: productPrice, size: selectedSize, color: selectedColor, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            populateCartSidebar();
            openSidebar();
        }

        
        function removeFromCart(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCartSidebar();
        }

    
        if (cartButton) {
            cartButton.addEventListener('click', (event) => {
                event.preventDefault();
                openSidebar();
            });
        }

        if (closeSidebarButton) {
            closeSidebarButton.addEventListener('click', closeSidebar);
        }

    
        document.querySelector('.btn').addEventListener('click', addToCart);

    
        populateCartSidebar();
    });
