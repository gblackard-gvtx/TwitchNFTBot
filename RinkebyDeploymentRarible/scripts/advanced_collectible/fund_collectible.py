#!/usr/bin/python3
from brownie import ERC721Rarible
from scripts.helpful_scripts import fund_with_link


def main():
    advanced_collectible = ERC721Rarible[len(ERC721Rarible) - 1]
    fund_with_link(advanced_collectible.address)
