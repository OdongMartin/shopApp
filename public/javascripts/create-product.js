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
        'Handmade Crafts': ['Type','Material', 'Size','Features'],

        'Auto Parts' : ['Brand', 'Model', 'Type', 'Compatibility', 'Warranty'], 
        'Car Accessories' : ['Brand', 'Model', 'Type', 'Compatibility', 'Warranty'],
        'Tools and Equipment' : ['Brand', 'Model', 'Type', 'Compatibility', 'Warranty'],

        'Haircare' :['Brand', 'Type', 'Ingredients', 'Skin Type', 'Usage Instructions'], 
        'Makeup' :['Brand', 'Type', 'Ingredients', 'Skin Type', 'Usage Instructions'], 
        'Skincare' :['Brand', 'Type', 'Ingredients', 'Skin Type', 'Usage Instructions'],

        'Art Supplies' :['Author', 'Genre', 'Format', 'Publisher', 'Type'], 
        'Books':['Author', 'Genre', 'Format', 'Publisher', 'Type'], 
        'Office Supplies':['Author', 'Genre', 'Format', 'Publisher', 'Type'], 

        'Computers and Laptops' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'], 
        'Consumer Electronics' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'], 
        'Smartphones and Accessories' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'],

        'Accessories' :['Brand', 'Type', 'Size', 'Color', 'Material'], 
        'Clothing' :['Brand', 'Type', 'Size', 'Color', 'Material'], 
        'Shoes' :['Brand', 'Type', 'Size', 'Color', 'Material'],

        'Beverages' : ['Brand', 'Type', 'Flavor', 'Ingredients', 'Expiry Date'], 
        'Gourmet Foods' : ['Brand', 'Type', 'Flavor', 'Ingredients', 'Expiry Date'],  
        'Snacks' : ['Brand', 'Type', 'Flavor', 'Ingredients', 'Expiry Date'], 

        'Customized Items' : ['Brand', 'Type', 'Occasion', 'Features'], 
        'Specialty Products' : ['Brand', 'Type', 'Occasion', 'Features'], 
        'Unique Gifts': ['Brand', 'Type', 'Occasion', 'Features'], 

        'Fitness Equipment' : ['Brand', 'Type', 'Usage Instructions'],
        'Supplements' : ['Brand', 'Type', 'Ingredients', 'Health Benefits', 'Usage Instructions'], 
        'Wellness Products' : ['Brand', 'Type', 'Ingredients', 'Health Benefits', 'Usage Instructions'],

        'Furniture' : ['Brand', 'Type', 'Material', 'Dimensions', 'Finish'], 
        'Home Decor': ['Brand', 'Type', 'Material', 'Dimensions', 'Finish'], 
        'Kitchen and Dining' : ['Brand', 'Type', 'Material', 'Dimensions', 'Finish'],

        'Fashion Accessories' : ['Brand', 'Material', 'Type', 'Size', 'Design'], 
        'Fine Jewelry' : ['Brand', 'Material', 'Type', 'Size', 'Design'],  
        'Watches' : ['Brand', 'Material', 'Type', 'Size', 'Design'], 

        'Pet Accessories' : ['Brand', 'Pet Type', 'Type', 'Size'], 
        'Pet Care Products' : ['Brand', 'Pet Type', 'Type', 'Size', 'Ingredients'], 
        'Pet Food' : ['Brand', 'Pet Type', 'Type', 'Size', 'Ingredients'],

        'Activewear' : ['Brand', 'Sports Type', 'Size', 'Material', 'Features'], 
        'Outdoor Gear' : ['Brand', 'Sports Type', 'Size', 'Material', 'Features'],  
        'Sports Equipment' : ['Brand', 'Sports Type', 'Size', 'Material', 'Features'], 

        'Innovative Gadgets' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'], 
        'Smart Home Devices' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'],  
        'Tech Accessories' : ['Brand', 'Model', 'Specifications', 'Compatibility', 'Warranty'], 

        'Board Games' : ['Brand', 'Age Group', 'Type', 'Features', 'Educational Value'],
        'Puzzles' : ['Brand', 'Age Group', 'Type', 'Features', 'Educational Value'], 
        'Toys for Kids' : ['Brand', 'Age Group', 'Type', 'Features', 'Educational Value'],
    
    }

    // Clear existing options
    additionalFields.innerHTML = '';

    const subCategoryValue = subCategory.value;

        // Create and display additional input fields based on the selected category
        categories[subCategoryValue].forEach(optionValue => {
            var label = document.createElement("label");
            label.textContent = optionValue;
            label.appendChild(document.createElement("br"));

            // var span = document.createElement("span");
            // span.textContent = "*";
            // span.className="text-red-700 font-bold";
            
            var input = document.createElement("input");
            input.type = "text";
            input.name = optionValue.toLowerCase().replace(/\s/g, ""); // Use option as the input name
            input.id = optionValue.toLowerCase().replace(/\s/g, "");
            input.maxlength = 30;
            input.className = "mb-3 p-2 rounded-xl bg-gray-700 text-white w-96";
            //input.required = true;

            additionalFields.appendChild(label);
            //additionalFields.appendChild(span);
            additionalFields.appendChild(input);
            additionalFields.appendChild(document.createElement("br"));
        });
    }
