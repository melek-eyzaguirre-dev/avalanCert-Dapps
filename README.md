# 🔺 AvalanCert Protocol — Decentralized Soulbound Credentials on Avalanche

> **Infraestructura descentralizada de grado institucional para la emisión de credenciales académicas inmutables (EIP-5192 SBT), homologación de certificados Web2 a Web3 y verificación pública instantánea Zero-Wallet sobre Avalanche C-Chain.**

[![Avalanche Fuji](https://img.shields.io/badge/Network-Avalanche_Fuji_Testnet-E84142?style=for-the-badge&logo=avalanche&logoColor=white)](https://testnet.snowtrace.io/)
[![Standard](https://img.shields.io/badge/Standard-EIP--5192_Soulbound-blue?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-5192)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Enlaces del Proyecto & Demostración

* 🌐 **Demo en Vivo (dApp):** [https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
* 📦 **Repositorio GitHub:** [https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps](https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps)
* 🎥 **Video Pitch / Demo (YouTube Short):** [Ver Video Demo en YouTube](https://youtube.com/shorts/zkkPRg0_SY4)
* 📊 **Pitch Deck & Presentación Ejecutiva:** [Ver Presentación en Gamma App](https://gamma.app) *(reemplaza con tu URL específica de Gamma)*
* 🔗 **Ecosystem Showcase:** [EduChain Project Hub](https://ecosystem-hub-test.up.railway.app/projects/educhain-78jj)

---

## 💡 El Problema y la Solución AvalanCert

### El Problema
El fraude documental y la falsificación de credenciales académicas generan pérdidas millonarias y ralentizan las auditorías de contratación. Los diplomas digitales tradicionales (formatos PDF o imágenes estándar) son vulnerables a manipulación tipográfica mediante editores convencionales sin dejar rastro aparente.

### La Solución AvalanCert
AvalanCert establece un estándar infalsificable uniendo la inmutabilidad de la C-Chain de Avalanche con criptografía de clave pública:
1. **Intransferibilidad Nativa (Soulbound EIP-5192):** Los certificados acuñados están ligados a la wallet del graduado de forma permanente. Las funciones de transferencia secundaria están anuladas por contrato.
2. **Anclaje Criptográfico Híbrido (SHA-256 Digest):** Cada PDF generado posee una huella matemática SHA-256 almacenada on-chain. Si se adultera un solo píxel o letra del documento, el hash cambia y el validador rechaza el archivo.
3. **Validación Zero-Wallet (Consenso Público):** Empleadores y reclutadores pueden validar documentos simplemente arrastrando el archivo PDF a la dApp o escaneando el código QR dinámico, sin extensiones Web3 ni pago de gas.
4. **Homologación de Enlaces Externos (Web2 ➔ Web3):** Permite a las instituciones certificar enlaces preexistentes (como credenciales de Udemy, Coursera o portales universitarios) asegurando su autenticidad en la blockchain.
5. **Gobernanza Institucional & Revocación Tombstone:** Sistema de control de acceso por roles (`DEFAULT_ADMIN_ROLE` y `ISSUER_ROLE`) con capacidad de revocación on-chain ante faltas académicas.

---

## 🏗️ Arquitectura del Sistema

```mermaid
sequenceDiagram
    autonumber
    actor Emisor as Institución (ISSUER_ROLE)
    participant dApp as AvalanCert Frontend (Cliente)
    participant AVAX as Avalanche C-Chain (AvalanCertSBT)
    actor Alumno as Estudiante Titular
    actor Reclutador as Reclutador / Empresa

    %% Emisión
    rect rgb(30, 20, 24)
    Note over Emisor,AVAX: Flujo de Emisión & Anclaje Criptográfico
    Emisor->>dApp: Carga datos (Formulario / CSV Masivo / URL Externa)
    dApp->>dApp: Computa digest criptográfico SHA-256 (Web Crypto API)
    Emisor->>AVAX: Firma transacción (issueCertificate / issueBatch)
    AVAX->>AVAX: Mintea SBT, almacena hash y emite evento Locked(tokenId)
    AVAX-->>dApp: Confirma bloque y retorna Token ID
    dApp->>dApp: Incrusta código QR verificador dinámico en el PDF
    dApp-->>Alumno: Descarga del diploma oficial (.pdf o paquete .zip)
    end

    %% Validación
    rect rgb(18, 30, 24)
    Note over Reclutador,AVAX: Verificación Pública Zero-Wallet (Drag & Drop)
    Reclutador->>dApp: Arrastra el archivo PDF (o ingresa Token ID)
    dApp->>dApp: Calcula SHA-256 en memoria local
    dApp->>AVAX: Consulta RPC getCertificate(tokenId)
    AVAX-->>dApp: Retorna {documentHash, issuer, revoked, owner, externalUrl}
    alt Hash Coincidente y Vigente
        dApp-->>Reclutador: Estado VERIFICADO (Documento íntegro y auténtico)
    else Hash Discrepante
        dApp-->>Reclutador: Estado ADULTERADO (Documento manipulado)
    else Token Revocado
        dApp-->>Reclutador: Estado REVOCADO (Credencial anulada por la institución)
    end
    end
graph TD
    A[Super Admin / Rectoría] -->|DEFAULT_ADMIN_ROLE| B(Smart Contract AvalanCertSBT)
    A -->|grantRole / revokeRole| C[Facultades / Departamentos]
    C -->|ISSUER_ROLE| D[issueCertificate: Emisión Individual]
    C -->|ISSUER_ROLE| E[issueBatch: Emisión Masiva CSV]
    C -->|ISSUER_ROLE| F[revokeCertificate: Anulación On-Chain]
    
    D --> G[(Avalanche C-Chain)]
    E --> G
    F --> G
    
    G -.->|locked = true| H[Wallet Estudiante: EIP-5192 SBT]
    G -.->|Tombstone Flag| I[Auditoría Pública en Tiempo Real]
avalanCert-Dapps/
├── contracts/
│   ├── interfaces/
│   │   └── IERC5192.sol            # Interfaz oficial EIP-5192 (Soulbound)
│   └── AvalanCertSBT.sol           # Contrato principal (ERC721URIStorage + AccessControl)
├── scripts/
│   └── deploy.js                   # Script de despliegue y verificación en Snowtrace
├── js/
│   ├── avalancheConfig.js          # Constantes de red Fuji, ABI y dirección del contrato
│   └── validator.js                # Lógica Web3, cálculo SHA-256, generador PDF/ZIP
├── css/
│   └── styles.css                  # Estilos visuales complementarios a Tailwind CSS
├── index.html                      # Aplicación dApp unificada (Emisor, Alumno, Verificador, Admin)
├── hardhat.config.js               # Configuración de compilador y redes Hardhat
├── package.json                    # Dependencias y scripts de ejecución
└── README.md                       # Documentación técnica del protocolo
