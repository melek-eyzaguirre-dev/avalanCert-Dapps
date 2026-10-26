# 🔺 AvalanCert Protocol (EIP-5192 Soulbound Credentials on Avalanche)

> **Infraestructura descentralizada para la emisión de credenciales académicas inmutables, homologación de certificados externos y verificación pública instantánea sobre Avalanche C-Chain.**

[![Avalanche Fuji](https://img.shields.io/badge/Network-Avalanche_Fuji_Testnet-E84142?logo=avalanche&logoColor=white)](https://testnet.snowtrace.io/)
[![Standard](https://img.shields.io/badge/EIP-5192_Soulbound_Token-blue)](https://eips.ethereum.org/EIPS/eip-5192)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Problemática y Solución

El fraude de credenciales académicas y certificaciones profesionales genera pérdidas millonarias y ralentiza los procesos de contratación. Los diplomas digitales tradicionales en formato PDF son fácilmente adulterables mediante herramientas estándar de edición tipográfica.

**AvalanCert** aborda este desafío combinando la inmutabilidad de la blockchain con criptografía de clave pública:
* **Tokens Intransferibles (EIP-5192):** Credenciales digitales acuñadas como Soulbound Tokens (SBTs) asociadas a la dirección del graduado, impidiendo transferencias secundarias o comercialización.
* **Huella Criptográfica SHA-256:** Cada diploma emitido se vincula de manera determinista con su digest criptográfico on-chain. Cualquier alteración del contenido original rompe la correspondencia con la blockchain.
* **Verificación Pública Zero-Wallet:** Evaluadores y empleadores pueden certificar la validez de un documento arrastrando el archivo PDF a la dApp o leyendo el código QR dinámico, sin interactuar con extensiones Web3 ni pagar gas.
* **Homologación Web2 a Web3:** Soporte para vincular credenciales previas y enlaces institucionales (plataformas como Udemy, Coursera o portales universitarios) dentro del estándar SBT.
* **Control de Acceso Institucional (RBAC):** Separación de permisos mediante `AccessControl` para rectorías y facultades, con capacidad de revocación on-chain ante faltas académicas.

---

## 🏗️ Arquitectura del Sistema

```mermaid
sequenceDiagram
    autonumber
    actor Emisor as Entidad Emisora (ISSUER_ROLE)
    participant App as dApp AvalanCert (Cliente)
    participant Chain as Avalanche C-Chain (AvalanCertSBT)
    actor Alumno as Estudiante Titular
    actor Verificador as Verificador / Empleador

    %% Emisión
    rect rgb(28, 20, 24)
    Note over Emisor,Chain: Proceso de Emisión y Anclaje Criptográfico
    Emisor->>App: Carga datos de acreditación (Formulario / Lote CSV / URL Externa)
    App->>App: Genera estructura canónica del PDF y calcula SHA-256
    Emisor->>Chain: Ejecuta issueCertificate(...) / issueBatch(...)
    Chain->>Chain: Mintea SBT, almacena hash y emite evento Locked(tokenId)
    Chain-->>App: Retorna confirmación de bloque y Token ID
    App->>App: Inyecta código QR verificador dinámico
    App-->>Alumno: Descarga del PDF oficial individual o archivo ZIP comprimido
    end

    %% Verificación
    rect rgb(18, 28, 22)
    Note over Verificador,Chain: Validación Pública On-Chain (Zero-Wallet)
    Verificador->>App: Carga documento PDF (Drag & Drop) o ingresa Token ID
    App->>App: Computa digest SHA-256 localmente (Web Crypto API)
    App->>Chain: Consulta RPC getCertificate(tokenId)
    Chain-->>App: Retorna hash on-chain, emisor, fecha, estado de revocación y URL
    alt Hash Coincidente & Vigente
        App-->>Verificador: Estado: VERIFICADO (Documento auténtico e inalterado)
    else Hash Discrepante
        App-->>Verificador: Estado: ADULTERADO (Contenido modificado)
    else Estado Revocado
        App-->>Verificador: Estado: REVOCADO (Credencial anulada por la institución)
    end
    end
graph TD
    A[Rectoría / Super Admin] -->|DEFAULT_ADMIN_ROLE| B(Smart Contract AvalanCertSBT)
    A -->|grantRole / revokeRole| C[Facultades / Departamentos]
    C -->|ISSUER_ROLE| D[issueCertificate: Emisión Individual]
    C -->|ISSUER_ROLE| E[issueBatch: Emisión Masiva CSV]
    C -->|ISSUER_ROLE| F[revokeCertificate: Anulación On-Chain]
    
    D --> G[(Avalanche C-Chain)]
    E --> G
    F --> G
    
    G -.->|locked = true| H[Wallet Estudiante: EIP-5192 SBT]
    G -.->|Tombstone Flag| I[Historial de Auditoría Pública]
