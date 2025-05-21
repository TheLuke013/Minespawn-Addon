import { world, MolangVariableMap } from '@minecraft/server';
import { replaceBlocks, getPlayerSlotItem, randomInt } from '../utils/utils.js';

function getExtremeTorchLightLocations(e) {
    return [
        { x: e.block.location.x + 10, y: e.block.location.y, z: e.block.location.z },
        { x: e.block.location.x - 10, y: e.block.location.y, z: e.block.location.z },
        { x: e.block.location.x, y: e.block.location.y, z: e.block.location.z + 10 },
        { x: e.block.location.x, y: e.block.location.y, z: e.block.location.z - 10 }
    ];
}

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('twisted:torch', {
        onPlace: e => {
            if (e.block.typeId === 'twisted:extreme_torch') {
                const locations = getExtremeTorchLightLocations(e);
                replaceBlocks(locations, 'minecraft:air', 'minecraft:light_block_15', e.dimension.id);
            }
        },

        onPlayerDestroy: e => {
            const locations = getExtremeTorchLightLocations(e);
            replaceBlocks(locations, 'minecraft:light_block_15', 'minecraft:air', e.dimension.id);
        },

        onTick: e => {
            const { block } = e;

            if (block.typeId === 'twisted:extreme_torch') {

                const blockFace = block.permutation.getState('minecraft:block_face');

                const particlePositions = {
                    north: [0.5, 1.5, 0.45],
                    south: [0.5, 1.5, 0.50],
                    east: [0.50, 1.5, 0.5],
                    west: [0.45, 1.5, 0.5],
                    up: [0.5, 1.6, 0.5]
                };

                const position = particlePositions[blockFace];

                if (position) {
                    const [offsetX, offsetY, offsetZ] = position;

                    const { x, y, z } = block.location;

                    const particleX = x + offsetX;
                    const particleY = y + offsetY;
                    const particleZ = z + offsetZ;

                    const molangVariables = new MolangVariableMap();

                    block.dimension.spawnParticle('minecraft:basic_flame_particle', { x: particleX, y: particleY, z: particleZ }, molangVariables);
                    block.dimension.spawnParticle('minecraft:basic_smoke_particle', { x: particleX, y: particleY, z: particleZ }, molangVariables);
                }
            }
        }
    });

    initEvent.blockComponentRegistry.registerCustomComponent('twisted:ore_xp_reward', {
        onPlayerDestroy: e => {
            const mainhandItem = getPlayerSlotItem(e.player);

            const pickaxes = [
                'minecraft:iron_pickaxe', 'minecraft:golden_pickaxe', 'minecraft:diamond_pickaxe',
                'minecraft:netherite_pickaxe', 'twisted:emerald_pickaxe', 'twisted:amethyst_pickaxe',
                'twisted:ruby_pickaxe', 'twisted:ultimate_pickaxe'];

            if (!(mainhandItem && pickaxes.includes(mainhandItem.typeId))) return;

            const enchantable = mainhandItem.getComponent('minecraft:enchantable');
            const silkTouch = enchantable?.getEnchantment('silk_touch');
            if (silkTouch) return;

            const xpAmount = randomInt(1, 5);
            for (let i = 0; i < xpAmount; i++) {
                e.dimension.spawnEntity("minecraft:xp_orb", e.block.location);
            }

        }
    });
})