import pytest
from fastapi import status
from fastapi.testclient import TestClient

from ..routers.user import UserCreate, UserUpdate


@pytest.mark.order("first")
def test_create_user(client: TestClient):
    """
    Test creating a new user.
    """
    facebook = "testuser"
    new_user = UserCreate(
        name="Test User", facebook=f"https://www.facebook.com/{facebook}"
    )
    response = client.post("/users/", json=new_user.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    user_id = response.json().get("id")
    assert user_id is not None
    # Read the user back to verify creation
    response = client.get(f"/users/{user_id}")
    assert response.status_code == status.HTTP_200_OK
    user_data = response.json()
    assert user_data["name"] == new_user.name
    assert user_data["facebook"] == facebook


def test_update_user(client: TestClient):
    """
    Test updating an existing user.
    """
    # Create a user to update
    new_user = UserCreate(name="To Be Updated")
    response = client.post("/users/", json=new_user.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    user_id = response.json().get("id")
    assert user_id is not None
    # Update the user
    facebook = "updated"
    update_user_info = UserUpdate(facebook=f"https://www.facebook.com/{facebook}")
    response = client.patch(
        f"/users/{user_id}", json=update_user_info.model_dump(exclude_unset=True)
    )
    assert response.status_code == status.HTTP_200_OK
    user_id = response.json().get("id")
    assert user_id is not None
    # Validate the update
    response = client.get(f"/users/{user_id}")
    assert response.status_code == status.HTTP_200_OK
    user_data = response.json()
    assert user_data["facebook"] == facebook
    # Try updating a non-existent user
    response = client.patch("/users/9999", json=new_user.model_dump())
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_user(client: TestClient):
    """
    Test deleting an existing user.
    """
    # Create a user to delete
    new_user = UserCreate(name="To Be Deleted")
    response = client.post("/users/", json=new_user.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    user_id = response.json().get("id")
    assert user_id is not None
    # Delete the user
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == status.HTTP_200_OK
    # Verify deletion
    response = client.get(f"/users/{user_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # Try deleting a non-existent user
    response = client.delete("/users/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
