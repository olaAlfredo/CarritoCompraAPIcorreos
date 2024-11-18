const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombreUsuario: { type: String, require: true },
    email: { type: String, require: true, unique: true  },
    password: { type: String, require: true },
    direccion: { type: String, require: true},
    fechaRegistro: { type: Date, default: Date.now },
    rolUsuario: { type: String, enum: ["admin", "trabajador", "cliente"], default: "cliente"},
    metodoPago: { type: String, enum:["credito", "debito","efectivo"], default: "efectivo" },
    facturapiid: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);