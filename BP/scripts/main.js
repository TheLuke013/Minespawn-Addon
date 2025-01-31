import { world, system } from '@minecraft/server';

function getPlayerMainhandItem(player) {
    const equippable = player.getComponent('equippable');
    return equippable.getEquipment('Mainhand');
}

function ultimateHammerAttack(player, attackLoc) {
    world.getDimension(player.dimension.id).createExplosion(attackLoc, 3, { causesFire: true, source: player });

    const entities = player.dimension.getEntities({
        location: player.location, maxDistance: 5,
        excludeFamilies: ['player']
    });

    entities.forEach(entity => {
        entity.applyKnockback(0, 0, 10, 3);
        //world.sendMessage(entity.typeId);
    })
}

function longRangeAttack(range, player) {
    const playerLoc = player.location;
    const rotation = player.getRotation();

    // Converter graus para radianos
    const yaw = (rotation.y + 90) * (Math.PI / 180); // Yaw controla direção horizontal
    const pitch = -rotation.x * (Math.PI / 180); // Pitch controla inclinação (negativo porque MC inverte)

    // Calcular a direção do vetor normalizado
    const dirX = Math.cos(yaw) * Math.cos(pitch);
    const dirY = Math.sin(pitch);
    const dirZ = Math.sin(yaw) * Math.cos(pitch);

    // Criar os blocos seguindo a linha reta da visão do jogador
    for (let i = 1; i <= range; i++) {
        const loc = {
            x: Math.floor(playerLoc.x + dirX * i),
            y: Math.floor(playerLoc.y + dirY * i),
            z: Math.floor(playerLoc.z + dirZ * i)
        };

        world.getDimension(player.dimension.id).getBlock(loc).setType('minecraft:stone');
    }
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

            if (weapon.typeId === 'minespawn:stelix_bertha') {
                e.hitEntity.setOnFire(30, false);
            } else {
                e.hitEntity.setOnFire(10, false);
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

        //long range attack
        if (player.getTags().includes('royal_guardian_attacking')) {
            player.removeTag('royal_guardian_attacking');
        } else if (player.getTags().includes('big_bertha_attacking')) {
            longRangeAttack(10, player);
            player.removeTag('big_bertha_attacking');
        } else if (player.getTags().includes('stelix_bertha_attacking')) {
            player.removeTag('stelix_bertha_attacking');
        }
    });
});
