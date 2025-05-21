import { getPlayerSlotItem } from './utils/utils.js';

export function enchantItems(player) {
    const mainhandItem = getPlayerSlotItem(player);
    //BIG BERTHA | STELIX BERTHA
    if (mainhandItem?.typeId === 'twisted:big_bertha' ||
        mainhandItem?.typeId === 'twisted:stelix_bertha') {
        player.runCommand('enchant @s knockback 2');
        player.runCommand('enchant @s bane_of_arthropods');
        player.runCommand('enchant @s fire_aspect');
    }
    //ROYAL GUARDIAN
    else if (mainhandItem?.typeId === 'twisted:royal_guardian') {
        player.runCommand('enchant @s unbreaking 3');
    }
    //ROYAL SHIELD
    else if (mainhandItem?.typeId === 'twisted:royal_shield') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s mending');
    }
    //BATTLE AXE
    else if (mainhandItem?.typeId === 'twisted:battle_axe') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s looting 3');
    }
    //QUEEN BATTLE AXE
    else if (mainhandItem?.typeId === 'twisted:queen_battle_axe') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s looting 3');
        player.runCommand('enchant @s fire_aspect 2');
        //player.runCommand('enchant @s sharpness 5');
    }
    //ULTIMATE HAMMER
    else if (mainhandItem?.typeId === 'twisted:ultimate_chainsaw') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s efficiency 5');
    }
    //EMERALD PICKAXE
    else if (mainhandItem?.typeId === 'twisted:emerald_pickaxe') {
        player.runCommand('enchant @s silk_touch');
    }
    //ENCHANTED EMERALD SWORD
    else if (mainhandItem?.typeId === 'twisted:enchanted_emerald_sword') {
        player.runCommand('enchant @s sharpness 2');
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s mending');
    }
    //ENCHANTED EMERALD ARMOR
    else if (mainhandItem?.typeId === 'twisted:enchanted_emerald_helmet' ||
        mainhandItem?.typeId === 'twisted:enchanted_emerald_chestplate' ||
        mainhandItem?.typeId === 'twisted:enchanted_emerald_leggings') {
        player.runCommand('enchant @s protection 2');
        player.runCommand('enchant @s mending');
    } else if (mainhandItem?.typeId === 'twisted:enchanted_emerald_boots') {
        player.runCommand('enchant @s protection 2');
        player.runCommand('enchant @s feather_falling');
        player.runCommand('enchant @s mending');
    }
    //ROYAL ARMOR
    else if (mainhandItem?.typeId === 'twisted:royal_helmet') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s aqua_affinity');
        player.runCommand('enchant @s respiration 2');
        player.runCommand('enchant @s mending');
    } else if (mainhandItem?.typeId === 'twisted:royal_chestplate' ||
        mainhandItem?.typeId === 'twisted:royal_leggings') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s mending');
    } else if (mainhandItem?.typeId === 'twisted:royal_boots') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s feather_falling 4');
        player.runCommand('enchant @s mending');
    }
    //ULTIMATE ARMOR
    else if (mainhandItem?.typeId === 'twisted:ultimate_helmet') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s aqua_affinity');
        player.runCommand('enchant @s respiration 2');
        player.runCommand('enchant @s unbreaking 3');
    } else if (mainhandItem?.typeId === 'twisted:ultimate_chestplate' ||
        mainhandItem?.typeId === 'twisted:ultimate_leggings') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s unbreaking 3');
    } else if (mainhandItem?.typeId === 'twisted:ultimate_boots') {
        player.runCommand('enchant @s protection 4');
        player.runCommand('enchant @s feather_falling 4');
        player.runCommand('enchant @s unbreaking 3');
    }
    //ULTIMATE SWORD
    if (mainhandItem?.typeId === 'twisted:ultimate_sword') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s knockback 2');
        player.runCommand('enchant @s sharpness 5');
        player.runCommand('enchant @s fire_aspect 2');
        player.runCommand('enchant @s looting 3');
    }
    //ULTIMATE PICKAXE
    else if (mainhandItem?.typeId === 'twisted:ultimate_pickaxe') {
        player.runCommand('enchant @s fortune 3');
        player.runCommand('enchant @s efficiency 5');
    }
    //ULTOMATE AXE, SHOVEL, HOE
    else if (mainhandItem?.typeId === 'twisted:ultimate_axe' ||
        mainhandItem?.typeId === 'twisted:ultimate_shovel' ||
        mainhandItem?.typeId === 'twisted:ultimate_hoe') {
        player.runCommand('enchant @s efficiency 5');
    }
}