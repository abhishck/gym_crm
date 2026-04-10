import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const dbConnect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Database connected : ${dbConnect.connection.name} ${dbConnect.connection.host}`,
    );
  } catch (error) {
    console.log(`dbconnect error : ${error.message}`);
    process.exit(1);
  }
};


export default dbConnection;