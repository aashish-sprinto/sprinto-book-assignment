import sequelize from "../db/sequelize.js";
import { connectMongo } from "./mongo.js";

export const connectDB = async () => {
    try {

        await sequelize.authenticate();
        console.log("✅ PostgreSQL connected successfully");


        await sequelize.sync({ alter: true });
        console.log("✅ PostgreSQL tables synced");


        await connectMongo();
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};
