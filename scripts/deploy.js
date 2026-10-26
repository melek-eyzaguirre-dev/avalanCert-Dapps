const { ethers, run, network } = require("hardhat");

async function main() {
  console.log("----------------------------------------------------");
  console.log(`Desplegando en la red: ${network.name} (ChainID: ${network.config.chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log(`Cuenta de despliegue (Admin & Issuer): ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance disponible: ${ethers.formatEther(balance)} AVAX`);

  if (balance === 0n) {
    throw new Error("La cuenta no tiene fondos AVAX en Fuji. Consigue fondos en: https://faucet.avax.network/");
  }

  // 1. Obtener la fábrica del contrato
  console.log("\nCompilando y desplegando AvalanCertSBT...");
  const AvalanCertSBT = await ethers.getContractFactory("AvalanCertSBT");

  // El constructor recibe address defaultAdmin
  const avalanCert = await AvalanCertSBT.deploy(deployer.address);
  await avalanCert.waitForDeployment();

  const contractAddress = await avalanCert.getAddress();
  console.log(`\n¡Contrato desplegado con éxito!`);
  console.log(`Dirección del Contrato: ${contractAddress}`);
  console.log(`Explorador Snowtrace: https://testnet.snowtrace.io/address/${contractAddress}`);

  // 2. Esperar confirmaciones de bloque antes de verificar
  if (network.name === "fuji") {
    console.log("\nEsperando 5 confirmaciones de bloque para indexación en Snowtrace...");
    const deploymentTx = avalanCert.deploymentTransaction();
    if (deploymentTx) {
      await deploymentTx.wait(5);
    }

    // 3. Verificación automática en Snowtrace
    console.log("Iniciando verificación en el explorador...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address],
      });
      console.log("¡Contrato verificado con éxito en Snowtrace!");
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("El contrato ya se encontraba verificado.");
      } else {
        console.warn("Advertencia en verificación automática:", error.message);
        console.log(`Puedes verificarlo manualmente ejecutando:`);
        console.log(`npx hardhat verify --network fuji ${contractAddress} "${deployer.address}"`);
      }
    }
  }

  console.log("\n-> Actualiza la constante CONTRACT_ADDRESS en js/avalancheConfig.js con:");
  console.log(`export const CONTRACT_ADDRESS = "${contractAddress}";`);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error en el despliegue:", error);
    process.exit(1);
  });