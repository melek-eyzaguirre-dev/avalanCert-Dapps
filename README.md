# AvalanCert

> Credenciales academicas verificables, intransferibles y auditables sobre
> Avalanche C-Chain.

[![Avalanche Fuji](https://img.shields.io/badge/Avalanche-Fuji%20Testnet-E84142?logo=avalanche)](https://testnet.snowtrace.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![EIP-5192](https://img.shields.io/badge/Standard-EIP--5192-4c8fc1)](https://eips.ethereum.org/EIPS/eip-5192)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit/)

AvalanCert es una dApp para emitir y verificar certificados digitales
resistentes a la falsificacion. Una institucion genera la credencial, calcula
la huella SHA-256 del documento y registra sus datos en un Soulbound Token
(SBT) compatible con EIP-5192. El titular no puede transferir el token y un
tercero puede comprobar la autenticidad del documento sin conectar una wallet.

## Enlaces

- **Demo en vivo:** [avalanCert-Dapps en GitHub Pages](https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/)
- **Repositorio:** [melek-eyzaguirre-dev/avalanCert-Dapps](https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps)
- **Ecosystem Hub:** [AvalanCert / EduChain](https://ecosystem-hub-test.up.railway.app/projects/educhain-78jj)
- **Video demo:** [YouTube Shorts](https://youtube.com/shorts/zkkPRg0_SY4)
- **Explorador de Avalanche Fuji:** [Snowtrace](https://testnet.snowtrace.io/)

> El enlace del Ecosystem Hub puede solicitar autenticacion antes de mostrar
> la ficha del proyecto.

## Problema y propuesta de valor

Los diplomas en PDF, imagen o papel pueden alterarse y su validacion suele
requerir procesos manuales. Esto aumenta el tiempo de contratacion, el costo de
las auditorias y el riesgo de aceptar una credencial falsa.

AvalanCert resuelve el problema mediante:

- **Huella criptografica:** el digest SHA-256 del documento se registra
  on-chain. Si cambia un byte del PDF, la huella ya no coincide.
- **Soulbound Token:** cada credencial queda vinculada a la wallet del titular
  y no admite transferencias secundarias.
- **Verificacion publica:** un reclutador puede validar por token, QR o PDF sin
  pagar gas ni instalar una extension Web3.
- **Emision individual y masiva:** permite emitir una credencial o un lote de
  credenciales desde un CSV.
- **Revocacion auditable:** una institucion autorizada puede marcar una
  credencial como revocada y dejar el evento registrado en la blockchain.

## Funcionalidades

### Institucion emisora

1. Conecta una wallet con permisos de `ISSUER_ROLE`.
2. Completa los datos del estudiante o carga un CSV.
3. Genera el certificado PDF y su huella SHA-256 en el navegador.
4. Firma la transaccion `issueCertificate` o `issueBatch`.
5. Descarga el certificado con un QR de verificacion.

### Titular

Puede consultar la credencial asociada a su wallet y conservar el PDF recibido.
El SBT no se puede vender ni transferir a otra cuenta.

### Verificador

Puede consultar un token o arrastrar un PDF. La dApp compara la huella local
con la huella almacenada en Avalanche y muestra si el documento es:

- **Verificado:** hash coincidente y credencial vigente.
- **Adulterado:** el hash del documento no coincide.
- **Revocado:** la institucion anulo la credencial.

### Administracion institucional

La cuenta administradora puede conceder o retirar `ISSUER_ROLE` y revocar
credenciales con un motivo. Estas operaciones requieren una transaccion y gas
en Fuji.

## Arquitectura

```text
Usuario / Institucion
        |
        v
Frontend estatico (HTML + JavaScript + ethers.js)
        |                         |
        | RPC de lectura           | Wallet / firma
        v                         v
Avalanche Fuji C-Chain <--- AvalanCertSBT.sol
        |
        +-- ERC-721 URIStorage + AccessControl
        +-- EIP-5192 (Soulbound)
        +-- SHA-256 del documento
        +-- Eventos de emision y revocacion
```

### Estructura relevante

```text
.
├── docs/proyectos/AvalanCert/
│   ├── index.html                 # Aplicacion web
│   ├── css/styles.css             # Estilos adicionales
│   ├── js/avalancheConfig.js      # Red, ABI y direccion del contrato
│   ├── js/validator.js            # Hash, PDF, QR y llamadas Web3
│   └── contracts/
│       ├── AvalanCertSBT.sol      # Contrato principal
│       └── interfaces/IERC5192.sol
├── scripts/
│   ├── hardhat.config.js          # Hardhat y red Fuji
│   └── deploy.js                  # Despliegue y verificacion
└── README.md
```

## Requisitos

- Git.
- Node.js 18 o superior y npm.
- Un navegador moderno.
- MetaMask u otra wallet compatible con EVM.
- AVAX de prueba en Fuji para emitir, revocar o desplegar.
- Una cuenta de Snowtrace/Routescan solo si se desea verificar el contrato.

La dApp se sirve como contenido estatico y no necesita una base de datos ni un
backend para ejecutarse.

## Clonar el proyecto

### HTTPS

```bash
git clone https://github.com/melek-eyzaguirre-dev/avalanCert-Dapps.git
cd avalanCert-Dapps
```

### SSH

```bash
git clone git@github.com:melek-eyzaguirre-dev/avalanCert-Dapps.git
cd avalanCert-Dapps
```

Para actualizar una copia existente:

```bash
git pull origin main
```

## Ejecutar la dApp en local

No abras `index.html` directamente con `file://`: los modulos ES y algunas
funciones del navegador requieren un servidor HTTP local.

### Opcion A: Python (sin instalar dependencias)

Desde la carpeta que contiene `index.html`:

```bash
cd docs/proyectos/AvalanCert
python -m http.server 8080
```

Abre <http://localhost:8080>.

En Windows PowerShell, si `python` no esta disponible, prueba:

```powershell
py -m http.server 8080
```

### Opcion B: servidor estatico con npx

```bash
npx --yes serve docs/proyectos/AvalanCert -l 8080
```

Abre <http://localhost:8080>.

Las dependencias del frontend se cargan desde CDN: ethers.js, jsPDF, JSZip,
PapaParse, QRCode.js, Tailwind CSS y Lucide. Por eso no hay un `npm install`
obligatorio para probar la interfaz.

## Configurar la red y el contrato

La configuracion se encuentra en
[`js/avalancheConfig.js`](docs/proyectos/AvalanCert/js/avalancheConfig.js).
El proyecto usa:

| Parametro | Valor |
|---|---|
| Red | Avalanche Fuji Testnet |
| Chain ID | `43113` (`0xA869`) |
| RPC | `https://api.avax-test.network/ext/bc/C/rpc` |
| Moneda | AVAX |
| Explorador | `https://testnet.snowtrace.io/` |

Despues de desplegar el contrato, reemplaza el valor de
`CONTRACT_ADDRESS` por la direccion real:

```js
export const CONTRACT_ADDRESS = "0xDIRECCION_DEL_CONTRATO";
```

Mientras conserve el valor de ejemplo, la interfaz no intentara ejecutar
operaciones on-chain. Esto permite revisar la UI en local, pero no representa
una emision real.

En MetaMask agrega Fuji mediante la opcion de cambiar/agregar red y solicita
AVAX de prueba desde el [faucet oficial de Avalanche](https://faucet.avax.network/).

## Desplegar el contrato en Fuji

El repositorio incluye [`scripts/deploy.js`](scripts/deploy.js) y
[`scripts/hardhat.config.js`](scripts/hardhat.config.js). El despliegue usa
Solidity `0.8.20`, OpenZeppelin y Hardhat.

### 1. Instalar dependencias de desarrollo

Ejecuta estos comandos desde el directorio del proyecto que contiene
`hardhat.config.js`:

```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
npm install @openzeppelin/contracts
```

Si trabajas con la estructura del repositorio publico, el contrato debe estar
en `contracts/` y el script en `scripts/`. En esta copia de trabajo el
contrato esta bajo `docs/proyectos/AvalanCert/contracts/`; conserva esa ruta o
configura la propiedad `paths.sources` de Hardhat antes de compilar.

### 2. Crear las variables de entorno

Crea un archivo `.env` local, **no lo subas a Git**:

```dotenv
PRIVATE_KEY=clave_privada_de_la_cuenta_de_despliegue
SNOWTRACE_API_KEY=clave_de_snowtrace_o_routescan
```

La clave privada debe corresponder a una cuenta financiada con AVAX Fuji.
Nunca uses una clave con fondos reales ni la pegues en el README, en el
frontend o en un commit.

### 3. Compilar

```bash
npx hardhat compile
```

### 4. Desplegar y verificar

En la estructura publica, donde `hardhat.config.js` esta en la raiz:

```bash
npx hardhat run scripts/deploy.js --network fuji
```

En la copia de trabajo incluida en este repositorio, el archivo de
configuracion esta dentro de `scripts/`, por lo que el equivalente es:

```bash
cd scripts
npx hardhat run deploy.js --network fuji
```

Antes de compilar esta copia, configura `paths.sources` para apuntar a
`../docs/proyectos/AvalanCert/contracts/`, o usa la estructura publica con
`contracts/` en la raiz. Hardhat no descubre automaticamente contratos que
esten fuera de su directorio de fuentes configurado.

El script imprime la direccion del contrato y, si la API esta configurada,
intenta verificar el bytecode en Snowtrace. Guarda la direccion mostrada y
actualiza `CONTRACT_ADDRESS` en `js/avalancheConfig.js`.

La cuenta que despliega recibe inicialmente:

- `DEFAULT_ADMIN_ROLE`
- `ISSUER_ROLE`

Para una instalacion institucional, usa una cuenta administradora dedicada y
concede `ISSUER_ROLE` solo a las wallets emisoras necesarias.

## Publicar el frontend

### GitHub Pages

El frontend es estatico y puede publicarse desde la carpeta que contiene
`index.html`:

1. Actualiza `CONTRACT_ADDRESS` con la direccion del contrato desplegado.
2. Confirma los cambios en la rama que publica GitHub Pages.
3. En **Settings > Pages**, selecciona el branch y la carpeta de publicacion.
4. Abre la URL generada y comprueba que la wallet este conectada a Fuji.

La demo publica actual esta disponible en
<https://melek-eyzaguirre-dev.github.io/avalanCert-Dapps/>.

### Hosting estatico alternativo

Tambien puede publicarse en Netlify, Vercel, Azure Static Web Apps o cualquier
servidor HTTP. No requiere comando de build: el directorio de publicacion es
el que contiene `index.html`.

## Flujo de uso recomendado

1. Cambia la wallet a **Avalanche Fuji Testnet**.
2. Abre la dApp y pulsa **Conectar Wallet**.
3. Para emitir, usa una cuenta con `ISSUER_ROLE`.
4. Genera el certificado individual o carga el CSV para una emision masiva.
5. Confirma la transaccion y espera su inclusion en el bloque.
6. Entrega el PDF generado al titular.
7. Verifica el PDF desde la pestaña **Verificador** o mediante su QR.
8. Para una anulacion, usa la cuenta institucional autorizada y registra el
   motivo de revocacion.

## Formato CSV para emision masiva

La interfaz espera una fila por estudiante. Usa encabezados consistentes con
los campos que consume el frontend:

```csv
nombre,curso,wallet,fecha
Ana Perez,Seguridad Web3,0x0000000000000000000000000000000000000001,2026-10-26
```

Usa direcciones EVM validas y evita incluir datos personales que no sean
necesarios. La blockchain es publica y los datos registrados no deben
considerarse confidenciales.

## Seguridad y buenas practicas

- No commitees `.env`, claves privadas, frases semilla ni API keys.
- Usa exclusivamente una wallet de prueba en Fuji durante el desarrollo.
- Revisa la direccion del contrato antes de firmar una transaccion.
- No almacenes informacion personal sensible en el hash, URI, eventos o
  metadatos publicos.
- El hash prueba la integridad del archivo, no la veracidad del contenido ni
  la identidad civil del titular.
- Antes de usar una red principal, realiza una auditoria del contrato, define
  un procedimiento de recuperacion de roles y prueba la revocacion.

## Solucion de problemas

### `CONTRACT_ADDRESS` sigue siendo el valor de ejemplo

Actualiza la constante en `js/avalancheConfig.js`, vuelve a publicar el
frontend y fuerza una recarga del navegador.

### MetaMask muestra la red equivocada

Cambia manualmente a Avalanche Fuji (`43113`) y vuelve a conectar la wallet.

### La transaccion falla por falta de fondos

Solicita AVAX de prueba en el faucet de Avalanche. El emisor necesita AVAX
para pagar gas incluso cuando el verificador solo realiza lecturas.

### La emision responde `missing role`

La wallet conectada no tiene `ISSUER_ROLE`. Otorgalo desde la cuenta
administradora mediante `grantRole`, o conecta la wallet correcta.

### El PDF aparece como adulterado

Valida el archivo original sin editarlo ni volver a exportarlo. Cualquier
cambio, incluso en los metadatos o en un byte del PDF, produce otra huella.

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](https://opensource.org/license/mit/).
