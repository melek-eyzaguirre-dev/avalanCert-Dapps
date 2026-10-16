# 🎓 AvalanCert — Plataforma Descentralizada de Certificación y Verificación Digital sobre Avalanche

[![Avalanche](https://img.shields.io/badge/Blockchain-Avalanche%20C--Chain%20%2F%20Subnets-E84142?style=for-the-badge&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Demo en Vivo](https://img.shields.io/badge/Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Event](https://img.shields.io/badge/Avalanche%20Ideathon-Santiago%202026-E84142?style=for-the-badge)](https://ecosystem-hub-test.up.railway.app/events/chile-team1-avalanche-ideathon-de-la-idea-a-la-prueba-de-con-20bc)

> **AvalanCert** es una aplicación descentralizada (dApp) construida para transformar diplomas académicos, certificados de cursos e-learning (Udemy, Coursera, institutos) y credenciales profesionales en **tokens intransferibles inmutables (*Soulbound Tokens* o SBTs / EIP-5192)** en la red **Avalanche**. Erradica el fraude curricular, neutraliza los ataques de phishing documental y ofrece validación pública instantánea mediante código QR y hash on-chain.

---

## 🚀 Acceso Rápido al Prototipo & Video Pitch

* 🌐 **Maqueta Navegable Interactiva (Demo en Vivo):**  
  👉 [https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
* 📺 **Video Pitch (3 Minutos):**  
  👉 `[Pega aquí el enlace de tu video de Loom / YouTube]`
* 📂 **Repositorio del Proyecto:**  
  👉 [https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps](https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps)

---

## 📌 Tabla de Contenidos
- [1. La Problemática](#1-la-problemática)
- [2. La Solución: AvalanCert](#2-la-solución-avalancert)
- [3. ¿Dónde entra Avalanche en la Solución?](#3-dónde-entra-avalanche-en-la-solución)
- [4. Arquitectura Conceptual y Flujo](#4-arquitectura-conceptual-y-flujo)
- [5. Estándar de Token (SBT EIP-5192)](#5-estándar-de-token-sbt-eip-5192)
- [6. Modelo de Negocio y Rentabilidad](#6-modelo-de-negocio-y-rentabilidad)
- [7. Recorrido del Mockup Navegable](#7-recorrido-del-mockup-navegable)
- [8. Hoja de Ruta (Hacia el Hackathon del 27 de Noviembre)](#8-hoja-de-ruta-hacia-el-hackathon-del-27-de-noviembre)
- [9. Equipo y Participación](#9-equipo-y-participación)

---

## 1. La Problemática ⚠️

1. **Falsificación de Títulos y Adulteración Curricular:** Se estima que más del 30% de los currículums contienen credenciales alteradas. Los diplomas digitales tradicionales en formato PDF o imágenes son fácilmente editables con programas de diseño digital.
2. **Vulnerabilidad al Phishing y Enlaces Caídos:** Las certificaciones emitidas por academias online o plataformas e-learning (Udemy, Coursera, bootcamps) suelen depender de enlaces centralizados vulnerables a caídas de servidor o sitios clonados para engañar a reclutadores.
3. **Validación Lenta y Costosa:** El proceso de verificación manual entre secretarías académicas, apostillas y empleadores suele tardar semanas.

---

## 2. La Solución: AvalanCert 💡

AvalanCert resuelve este reto mediante una infraestructura de credenciales soberanas descentralizadas:
* **Acuñación Criptográfica:** La institución emisora (o creador del curso verificado) firma y acuña la credencial directamente en la red Avalanche.
* **Intransferibilidad Total (*Soulbound Token*):** El token queda irrevocablemente anclado a la billetera o identidad digital del estudiante. No puede transferirse, venderse ni clonarse.
* **Verificación Instantánea sin Intermediarios:** Cualquier empleador o institución puede escanear un código QR o consultar el ID del certificado para obtener el consenso criptográfico en menos de un segundo.

---

## 3. ¿Dónde entra Avalanche en la Solución? 🔺

Avalanche es el núcleo fundamental que hace viable a AvalanCert frente a otras redes:

| Ventaja Técnica | Aplicación en AvalanCert |
| :--- | :--- |
| **Finalidad Sub-Segundo (< 1s)** | El mecanismo de consenso *Snowman* valida transacciones al instante, permitiendo que un reclutador o estudiante verifique su credencial de inmediato. |
| **Costos de Gas Mínimos (Fracciones de Centavo)** | La emisión de certificados masivos para miles de estudiantes universitarios o de cursos online es económicamente sostenible. |
| **Subnets / Avalanche L1s Personalizables** | Permite proyectar en el futuro una *Subnet Académica*, donde un consorcio de universidades e institutos opere con sus propios validadores y reglas de gobernanza sin interferencia externa. |
| **Compatibilidad con EVM (Avalanche C-Chain & Fuji Testnet)** | Facilita la implementación de contratos inteligentes en Solidity estándar bajo especificaciones ERC-721 y extensiones Soulbound (EIP-5192). |

---

## 4. Arquitectura Conceptual y Flujo 🛠️

```mermaid
flowchart TD
    subgraph Emisor["1. Entidad Emisora (Universidad / Instructor)"]
        A[Dashboard Institucional AvalanCert] -->|Ingresa datos del graduado| B[Firma Digital de la Institución]
    end

    subgraph Almacenamiento["2. Persistencia Descentralizada"]
        B -->|Genera Hash y Metadatos JSON| C[(IPFS / Filecoin)]
        C -->|URI de Metadatos Inmutables| D[Smart Contract AvalanCert]
    end

    subgraph Blockchain["3. Red Avalanche (Fuji Testnet / C-Chain)"]
        D -->|Acuña SBT EIP-5192| E[Token Soulbound Intransferible]
        E -->|Anclado permanentemente| F[Billetera / Perfil del Estudiante]
    end

    subgraph Verificacion["4. Tercero / Reclutador"]
        G[Escaneo de Código QR / Barra de Búsqueda] -->|Consulta on-chain directa| D
        D -->|Verificación criptográfica| H[Estado: Auténtico, Inmutable y Válido]
    end
5. Estándar de Token (SBT EIP-5192) 🔒
Para certificar que la credencial pertenece únicamente al egresado legítimo:

Se implementa la interfaz EIP-5192 (Minimal Soulbound Token) sobre la C-Chain de Avalanche.

Las funciones de transferencia estándar (transferFrom, safeTransferFrom) quedan deshabilitadas tras la acuñación inicial.

Se emite el evento canónico Locked(uint256 tokenId) para auditar la vinculación permanente en el libro mayor.

Se incluye una rutina administrativa de revocación autorizada, habilitada solo para la entidad rectora en casos de anulación académica formal.

6. Modelo de Negocio y Rentabilidad 📈
AvalanCert cuenta con un modelo financiero diversificado:

SaaS B2B para Instituciones de Educación Superior: Licenciamiento mensual o anual para universidades e institutos, habilitando dashboards masivos, personalización institucional y acceso a APIs de integración con sus ERPs.

Pay-per-Certificate para Creadores de Contenido: Modelo por consumo orientado a instructores independientes de Udemy, Coursera y academias digitales, mediante micropagos en tokens AVAX o moneda fiduciaria por lote emitido.

API Empresarial de Verificación Masiva: Consulta pública y lectura QR gratuitas; planes de suscripción para empresas de contratación que auditan currículums de manera automatizada.

7. Recorrido del Mockup Navegable 🖥️
La prueba de concepto interactiva está disponible en:

👉 Abrir Maqueta Interactiva en GitHub Pages

Módulos funcionales integrados:
Portal del Emisor Institucional: Interfaz de captura de información del alumno, curso, entidad y fecha, simulando la emisión en tiempo real en la red Avalanche Fuji Testnet.

Billetera del Estudiante: Vista de certificados personales con marcas de agua criptográficas, datos del programa e integración de códigos QR dinámicos.

Verificador Público On-Chain: Buscador con verificación instantánea por identificador (AVAX-SBT-9142) o hash de transacción, certificando el número de bloque y el estado de consenso.

8. Hoja de Ruta (Hacia el Hackathon del 27 de Noviembre) 🚀
[x] Fase 1: Ideathon (16 de Octubre 2026 - Open Beauchef)

Diseño conceptual y propuesta técnica de AvalanCert.

Implementación del prototipo interactivo en GitHub Pages.

Documentación de arquitectura con Avalanche en repositorio público.

Grabación del pitch de 3 minutos.

[ ] Fase 2: Contratos Inteligentes (Noviembre 2026)

Programación de contratos Solidity bajo la especificación EIP-5192.

Pruebas y despliegue en la red de pruebas Avalanche Fuji Testnet.

[ ] Fase 3: Hackathon Presencial (27 de Noviembre 2026)

Integración frontend con Web3 wallets (Core Wallet / MetaMask)
