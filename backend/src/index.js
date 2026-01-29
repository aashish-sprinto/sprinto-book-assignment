import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { extractAuthContext } from './middleware/auth.js';

dotenv.config();

await connectDB();

const app = express();
const port = process.env.PORT || 4000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = new Set([frontendUrl, 'http://localhost:3000']);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.has(origin) || origin.includes('localhost:3000'))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
        res.header('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// Parse JSON
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const { user } = extractAuthContext({ req });
        return { user, req };
    },
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            locations: error.locations,
            path: error.path,
        };
    },
});

// Start Apollo server
await server.start();

// Ensure POST requests hitting `/` are forwarded to `/graphql` so curl or other tools work
app.post('/', (req, res, next) => {
    req.url = '/graphql';
    next();
});

server.applyMiddleware({ app, path: '/graphql', cors: false });

app.get('/', (req, res) => {
    res.json({
        message: '🚀 GraphQL Server is running',
        graphql: 'Visit /graphql for GraphQL Playground',
        health: 'Visit /health for health check',
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: '🚀 Backend is running!' });
});

app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    console.log(`📚 GraphQL Playground available at http://localhost:${port}/graphql`);
    console.log(`🔄 CORS enabled for: ${frontendUrl}`);
});

