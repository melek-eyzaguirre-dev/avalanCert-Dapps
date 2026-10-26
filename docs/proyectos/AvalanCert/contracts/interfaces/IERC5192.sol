// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC5192 Minimal Soulbound Token Interface
 * @notice Estándar EIP-5192 para tokens intransferibles (Soulbound).
 * @dev Define los eventos y el método necesario para consultar si un token está bloqueado.
 */
interface IERC5192 {
    /**
     * @dev Se emite cuando un token se bloquea de forma permanente (intransferible).
     * @param tokenId El identificador único del token.
     */
    event Locked(uint256 tokenId);

    /**
     * @dev Se emite si un token llega a desbloquearse (opcional según el caso de uso).
     * @param tokenId El identificador único del token.
     */
    event Unlocked(uint256 tokenId);

    /**
     * @notice Devuelve el estado de bloqueo de un token.
     * @dev Debe retornar true para tokens Soulbound activos.
     * @param tokenId El identificador del token a verificar.
     * @return True si el token está bloqueado (intransferible), false en caso contrario.
     */
    function locked(uint256 tokenId) external view returns (bool);
}