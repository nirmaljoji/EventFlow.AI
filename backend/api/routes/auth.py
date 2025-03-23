from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from pydantic import BaseModel
from ..database.mongodb import MongoDB

# Initialize router
router = APIRouter()

# Security configurations
SECRET_KEY = "your-secret-key"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Request models
class SignupRequest(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str

#helper functions

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise credentials_exception
        
        # Get database connection
        db = MongoDB.get_db()

        user = db.users.find_one({"email": username})
        
        if user is None:
            raise credentials_exception
            
        # Return the user ID as string
        return str(user["_id"])
        
    except JWTError:
        raise credentials_exception

    
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
async def signup(signup_data: SignupRequest):
    # Connect to MongoDB if not already connected
    db = MongoDB.get_db()
    
    # Check if user already exists
    existing_user = db.users.find_one({"email": signup_data.username})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    user_data = {
        "email": signup_data.username,
        "hashed_password": get_password_hash(signup_data.password),
        "firstName": signup_data.firstName,
        "lastName": signup_data.lastName,
        "created_at": datetime.utcnow()
    }
    
    # Insert user into database
    result = MongoDB.db.users.insert_one(user_data)
    
    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": signup_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Connect to MongoDB if not already connected
    db = MongoDB.get_db()
    
    # Find user
    user = db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    
    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}