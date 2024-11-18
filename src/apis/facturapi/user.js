const Facturapi = require("facturapi").default;
const facturapi = new Facturapi("sk_test_gOVp4m6Xd5yWv3bEzgwe2Z5YXJzjLkenxlaN21oYZM");

async function createUser(user){
    const facturapiUser = {
        legal_name: user.nombreUsuario,
        tax_id: "XAXX010101001",
        tax_system: "601",
        email: user.email,
        address: {
            street: user.direccion || "",
            zip: "12345",
          },
        
    };
    return await facturapi.customers.create(facturapiUser);
}

async function updateUser(id, user){
    const facturapiUser = {
        legal_name: user.nombreUsuario,
        address: user.direccion,
        email: user.correo
    };
    return await facturapi.customers.update(id, facturapiUser);
}

async function deleteUser(id){
    return await facturapi.customers.del(id);
}

module.exports = {  createUser, updateUser, deleteUser };