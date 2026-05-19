import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import bcrypt
from app.database import get_db
from app.models import User, GardenPlot
from app.schemas import OnboardingPayload, UserResponse, GardenPlotResponse, UserLogin
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Auth & Onboarding"])


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_with_onboarding(payload: OnboardingPayload, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже зарегистрирован"
        )

    try:
        user_id = str(uuid.uuid4())
        new_user = User(
            id=user_id,
            email=payload.user.email,
            hashed_password=hash_password(payload.user.password),
            first_name=payload.user.first_name
        )
        db.add(new_user)

        plot_id = str(uuid.uuid4())
        first_plot = GardenPlot(
            id=plot_id,
            user_id=user_id,
            name=payload.first_plot.name,
            type=payload.first_plot.type,
            location=payload.first_plot.location
        )
        db.add(first_plot)

        db.commit()
        db.refresh(new_user)
        db.refresh(first_plot)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании аккаунта: {str(e)}"
        )

    access_token = create_access_token(data={"sub": new_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_attributes(new_user),
        "first_plot": GardenPlotResponse.from_attributes(first_plot)
    }


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id})

    user_plots = db.query(GardenPlot).filter(GardenPlot.user_id == user.id).all()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_attributes(user),
        "plots": [GardenPlotResponse.from_attributes(plot) for plot in user_plots]
    }

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось валидировать учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user