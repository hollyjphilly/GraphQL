const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');


// dummy data
// var books = [
//     { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1"},
//     { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2"},
//     { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3"},
// ]

// var authors = [
//     { name: "Patrick Rothfuss", age: 44, id: "1"},
//     { name: "Brandon Sanderson", age: 42, id: "2"},
//     { name: "Terry Pratchett", age: 66, id: "3"},
// ]

// graph has object types on it
const { GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){ // parent here is the book
                // responsible for going out and grabbing data
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({  // must be a function because graphQL needs to look up type dependencies
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType), // use GraphQLList for has_many relationships
            resolve(parent, args){
                return _.filter(books, { authorId: parent.id })
            }
        }
    })
});

// entrypoint to graph is called a root query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // the "fields" you put here is what you will query for

        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){  // in JS there is not type of ID, but when we get the id in args it becomes string for us to urs in the resolve function
                // code to get data from db / other source
                // return _.find(books, { id: args.id });
            }
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
            }
        },
        
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return _.find(authors, { id: args.id })
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){ // args = what the user sent along
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save() // result of save() is what you get back after saving bc of return
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }
        }
        
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})