import * as Vector3 from "./vector3.js";
import { world } from '@minecraft/server';

export function shootEntityFromPlayer(entityId, player) {
    const direction = Vector3.fromRotation(player.getRotation());

    let playerLocation = new Vector3.Vector3(player.location);
    let projectileSpawn = playerLocation.add(Vector3.Up.multiply(1.5)).add(direction.multiply(2));

    const projectile = player.dimension.spawnEntity(entityId, { x: projectileSpawn.x, y: projectileSpawn.y, z: projectileSpawn.z });
    const projectileVelocity = direction.multiply(4);

    projectile.applyImpulse({ x: projectileVelocity.x, y: projectileVelocity.y, z: projectileVelocity.z });
    projectile.setRotation(player.getRotation());
    projectile.addTag(`player:${player.name}`);
}

export function getPlayerSlotItem(player, slot = 'Mainhand') {
    const equippable = player.getComponent('equippable');
    return equippable.getEquipment(slot);
}

export function replaceBlocks(locations, replaceBlock, block, dimension) {
    for (let i = 0; i < locations.length; i++) {
        if (world.getDimension(dimension).getBlock(locations[i]).typeId === replaceBlock) {
            world.getDimension(dimension).setBlockType(locations[i], block);
        }
    }
}

export function getCardinalDirection(player) {
    const yaw = player.getRotation().y;
    if (yaw >= -45 && yaw < 45) return 'north';
    else if (yaw >= 45 && yaw < 135) return 'east';
    else if (yaw >= 135 || yaw < -135) return 'south';
    else return 'west';
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}