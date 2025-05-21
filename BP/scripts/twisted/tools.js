import { world } from '@minecraft/server';
import { itemDurability } from './item_durability.js';

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