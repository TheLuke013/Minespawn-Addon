import { world, system } from '@minecraft/server';
import { ultimateHammerAttack } from './weapons.js';
import { getPlayerMainhandItem } from './utils/utils.js';
import { enchantItems } from './self_enchantments.js';

import './custom_components/itemCustomComponents.js';
import './custom_components/blockCustomComponents.js';
import './miners_dream.js';
import './tools.js';

function longRangeAttack(player) {

}

world.afterEvents.entityHitBlock.subscribe(e => {
    const entity = e.damagingEntity;
    const block = e.hitBlock;

    //ultimate hammer explosion on hit block
    if (entity.typeId === 'minecraft:player') {
        const mainhandItem = getPlayerMainhandItem(entity);

        if (mainhandItem?.typeId === 'minespawn:ultimate_hammer') {
            ultimateHammerAttack(entity, block.location);
        }
    }
});

system.runInterval(() => {
    const players = world.getPlayers();

    players.forEach(player => {
        //self-enchantment of items
        enchantItems(player);

        //long range attack
        if (player.getTags().includes('royal_guardian_attacking')) {
            player.removeTag('royal_guardian_attacking');
        } else if (player.getTags().includes('big_bertha_attacking')) {
            longRangeAttack(player);
            player.removeTag('big_bertha_attacking');
        } else if (player.getTags().includes('stelix_bertha_attacking')) {
            player.removeTag('stelix_bertha_attacking');
        }

        //mobjira knockback
        else if (player.getTags().includes('mobjira_jump_knockback')) {
            player.applyKnockback(10, 10, 10, 1);
            player.removeTag('mobjira_jump_knockback');
        }
    })
});
