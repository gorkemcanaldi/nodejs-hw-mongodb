import mongoose from 'mongoose';

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoUri);
    console.log('Mongo connection successfully established');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default initMongoConnection;
