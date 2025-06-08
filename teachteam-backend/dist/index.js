"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importStar(require("express"));
const data_source_1 = require("./data-source");
const lecturer_routes_1 = __importDefault(require("./routes/lecturer.routes"));
const tutor_routes_1 = __importDefault(require("./routes/tutor.routes"));
const lecturerProfile_routes_1 = __importDefault(require("./routes/lecturerProfile.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const tutorProfile_routes_1 = __importDefault(require("./routes/tutorProfile.routes"));
const cors_1 = __importDefault(require("cors"));
const preference_routes_1 = __importDefault(require("./routes/preference.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const lecturerAnalytics_routes_1 = __importDefault(require("./routes/lecturerAnalytics.routes"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const schema_2 = require("@graphql-tools/schema");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const ws_2 = require("graphql-ws/lib/use/ws");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", lecturer_routes_1.default);
app.use("/api", tutor_routes_1.default);
app.use("/api", lecturerProfile_routes_1.default);
app.use("/api", course_routes_1.default);
app.use("/api", application_routes_1.default);
app.use("/api", tutorProfile_routes_1.default);
app.use("/api", preference_routes_1.default);
app.use("/api", notification_routes_1.default);
app.use("/api", admin_routes_1.default);
app.use("/api", lecturerAnalytics_routes_1.default);
async function startServer() {
    const ws = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const schema = (0, schema_2.makeExecutableSchema)({ typeDefs: schema_1.typeDefs, resolvers: resolvers_1.resolvers });
    const serverCleanup = (0, ws_2.useServer)({ schema }, ws);
    const apolloServer = new server_1.ApolloServer({
        schema,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await apolloServer.start();
    app.use("/graphql", (0, cors_1.default)(), (0, express_1.json)(), (0, express4_1.expressMiddleware)(apolloServer));
    await data_source_1.AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}
startServer().catch((error) => console.log("Error during server initialization:", error));
