from advanced_collectible.create_metadata import pinMetadata
from advanced_collectible.create_nft_from_twitch_nftstore import pin_nft_to_nftstore
def test_pin_json():
    assert pinMetadata('testing.json') == 'bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa', "Should be bafkreih542xjbriydqjipek7gbtsmktbnii6bnom732xjvkuumrnp4ezoa"
def test_pin_video():
    assert pin_nft_to_nftstore('testing.mp4') == 'bafybeifz5gw6h2aoik3fa745rjzbi5hgtsjqmgys2a6mmskdw5zgtxtt5i', "Should be bafybeifz5gw6h2aoik3fa745rjzbi5hgtsjqmgys2a6mmskdw5zgtxtt5i"
def test_pin_video_small():
    assert pin_nft_to_nftstore('testing-small.mp4') == 'bafybeighzqvavbmhcui2h7rc3plphnriqhy47sew22syu2cey3snnqig5y', "Should be bafybeighzqvavbmhcui2h7rc3plphnriqhy47sew22syu2cey3snnqig5y"

if __name__ == "__main__":
    test_pin_json()
    test_pin_video_small()
    test_pin_video()
    print("Everything passed")