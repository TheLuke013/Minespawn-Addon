import { world } from '@minecraft/server';
import { getCardinalDirection } from './utils/utils.js';

function minersDreamFill(coords1, coords2, dimension) {
    const blocksToDestroy = [
        'minecraft:stone', 'minecraft:blackstone', 'minecraft:netherrack',
        'minecraft:magma', 'minecraft:soul_sand', 'minecraft:soul_soil',
        'minecraft:deepslate', 'minecraft:tuff', 'minecraft:gravel',
        'minecraft:dirt', 'minecraft:water', 'minecraft:lava',
        'minecraft:flowing_water', 'minecraft:flowing_lava', 'minecraft:clay', 'minecraft:moss_block',
        'minecraft:azalea', 'minecraft:flowering_azalea', 'minecraft:cave_vines',
        'minecraft:cave_vines_body_with_berries', 'minecraft:cave_vines_head_with_berries',
        'minecraft:warped_nylium', 'minecraft:crimson_nylium', 'minecraft:polished_blackstone_bricks',
        'minecraft:cracked_polished_blackstone_bricks', 'minecraft:basalt', 'minecraft:crimson_stem',
        'minecraft:warped_stem', 'minecraft:twisting_vines', 'minecraft:weeping_vines',
        'minecraft:nether_wart_block', 'minecraft:warped_wart_block'
    ];

    blocksToDestroy.forEach(block => {
        dimension.runCommand(`fill ${coords1.x} ${coords1.y} ${coords1.z} ${coords2.x} ${coords2.y} ${coords2.z} air replace ${block}`);
    });

    //replace air roof/floor to cobblestone
    const excludeBaseBlocks = [
        'minecraft:air', 'minecraft:water', 'minecraft:lava',
        'minecraft:flowing_water', 'minecraft:flowing_lava'
    ];
    const baseBlock = dimension.id === 'minecraft:nether' ? 'nether_brick' : 'cobblestone';

    excludeBaseBlocks.forEach(block => {
        dimension.runCommand(`fill ${coords1.x} ${coords1.y - 1} ${coords1.z} ${coords2.x} ${coords1.y - 1} ${coords2.z} ${baseBlock} replace ${block}`);
        dimension.runCommand(`fill ${coords1.x} ${coords1.y + 6} ${coords1.z} ${coords2.x} ${coords1.y + 6} ${coords2.z} ${baseBlock} replace ${block}`);
    })
}

function placeMinersDreamStructures(blockLoc, dimension, xT, zT, xOrigin, zOrigin, pos = 1) {
    blockLoc.x += xOrigin;
    blockLoc.z += zOrigin;

    let strucName = pos == 2 ? 'miners_dream/miners_dream_2' : 'miners_dream/miners_dream';
    strucName += dimension === 'minecraft:nether' ? '_nether' : '';

    //world.sendMessage(`${strucName}`);

    for (let i = 0; i <= 6; i++) {
        world.getDimension(dimension).runCommand(`structure load "${strucName}" ${blockLoc.x} ${blockLoc.y} ${blockLoc.z}`);
        blockLoc.x += xT;
        blockLoc.z += zT;
    }
}

world.afterEvents.itemUseOn.subscribe(e => {
    if (e.itemStack.typeId === 'minespawn:miners_dream' && e.source.typeId === 'minecraft:player') {
        const playerDirection = getCardinalDirection(e.source);
        const bLoc = e.block.location;

        if (playerDirection == 'south') {
            minersDreamFill({ x: bLoc.x - 4, y: bLoc.y, z: bLoc.z - 64 }, { x: bLoc.x + 4, y: bLoc.y + 5, z: bLoc.z }, e.source.dimension);
            placeMinersDreamStructures(bLoc, e.source.dimension.id, 0, -10, -4, 0);
        } else if (playerDirection == 'north') {
            minersDreamFill({ x: bLoc.x - 4, y: bLoc.y, z: bLoc.z + 64 }, { x: bLoc.x + 4, y: bLoc.y + 5, z: bLoc.z }, e.source.dimension);
            placeMinersDreamStructures(bLoc, e.source.dimension.id, 0, 10, -4, 0);
        } else if (playerDirection == 'east') {
            minersDreamFill({ x: bLoc.x, y: bLoc.y, z: bLoc.z - 4 }, { x: bLoc.x - 64, y: bLoc.y + 5, z: bLoc.z + 4 }, e.source.dimension);
            placeMinersDreamStructures(bLoc, e.source.dimension.id, -10, 0, 0, -4, 2);
        } else if (playerDirection == 'west') {
            minersDreamFill({ x: bLoc.x, y: bLoc.y, z: bLoc.z - 4 }, { x: bLoc.x + 64, y: bLoc.y + 5, z: bLoc.z + 4 }, e.source.dimension);
            placeMinersDreamStructures(bLoc, e.source.dimension.id, 10, 0, 0, -4, 2);
        }

        e.source.dimension.playSound('random.explode', e.source.location);
    }
})