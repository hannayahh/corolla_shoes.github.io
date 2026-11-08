const messageForm = document.getElementById("messageForm");
const formNotice = document.getElementById("formNotice");

if (messageForm && formNotice) {

    messageForm.addEventListener("submit", function(event) {

        event.preventDefault();

        formNotice.textContent =
            "Thank you! Your message form has been checked.";

        messageForm.reset();

    });

}

// GET SAVED CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// SELECTED PRODUCT
let selectedProduct = {
    name: "",
    description: "",
    video: "",
    images: {},
    prices: {}
};

// SAVE CART
function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

}

// OPEN PRODUCT MODAL
function openModal(name, description, video, images, prices) {

    selectedProduct = {
        name: name,
        description: description,
        video: video,
        images: images,
        prices: prices
    };

    document.getElementById("modalName").textContent = name;
    document.getElementById("modalDescription").textContent = description;

    let modalVideo = document.getElementById("modalVideo");
    let videoSource = document.getElementById("videoSource");

    videoSource.src = video;
    modalVideo.load();

    modalVideo.style.display = "block";
    modalVideo.play();

    document.getElementById("modalImage").style.display = "none";

    // COLOR OPTIONS

    let colorSelect = document.getElementById("shoeColor");

    colorSelect.innerHTML = '<option value="">Choose Color</option>';

    for (let color in images) {

        colorSelect.innerHTML += `
            <option value="${color}">${color}</option>
        `;

    }

    // SIZE OPTIONS

    let sizeSelect = document.getElementById("shoeSize");

    sizeSelect.innerHTML = '<option value="">Choose Size</option>';

    for (let size in prices) {

        sizeSelect.innerHTML += `
            <option value="${size}">${size}</option>
        `;

    }

    document.getElementById("modalPrice").textContent = "Select Size";

    document.getElementById("cartModal").style.display = "flex";

}
// UPDATE PRODUCT IMAGE AND PRICE

function updateProduct() {

    let color = document.getElementById("shoeColor").value;
    let size = document.getElementById("shoeSize").value;

    let video = document.getElementById("modalVideo");
    let image = document.getElementById("modalImage");

    if (color === "") {

        video.style.display = "block";
        image.style.display = "none";

    } else {

        video.pause();

        video.style.display = "none";
        image.style.display = "block";

        image.src = selectedProduct.images[color];

    }

    if (size !== "") {

        let price = selectedProduct.prices[size];

        document.getElementById("modalPrice").textContent =
            "₱" + Number(price).toLocaleString("en-PH");

    } else {

        document.getElementById("modalPrice").textContent = "Select Size";

    }

}

// CLOSE PRODUCT MODAL
function closeModal() {

    document.getElementById("cartModal").style.display = "none";

}

// OPEN CART SIDEBAR
function openCart() {

    displayCart();

    document.getElementById("cartSidebar").classList.add("active");

    document.getElementById("cartOverlay").classList.add("active");

}

// CLOSE CART SIDEBAR
function closeCart() {

    document.getElementById("cartSidebar").classList.remove("active");

    document.getElementById("cartOverlay").classList.remove("active");

}

// CONFIRM ADD TO CART

function confirmCart() {

    let color = document.getElementById("shoeColor").value;
    let size = document.getElementById("shoeSize").value;

    if (color === "" || size === "") {

        alert("Please select a color and size!");

        return;

    }

    let price = selectedProduct.prices[size];
    let image = selectedProduct.images[color];

    if (price === undefined || !image) {

        alert("This product variation is unavailable.");

        return;

    }

    let product = {

        name: selectedProduct.name,

        image: image,

        color: color,

        size: size,

        price: Number(price),

        quantity: 1

    };

    cart.push(product);

    saveCart();

    closeModal();

    openCart();

}

// DISPLAY CART ITEMS
function displayCart() {

    let cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    let total = 0;
    let totalQuantity = 0;

    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {

        let price = Number(item.price);
        let quantity = Number(item.quantity) || 1;

        let subtotal = price * quantity;

        total += subtotal;
        totalQuantity += quantity;

        cartItems.innerHTML += `

            <div class="cart-product">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-product-info">

                    <h4>${item.name}</h4>

                    <p>Size: ${item.size}</p>

                    <p>Color: ${item.color}</p>

                    <strong>
                        ₱${price.toLocaleString("en-PH")}
                    </strong>

                    <div class="quantity-control">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>${quantity}</span>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})">

                    Remove

                </button>

            </div>

        `;

    });

    // EMPTY CART
    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>Your cart is empty</h3>

                <p>Discover your perfect pair at Corolla Shoes.</p>

            </div>

        `;

    }

    // TOTAL PRICE
    let totalElement = document.getElementById("total");

    if (totalElement) {

        totalElement.innerText = total.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }

    // TOTAL QUANTITY
    let countElement = document.getElementById("cart-count");

    if (countElement) {

        countElement.innerText = totalQuantity;

    }

}

// CHANGE QUANTITY
function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart[index].quantity = 1;

    }

    saveCart();

}

// REMOVE ITEM
function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

}

// OPEN CHECKOUT
function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    let total = 0;

    cart.forEach(function(item) {

        total += Number(item.price) * Number(item.quantity);

    });

    document.getElementById("checkoutTotal").textContent =
        total.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("checkoutOverlay").classList.add("active");

}

// CLOSE CHECKOUT
function closeCheckout() {

    document.getElementById("checkoutOverlay").classList.remove("active");

}

// SUBMIT CHECKOUT
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        let customer = {

            name: document.getElementById("customerName").value,

            email: document.getElementById("customerEmail").value,

            phone: document.getElementById("customerPhone").value,

            address: document.getElementById("customerAddress").value,

            city: document.getElementById("customerCity").value,

            province: document.getElementById("customerProvince").value,

            postal: document.getElementById("customerPostal").value

        };


        let total = 0;

        cart.forEach(function(item) {

            total += Number(item.price) * Number(item.quantity);

        });


        let order = {

            customer: customer,

            products: [...cart],

            total: total,

            date: new Date().toLocaleString("en-PH")

        };


        // SAVE ORDER FOR DEMONSTRATION

        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(order);

        localStorage.setItem("orders", JSON.stringify(orders));


        alert("Thank you for ordering at Corolla Shoes! Your order has been recorded in this browser.");


        // CLEAR CART

        cart = [];

        localStorage.removeItem("cart");

        displayCart();

        closeCheckout();

        closeCart();

        checkoutForm.reset();

    });

}
// DISPLAY SAVED CART WHEN PAGE LOADS
displayCart();
