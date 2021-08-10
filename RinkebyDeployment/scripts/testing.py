from advanced_collectible.create_metadata import pinMetadata
def test_pin_json():
    assert pinMetadata('testing.json') == 'bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa', "Should be bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa"

if __name__ == "__main__":
    test_pin_json()
    print("Everything passed")