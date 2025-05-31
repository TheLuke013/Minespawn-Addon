import { world, system, Direction, ItemStack } from '@minecraft/server';
import { itemDurability } from './item_durability.js';

const BLOCK_DROPS = {
    'minecraft:coal_ore': 'minecraft:coal',
    'minecraft:copper_ore': 'minecraft:raw_copper',
    'minecraft:iron_ore': 'minecraft:raw_iron',
    'minecraft:gold_ore': 'minecraft:raw_gold',
    'minecraft:lapis_ore': 'minecraft:lapis_lazuli',
    'minecraft:redstone_ore': 'minecraft:redstone',
    'minecraft:lit_redstone_ore': 'minecraft:redstone',
    'minecraft:emerald_ore': 'minecraft:emerald',
    'minecraft:diamond_ore': 'minecraft:diamond',
    'minecraft:deepslate_coal_ore': 'minecraft:coal',
    'minecraft:deepslate_copper_ore': 'minecraft:raw_copper',
    'minecraft:deepslate_iron_ore': 'minecraft:raw_iron',
    'minecraft:deepslate_gold_ore': 'minecraft:raw_gold',
    'minecraft:deepslate_lapis_ore': 'minecraft:lapis_lazuli',
    'minecraft:deepslate_redstone_ore': 'minecraft:redstone',
    'minecraft:deepslate_lit_redstone_ore': 'minecraft:redstone',
    'minecraft:deepslate_emerald_ore': 'minecraft:emerald',
    'minecraft:deepslate_diamond_ore': 'minecraft:diamond',
    'minecraft:nether_gold_ore': 'minecraft:gold_nugget',
    'minecraft:quartz_ore': 'minecraft:quartz',
    'twisted:ruby_ore': 'twisted:ruby',
    'twisted:amethyst_ore': 'twisted:amethyst',
    'twisted:titanium_ore': 'twisted:titanium_nugget',
    'twisted:uranium_ore': 'twisted:uranium_nugget',
    'twisted:deepslate_ruby_ore': 'twisted:ruby',
    'twisted:deepslate_amethyst_ore': 'twisted:amethyst',
    'twisted:deepslate_titanium_ore': 'twisted:titanium_nugget',
    'twisted:deepslate_uranium_ore': 'twisted:uranium_nugget'
};

world.afterEvents.itemUseOn.subscribe(e => {
    const item = e.itemStack;
    if (item.getTags().includes('twisted:hoe')) {
        itemDurability(e.source);
        world.playSound('use.gravel', e.source.location);

        if (item.typeId === 'twisted:ultimate_hoe') {
            const loc = e.block.location;
            e.source.runCommand(`fill ${loc.x + 1} ${loc.y - 1} ${loc.z + 1} ${loc.x - 1} ${loc.y + 1} ${loc.z - 1} farmland replace grass_block`);
            e.source.runCommand(`fill ${loc.x + 1} ${loc.y - 1} ${loc.z + 1} ${loc.x - 1} ${loc.y + 1} ${loc.z - 1} farmland replace dirt`);
        }
    }
})

world.beforeEvents.playerBreakBlock.subscribe(e => {
    try {
        const item = e.itemStack;
        if (item.typeId === 'twisted:small_ultimate_hammer') {
            const enchantments = item.getComponent('enchantable');
            const fortuneLevel = enchantments.hasEnchantment('fortune') ? enchantments.getEnchantment('fortune').level : 0;
            const hasSilkTouch = enchantments.hasEnchantment('silk_touch');
            hammerBreak(e.block, e.player, fortuneLevel, hasSilkTouch);
        }
    } catch (e) { }

})

function hammerBreak(block, player, fortuneLevel, hasSilkTouch) {
    const dimension = block.dimension;
    const centerLocation = block.location;
    const blockFace = player.getBlockFromViewDirection().face;

    const offsets = getOffsets(blockFace);

    for (const offset of offsets) {
        const currentLocation = {
            x: centerLocation.x + offset.x,
            y: centerLocation.y + offset.y,
            z: centerLocation.z + offset.z
        };

        const currentBlock = dimension.getBlock(currentLocation);
        if (currentBlock) {
            if (hasSilkTouch) {
                handleSilkTouch(dimension, currentLocation, currentBlock, currentLocation.x === centerLocation.x && currentLocation.y === centerLocation.y && currentLocation.z === centerLocation.z);
            } else {
                handleNormalBreak(dimension, currentLocation, currentBlock, fortuneLevel);
            }
        }
    }
}

function handleSilkTouch(dimension, location, block, isFirstBlock) {
    const blockType = block.typeId;
    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air replace`);

    if (!isFirstBlock) {
        system.run(() => {
            const newBlock = new ItemStack(blockType);
            dimension.spawnItem(newBlock, location);
        });
    }
}

function handleNormalBreak(dimension, location, block, fortuneLevel) {
    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air destroy`);

    if (BLOCK_DROPS[block.typeId] && fortuneLevel > 0) {
        handleFortuneDrops(dimension, location, block, fortuneLevel);
    }
}

function getOffsets(blockFace) {
    switch (blockFace) {
        case Direction.North:
        case Direction.South:
            return [
                { x: -1, y: 1, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 },
                { x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
                { x: -1, y: -1, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 1, y: -1, z: 0 }
            ];
        case Direction.East:
        case Direction.West:
            return [
                { x: 0, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 1, z: 1 },
                { x: 0, y: 0, z: -1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 },
                { x: 0, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, { x: 0, y: -1, z: 1 }
            ];
        case Direction.Up:
        case Direction.Down:
            return [
                { x: -1, y: 0, z: -1 }, { x: 0, y: 0, z: -1 }, { x: 1, y: 0, z: -1 },
                { x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
                { x: -1, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 1 }
            ];
    }
}