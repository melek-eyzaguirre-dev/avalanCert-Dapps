# AvalanCert - Plataforma Descentralizada de Certificacion y Verificacion Digital sobre Avalanche

[![Avalanche](https://img.shields.io/badge/Blockchain-Avalanche%20C--Chain%20%2F%20Subnets-E84142?style=for-the-badge&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Demo en Vivo](https://img.shields.io/badge/Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Event](https://img.shields.io/badge/Avalanche%20Ideathon-Santiago%202026-E84142?style=for-the-badge)](https://ecosystem-hub-test.up.railway.app/events/chile-team1-avalanche-ideathon-de-la-idea-a-la-prueba-de-con-20bc)

> AvalanCert es una aplicacion descentralizada (dApp) disenada para transformar titulos academicos, credenciales de cursos e-learning (Udemy, Coursera, plataformas MOOC) y certificaciones profesionales en Soulbound Tokens (SBTs / EIP-5192) sobre la red Avalanche. Previene el fraude curricular, neutraliza vulnerabilidades de phishing documental y habilita la verificacion on-chain instantanea mediante codigos QR y hashes criptograficos.

---

## Acceso al Prototipo y Video Pitch

* Maqueta Navegable Interactiva (Demo en Vivo): https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/
* Repositorio Oficial: https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps
* Video Pitch (3 Minutos): Pega aqui el enlace de tu video de Loom o YouTube

---

## Tabla de Contenidos
1. [La Problematica](#1-la-problematica)
2. [La Solucion: AvalanCert](#2-la-solucion-avalancert)
3. [Donde entra Avalanche en la Solucion](#3-donde-entra-avalanche-en-la-solucion)
4. [Arquitectura Conceptual y Flujo](#4-arquitectura-conceptual-y-flujo)
5. [Estandar de Token (SBT EIP-5192)](#5-estandar-de-token-sbt-eip-5192)
6. [Modelo de Negocio y Rentabilidad](#6-modelo-de-negocio-y-rentabilidad)
7. [Recorrido del Mockup Navegable](#7-recorrido-del-mockup-navegable)
8. [Hoja de Ruta (Hacia el Hackathon del 27 de Noviembre)](#8-hoja-de-ruta-hacia-el-hackathon-del-27-de-noviembre)
9. [Equipo y Participacion](#9-equipo-y-participacion)

---

## 1. La Problematica

* **Falsificacion y Fraude Curricular:** Mas del 30% de los historiales profesionales contienen inconsistencias o credenciales adulteradas. Los formatos tradicionales (PDF o diplomas impresos) son editables con herramientas de software estandar sin dejar trazabilidad.
* **Vulnerabilidad a Phishing y Servidores Caidos:** En la educacion online (Udemy, Coursera o academias tecnicas), los certificados dependen de URLs centralizadas propensas a enlaces caidos o clonaciones de dominios disenadas para enganar a evaluadores.
* **Procesos Lentos de Auditoria:** Validar la legitimidad de un titulo universitario entre secretarias academicas de distintos paises o instituciones toma semanas y acarrea costos de legalizacion o apostillado.

---

## 2. La Solucion: AvalanCert

AvalanCert establece una infraestructura descentralizada de emision y verificacion:

* **Acunacion Criptografica:** La institucion o instructor certificado firma digitalmente y emite una credencial inmutable en la blockchain.
* **Intransferibilidad Estricta (Soulbound):** El token queda ligado de manera definitiva a la direccion de la billetera o identidad digital del estudiante, impidiendo su venta, prestamo o clonacion.
* **Verificacion Instantanea Descentralizada:** Reclutadores, empresas o universidades auditan la autenticidad del diploma escaneando un codigo QR o consultando el hash en el explorador de bloques en menos de 1 segundo.

---

## 3. Donde entra Avalanche en la Solucion

Avalanche proporciona los componentes de infraestructura necesarios para la adopcion masiva:

* **Finalidad Sub-Segundo (< 1s):** El mecanismo de consenso Snowman procesa validaciones y minteos de manera inmediata, eliminando los tiempos de espera de confirmacion de bloque.
* **Comisiones Minimas de Gas:** El bajo costo por transaccion permite acunar diplomas de forma viable para instituciones con promociones masivas de alumnos.
* **Subnets / Avalanche L1s:** Capacidad tecnica para desplegar una Subnet Academica Soberana para consorcios universitarios, fijando sus propios validadores y politicas de privacidad.
* **Compatibilidad con EVM (C-Chain y Fuji):** Despliegue agil de contratos inteligentes basados en Solidity bajo especificaciones abiertas y estandarizadas.

---

## 4. Arquitectura Conceptual y Flujo

El flujo operativo de AvalanCert se estructura en cuatro capas:

1. **Entidad Emisora (Universidad o Instructor):**
   * Ingreso al Dashboard Institucional de AvalanCert.
   * Carga de datos del egresado y firma digital de la entidad.

2. **Persistencia Descentralizada (Almacenamiento):**
   * Generacion de hash criptografico y metadatos JSON del diploma.
   * Almacenamiento distribuido en IPFS con URI inmutable.

3. **Capa Blockchain (Avalanche Fuji Testnet / C-Chain):**
   * Invocacion del Smart Contract de AvalanCert.
   * Acunacion del Soulbound Token (SBT EIP-5192) intransferible vinculado a la direccion de la billetera del graduado.

4. **Tercero Verificador (Empleador o Reclutador):**
   * Lectura de codigo QR o busqueda por ID de certificado.
   * Consulta directa on-chain con respuesta instantanea de estado: Autentico, Valido e Inalterable.

---

## 5. Estandar de Token (SBT EIP-5192)

Para certificar que la credencial pertenece unicamente al egresado legitimo:

* Se implementa la interfaz **EIP-5192 (Minimal Soulbound Token)** sobre la red Avalanche.
* Las funciones de transferencia estandar (`transferFrom`, `safeTransferFrom`) quedan deshabilitadas tras la acunacion inicial.
* Se emite el evento canonico `Locked(uint256 tokenId)` para auditar la vinculacion permanente en el registro publico.
* Se incluye una rutina administrativa de **revocacion autorizada**, habilitada solo para la entidad rectora en casos de anulacion academica formal.

---

## 6. Modelo de Negocio y Rentabilidad

AvalanCert cuenta con un modelo financiero diversificado y sostenible:

* **SaaS B2B para Instituciones Educativas:** Licenciamiento mensual o anual para universidades e institutos, habilitando paneles masivos, personalizacion institucional y acceso a APIs de integracion con sus plataformas de gestion.
* **Pay-per-Certificate para Creadores de Contenido:** Modelo por consumo orientado a instructores independientes de Udemy, Coursera y academias digitales, mediante micropagos por lote emitido.
* **API Empresarial de Verificacion Masiva:** Consulta publica individual y lectura QR gratuitas; planes corporativos de pago para departamentos de Recursos Humanos que procesan volumenes elevados de postulaciones de forma automatizada.

---

## 7. Recorrido del Mockup Navegable

La prueba de concepto interactiva esta activa en GitHub Pages:
https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/

### Modulos funcionales integrados:
1. **Portal del Emisor Institucional:** Interfaz de captura de informacion del alumno, curso, entidad y fecha, simulando la emision en tiempo real en la red Avalanche Fuji Testnet.
2. **Billetera del Estudiante:** Vista de certificados personales con marcas de agua criptograficas, datos del programa e integracion de codigos QR dinamicos.
3. **Verificador Publico On-Chain:** Buscador con verificacion instantanea por identificador (`AVAX-SBT-9142`) o hash de transaccion, certificando el numero de bloque y el estado de consenso.

---

## 8. Hoja de Ruta (Hacia el Hackathon del 27 de Noviembre)

* **Fase 1: Ideathon (16 de Octubre 2026 - Open Beauchef)**
  * Diseno conceptual y propuesta tecnica de AvalanCert.
  * Implementacion del prototipo interactivo en GitHub Pages.
  * Documentacion de arquitectura con Avalanche en repositorio publico.
  * Grabacion del pitch de 3 minutos.
* **Fase 2: Contratos Inteligentes (Noviembre 2026)**
  * Programacion de contratos Solidity bajo la especificacion EIP-5192.
  * Pruebas y despliegue en la red de pruebas Avalanche Fuji Testnet.
* **Fase 3: Hackathon Presencial (27 de Noviembre 2026)**
  * Integracion frontend con Web3 wallets (Core Wallet / MetaMask).
  * Almacenamiento descentralizado de metadatos en IPFS.
  * Ejecucion funcional de validaciones on-chain contra el explorador de Avalanche.

---

## 9. Equipo y Participacion

* **Lider de Proyecto y Desarrolladora:** Julieta Eyzaguirre ([@melek-eyzaguirre-dev](https://github.com/melek-eyzaguirre-dev))
* **Iniciativa:** Avalanche Ideathon 2026 - Open Beauchef, Universidad de Chile
* **Licencia:** Distribuido bajo los terminos de la licencia MIT.
