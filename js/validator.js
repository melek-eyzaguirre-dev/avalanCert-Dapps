import { CONTRACT_ADDRESS, CONTRACT_ABI, AVALANCHE_FUJI_PARAMS } from './avalancheConfig.js';

/**
 * Calcula el digest SHA-256 nativo usando Web Crypto API
 */
export async function calculateSHA256(arrayBuffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Emite un certificado individual, computa su hash, genera el PDF y ejecuta la tx
 */
export async function generateAndIssueCertificate(studentData, recipientWallet) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  // Diseño Base del Certificado
  doc.setFillColor(11, 14, 20);
  doc.rect(0, 0, 842, 595, "F");
  doc.setDrawColor(232, 65, 66);
  doc.setLineWidth(3);
  doc.rect(20, 20, 802, 555);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(232, 65, 66);
  doc.setFontSize(28);
  doc.text("AVALANCERT CREDENTIAL", 421, 100, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("EIP-5192 SOULBOUND ACADEMIC CERTIFICATE", 421, 130, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(200, 200, 200);
  doc.text("Se certifica de manera inmutable que:", 421, 190, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(studentData.studentName, 421, 230, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.text("Ha acreditado satisfactoriamente los requisitos del programa:", 421, 280, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(232, 65, 66);
  doc.text(studentData.courseName, 421, 320, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(160, 160, 160);
  doc.text(`Emisor: ${studentData.issuerOrg} | Fecha: ${studentData.issueDate}`, 421, 360, { align: "center" });
  doc.text(`Wallet Titular: ${recipientWallet}`, 421, 385, { align: "center" });

  // Cálculo de la huella digital previa
  const pdfBufferPre = doc.output("arraybuffer");
  const documentHash = await calculateSHA256(pdfBufferPre);

  let tokenId = `AVAX-SBT-${Math.floor(1000 + Math.random() * 9000)}`;
  let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  // Ejecución On-Chain si la wallet y contrato están activos
  if (window.ethereum && CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const metadataURI = `ipfs://avalancert/${documentHash}`;
      const tx = await contract.issueCertificate(recipientWallet, metadataURI, documentHash);
      const receipt = await tx.wait();

      txHash = receipt.hash;
      const event = receipt.logs
        .map(log => { try { return contract.interface.parseLog(log); } catch { return null; } })
        .find(e => e && e.name === "CertificateIssued");

      if (event) {
        tokenId = `AVAX-SBT-${event.args.tokenId.toString()}`;
      }
    } catch (err) {
      console.warn("Transacción blockchain no confirmada. Se usará identificador local de prueba.", err);
    }
  }

  // QR dinámico e incrustación final
  const verificationUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(tokenId)}&hash=${encodeURIComponent(documentHash)}`;
  const qrDiv = document.createElement("div");
  new QRCode(qrDiv, {
    text: verificationUrl,
    width: 110,
    height: 110,
    colorDark: "#0B0E14",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });

  await new Promise(resolve => setTimeout(resolve, 80));
  const qrCanvas = qrDiv.querySelector("canvas");
  if (qrCanvas) {
    doc.addImage(qrCanvas.toDataURL("image/png"), "PNG", 670, 420, 110, 110);
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Token ID: ${tokenId}`, 670, 545);
  doc.text(`SHA-256: ${documentHash.substring(0, 16)}...`, 670, 560);

  doc.save(`${tokenId}_${studentData.studentName.replace(/\s+/g, '_')}.pdf`);

  return { tokenId, txHash, documentHash, verificationUrl };
}

/**
 * Minteo masivo y empaquetado en ZIP
 */
export async function processBatchIssuance(studentsList, issuerOrg, onProgress) {
  const { jsPDF } = window.jspdf;
  const zip = new JSZip();

  const recipients = [];
  const uris = [];
  const hashes = [];
  const generatedDocs = [];

  for (let i = 0; i < studentsList.length; i++) {
    const s = studentsList[i];
    onProgress(`Procesando certificados (${i + 1}/${studentsList.length})...`);

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFillColor(11, 14, 20);
    doc.rect(0, 0, 842, 595, "F");
    doc.setDrawColor(232, 65, 66);
    doc.setLineWidth(3);
    doc.rect(20, 20, 802, 555);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(232, 65, 66);
    doc.setFontSize(26);
    doc.text("AVALANCERT CREDENTIAL", 421, 110, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(s.nombre, 421, 230, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text("Ha acreditado el programa:", 421, 280, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(232, 65, 66);
    doc.text(s.curso, 421, 320, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(160, 160, 160);
    doc.text(`Emisor: ${issuerOrg} | Fecha: ${s.fecha || '2026-11-01'}`, 421, 360, { align: "center" });
    doc.text(`Wallet: ${s.wallet}`, 421, 385, { align: "center" });

    const buffer = doc.output("arraybuffer");
    const documentHash = await calculateSHA256(buffer);

    recipients.push(s.wallet);
    uris.push(`ipfs://avalancert-batch/${documentHash}`);
    hashes.push(documentHash);
    generatedDocs.push({ doc, student: s, hash: documentHash });
  }

  onProgress("Acuñando lote en Avalanche C-Chain...");
  let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  let baseTokenId = Math.floor(2000 + Math.random() * 5000);

  if (window.ethereum && CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          ...CONTRACT_ABI,
          "function issueBatch(address[] calldata recipients, string[] calldata uris, bytes32[] calldata documentHashes) external returns (uint256[] memory)"
        ],
        signer
      );

      const tx = await contract.issueBatch(recipients, uris, hashes);
      const receipt = await tx.wait();
      txHash = receipt.hash;
    } catch (e) {
      console.warn("Fallo o rechazo en issueBatch on-chain. Procediendo en modo local:", e);
    }
  }

  onProgress("Comprimiendo certificados en archivo ZIP...");
  for (let i = 0; i < generatedDocs.length; i++) {
    const item = generatedDocs[i];
    const currentId = `AVAX-SBT-${baseTokenId + i}`;
    const verifyUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(currentId)}&hash=${encodeURIComponent(item.hash)}`;

    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, { text: verifyUrl, width: 100, height: 100 });
    await new Promise(r => setTimeout(r, 50));

    const qrCanvas = qrDiv.querySelector("canvas");
    if (qrCanvas) {
      item.doc.addImage(qrCanvas.toDataURL("image/png"), "PNG", 670, 420, 100, 100);
    }

    item.doc.setFont("courier", "normal");
    item.doc.setFontSize(8);
    item.doc.setTextColor(150, 150, 150);
    item.doc.text(`Token ID: ${currentId}`, 670, 545);

    const pdfBlob = item.doc.output("blob");
    zip.file(`${currentId}_${item.student.nombre.replace(/\s+/g, '_')}.pdf`, pdfBlob);
  }

  const zipContent = await zip.generateAsync({ type: "blob" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(zipContent);
  downloadLink.download = `Certificados_Batch_${Date.now()}.zip`;
  downloadLink.click();

  return { totalMinted: studentsList.length, txHash };
}

/**
 * Consulta del validador público
 */
export async function verifyCertificateOnChain(searchQuery, localStore = []) {
  const query = searchQuery.trim().toLowerCase();

  if (CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    try {
      const provider = new ethers.JsonRpcProvider(AVALANCHE_FUJI_PARAMS.rpcUrls[0]);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const cleanId = query.replace("avax-sbt-", "");
      if (!isNaN(cleanId)) {
        const cert = await contract.getCertificate(cleanId);
        return {
          found: true,
          source: "Avalanche Fuji C-Chain",
          id: `AVAX-SBT-${cleanId}`,
          issuerOrg: cert.issuer,
          studentWallet: cert.owner,
          documentHash: cert.documentHash,
          isRevoked: cert.revoked,
          issueDate: new Date(Number(cert.issuedAt) * 1000).toLocaleDateString()
        };
      }
    } catch (e) {
      console.log("No encontrado en RPC, verificando en registros locales...");
    }
  }

  const localMatch = localStore.find(c =>
    c.id.toLowerCase() === query ||
    c.txHash.toLowerCase() === query ||
    (c.documentHash && c.documentHash.toLowerCase() === query) ||
    c.studentName.toLowerCase().includes(query)
  );

  if (localMatch) {
    return {
      found: true,
      source: "Avalanche Node Local Storage",
      ...localMatch,
      isRevoked: localMatch.isRevoked || false
    };
  }

  return { found: false };
}

export async function manageIssuerRole(targetWallet, action) {
  const ISSUER_ROLE = ethers.id("ISSUER_ROLE");

  if (window.ethereum && CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      [
        "function grantRole(bytes32 role, address account) external",
        "function revokeRole(bytes32 role, address account) external"
      ],
      signer
    );

    if (action === "grant") {
      const tx = await contract.grantRole(ISSUER_ROLE, targetWallet);
      await tx.wait();
      return { success: true, message: `Rol ISSUER otorgado a ${targetWallet}` };
    } else {
      const tx = await contract.revokeRole(ISSUER_ROLE, targetWallet);
      await tx.wait();
      return { success: true, message: `Rol ISSUER revocado a ${targetWallet}` };
    }
  }

  return { success: true, message: `[Simulación] Permiso ${action === 'grant' ? 'otorgado' : 'revocado'} a ${targetWallet}.` };
}

export async function revokeCertificateOnChain(tokenId, reason) {
  if (window.ethereum && CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const cleanId = tokenId.replace("AVAX-SBT-", "");
    const tx = await contract.revokeCertificate(cleanId, reason);
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  }

  return {
    success: true,
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
}

// Registro global
window.calculateSHA256 = calculateSHA256;
window.generateAndIssueCertificate = generateAndIssueCertificate;
window.processBatchIssuance = processBatchIssuance;
window.verifyCertificateOnChain = verifyCertificateOnChain;
window.manageIssuerRole = manageIssuerRole;
window.revokeCertificateOnChain = revokeCertificateOnChain;
/**
 * Certifica de forma segura un enlace institucional o diploma externo (Udemy, Coursera, etc.)
 */
export async function certifyExternalLink(studentData, recipientWallet, externalUrl) {
  // 1. Validar formato de URL
  try {
    new URL(externalUrl);
  } catch (_) {
    throw new Error("El enlace proporcionado no es una URL válida.");
  }

  // 2. Generar el hash SHA-256 canónico del enlace oficial
  const encoder = new TextEncoder();
  const data = encoder.encode(externalUrl.trim().toLowerCase());
  const documentHash = await calculateSHA256(data);

  // 3. Crear el PDF de respaldo que contiene la referencia y el enlace
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFillColor(11, 14, 20);
  doc.rect(0, 0, 842, 595, "F");
  doc.setDrawColor(232, 65, 66);
  doc.setLineWidth(3);
  doc.rect(20, 20, 802, 555);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(232, 65, 66);
  doc.setFontSize(26);
  doc.text("AVALANCERT EXTERNAL ACCREDITATION", 421, 100, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(180, 180, 180);
  doc.text("HOMOLOGACIÓN ON-CHAIN DE CREDENCIAL EXTERNA", 421, 130, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.text("Se homologa en Avalanche el título otorgado a:", 421, 190, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(studentData.studentName, 421, 230, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.text("Correspondiente al programa acreditado:", 421, 280, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(232, 65, 66);
  doc.text(studentData.courseName, 421, 320, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(160, 160, 160);
  doc.text(`Institución: ${studentData.issuerOrg} | Fecha: ${studentData.issueDate}`, 421, 360, { align: "center" });
  doc.text(`Enlace Oficial: ${externalUrl}`, 421, 385, { align: "center" });

  let tokenId = `AVAX-SBT-${Math.floor(5000 + Math.random() * 4000)}`;
  let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  // 4. Interacción On-Chain con issueCertificate pasando externalUrl
  if (window.ethereum && CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes("TuContrato")) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const metadataURI = `ipfs://avalancert-ext/${documentHash}`;
      const tx = await contract.issueCertificate(recipientWallet, metadataURI, documentHash, externalUrl);
      const receipt = await tx.wait();

      txHash = receipt.hash;
      const event = receipt.logs
        .map(log => { try { return contract.interface.parseLog(log); } catch { return null; } })
        .find(e => e && e.name === "CertificateIssued");

      if (event) {
        tokenId = `AVAX-SBT-${event.args.tokenId.toString()}`;
      }
    } catch (err) {
      console.warn("Fallo o rechazo on-chain. Procediendo en modo local:", err);
    }
  }

  // 5. Incrustar QR en el PDF que apunta al validador y al enlace original
  const verificationUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(tokenId)}&hash=${encodeURIComponent(documentHash)}`;
  const qrDiv = document.createElement("div");
  new QRCode(qrDiv, { text: verificationUrl, width: 100, height: 100 });
  await new Promise(r => setTimeout(r, 60));

  const qrCanvas = qrDiv.querySelector("canvas");
  if (qrCanvas) {
    doc.addImage(qrCanvas.toDataURL("image/png"), "PNG", 670, 420, 100, 100);
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Token ID: ${tokenId}`, 670, 545);
  doc.text(`Hash Enlace: ${documentHash.substring(0, 16)}...`, 670, 560);

  doc.save(`${tokenId}_Homologado_${studentData.studentName.replace(/\s+/g, '_')}.pdf`);

  return { tokenId, txHash, documentHash, externalUrl };
}

window.certifyExternalLink = certifyExternalLink;