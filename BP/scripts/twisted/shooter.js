import { world, ItemStack } from '@minecraft/server';

export function hasAmmunition(player, itemId) {
    if (!itemId) return false;
    if (player.matches({ gameMode: "creative" })) return true;

    const inventory = player.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item?.typeId === itemId) {
            if (item.amount > 1) return true;
        }
    }

    return false;
}

export function useAmmunition(player, itemId) {
    if (!itemId) return false;
    const inventory = player.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item?.typeId === itemId) {
            if (item.amount > 1) {
                const newItem = new ItemStack(item.typeId, item.amount - 1);
                inventory.setItem(i, newItem);
            } else {
                inventory.setItem(i, undefined);
            }
            return;
        }
    }
}
