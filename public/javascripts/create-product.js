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
}