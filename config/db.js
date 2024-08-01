// Mongo DB Atlas connection
import { connect } from "mongoose";

const db_uri = process.env.db_uri;

if (!db_uri) {
  throw new Error('db_uri no está definida en las variables de entorno');
}

async function main() {
  await connect(db_uri);
}

main()
  .then(() => console.log("MongoDB Database on Mongo Atlas Cloud Service Connected."))
  .catch((err) => console.log(`Database connection failed: ${err.message}`));
