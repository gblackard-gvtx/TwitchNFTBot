from advanced_collectible.create_metadata import pinMetadata
def test_pin_json():
    print(pinMetadata('testing.json'))
    assert pinMetadata('testing.json') == 'bafkreigj5llwdsvexm2v4s7dhtlq33a6vod7bzz6fcczb4rgha6bnrnuzq', "Should be bafkreigj5llwdsvexm2v4s7dhtlq33a6vod7bzz6fcczb4rgha6bnrnuzq"

if __name__ == "__main__":
    test_pin_json()
    print("Everything passed")