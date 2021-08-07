#!/usr/bin/python3
from brownie import SimpleCollectible, ERC721Rarible, accounts, network, config
from metadata import sample_metadata
from scripts.helpful_scripts import get_breed


def main():
    print("Working on " + network.show_active())
    advanced_collectible = ERC721Rarible[len(SimpleCollectible) - 1]
    breakpoint()
    number_of_advanced_collectibles = advanced_collectible.tokenCounter()
    print(number_of_advanced_collectibles)
