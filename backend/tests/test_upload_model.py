from app.models.upload import DatasetProfile, Upload


def test_upload_model_fields():
    upload = Upload(
        file_name="orders.csv",
        dataset_type="Orders",
        row_count=10,
        status="COMPLETED",
        validation_score=100,
        uploaded_by="tester",
    )
    assert upload.file_name == "orders.csv"
    assert upload.dataset_type == "Orders"


def test_dataset_profile_model_fields():
    profile = DatasetProfile(
        upload_id=1,
        row_count=10,
        column_count=5,
        duplicate_rows=0,
        null_percentage=0.0,
        profile_schema=[],
        statistics={},
    )
    assert profile.column_count == 5
