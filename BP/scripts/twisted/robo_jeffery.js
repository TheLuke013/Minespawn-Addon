import { world, system } from '@minecraft/server';
import * as Vector3 from './utils/vector3.js';
import { getDistance } from './utils/utils.js';

export function roboJefferyBehaviours(jeffery, player) {
    //on jumping impulse to player
    if (jeffery.getTags().includes('jeffery_is_jumping')) {
        const direction = Vector3.getDirection(jeffery.location, player.location);
        let distance = Vector3.distance(jeffery.location, player.location);

        const minStrength = 1.2;
        const maxStrength = 6.0;

        const impulseStrength = Math.min(maxStrength, Math.max(minStrength, distance * 0.5));

        jeffery.applyImpulse({ x: direction.x * impulseStrength, y: 0.5, z: direction.z * impulseStrength });
        jeffery.removeTag('jeffery_is_jumping');
    } else if (jeffery.getTags().includes('mega_smash_attack')) {
        jeffery.removeTag('mega_smash_attack');
        const distance = getDistance(jeffery, player);
        if (distance <= 30) {
            const dir = jeffery.getViewDirection();
            player.applyKnockback(dir.x, dir.z, 20, 2);
            player.applyDamage(40);
        }
    }

    //jumping knockback
    if (player.getTags().includes('jeffery_jump_knockback')) {
        const kNormalPower = 10;
        const kProtecPower = 1;
        const dir = jeffery.getViewDirection();

        if (player.getTags().includes('knockback_resistance')) {
            player.applyKnockback(dir.x, dir.z, kProtecPower, 1);
        } else {
            player.applyKnockback(dir.x, dir.z, kNormalPower, 1);
        }
        player.removeTag('jeffery_jump_knockback');
    }
}