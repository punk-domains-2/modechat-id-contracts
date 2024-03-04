// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "base64-sol/base64.sol";
import { OwnableWithManagers } from "../../access/OwnableWithManagers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../../lib/strings.sol";

/// @title Domain metadata contract
/// @author Tempe Techie
/// @notice Contract that stores metadata for a TLD
contract IonicIdMetadata is OwnableWithManagers {
  string public description = ".ion domains are a digital identity for Ionic community. Mint yours at https://id.ionic.money/";

  // EVENTS
  event DescriptionChanged(address indexed user, string description);
  event BrandChanged(address indexed user, string brand);

  // READ
  function getMetadata(string calldata _domainName, string calldata _tld, uint256 _tokenId) public view returns(string memory) {
    string memory fullDomainName = string(abi.encodePacked(_domainName, _tld));
    uint256 domainLength = strings.len(strings.toSlice(_domainName));

    return string(
      abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(abi.encodePacked(
        '{"name": "', fullDomainName, '", ',
        '"description": "', description, '", ',
        '"attributes": [',
          '{"trait_type": "length", "value": "', Strings.toString(domainLength) ,'"}'
        '], '
        '"image": "', _getImage(fullDomainName), '"}'))))
    );
  }

  function _getImage(string memory _fullDomainName) internal view returns (string memory) {
    string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">',
        '<rect x="0" y="0" width="500" height="500" fill="#000000"/>',
        '<text x="50%" y="50%" dominant-baseline="middle" fill="white" text-anchor="middle" font-size="x-large" font-family="sans-serif">',
        _fullDomainName,'</text>',
        '<g transform="translate(195, 350)"><path d="M40.4124 14.2559C40.4124 21.9878 34.1183 28.2559 26.3541 28.2559V22.6107C30.9876 22.6107 34.7437 18.8701 34.7437 14.2559C34.7437 9.64161 30.9876 5.90102 26.3541 5.90102C21.7207 5.90102 17.9645 9.64161 17.9645 14.2559H12.2959C12.2959 6.52387 18.59 0.255859 26.3541 0.255859C34.1183 0.255859 40.4124 6.52387 40.4124 14.2559Z" fill="#39FF88"/><path fill-rule="evenodd" clip-rule="evenodd" d="M60.8014 5.89534C60.8014 5.89534 60.293 5.91456 60.0256 5.90109L59.2319 5.89534C57.3354 5.94348 55.8553 6.52924 54.7917 7.65261C53.6469 8.82628 53.0744 10.6035 53.0744 12.9844V27.5714H46.7607V12.1796C46.7607 9.46342 47.249 7.25021 48.2255 5.54001C49.202 3.79627 50.5489 2.50524 52.2663 1.6669C53.9499 0.82857 55.8693 0.409405 58.0243 0.409405L60.0256 0.40946C60.0103 0.4076 60.5893 0.408191 61.1808 0.408794C61.4784 0.409098 61.779 0.409405 62.0089 0.409405C64.164 0.409405 66.0834 0.82857 67.767 1.6669C69.4843 2.50524 70.8312 3.79627 71.8077 5.54001C72.7842 7.25021 73.2725 9.46342 73.2725 12.1796V27.5714H66.9588V12.9844C66.9588 10.6035 66.3864 8.82628 65.2415 7.65261C64.1779 6.52924 62.6979 5.94348 60.8014 5.89534ZM100.907 26.1629C103.13 27.3366 105.655 27.9234 108.484 27.9234C111.11 27.9234 113.417 27.3869 115.404 26.3138C117.424 25.2072 118.956 23.6479 120 21.6359L115.151 18.8191C114.343 20.0934 113.35 21.0323 112.171 21.6359C111.026 22.2395 109.78 22.5413 108.433 22.5413C106.884 22.5413 105.487 22.206 104.241 21.5353C102.995 20.8646 102.019 19.9089 101.312 18.6682C100.604 17.3939 100.251 15.8849 100.251 14.1412C100.251 12.3975 100.604 10.9052 101.312 9.66449C102.019 8.39022 102.995 7.41775 104.241 6.74708C105.487 6.07642 106.884 5.74108 108.433 5.74108C109.78 5.74108 111.026 6.04288 112.171 6.64648C113.35 7.25008 114.343 8.18902 115.151 9.46329L120 6.64648C118.956 4.60095 117.424 3.05841 115.404 2.01888C113.417 0.94581 111.11 0.409278 108.484 0.409278C105.655 0.409278 103.13 0.996111 100.907 2.16978C98.7188 3.34345 97.0014 4.96981 95.7555 7.04888C94.5096 9.09442 93.8867 11.4585 93.8867 14.1412C93.8867 16.7903 94.5096 19.1544 95.7555 21.2335C97.0014 23.3126 98.7188 24.9557 100.907 26.1629ZM0 27.5713V0.711076H6.31366V27.5713H0ZM81.5088 27.5713V0.711076H87.8224V27.5713H81.5088Z" fill="white"/></g>',
      '</svg>'
    ))));

    return string(abi.encodePacked("data:image/svg+xml;base64,", svgBase64Encoded));
  }

  // WRITE (OWNER)

  /// @notice Only metadata contract owner can call this function.
  function changeDescription(string calldata _description) external onlyManagerOrOwner {
    description = _description;
    emit DescriptionChanged(msg.sender, _description);
  }
}