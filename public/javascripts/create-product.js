function getSelectedCategory() {
    var selectedCategory = document.getElementById("category");
    var subCategory = document.getElementById("subcategory");
    const categories = {
        'Art and Crafts': ['Art Prints', 'DIY Supplies', 'Handmade Crafts'],
        'Automotive': ['Auto Parts', 'Car Accessories', 'Tools and Equipment'],
        'Beauty and Personal Care': ['Haircare', 'Makeup', 'Skincare'],
        'Books and Stationery': ['Art Supplies', 'Books', 'Office Supplies'],
        'Electronics and Gadgets': ['Computers and Laptops', 'Consumer Electronics', 'Smartphones and Accessories'],
        'Fashion and Apparel': ['Accessories', 'Clothing', 'Shoes'],
        'Food and Beverages': ['Beverages', 'Gourmet Foods', 'Snacks'],
        'Gifts and Specialty Items': ['Customized Items', 'Specialty Products', 'Unique Gifts'],
        'Health and Wellness': ['Fitness Equipment', 'Supplements', 'Wellness Products'],
        'Home and Furniture': ['Furniture', 'Home Decor', 'Kitchen and Dining'],
        'Jewelry and Accessories': ['Fashion Accessories', 'Fine Jewelry', 'Watches'],
        'Pet Supplies': ['Pet Accessories', 'Pet Care Products', 'Pet Food'],
        'Sports and Outdoors': ['Activewear', 'Outdoor Gear', 'Sports Equipment'],
        'Tech and Gadgets': ['Innovative Gadgets', 'Smart Home Devices', 'Tech Accessories'],
        'Toys and Games': ['Board Games', 'Puzzles', 'Toys for Kids'],
    }

    // Clear existing options
    subCategory.innerHTML = '';

    // Get selected category value
    const selectedCategoryValue = selectedCategory.value;

    // Populate subcategory options
    categories[selectedCategoryValue].forEach(optionValue => {
        var option = document.createElement("option");
        option.value = optionValue;
        option.text = optionValue;
        subCategory.add(option);
    });

    getSelectedSubCategory()
}

function getSelectedSubCategory() {
    var subCategory = document.getElementById("subcategory");
    var additionalFields = document.getElementById('additionalFields');

    const categories = {
        'Art Prints': ['Artist','Type','Material', 'Size','Features'],
        'DIY Supplies': ['Type','Material', 'Size','Features'],
        'Handmade Crafts': ['Type','Material', 'Size','Features']

        // 'Auto Parts', 
        // 'Car Accessories', 
        // 'Tools and Equipment',

        // 'Haircare', 
        // 'Makeup', 
        // 'Skincare',

        // 'Art Supplies', 
        // 'Books', 
        // 'Office Supplies',

        // 'Computers and Laptops', 
        // 'Consumer Electronics', 
        // 'Smartphones and Accessories',

        // 'Accessories', 
        // 'Clothing', 
        // 'Shoes',

        // 'Beverages', 
        // 'Gourmet Foods', 
        // 'Snacks',

        // 'Customized Items', 
        // 'Specialty Products', 
        // 'Unique Gifts',

        // 'Fitness Equipment',
        // 'Supplements', 
        // 'Wellness Products',

        // 'Furniture', 
        // 'Home Decor', 
        // 'Kitchen and Dining',

        // 'Fashion Accessories', 
        // 'Fine Jewelry', 
        // 'Watches',

        // 'Pet Accessories', 
        // 'Pet Care Products', 
        // 'Pet Food',

        // 'Activewear', 
        // 'Outdoor Gear', 
        // 'Sports Equipment',

        // 'Innovative Gadgets', 
        // 'Smart Home Devices', 
        // 'Tech Accessories',

        // 'Board Games', 
        // 'Puzzles', 
        // 'Toys for Kids'
    
    }

    // Clear existing options
    additionalFields.innerHTML = '';

    const subCategoryValue = subCategory.value;

        // Create and display additional input fields based on the selected category
        categories[subCategoryValue].forEach(optionValue => {
            var label = document.createElement("label");
            label.textContent = optionValue;
            label.appendChild(document.createElement("br"));
            
            var input = document.createElement("input");
            input.type = "text";
            input.name = optionValue.toLowerCase().replace(/\s/g, ""); // Use option as the input name
            input.id = optionValue.toLowerCase().replace(/\s/g, "");
            input.maxlength = 30;
            input.className = "mb-3 p-2 rounded-xl bg-gray-700 text-white w-96";

            additionalFields.appendChild(label);
            additionalFields.appendChild(input);
            additionalFields.appendChild(document.createElement("br"));
        });
    }
