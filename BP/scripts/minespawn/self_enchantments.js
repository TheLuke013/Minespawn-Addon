import { getPlayerMainhandItem } from './utils/utils.js';

export function enchantItems(player) {
    const mainhandItem = getPlayerMainhandItem(player);
    //BIG BERTHA | STELIX BERTHA
    if (mainhandItem?.typeId === 'minespawn:big_bertha' ||
        mainhandItem?.typeId === 'minespawn:stelix_bertha') {
        player.runCommand('enchant @s knockback 2');
        player.runCommand('enchant @s bane_of_arthropods');
        player.runCommand('enchant @s fire_aspect');
    }
    //ROYAL GUARDIAN
    else if (mainhandItem?.typeId === 'minespawn:royal_guardian') {
        player.runCommand('enchant @s unbreaking 3');
    }
    //BATTLE AXE
    else if (mainhandItem?.typeId === 'minespawn:battle_axe') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s looting 3');
    }
    //QUEEN BATTLE AXE
    else if (mainhandItem?.typeId === 'minespawn:queen_battle_axe') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s looting 3');
        player.runCommand('enchant @s fire_aspect 2');
        player.runCommand('enchant @s sharpness 5');
    }
    //ULTIMATE HAMMER
    else if (mainhandItem?.typeId === 'minespawn:ultimate_chainsaw') {
        player.runCommand('enchant @s unbreaking 3');
        player.runCommand('enchant @s efficiency 5');
    }
    //ENCHANTED EMERALD ARMOR
    else if (mainhandItem?.typeId === 'minespawn:experience_helmet' ||
        mainhandItem?.typeId === 'minespawn:experience_chestplate' ||
        mainhandItem?.typeId === 'minespawn:experience_leggings') {
        player.runCommand('enchant @s protection 2');
    } else if (mainhandItem?.typeId === 'minespawn:experience_boots') {
        player.runCommand('enchant @s protection 2');
        player.runCommand('enchant @s feather_falling');
    }
}