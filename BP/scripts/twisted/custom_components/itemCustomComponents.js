import { world } from '@minecraft/server';
import { shootEntityFromPlayer, getPlayerSlotItem, getCardinalDirection } from '../utils/utils.js';
import { ultimateChainsaw, ultimateHammerAttack } from '../weapons.js';
import { itemDurability } from '../item_durability.js';
import { knockbackAttack, flamingAttack } from '../big_weapons_attack.js';
import { hasAmmunition, useAmmunition, useAmmunitionDurability } from '../shooter.js';

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('twisted:knockback', {
        onHitEntity: e => {
            knockbackAttack(e.attackingEntity, e.itemStack, e.hitEntity);
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:flaming_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;
            flamingAttack(e.hitEntity, weapon);

        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:on_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;
            if (weapon.typeId === 'twisted:big_bertha') {
                e.hitEntity.applyDamage(500);
            } else if (weapon.typeId === 'twisted:stelix_bertha') {
                e.hitEntity.applyDamage(580);
            } else if (weapon.typeId === 'twisted:royal_guardian') {
                e.hitEntity.applyDamage(750);
            } else if (weapon.typeId === 'twisted:ultimate_hammer') {
                ultimateHammerAttack(e.attackingEntity, e.hitEntity.location);
            } else if (weapon.typeId === 'twisted:queen_battle_axe') {
                e.hitEntity.applyDamage(666);
            } else if (weapon.typeId === 'twisted:mantis_sword') {
                const currentHealth = e.attackingEntity.getComponent("minecraft:health").currentValue;
                e.attackingEntity.getComponent("minecraft:health")?.setCurrentValue(currentHealth + 6);
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:chainsaw', {
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

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:blaster', {
        onUse: e => {
            const tags = e.itemStack.getTags();
            if (e.source.typeId === 'minecraft:player' && tags.includes('twisted:is_blaster')) {
                const player = e.source;
                const mainhandItem = getPlayerSlotItem(player);
                if (mainhandItem?.typeId === 'twisted:water_blaster' && hasAmmunition(player, 'twisted:water_rocket')) {
                    shootEntityFromPlayer('twisted:water_rocket', player);
                    useAmmunition(player, 'twisted:water_rocket');
                } else if (mainhandItem?.typeId === 'twisted:fire_blaster' && hasAmmunition(player, 'twisted:fire_rocket')) {
                    shootEntityFromPlayer('twisted:fire_rocket', player);
                    useAmmunition(player, 'twisted:fire_rocket');
                } else if (mainhandItem?.typeId === 'twisted:spider_blaster' && hasAmmunition(player, 'twisted:spider_rocket')) {
                    shootEntityFromPlayer('twisted:spider_rocket', player);
                    useAmmunition(player, 'twisted:spider_rocket');
                    player.playSound('mob.spider.say');
                } else if (mainhandItem?.typeId === 'twisted:lumen_blaster' && hasAmmunition(player, 'twisted:laser_charge')) {
                    shootEntityFromPlayer('twisted:lumen_laser', player);
                    useAmmunitionDurability(player, 'twisted:laser_charge');
                } else if (mainhandItem?.typeId === 'twisted:exterminator_blaster' && hasAmmunition(player, 'twisted:laser_charge')) {
                    shootEntityFromPlayer('twisted:exterminator_laser', player);
                    useAmmunitionDurability(player, 'twisted:laser_charge');
                } else {
                    player.playSound('blaster.empty');
                    if (tags.includes('twisted:laser_charge')) {
                        player.runCommand('titleraw @s actionbar {"rawtext":[{"translate":"laser_blaster.empty"}]}');
                    } else {
                        player.runCommand('titleraw @s actionbar {"rawtext":[{"translate":"blaster.empty"}]}');
                    }

                    return;
                }

                if (tags.includes('twisted:mega_laser')) {
                    player.playSound('blaster.mega_shot');
                } else if (tags.includes('twisted:laser')) {
                    player.playSound('blaster.laser_shoot');
                } else {
                    player.playSound('blaster.fire');
                }

                player.runCommand('camerashake add @s 0.06 0.5 rotational');
                itemDurability(player);
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:placer', {
        onUseOn: e => {
            if (e.itemStack.typeId === 'twisted:royal_armor_stand') {
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

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:durability', {
        onMineBlock: e => {
            itemDurability(e.source);
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('twisted:food_effects', {
        onConsume: e => {
            if (e.itemStack.typeId === 'twisted:crystal_apple') {
                e.source.addEffect('minecraft:strength', 3000, { showParticles: false });
                e.source.addEffect('minecraft:regeneration', 3000, { showParticles: false });
            }
        }
    });
});