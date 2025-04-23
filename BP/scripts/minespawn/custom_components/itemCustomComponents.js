import { world } from '@minecraft/server';
import { shootEntityFromPlayer, getPlayerSlotItem, getCardinalDirection } from '../utils/utils.js';
import { ultimateChainsaw, ultimateHammerAttack } from '../weapons.js';
import { itemDurability } from '../item_durability.js';
import { knockbackAttack, flamingAttack } from '../big_weapons_attack.js';

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:knockback', {
        onHitEntity: e => {
            knockbackAttack(e.attackingEntity, e.itemStack, e.hitEntity);
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:flaming_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;
            flamingAttack(e.hitEntity, weapon);

        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:on_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;
            if (weapon.typeId === 'minespawn:big_bertha') {
                e.hitEntity.applyDamage(500);
            } else if (weapon.typeId === 'minespawn:stelix_bertha') {
                e.hitEntity.applyDamage(580);
            } else if (weapon.typeId === 'minespawn:royal_guardian') {
                e.hitEntity.applyDamage(750);
            } else if (weapon.typeId === 'minespawn:ultimate_hammer') {
                ultimateHammerAttack(e.attackingEntity, e.hitEntity.location);
            } else if (weapon.typeId === 'minespawn:queen_battle_axe') {
                e.hitEntity.applyDamage(666);
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:chainsaw', {
        onMineBlock: e => {
            ultimateChainsaw(e.source.dimension, e.block.location);
            world.playSound('weapon.chainsaw', e.source.location);
        },

        onHitEntity: e => {
            world.playSound('weapon.chainsaw', e.attackingEntity.location)
            const entities = world.getDimension(e.attackingEntity.dimension.id).getEntities({
                location: e.attackingEntity.location,
                maxDistance: 5,
                excludeTypes: [e.attackingEntity.typeId, 'minecraft:item']
            });

            entities.forEach(entity => {
                entity.applyDamage(60);
            })
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:blaster', {
        onUse: e => {
            if (e.source.typeId === 'minecraft:player' && e.itemStack.getTags().includes('minespawn:is_gun')) {

                const mainhandItem = getPlayerSlotItem(e.source);
                if (mainhandItem?.typeId === 'minespawn:waterzooka') {
                    shootEntityFromPlayer('minespawn:water_rocket', e.source);
                } else if (mainhandItem?.typeId === 'minespawn:firezooka') {
                    shootEntityFromPlayer('minespawn:fire_rocket', e.source);
                }

                e.source.playSound('gun.blaster_fire');
                e.source.runCommand('camerashake add @s 0.06 0.5 rotational');
                itemDurability(e.source);
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:placer', {
        onUseOn: e => {
            if (e.itemStack.typeId === 'minespawn:royal_armor_stand') {
                const bl = e.block.location;
                const playerDirection = getCardinalDirection(e.source);
                let standDir = '';

                if (playerDirection == 'south') {
                    standDir = '90_degrees';
                } else if (playerDirection == 'north') {
                    standDir = '270_degrees';
                } else if (playerDirection == 'east') {
                    standDir = '0_degrees';
                } else if (playerDirection == 'west') {
                    standDir = '180_degrees';
                }
                world.getDimension(e.source.dimension.id).runCommandAsync(
                    `structure load royal_armor_stand ${bl.x} ${bl.y + 1} ${bl.z} ${standDir}`
                );
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:durability', {
        onMineBlock: e => {
            itemDurability(e.source);
        }
    });
});