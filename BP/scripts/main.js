import { world, system } from '@minecraft/server';

function getPlayerMainhandItem(player) {
    const equippable = player.getComponent('equippable');
    return equippable.getEquipment('Mainhand');
}

function ultimateHammerAttack(player, attackLoc) {
    world.getDimension(player.dimension.id).createExplosion(attackLoc, 3, { causesFire: true, source: player });

    const entities = player.dimension.getEntities({
        location: player.location, maxDistance: 5,
        excludeTypes: ['minecraft:item', 'minecraft:player']
    });

    entities.forEach(entity => {
        if (!entity || !entity.isValid() || !entity.applyKnockback) return;

        try {
            entity.applyKnockback(0, 0, 10, 3);
        } catch (error) {
            world.sendMessage(`Knockback failed for ${entity.typeId}`);
        }
    });

}

function longRangeAttack(player) {

}

//custom components registers
world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:knockback', {
        onHitEntity: e => {
            const dir = e.attackingEntity.getViewDirection();
            const weapon = e.itemStack;

            if (weapon.typeId === 'minespawn:stelix_bertha') {
                e.hitEntity.applyKnockback(dir.x, dir.z, 30, 1);
            } else {
                e.hitEntity.applyKnockback(dir.x, dir.z, 10, 1);
            }
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:flaming_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;

            if (e.hitEntity.typeId != 'minespawn:mobjira') {
                if (weapon.typeId === 'minespawn:stelix_bertha') {
                    e.hitEntity.setOnFire(30, false);
                } else {
                    e.hitEntity.setOnFire(10, false);
                }
            }
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
});

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
        const mainhandItem = getPlayerMainhandItem(player);

        //big bertha and stelix bertha enchantments
        if (mainhandItem?.typeId === 'minespawn:big_bertha' ||
            mainhandItem?.typeId === 'minespawn:stelix_bertha') {
            player.runCommand('enchant @s knockback 2');
            player.runCommand('enchant @s bane_of_arthropods');
            player.runCommand('enchant @s fire_aspect');
        }
        //royal guardian enchantment
        else if (mainhandItem?.typeId === 'minespawn:royal_guardian') {
            player.runCommand('enchant @s unbreaking 3');
        }
        //battle axe
        else if (mainhandItem?.typeId === 'minespawn:battle_axe') {
            player.runCommand('enchant @s unbreaking 3');
            player.runCommand('enchant @s looting 3');
        }
        //queen battle axe
        else if (mainhandItem?.typeId === 'minespawn:queen_battle_axe') {
            player.runCommand('enchant @s unbreaking 3');
            player.runCommand('enchant @s looting 3');
            player.runCommand('enchant @s fire_aspect 2');
            player.runCommand('enchant @s sharpness 5');
        }
        //enchanted emerald armor
        else if (mainhandItem?.typeId === 'minespawn:experience_helmet' ||
            mainhandItem?.typeId === 'minespawn:experience_chestplate' ||
            mainhandItem?.typeId === 'minespawn:experience_leggings') {
            player.runCommand('enchant @s protection 2');
        } else if (mainhandItem?.typeId === 'minespawn:experience_boots') {
            player.runCommand('enchant @s protection 2');
            player.runCommand('enchant @s feather_falling');
        }

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
