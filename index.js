const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GraphQL schema
const schema = buildSchema(`
  type FileInfo {
    filename: String!
    fullPath: String!
    size: Float!
    extension: String!
    createdDate: String!
    permissions: String!
    isDirectory: Boolean!
  }

  type Query {
    getDirectoryListing(path: String!): [FileInfo]
  }
`);

// Resolver function to get directory listing
const getDirectoryListing = (path) => {
  const files = fs.readdirSync(path);
  return files.map((file) => {
    const fullPath = `${path}/${file}`;
    const stats = fs.statSync(fullPath);
    const isDirectory = stats.isDirectory();
    const fileInfo = {
      filename: file,
      fullPath,
      size: stats.size,
      extension: file.split('.').pop(),
      createdDate: stats.birthtime.toISOString(),
      permissions: stats.mode.toString(8).slice(-3),
      isDirectory,
    };
    return fileInfo;
  });
};

// Root resolver
const root = {
  getDirectoryListing: ({ path }) => {
    return getDirectoryListing(path);
  },
};

// REST API endpoint
app.get('/api/directory', (req, res) => {
  const path = req.query.path;
  const directoryListing = getDirectoryListing(path);
  res.json(directoryListing);
});

// GraphQL API endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
