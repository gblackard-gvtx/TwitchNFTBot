from advanced_collectible.create_metadata import pinMetadata
from advanced_collectible.create_nft_from_twitch_nftstore import pin_nft_to_nftstore
def test_pin_json():
    assert pinMetadata('testing.json') == 'bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa', "Should be bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa"
def test_pin_video():
    assert pin_nft_to_nftstore('testing.mp4') == 'bafybeide3g67aazuwlijqdwreqeddioyn5wfj4b3uidh6zxtpemdaimmue', "Should be bafybeide3g67aazuwlijqdwreqeddioyn5wfj4b3uidh6zxtpemdaimmue"
def test_pin_video_small():
    assert pin_nft_to_nftstore('testing-small.mp4') == 'bafybeiew466bk3caift2gsnzeb23qmzmpqnim32utahanj5f5ks2ycvk7y', "Should be bafybeiew466bk3caift2gsnzeb23qmzmpqnim32utahanj5f5ks2ycvk7y"

if __name__ == "__main__":
    test_pin_json()
    test_pin_video_small()
    test_pin_video()
    print("Everything passed")