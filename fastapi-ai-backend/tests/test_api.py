import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models_db import User, AIPredictionLog
from main import app
from auth import EXPECTED_API_KEY

# Use a file-based SQLite database for test isolation (avoids memory connection drop issues)
TEST_DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_database():
    # Recreate tables for each test case
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply the database override
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    # Use context manager to trigger lifespan events (loads the model)
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_user_registration_and_login(client):
    # 1. Register a new user
    reg_response = client.post(
        "/auth/register",
        json={"email": "tester@caos.in", "password": "secure_password", "role": "Senior CA"}
    )
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert reg_data["email"] == "tester@caos.in"
    assert reg_data["role"] == "Senior CA"
    assert "id" in reg_data

    # Try registering the same email again (should fail)
    duplicate_response = client.post(
        "/auth/register",
        json={"email": "tester@caos.in", "password": "secure_password"}
    )
    assert duplicate_response.status_code == 400

    # 2. Login to get JWT Token
    login_response = client.post(
        "/auth/login",
        json={"email": "tester@caos.in", "password": "secure_password"}
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert token_data["token_type"] == "bearer"
    assert "access_token" in token_data

    # Try logging in with wrong password
    bad_login = client.post(
        "/auth/login",
        json={"email": "tester@caos.in", "password": "wrong_password"}
    )
    assert bad_login.status_code == 401

    # 3. Retrieve User Profile via token
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "tester@caos.in"

def test_predict_unauthorized(client):
    # Send request without any credentials (should fail)
    response = client.post("/predict", json={"invoice_text": "Missing PAN"})
    assert response.status_code == 401

def test_predict_authorized_via_api_key(client):
    # Send request with valid X-API-Key header (should pass)
    headers = {"X-API-Key": EXPECTED_API_KEY}
    response = client.post("/predict", json={"invoice_text": "gst mismatch"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["risk"] == "High"

def test_predict_authorized_via_jwt(client):
    # Register & Login to get token
    client.post("/auth/register", json={"email": "ca@caos.in", "password": "password123"})
    login_res = client.post("/auth/login", json={"email": "ca@caos.in", "password": "password123"})
    token = login_res.json()["access_token"]

    # Send request with JWT Authorization header (should pass)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/predict", json={"invoice_text": "missing pan"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["risk"] == "Medium"

