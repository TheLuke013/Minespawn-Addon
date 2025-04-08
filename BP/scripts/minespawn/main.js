import { world, system } from '@minecraft/server';
import { enchantItems } from './item_enchantments.js';
import { royalArmorEffects } from './armor_effects.js';
import * as Vector3 from "./utils/vector3.js";

import './custom_components/itemCustomComponents.js';
import './custom_components/blockCustomComponents.js';
import './miners_dream.js';
import './weapons.js';
import './tools.js';

function longRangeAttack(player) {

}

system.runInterval(() => {
    const players = world.getPlayers();

    players.forEach(player => {
        const worldEntities = world.getDimension(player.dimension.id).getEntities();
        worldEntities.forEach(entity => {
            //MOBJIRA BEHAVIOURS
            if (entity.typeId === 'minespawn:mobjira') {
                const mobjira = entity;

                //impulse on jumping
                if (mobjira.getTags().includes('mobjira_is_jumping')) {
                    world.sendMessage('Mobjira esta pulando');
                    const direction = Vector3.fromRotation(mobjira.getRotation()).multiply(5);
                    mobjira.applyImpulse({ x: direction.x, y: direction.y, z: direction.z });
                    mobjira.removeTag('mobjira_is_jumping');
                }

                //regeneration
                const healthComponent = mobjira.getComponent('minecraft:health');
                if (healthComponent && healthComponent?.currentValue > 4000) {
                    mobjira.addEffect('minecraft:regeneration', 100, { amplifier: 255, showParticles: false });
                }
            }
        })

        //self-enchantment of items
        enchantItems(player);
        royalArmorEffects(player);

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
