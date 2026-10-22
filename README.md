# AvalanCert Protocol 🔺
> **Infraestructura descentralizada de emisión y verificación de credenciales académicas e institucionales sobre Avalanche.**

[![Avalanche](https://img.shields.io/badge/Network-Avalanche_Fuji_Testnet-E84142?style=flat&logo=avalanche)](https://subnets.avax.network/)
[![Standard](https://img.shields.io/badge/Standard-ERC--5192_SBT-informational)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Demo y Recursos
- **🌐 DApp Navegable (Live Demo):** [https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
- **🎬 Video Pitch :** [![YouTube](https://img.shields.io/badge/YouTube-Video_Pitch-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/shorts/zkkPRg0_SY4)
- **📁 Repositorio:** [https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps](https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps)

---

## 🎯 1. Problema Concreto y Usuarios Afectados

### El Problema
La falsificación y adulteración de diplomas, títulos universitarios y certificaciones profesionales críticas (minería, salud, construcción, seguridad industrial) genera pérdidas operativas millonarias y riesgos humanos. 

Hoy en día, validar una credencial requiere:
- Procesos burocráticos manuales que tardan días o semanas entre instituciones, notarías y ministerios.
- Dependencia de bases de datos centralizadas vulnerables a caídas, pérdidas de registros o adulteración no auditada.
- Costos administrativos y de timbraje elevados para las instituciones emisoras.

### Usuarios Afectados
1. **Instituciones Emisoras:** Universidades, institutos técnicos, centros de capacitación y organismos de acreditación profesional.
2. **Egresados y Profesionales:** Graduados y técnicos que necesitan acreditar sus competencias de forma ágil y portable internacionalmente.
3. **Validadores y Empleadores:** Departamentos de Recursos Humanos, empresas reguladas y faenas industriales que requieren comprobar autenticidad al instante.

---

## 💡 2. La Solución: AvalanCert

AvalanCert es un protocolo basado en **Soulbound Tokens (SBT - ERC-5192)** que convierte los certificados en credenciales digitales intransferibles, auditables y con validez legal verificable en menos de 1 segundo.

### Funcionalidades Clave
- **Emisión Segura para Entidades Acreditadas:** Control de acceso institucional mediante roles (`ISSUER_ROLE`) para acuñar títulos digitales directamente a la billetera pública del egresado.
- **Intransferibilidad Nativa (SBT):** Los certificados están anclados a la identidad digital del egresado y no pueden venderse ni transferirse a terceros.
- **Validador Cero-Barreras con Código QR:** Cualquier reclutador o fiscalizador puede escanear el QR del diploma y comprobar vigencia, emisor y hash criptográfico en la blockchain sin necesidad de instalar billeteras o poseer tokens.
- **Mecanismo de Revocación Auditable:** Registro on-chain de títulos revocados por faltas éticas, anulación administrativa o vencimiento de certificaciones periódicas.

---

## 🏗️ 3. Arquitectura: On-Chain vs Off-Chain

Para garantizar la privacidad (cumplimiento normativo de protección de datos personales) y la eficiencia en costos de gas, AvalanCert separa responsabilidades:
| Capa | Componente | Información Almacenada |
| :--- | :--- | :--- |
| **Off-Chain / Privado** | IPFS & Base Institucional | Datos personales del alumno, documento PDF original legible, firmas visuales. |
| **On-Chain (Avalanche)** | Smart Contract (ERC-5192) | Hash criptográfico (SHA-256) del documento, Token ID intransferible, dirección del titular, dirección de la institución emisora, estado de revocación y timestamp. |

---

## 🔺 4. ¿Por Qué Avalanche?

1. **Subsegundo de Finalidad:** Transacciones instantáneas e irreversibles, cruciales para que la experiencia de validación de un diploma sea en tiempo real.
2. **Costos Predecibles y Bajos (C-Chain):** Tarifas de gas mínimas que permiten a las instituciones emitir miles de certificados a una fracción de centavo de dólar por emisión.
3. **Visión a Escala (Avalanche L1 / Subnets):** Capacidad de desplegar en etapas posteriores una **L1 soberana permisionada** para consorcios universitarios o ministerios, manteniendo soberanía sobre sus reglas de validación y tarifas de red.

---

## 💼 5. Hipótesis de Modelo de Negocio

- **Cliente Objetivo:** Universidades, instituciones de educación superior, organismos certificadores de seguridad minera/industrial y bootcamps de tecnología.
- **¿Quién Paga?:** La institución emisora y/o empresas de reclutamiento masivo.
- **Propuesta de Valor:** Reducción del 90% en costos de validación de títulos, eliminación del fraude de certificados y entrega de credenciales verificables con valor internacional inmediato.
- **Mecanismo de Cobro:**
  - **SaaS Institucional:** Cuota mensual por la plataforma de administración y control de roles.
  - **Pay-per-Mint (Cobro por lote):** Microtarifa por credencial emitida ($0.50 - $1.50 USD por título).
  - **API de Verificación Masiva:** Planes para portales de empleo y plataformas de RRHH.

---

## 🛠️ 6. Estructura del Repositorio y Tecnologías

```text
avalanche/
├── contracts/                        # Smart Contracts en Solidity
│   ├── AvalanCertSBT.sol             # Contrato Core ERC-5192 con control de roles
│   └── interfaces/
│       └── IERC5192.sol              # Interfaz oficial del estándar Soulbound
├── docs/                             # Documentación de negocio y materiales del pitch
│   ├── guionPitchProyecto.docx
│   └── investigacion.docx
├── js/                               # Lógica frontend y Web3
│   ├── avalancheConfig.js            # Parámetros RPC de Avalanche Fuji Testnet
│   └── validator.js                  # Motor de generación de QR y verificación URL
├── css/
│   └── styles.css                    # Estilos visuales con estética Avalanche
├── index.html                        # Interfaz interactiva de la DApp
└── README.md
