const ShoppingCart = require('../models/shoppingCartModel');
const email = require('../apis/correo/email');

module.exports = {
  getAllShoppingCarts: async () => await ShoppingCart.find(),
  getShoppingCartById: async (_id) => await ShoppingCart.findOne({ _id }),
  getShoppingCartByUser: async (userId) => await ShoppingCart.find({ "user._id": userId }),
  createShoppingCart: async (args) => {
    const newShoppingCart = new ShoppingCart(args);
    let subtotal = 0;
    for (let i = 0; i < newShoppingCart.product.length; i++) {
      subtotal += newShoppingCart.product[i].price;
    }
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    newShoppingCart.subtotal = subtotal;
    newShoppingCart.IVA = iva;
    newShoppingCart.total = total;
    return await newShoppingCart.save();
  },
  updateShoppingCart: async (cartId, updates) => {
    const cart = await ShoppingCart.findById(cartId);
    if (cart && cart.status === 'ACTIVE') {
      Object.assign(cart, updates);
      return await cart.save();
    }
    throw new Error('Cannot update an inactive cart');
  },
  deleteShoppingCart: async (_id) => {
    const deletedShoppingCart = await ShoppingCart.findByIdAndDelete(_id);
    return deletedShoppingCart;
  },
  // Other mutations
  addProductShoppingCart: async (cartId, product) => {
    const cart = await ShoppingCart.findById(cartId);
    if (cart && cart.status === 'ACTIVE') {
      cart.product.push(product);
      let newSubtotal = 0;
      newSubtotal = product.price + cart.subtotal;
      const iva = newSubtotal * 0.16;
      const total = newSubtotal + iva;
      cart.subtotal = newSubtotal;
      cart.IVA = iva;
      cart.total = total;
      return await cart.save();
    }
    throw new Error('Cannot add product to an inactive cart');
  },
  removeProductFromShoppingCart: async (cartId, productId) => {
    const cart = await ShoppingCart.findById(cartId);
    if (cart && cart.status === 'ACTIVE') {
      const productToRemove = cart.product.find(p => p._id === productId);

      if (!productToRemove) {
        throw new Error('Product not found in cart');
      }
      cart.product = cart.product.filter(p => p._id !== productId);
      let newSubtotal = cart.subtotal - productToRemove.price;
      const iva = newSubtotal * 0.16;
      const total = newSubtotal + iva;
      cart.subtotal = newSubtotal;
      cart.IVA = iva;
      cart.total = total;

      return await cart.save();
    }
    throw new Error('Cannot remove product from an inactive cart');
  },

  closeShoppingCart: async (cartId) => {
    const cart = await ShoppingCart.findById(cartId);
    if (cart) {
      cart.status = 'INACTIVE';
      cart.endDate = new Date();
      console.log("Enviando correo");
  
      // Construir la tabla de productos
      const productTable = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f1f1f1;">
              <th style="border: 1px solid #ddd; padding: 8px;">Nombre</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Descripción</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Precio</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cart.product.map(product => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.description}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${product.price.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity || 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${(product.price * (product.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
  
      email.send(
        cart.user,
        `TecStore`,
        `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Carrito de Compras Cerrado</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f8f8f8;
                  }
                  .email-container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      overflow: hidden;
                  }
                  .header {
                      background-color: #2196F3;  /* Encabezado */
                      color: #ffffff;
                      text-align: center;
                      padding: 20px;
                  }
                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }
                  .content {
                      padding: 20px;
                      color: #333333;
                  }
                  .content h2 {
                      margin: 0 0 10px;
                      font-size: 20px;
                      color: #2196F3;  /* Titulo */
                  }
                  .content p {
                      line-height: 1.6;
                      margin: 0 0 10px;
                  }
                  .footer {
                      text-align: center;
                      padding: 15px;
                      font-size: 12px;
                      color: #888888;
                      background-color: #f1f1f1;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="header">
                      <h1>¡Gracias por tu compra en TecStore!</h1>
                  </div>
                  <div class="content">
                      <h2>¡Hola ${cart.user.nombreUsuario}!</h2>
                      <p>Gracias por realizar tu compra en TecStore. Tu pedido ha sido registrado exitosamente y está listo para ser procesado.</p>
                      <p>Detalle de tu pedido:</p>
                      ${productTable}
                  </div>
                  <div class="footer">
                      <p>Este es un mensaje automático de TecStore. Si tienes alguna pregunta, por favor contáctanos a través de nuestro servicio al cliente.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      );
  
      return await cart.save();
    }
    throw new Error('Cart not found');
  }
};
