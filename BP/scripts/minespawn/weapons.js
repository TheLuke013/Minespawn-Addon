import { world } from '@minecraft/server';
import { getPlayerSlotItem } from './utils/utils.js';
import { detectFullArmor } from './armors.js';

export function ultimateHammerAttack(player, attackLoc) {
    world.getDimension(player.dimension.id).createExplosion(attackLoc, 3, { causesFire: true, source: player });

    const entities = player.dimension.getEntities({
        location: player.location, maxDistance: 5,
        excludeTypes: ['minecraft:item', 'minecraft:player']
    });

    entities.forEach(entity => {
        if (!entity || !entity.isValid() || !entity.applyKnockback) return;

        try {
            entity.applyKnockback(0, 0, 10, 3);
        } catch (error) {
            world.sendMessage(`Knockback failed for ${entity.typeId}`);
        }
    });

}

export function ultimateChainsaw(dimension, entryLoc) {
    const blocksToDestroy = [
        'minecraft:acacia_log', 'minecraft:birch_log', 'minecraft:cherry_log',
        'minecraft:dark_oak_log', 'minecraft:jungle_log', 'minecraft:mangrove_log',
        'minecraft:oak_log', 'minecraft:pale_oak_log', 'minecraft:spruce_log',
        'minecraft:acacia_leaves', 'minecraft:azalea_leaves', 'minecraft:azalea_leaves_flowered',
        'minecraft:birch_leaves', 'minecraft:cherry_leaves', 'minecraft:dark_oak_leaves',
        'minecraft:jungle_leaves', 'minecraft:mangrove_leaves', 'minecraft:oak_leaves',
        'minecraft:pale_oak_leaves', 'minecraft:spruce_leaves'
    ];

    let blocksCoords = [];

    const wDestroy = 2;
    const hDestroy = 5
    for (let x = -wDestroy; x <= wDestroy; x++) {
        for (let y = 0; y <= hDestroy; y++) {
            for (let z = -wDestroy; z <= wDestroy; z++) {
                const blockLoc = { x: entryLoc.x + x, y: entryLoc.y + y, z: entryLoc.z + z };
                const block = dimension.getBlock(blockLoc);

                if (block && blocksToDestroy.includes(block.typeId)) {
                    blocksCoords.push(blockLoc);
                }
            }
        }
    }

    blocksCoords.forEach(block => {
        dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air destroy`);
    })
}

world.afterEvents.entityHitBlock.subscribe(e => {
    const entity = e.damagingEntity;
    const block = e.hitBlock;

    //ultimate hammer explosion on hit block
    if (entity.typeId === 'minecraft:player') {
        const mainhandItem = getPlayerSlotItem(entity);

        if (mainhandItem?.typeId === 'minespawn:ultimate_hammer') {
            ultimateHammerAttack(entity, block.location);
        }
    }
});

world.afterEvents.entityHitEntity.subscribe(e => {
    const player = e.damagingEntity;
    if (!(player.typeId === 'minecraft:player')) return;

    //summon more xp when player hits with enchanted emerald armor and sword
    if (detectFullArmor(player, 'minespawn:experience') && getPlayerSlotItem(player)?.typeId === 'minespawn:experience_sword') {
        for (let i = 0; i < 5; i++) { player.dimension.spawnEntity('minecraft:xp_orb', player.location); }
    }

})