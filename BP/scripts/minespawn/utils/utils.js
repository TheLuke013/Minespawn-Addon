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
}

export function getPlayerMainhandItem(player) {
    const equippable = player.getComponent('equippable');
    return equippable.getEquipment('Mainhand');
}

export function replaceBlocks(locations, replaceBlock, block, dimension) {
    for (let i = 0; i < locations.length; i++) {
        if (world.getDimension(dimension).getBlock(locations[i]).typeId === replaceBlock) {
            world.getDimension(dimension).setBlockType(locations[i], block);
        }
    }
}