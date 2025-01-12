import { world, system } from '@minecraft/server';

function getPlayerMainhandItem(player) {
    const equippable = player.getComponent('equippable');
    return equippable.getEquipment('Mainhand');
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

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:weapon_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;
            if (weapon.typeId === 'minespawn:big_bertha') {
                e.hitEntity.applyDamage(500);
            } else if (weapon.typeId === 'minespawn:stelix_bertha') {
                e.hitEntity.applyDamage(580);
            } else if (weapon.typeId === 'minespawn:royal_guardian') {
                e.hitEntity.applyDamage(750);
            }
        }
    });
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
    })
});
