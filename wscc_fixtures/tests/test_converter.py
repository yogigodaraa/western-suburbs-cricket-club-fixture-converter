
def test_sanitize_filename():
    """Test filename sanitization"""
    assert sanitize_filename("test.csv") == "test.csv"
    assert sanitize_filename("../test.csv") == "test.csv"
    assert sanitize_filename("test;.csv") == "test.csv"
