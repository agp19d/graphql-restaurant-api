const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");

// Sample Data
const restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      { name: "Swordfish grill", price: 27 },
      { name: "Roasted Broccoli", price: 11 },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      { name: "Flatbread", price: 14 },
      { name: "Carbonara", price: 18 },
      { name: "Spaghetti", price: 19 },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      { name: "Dragon Roll", price: 12 },
      { name: "Pancake roll", price: 11 },
      { name: "Cod cakes", price: 13 },
    ],
  },
];

// Schema Definition
const schema = buildSchema(`
type Query {
  restaurant(id: Int): Restaurant
  restaurants: [Restaurant]
},
type Restaurant {
  id: Int
  name: String
  description: String
  dishes: [Dish]
},
type Dish {
  name: String
  price: Int
},
input RestaurantInput {
  name: String
  description: String
},
type DeleteResponse {
  ok: Boolean!
},
type Mutation {
  setrestaurant(input: RestaurantInput): Restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): Restaurant
},
`);

// Resolver Functions
const root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    const newRestaurant = { id: restaurants.length + 1, ...input, dishes: [] };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    const ok = index !== -1;
    if (ok) {
      restaurants.splice(index, 1);
    }
    return { ok };
  },
  editrestaurant: ({ id, name }) => {
    const restaurant = restaurants.find(restaurant => restaurant.id === id);
    if (!restaurant) {
      throw new Error("restaurant doesn't exist");
    }
    restaurant.name = name;
    return restaurant;
  },
};

// Server Setup
const app = express();
const port = 5500;

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => console.log(`Running GraphQL on Port:${port}`));

module.exports = root;
