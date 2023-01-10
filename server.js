/*
  1. Import module 'ApolloServer' yang telah kita install ke dalam file ini.
     Supaya kalian bisa menggunakan sepenuhnya framework Express.
  2. Import module 'jwt' untuk memverifikasi nilai token yang dinput.
  3. Import module 'typeDefs' untuk memanggil kelas schema. 
  4. Import module 'resolvers' untuk memanggil kelas resolver.
*/
const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const typeDefs = require('./src/schema/schema')
const resolvers = require('./src/resolvers/resolver')

require('dotenv').config()

//memangil file JWR SECRET dan nilai PORT dari file .env
const { JWT_SECRET, PORT } = process.env

//verifikasi token jwt yang dinput
const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET)
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

// Buat fungsi ApolloServer yang didapat dari import diatas menjadi sebuah variable bernama server.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        //mengambil nilai dari auth-token
        const token = req.headers['auth-token'];
        //memanggil fungsi getUser dengan paramter token yang diterima
        return { user: getUser(token) }
    },
    //digunakan untuk menampilkan user interface dari konsep GraphQL dan akan menampikannya di browser
    introspection: true,
    playground: true
})

// Setup server nya agar bisa dijalankan di port yang local di komputer kita.
server.listen({ port: PORT || 8080 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});