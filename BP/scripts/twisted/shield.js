import { world } from '@minecraft/server';
import { getPlayerSlotItem } from './utils/utils.js';
import * as Vector3 from './utils/vector3.js';
import { itemDurability } from './item_durability.js';

function shieldMustDefend(player, damager, damage) {
    const mainhandItem = getPlayerSlotItem(player);
    const offhandItem = getPlayerSlotItem(player, 'Offhand');
    const currentHealth = player.getComponent("minecraft:health").currentValue;

    if ((player.isSneaking && mainhandItem?.typeId === 'twisted:royal_shield') ||
        (player.isSneaking && offhandItem?.typeId === 'twisted:royal_shield')) {
        const impulse = 1.3;
        const direction = Vector3.fromRotation(player.getRotation());
        const lookDirection = player.getViewDirection();
        let angle = Math.atan2(lookDirection.x * direction.z - lookDirection.z * direction.x, lookDirection.x * direction.x + lookDirection.z * direction.z) * (180 / Math.PI);

        if (angle > 180) {
            angle -= 360;
        } else if (angle < -180) {
            angle += 360;
        };
        const angleThreshold = 45;

        if (Math.abs(angle) <= angleThreshold) {
            player.getComponent("minecraft:health")?.setCurrentValue(currentHealth + damage);
            player.applyKnockback(0, 0, 0, 0);
            damager.applyKnockback(direction.x, direction.z, impulse, impulse * 0.4);
            world.playSound(`item.shield.block`, player.location);

            //shield durability
            if (mainhandItem != undefined) {
                itemDurability(player);
            } else if (offhandItem != undefined) {
                itemDurability(player);
            }
        }
    }
}

export function shieldSystem(player) {
    const entities = player.getEntitiesFromViewDirection({ maxDistance: 2, families: ['monster'] });
    if (entities.length >= 1) {
        entities.forEach(entity => {
            shieldMustDefend(player, entity.entity, 0);
        })
    }
}

world.afterEvents.entityHurt.subscribe(e => {
    if (!(e.hurtEntity.typeId === 'minecraft:player')) return;

    const player = e.hurtEntity;
    const damager = e.damageSource.damagingEntity;
    shieldMustDefend(player, damager, e.damage);
})
