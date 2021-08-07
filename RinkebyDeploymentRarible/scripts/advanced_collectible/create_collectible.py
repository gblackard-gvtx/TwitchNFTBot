#!/usr/bin/python3
from brownie import ERC721Rarible, accounts, config
from scripts.helpful_scripts import fund_with_link
import time


def main():
    dev = accounts.add(config["wallets"]["from_key"])
    advanced_collectible = ERC721Rarible[len(ERC721Rarible) - 1]
    fund_with_link(advanced_collectible.address)
    transaction = advanced_collectible.createCollectible("None", {"from": dev})
    print("Waiting on second transaction...")
    # wait for the 2nd transaction
    transaction.wait(1)
    time.sleep(35)
    requestId = transaction.events["requestedCollectible"]["requestId"]
    advanced_collectible.requestIdToTokenId(requestId)
