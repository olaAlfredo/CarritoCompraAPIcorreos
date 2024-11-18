const Facturapi = require("facturapi").default;
const facturapi = new Facturapi("sk_test_gOVp4m6Xd5yWv3bEzgwe2Z5YXJzjLkenxlaN21oYZM");


async function createProduct(product){
    const facturapiProduct = {
        description: product.description,
        product_key: "50202306",
        price: product.price
    };
    return await facturapi.products.create(facturapiProduct);
}

async function updateProduct(id, product){
    const facturapiProduct = {
        description: product.description,
        price: product.price
    };
    return await facturapi.products.update(id, facturapiProduct);
}

async function deleteProduct(id){
    return await facturapi.products.del(id);
}

module.exports = {  createProduct, updateProduct, deleteProduct };