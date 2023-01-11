const { gql } = require('apollo-server')

const typeDefs = gql `
scalar Date
     
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        date: Date
        exp: Int!
        points: Int!
        avatar : String!
        level: Int
        rank: Int
    }
    type AuthPayload {
        token: String!
        user: User!
    }
    enum Category {
        reading
        writing 
        listening
        speaking
    }
    type Level {
        id: Int!
        category : Category!
        episode: Int!
        level: Int!
        question: String!
        answer1: String!
        answer2: String!
        answer3: String!
        answer4: String!
        correctanswer: Int!
        sound: String
        isCompleted: Boolean
    }
    type SavedLevel {
        id: ID!
        category: String!
        episode: Int!
        level: Int!
        createdAt: Date
        isCompleted: Boolean!
    }
    type Progress {
        true: Int!
        false: Int!
        notStarted: Int!
    }
    type Profile{
        userCheck: User!
        level: Int!
        rank: Int!
    }
    type GetEpisode {
        episode: Int!
        progress: Float!
        level: Int!
    }
    type Query {
        getProfile: [User]!
        getUserSavedLevel(category: String!, episode:Int!): SavedLevel!
        getUserLevel(category: String!, episode:Int!): [Level]!
        getProgress(category: String!, episode:Int!): Progress!
        getEpisode(category: String!): [GetEpisode]!
        getLeaderboard: [User]!
    }
    type Mutation {
        registerUser( name: String!, email: String!, password: String!): User!
        login (email: String!, password: String!): AuthPayload!
        forgotPassword(email: String!, password: String!): User!
        updateUser(name: String!, email: String!, password: String!, avatar: String!): User!
        savedUserProgress(category: String!, episode: Int!, level: Int!, isCompleted: Boolean!): SavedLevel!

        uploadSoal(category: String!, episode: Int!, level: Int!, question: String!, answer1: String!, answer2: String!, answer3: String!, answer4: String!, correctanswer: Int!): Level!
}
`

module.exports = typeDefs