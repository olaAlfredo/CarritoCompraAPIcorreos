const { gql } = require('apollo-server');

const typeDefs = gql`
    enum rol{
        admin
        trabajador
        cliente
    }

    enum metodoPago {
        credito
        debito
        efectivo
    }

    type User {
        _id: ID! 
        nombreUsuario: String!
        email: String!
        password: String
        direccion: String
        fechaRegistro: String
        rolUsuario: rol
        metodoPago: metodoPago
        facturapiid: String!
    }

    type Query {
        getAllUsers: [User]!
        userById(_id: ID!): User
    }

    type Mutation {
        createUser(
            nombreUsuario: String!
            email: String!
            password: String!
            direccion: String
            rolUsuario: rol
            metodoPago: metodoPago
        ): User!

        updateUser(
            _id: ID! 
            nombreUsuario: String
            email: String
            password: String
            direccion: String
            rolUsuario: rol
            metodoPago: metodoPago
        ): User!

        deleteUser(_id: ID!): User!
    }
`;

module.exports = typeDefs;
