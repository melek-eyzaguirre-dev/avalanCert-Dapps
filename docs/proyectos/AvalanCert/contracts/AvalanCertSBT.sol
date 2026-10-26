// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IERC5192.sol";

/**
 * @title AvalanCertSBT
 * @notice Soulbound Token (ERC-5192) para certificaciones académicas nativas y externas en Avalanche.
 */
contract AvalanCertSBT is ERC721URIStorage, AccessControl, IERC5192 {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    uint256 private _nextTokenId;

    struct CertificateData {
        bytes32 documentHash; // Hash SHA-256 del documento o link canónico
        address issuer;       // Institución que certificó la credencial
        uint64 issuedAt;      // Timestamp Unix de emisión
        bool revoked;         // Estado de revocación administrativa
        string externalUrl;   // Enlace institucional o de plataforma (Udemy, Coursera, etc.)
    }

    // Mapping tokenId => CertificateData
    mapping(uint256 => CertificateData) private _certificates;

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        bytes32 documentHash,
        string uri,
        string externalUrl
    );
    event CertificateRevoked(uint256 indexed tokenId, address indexed issuer, string reason);

    constructor(address defaultAdmin) ERC721("AvalanCert Credential", "AVCERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ISSUER_ROLE, defaultAdmin);
        _nextTokenId = 1;
    }

    /**
     * @notice Mintea un certificado individual intransferible (SBT).
     */
    function issueCertificate(
        address to,
        string calldata uri,
        bytes32 documentHash,
        string calldata externalUrl
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(to != address(0), "Direccion invalida");
        require(documentHash != bytes32(0), "Hash requerido");

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        _certificates[tokenId] = CertificateData({
            documentHash: documentHash,
            issuer: msg.sender,
            issuedAt: uint64(block.timestamp),
            revoked: false,
            externalUrl: externalUrl
        });

        emit Locked(tokenId);
        emit CertificateIssued(tokenId, to, msg.sender, documentHash, uri, externalUrl);

        return tokenId;
    }

    /**
     * @notice Mintea certificados en lote (Batch Minting) para graduaciones masivas.
     */
    function issueBatch(
        address[] calldata recipients,
        string[] calldata uris,
        bytes32[] calldata documentHashes,
        string[] calldata externalUrls
    ) external onlyRole(ISSUER_ROLE) returns (uint256[] memory) {
        uint256 total = recipients.length;
        require(total > 0, "Lista vacia");
        require(
            total == uris.length && 
            total == documentHashes.length && 
            total == externalUrls.length,
            "Longitud inconsistente"
        );

        uint256[] memory mintedIds = new uint256[](total);

        for (uint256 i = 0; i < total; i++) {
            require(recipients[i] != address(0), "Direccion invalida");
            require(documentHashes[i] != bytes32(0), "Hash invalido");

            uint256 tokenId = _nextTokenId++;
            mintedIds[i] = tokenId;

            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);

            _certificates[tokenId] = CertificateData({
                documentHash: documentHashes[i],
                issuer: msg.sender,
                issuedAt: uint64(block.timestamp),
                revoked: false,
                externalUrl: externalUrls[i]
            });

            emit Locked(tokenId);
            emit CertificateIssued(tokenId, recipients[i], msg.sender, documentHashes[i], uris[i], externalUrls[i]);
        }

        return mintedIds;
    }

    /**
     * @notice Revocación administrativa de un título.
     */
    function revokeCertificate(uint256 tokenId, string calldata reason) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token inexistente");
        require(!_certificates[tokenId].revoked, "Ya revocado");

        _certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId, msg.sender, reason);
    }

    /**
     * @notice Consulta los datos completos del certificado para el validador público.
     */
    function getCertificate(uint256 tokenId)
        external
        view
        returns (
            bytes32 documentHash,
            address issuer,
            uint64 issuedAt,
            bool revoked,
            address owner,
            string memory externalUrl
        )
    {
        address tokenOwner = _ownerOf(tokenId);
        require(tokenOwner != address(0), "Token inexistente");

        CertificateData memory cert = _certificates[tokenId];
        return (
            cert.documentHash, 
            cert.issuer, 
            cert.issuedAt, 
            cert.revoked, 
            tokenOwner, 
            cert.externalUrl
        );
    }

    // --- EIP-5192 ---

    function locked(uint256 tokenId) external view override returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token inexistente");
        return true;
    }

    // --- Bloqueo Soulbound ---

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            revert("AvalanCert: Token es Soulbound (intransferible)");
        }

        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return interfaceId == 0xb45a3c0e || super.supportsInterface(interfaceId);
    }
}