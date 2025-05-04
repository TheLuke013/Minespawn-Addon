import { world, system } from '@minecraft/server';
import { enchantItems } from './item_enchantments.js';
import { royalArmorEffects } from './armors.js';
import { mobjiraBehaviours } from './mobjira.js';
import { roboJefferyBehaviours } from './robo_jeffery.js';
import { longRangeAttack, handleLongRange } from './big_weapons_attack.js';
import { shieldSystem } from './shield.js';;

import './custom_components/itemCustomComponents.js';
import './custom_components/blockCustomComponents.js';
import './miners_dream.js';
import './weapons.js';
import './tools.js';
import './shooter.js';

export const bigWeapons = [
    'twisted:big_bertha', 'twisted:stelix_bertha', 'twisted:royal_guardian',
    'twisted:queen_battle_axe', 'twisted:battle_axe'
]

export const giantMonsters = [
    'twisted:mobjira'
]

world.afterEvents.itemUse.subscribe(e => {
    if (e.itemStack.typeId === 'twisted:princess_poem') {
        e.source.runCommand('tellraw @a {"rawtext":[{"translate":"p_poem.content"}]}');
    }
})

//MOBS KNOCKBACK
world.afterEvents.entityHitEntity.subscribe(e => {
    const dir = e.damagingEntity.getViewDirection();

    //nastysaurus
    if (e.damagingEntity.typeId === 'twisted:nastysaurus') {
        e.hitEntity.applyKnockback(dir.x, dir.z, 5, 1);
    }
    //robo jeffery
    else if (e.damagingEntity.typeId === 'twisted:robo_jeffery') {
        e.hitEntity.applyKnockback(dir.x, dir.z, 5, 1);
    }
})

system.runInterval(() => {
    const players = world.getPlayers();

    players.forEach(player => {
        const worldEntities = world.getDimension(player.dimension.id).getEntities();
        worldEntities.forEach(entity => {
            if (entity.typeId === 'twisted:mobjira') {
                mobjiraBehaviours(entity, player);
            } else if (entity.typeId === 'twisted:robo_jeffery') {
                roboJefferyBehaviours(entity, player);
            }
        })

        shieldSystem(player);

        //self-enchantment of items
        enchantItems(player);
        royalArmorEffects(player);

        //long range attack
        longRangeAttack(player);
        handleLongRange(player);

        //player knockback resistance
        if (player.getTags().includes('add_knockback_resistance')) {
            player.runCommand('event entity @s twisted:add_kb_resistance');
            player.addTag('knockback_resistance');
            player.removeTag('add_knockback_resistance');
        } else if (player.getTags().includes('remove_knockback_resistance')) {
            player.runCommand('event entity @s twisted:remove_kb_resistance');
            player.removeTag('remove_knockback_resistance');
        }
    })
}, 1);
