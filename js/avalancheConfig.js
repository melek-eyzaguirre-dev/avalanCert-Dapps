export const AVALANCHE_FUJI_PARAMS = {
    chainId: "0xa869",
    chainName: "Avalanche Fuji Testnet",
    nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"]
};

// Reemplaza con la dirección que imprima tu deploy.js
export const CONTRACT_ADDRESS = "0xTuContratoDesplegadoEnFuji";

export const CONTRACT_ABI = [
    "function issueCertificate(address to, string calldata uri, bytes32 documentHash, string calldata externalUrl) external returns (uint256)",
    "function issueBatch(address[] calldata recipients, string[] calldata uris, bytes32[] calldata documentHashes, string[] calldata externalUrls) external returns (uint256[] memory)",
    "function getCertificate(uint256 tokenId) external view returns (bytes32 documentHash, address issuer, uint64 issuedAt, bool revoked, address owner, string memory externalUrl)",
    "function revokeCertificate(uint256 tokenId, string calldata reason) external",
    "function grantRole(bytes32 role, address account) external",
    "function revokeRole(bytes32 role, address account) external",
    "function locked(uint256 tokenId) external view returns (bool)",
    "event CertificateIssued(uint256 indexed tokenId, address indexed recipient, address indexed issuer, bytes32 documentHash, string uri, string externalUrl)",
    "event CertificateRevoked(uint256 indexed tokenId, address indexed issuer, string reason)"
];