import { EnchantmentTypes } from "@minecraft/server";

export function enchantItems(player) {
    const inventory = player.getComponent("inventory").container;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (!item) continue;

        const enchantable = item.getComponent("minecraft:enchantable");
        if (!enchantable) continue;

        const enchants = [];

        switch (item.typeId) {
            case 'twisted:big_bertha':
            case 'twisted:stelix_bertha':
                enchants.push(
                    { type: EnchantmentTypes.get("knockback"), level: 2 },
                    { type: EnchantmentTypes.get("bane_of_arthropods"), level: 1 },
                    { type: EnchantmentTypes.get("fire_aspect"), level: 1 }
                );
                break;

            case 'twisted:royal_guardian':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 }
                );
                break;

            case 'twisted:royal_shield':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:battle_axe':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 2 },
                    { type: EnchantmentTypes.get("looting"), level: 2 }
                );
                break;

            case 'twisted:queen_battle_axe':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("looting"), level: 3 },
                    { type: EnchantmentTypes.get("fire_aspect"), level: 2 }
                    // { type: EnchantmentTypes.get("sharpness"), level: 5 } // Descomentável se desejar
                );
                break;

            case 'twisted:ultimate_chainsaw':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("efficiency"), level: 5 }
                );
                break;

            case 'twisted:emerald_pickaxe':
                enchants.push(
                    { type: EnchantmentTypes.get("silk_touch"), level: 1 }
                );
                break;

            case 'twisted:enchanted_emerald_sword':
                enchants.push(
                    { type: EnchantmentTypes.get("sharpness"), level: 2 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:enchanted_emerald_helmet':
            case 'twisted:enchanted_emerald_chestplate':
            case 'twisted:enchanted_emerald_leggings':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 2 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:enchanted_emerald_boots':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 2 },
                    { type: EnchantmentTypes.get("feather_falling"), level: 1 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:royal_helmet':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("aqua_affinity"), level: 1 },
                    { type: EnchantmentTypes.get("respiration"), level: 2 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:royal_chestplate':
            case 'twisted:royal_leggings':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:royal_boots':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("feather_falling"), level: 4 },
                    { type: EnchantmentTypes.get("mending"), level: 1 }
                );
                break;

            case 'twisted:ultimate_helmet':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("aqua_affinity"), level: 1 },
                    { type: EnchantmentTypes.get("respiration"), level: 2 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 }
                );
                break;

            case 'twisted:ultimate_chestplate':
            case 'twisted:ultimate_leggings':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 }
                );
                break;

            case 'twisted:ultimate_boots':
                enchants.push(
                    { type: EnchantmentTypes.get("protection"), level: 4 },
                    { type: EnchantmentTypes.get("feather_falling"), level: 4 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 }
                );
                break;

            case 'twisted:ultimate_sword':
                enchants.push(
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("knockback"), level: 2 },
                    { type: EnchantmentTypes.get("sharpness"), level: 5 },
                    { type: EnchantmentTypes.get("fire_aspect"), level: 2 },
                    { type: EnchantmentTypes.get("looting"), level: 3 }
                );
                break;

            case 'twisted:ultimate_pickaxe':
                enchants.push(
                    { type: EnchantmentTypes.get("fortune"), level: 3 },
                    { type: EnchantmentTypes.get("efficiency"), level: 5 }
                );
                break;

            case 'twisted:ultimate_axe':
            case 'twisted:ultimate_shovel':
            case 'twisted:ultimate_hoe':
                enchants.push(
                    { type: EnchantmentTypes.get("efficiency"), level: 5 }
                );
                break;

            case 'twisted:small_ultimate_hammer':
                enchants.push(
                    { type: EnchantmentTypes.get("efficiency"), level: 5 },
                    { type: EnchantmentTypes.get("unbreaking"), level: 3 },
                    { type: EnchantmentTypes.get("silk_touch"), level: 1 }
                );
                break;
            case 'twisted:ultimate_bow':
                enchants.push(
                    { type: EnchantmentTypes.get("flame"), level: 1 },
                    { type: EnchantmentTypes.get("infinity"), level: 1 },
                    { type: EnchantmentTypes.get("power"), level: 5 },
                    { type: EnchantmentTypes.get("punch"), level: 2 }
                );
                break;
        }

        try {
            if (enchants.length > 0) {
                enchantable.addEnchantments(enchants);
                inventory.setItem(i, item);
            }
        } catch (e) { }
    }
}
