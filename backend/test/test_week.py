import pytest
from datetime import datetime
from fastapi import status
from fastapi.testclient import TestClient

from ..routers.week import WeekCreate, WeekUpdate


# Test creation of the week record with the date
@pytest.mark.order(after="test_delete_user")
def test_create_week(client: TestClient):
    date = "2025-08-29"
    week_data = WeekCreate(date=datetime.fromisoformat(date))
    response = client.post("/weeks/", json=week_data.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    week_id = response.json().get("id")
    assert week_id is not None
    # Read data back to validate
    response = client.get(f"/weeks/{week_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["date"] == date
    # Block creating week record with the same date
    response = client.post("/weeks/", json=week_data.model_dump())
    assert response.status_code == status.HTTP_400_BAD_REQUEST


# Test update week record with date
def test_update_and_delete_week(client: TestClient):
    date = "2025-09-04"
    week_data = WeekCreate(date=datetime.fromisoformat(date))
    response = client.post("/weeks/", json=week_data.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    week_id = response.json().get("id")
    assert week_id is not None
    # Update the week record
    updated_date = "2025-09-05"
    updated_data = WeekUpdate(date=datetime.fromisoformat(updated_date))
    response = client.put(f"/weeks/{week_id}", json=updated_data.model_dump())
    assert response.status_code == status.HTTP_200_OK
    # Read data back to validate
    response = client.get(f"/weeks/{week_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["date"] == updated_date
    # Test delete
    response = client.delete(f"/weeks/{week_id}")
    assert response.status_code == status.HTTP_200_OK
    # Verify deletion
    response = client.get(f"/weeks/{week_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # If delete non-existing week
    response = client.delete(f"/weeks/{week_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
