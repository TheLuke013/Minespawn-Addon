import { EquipmentSlot } from '@minecraft/server';

export function detectFullArmor(source, armorName) {
    const equippable = source.getComponent("minecraft:equippable");

    const head = equippable.getEquipmentSlot(EquipmentSlot.Head);
    if (!head.hasItem()) return;
    const chest = equippable.getEquipmentSlot(EquipmentSlot.Chest);
    if (!chest.hasItem()) return;
    const legs = equippable.getEquipmentSlot(EquipmentSlot.Legs);
    if (!legs.hasItem()) return;
    const feet = equippable.getEquipmentSlot(EquipmentSlot.Feet);
    if (!feet.hasItem()) return;

    if (head?.typeId === `${armorName}_helmet` &&
        chest?.typeId === `${armorName}_chestplate` &&
        legs?.typeId === `${armorName}_leggings` &&
        feet?.typeId === `${armorName}_boots`) {
        return true;
    }

    return false;
}

export function royalArmorEffects(player) {
    const fullRoyal = detectFullArmor(player, 'twisted:royal');
    if (fullRoyal) {
        player.addEffect('minecraft:resistance', 100, { showParticles: false });
        player.addEffect('minecraft:fire_resistance', 100, { showParticles: false });
        player.addEffect('minecraft:regeneration', 100, { showParticles: false });
        player.addEffect('minecraft:slow_falling', 100, { showParticles: false });

        if (!(player.getTags().includes('knockback_resistance')))
            player.addTag('add_knockback_resistance');
    } else if (!(fullRoyal) && player.getTags().includes('knockback_resistance')) {
        player.removeTag('knockback_resistance');
        player.addTag('remove_knockback_resistance');
    }
}

export function ultimateArmorEffects(player) {
    const fullRoyal = detectFullArmor(player, 'twisted:ultimate');
    if (fullRoyal) {
        player.addEffect('minecraft:resistance', 100, { amplifier: 2, showParticles: false });
        player.addEffect('minecraft:fire_resistance', 100, { showParticles: false });
        player.addEffect('minecraft:speed', 100, { amplifier: 1, showParticles: false });
        player.addEffect('minecraft:jump_boost', 100, { amplifier: 2, showParticles: false });
    }
}