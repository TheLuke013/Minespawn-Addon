import { EquipmentSlot } from '@minecraft/server';

export function itemDurability(source) {
    if (!(source.typeId === 'minecraft:player')) return;

    const equippable = source.getComponent("minecraft:equippable");

    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    if (!mainhand.hasItem()) return;

    if (source.matches({ gameMode: "creative" })) return;

    const itemStack = mainhand.getItem();
    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

    const enchantable = itemStack.getComponent("minecraft:enchantable");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;

    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return;

    const shouldBreak = durability.damage === durability.maxDurability;

    if (shouldBreak) {
        mainhand.setItem(undefined);
        source.playSound("random.break");
    } else {
        durability.damage++;
        mainhand.setItem(itemStack);
    }
}