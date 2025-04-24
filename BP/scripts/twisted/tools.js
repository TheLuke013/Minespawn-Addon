import { world } from '@minecraft/server';
import { itemDurability } from './item_durability.js';

world.afterEvents.itemUseOn.subscribe(e => {
    const item = e.itemStack;
    if (item.getTags().includes('twisted:hoe')) {
        itemDurability(e.source);
        world.playSound('use.gravel', e.source.location);
    }
})