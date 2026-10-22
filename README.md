# AvalanCert Protocol 🔺
> **Infraestructura descentralizada de emisión y verificación de credenciales académicas e institucionales sobre Avalanche.**

[![Avalanche](https://img.shields.io/badge/Network-Avalanche_Fuji_Testnet-E84142?style=flat&logo=avalanche)](https://subnets.avax.network/)
[![Standard](https://img.shields.io/badge/Standard-ERC--5192_SBT-informational)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Demo y Recursos
- **🌐 DApp Navegable (Live Demo):** [https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
- **🎬 Video Pitch (3 min):** [![YouTube](https://img.shields.io/badge/YouTube-Video_Pitch-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/shorts/zkkPRg0_SY4)
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
