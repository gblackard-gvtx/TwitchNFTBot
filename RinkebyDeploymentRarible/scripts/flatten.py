#!/usr/bin/python3
from brownie import ERC721Rarible, accounts, network, config, interface
import json


def main():
    flatten()


def flatten():
    file = open("./ERC721Rarible_flattened.json", "w")
    json.dump(ERC721Rarible.get_verification_info(), file)
    file.close()
