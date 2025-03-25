import os
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel
from dotenv import load_dotenv
from ..utils.logger import logger
load_dotenv()

class MongoDB:
    client: MongoClient | None = None
    db = None

    @classmethod
    def connect_db(cls):
        try:
            mongodb_url = os.getenv("MONGODB_URL")
            database_name = os.getenv("DATABASE_NAME")
            
            cls.client = MongoClient(mongodb_url)
            cls.db = cls.client.get_database(database_name)
            
            logger.info("Mongo Check Complete")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    @classmethod
    def close_db(cls):
        if cls.client:
            cls.client.close()
            logger.info("Closed MongoDB connection")

    @classmethod
    def get_db(cls):
        return cls.db 