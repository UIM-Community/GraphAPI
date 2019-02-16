require("make-promises-safe");
require("dotenv").config();

// Require Third-party Dependencies
const polka = require("polka");
const send = require("@polka/send-type");
const bodyParser = require("body-parser");
const { pu } = require("@uim/pu");
const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

// Globals
const port = process.env.port || 1337;

// GraphQL
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return "world";
                }
            }
        }
    })
});

// Init nimsoft Probe Utilities
const nimsoft = pu({
    login: process.env.uim_user || "adminitrator",
    password: process.env.uim_password,
    path: process.env.uim_path || "/opt/nimsoft/bin/pu"
});

const server = polka();
server.use(bodyParser.json());

server.get("/", (req, res) => {
    send(res, 200, { uptime: process.uptime() });
});

server.post("/", async (req, res) => {
    const query = req.body.query;
    if (typeof query !== "string") {
        send(res, 400, "body.query must be a string containing a GraphQL Query");
    }

    try {
        const result = await graphql(schema, query);
        const isError = Array.isArray(result.errors);

        send(res, isError ? 500 : 200, result);
    }
    catch (err) {
        console.error(err);

        send(res, 500, err.message);
    }
});

server.post("/pu", async (req, res) => {
    const { path, args = [] } = req.body;
    if (typeof path !== "string") {
        send(res, 400, "body.path must be a string");
    }
    if (!Array.isArray(args)) {
        send(res, 400, "body.args must be an Array of arguments (or undefined)");
    }

    try {
        const result = await nimsoft(path, args);
        send(res, 200, result);
    }
    catch (err) {
        console.error(err);

        send(res, 500, err.message);
    }
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Http Server is listening on port <${port}>`);
});
