import { world } from '@minecraft/server';

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:knockback', {
        onHitEntity: e => {
            const dir = e.attackingEntity.getViewDirection();
            e.hitEntity.applyKnockback(dir.x, dir.z, 10, 1);
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:flaming_damage', {
        onHitEntity: e => {
            e.hitEntity.setOnFire(10, false);
        }
    });

    initEvent.itemComponentRegistry.registerCustomComponent('minespawn:weapon_damage', {
        onHitEntity: e => {
            const weapon = e.itemStack;

            if (weapon.typeId === 'minespawn:big_bertha' && 'minespawn:slice') {
                e.hitEntity.applyDamage(500);
            } else if (weapon.typeId === 'minespawn:royal_guardian') {
                e.hitEntity.applyDamage(750);
            }
        }
    });
});